import { describe, expect, it } from "vitest";

import type { FuelPrice } from "../types/trip-provider";
import {
  calculateFuelCostCents,
  selectAverageFuelPrice,
} from "./live-trip-costs";

const prices: FuelPrice[] = [
  { countryCode: "HR", fuelType: "gasoline", priceCentsPerLitre: 150, sourceDate: "2026-07-13" },
  { countryCode: "SI", fuelType: "gasoline", priceCentsPerLitre: 160, sourceDate: "2026-07-13" },
  { countryCode: "AT", fuelType: "diesel", priceCentsPerLitre: 170, sourceDate: "2026-07-13" },
];

describe("live trip costs", () => {
  it("averages matching countries without counting duplicates", () => {
    expect(
      selectAverageFuelPrice({
        prices,
        countryCodes: ["HR", "SI", "HR"],
        fuelType: "gasoline",
      }),
    ).toEqual({ priceCentsPerLitre: 155, sourceDate: "2026-07-13" });
  });

  it("uses gasoline pricing for hybrid estimates", () => {
    expect(
      selectAverageFuelPrice({
        prices,
        countryCodes: ["HR"],
        fuelType: "hybrid",
      })?.priceCentsPerLitre,
    ).toBe(150);
  });

  it("calculates the fuel cost from microlitres", () => {
    expect(calculateFuelCostCents(10_500_000, 160)).toBe(1680);
  });
});
