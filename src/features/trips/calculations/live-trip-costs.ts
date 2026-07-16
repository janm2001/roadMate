import type { FuelPrice, TripFuelType } from "../types/trip-provider";

export function selectAverageFuelPrice(input: {
  prices: FuelPrice[];
  countryCodes: string[];
  fuelType: TripFuelType;
}): { priceCentsPerLitre: number; sourceDate: string } | null {
  const requestedFuelType = input.fuelType === "hybrid" ? "gasoline" : input.fuelType;
  const distinctCountryCodes = [...new Set(input.countryCodes)];
  const matching = input.prices.filter(
    (price) =>
      distinctCountryCodes.includes(price.countryCode) &&
      price.fuelType === requestedFuelType,
  );

  if (matching.length === 0) {
    return null;
  }

  return {
    priceCentsPerLitre: Math.round(
      matching.reduce((total, price) => total + price.priceCentsPerLitre, 0) /
        matching.length,
    ),
    sourceDate: matching
      .map((price) => price.sourceDate)
      .sort()
      .at(-1)!,
  };
}

export function calculateFuelCostCents(
  fuelConsumptionMicrolitres: number,
  priceCentsPerLitre: number,
): number {
  return Math.round(
    (fuelConsumptionMicrolitres / 1_000_000) * priceCentsPerLitre,
  );
}
