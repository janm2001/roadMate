import type { TripCost } from "../types/trip-plan";

export function calculateTripTotalCents(costs: TripCost[]): number {
  return costs.reduce((totalCents, cost) => totalCents + cost.amountCents, 0);
}

export function calculatePerTravellerCents(
  totalCents: number,
  travellerCount: number,
): number {
  if (travellerCount <= 0) {
    return 0;
  }

  return Math.ceil(totalCents / travellerCount);
}
