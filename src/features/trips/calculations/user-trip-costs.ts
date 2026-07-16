import type { UserTrip } from "../types/user-trip";

export function calculateUserTripTotalCents(trip: UserTrip): number {
  const manualCosts =
    trip.foodBudgetCents +
    trip.activitiesBudgetCents +
    trip.stops.reduce(
      (total, stop) =>
        total + stop.accommodationBudgetCents + stop.parkingBudgetCents,
      0,
    );
  const liveFuel = trip.routeEstimate?.fuelCostCents ?? 0;
  const euroTolls =
    trip.routeEstimate?.tollAmounts
      .filter((amount) => amount.currencyCode === "EUR")
      .reduce((total, amount) => total + amount.amountCents, 0) ?? 0;

  return manualCosts + liveFuel + euroTolls;
}
