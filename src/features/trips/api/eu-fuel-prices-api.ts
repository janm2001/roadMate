import ExcelJS from "exceljs";

import type { FuelPrice } from "../types/trip-provider";

const bulletinUrl =
  "https://energy.ec.europa.eu/data-and-analysis/weekly-oil-bulletin_en";

const countries = {
  Austria: "AT",
  Croatia: "HR",
  Slovenia: "SI",
} as const;

function formatSourceDate(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  const parsed = new Date(String(value));

  if (Number.isNaN(parsed.getTime())) {
    throw new Error("The EU fuel bulletin has an invalid source date.");
  }

  return parsed.toISOString().slice(0, 10);
}

export async function fetchEuFuelPrices(): Promise<FuelPrice[]> {
  const pageResponse = await fetch(bulletinUrl, {
    signal: AbortSignal.timeout(10_000),
    next: { revalidate: 86_400 },
  });

  if (!pageResponse.ok) {
    throw new Error("The EU fuel bulletin is unavailable.");
  }

  const page = await pageResponse.text();
  const workbookPath = page
    .match(/href="([^"]+\.xlsx[^"]*)"/i)?.[1]
    ?.replaceAll("&amp;", "&");

  if (!workbookPath) {
    throw new Error("The EU fuel bulletin workbook could not be located.");
  }

  const workbookUrl = new URL(workbookPath, bulletinUrl);
  const workbookResponse = await fetch(workbookUrl, {
    signal: AbortSignal.timeout(15_000),
    next: { revalidate: 86_400 },
  });

  if (!workbookResponse.ok) {
    throw new Error("The EU fuel workbook is unavailable.");
  }

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(await workbookResponse.arrayBuffer());
  const worksheet = workbook.worksheets[0];

  if (!worksheet) {
    throw new Error("The EU fuel workbook is empty.");
  }

  const sourceDate = formatSourceDate(worksheet.getCell(2, 1).value);
  const prices: FuelPrice[] = [];

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber < 3) {
      return;
    }

    const countryName = String(row.getCell(1).value ?? "");
    const countryCode = countries[countryName as keyof typeof countries];
    const gasolineEurosPerThousandLitres = Number(row.getCell(2).value);
    const dieselEurosPerThousandLitres = Number(row.getCell(3).value);

    if (!countryCode) {
      return;
    }

    if (Number.isFinite(gasolineEurosPerThousandLitres)) {
      prices.push({
        countryCode,
        fuelType: "gasoline",
        priceCentsPerLitre: Math.round(gasolineEurosPerThousandLitres / 10),
        sourceDate,
      });
    }

    if (Number.isFinite(dieselEurosPerThousandLitres)) {
      prices.push({
        countryCode,
        fuelType: "diesel",
        priceCentsPerLitre: Math.round(dieselEurosPerThousandLitres / 10),
        sourceDate,
      });
    }
  });

  if (prices.length !== 6) {
    throw new Error("The EU fuel workbook is missing supported countries.");
  }

  return prices;
}
