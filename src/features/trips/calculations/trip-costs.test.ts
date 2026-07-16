import { describe, expect, it } from "vitest";

import type { TripCost } from "../types/trip-plan";
import {
  calculatePerTravellerCents,
  calculateTripTotalCents,
} from "./trip-costs";

const costs: TripCost[] = [
  { category: "fuel", label: "Fuel", amountCents: 7200 },
  { category: "tolls", label: "Tolls", amountCents: 3800 },
  { category: "parking", label: "Parking", amountCents: 0 },
];

describe("trip costs", () => {
  it("adds every cost in cents", () => {
    expect(calculateTripTotalCents(costs)).toBe(11000);
  });

  it("returns zero for an empty cost list", () => {
    expect(calculateTripTotalCents([])).toBe(0);
  });

  it("rounds a shared cost up to the nearest cent", () => {
    expect(calculatePerTravellerCents(10000, 3)).toBe(3334);
  });

  it("returns zero when there are no travellers", () => {
    expect(calculatePerTravellerCents(10000, 0)).toBe(0);
  });
});
