import { BedDouble, CircleParking, Fuel, Landmark, ReceiptText, Utensils } from "lucide-react";

import { formatEuroCents } from "../calculations/trip-formatters";
import { calculateUserTripTotalCents } from "../calculations/user-trip-costs";
import type { UserTrip } from "../types/user-trip";

export function UserTripCostBreakdown({ trip }: { trip: UserTrip }) {
  const accommodationCents = trip.stops.reduce(
    (total, stop) => total + stop.accommodationBudgetCents,
    0,
  );
  const parkingCents = trip.stops.reduce(
    (total, stop) => total + stop.parkingBudgetCents,
    0,
  );
  const euroTolls =
    trip.routeEstimate?.tollAmounts.find(
      (amount) => amount.currencyCode === "EUR",
    )?.amountCents ?? null;
  const rows = [
    { label: "Apartments", value: accommodationCents, icon: BedDouble },
    { label: "Parking budget", value: parkingCents, icon: CircleParking },
    { label: "Food budget", value: trip.foodBudgetCents, icon: Utensils },
    { label: "Activities", value: trip.activitiesBudgetCents, icon: Landmark },
    { label: "Estimated fuel", value: trip.routeEstimate?.fuelCostCents ?? null, icon: Fuel },
    { label: "Estimated tolls", value: euroTolls, icon: ReceiptText },
  ];

  return (
    <section aria-labelledby="user-cost-heading">
      <h2 id="user-cost-heading" className="text-xl font-semibold">
        Cost plan
      </h2>
      <div className="mt-4 divide-y border-y">
        {rows.map((row) => (
          <div className="flex items-center justify-between gap-4 py-3" key={row.label}>
            <span className="flex items-center gap-3 text-sm">
              <span className="flex size-9 items-center justify-center rounded-md bg-muted">
                <row.icon className="size-4" aria-hidden="true" />
              </span>
              {row.label}
            </span>
            <span className="font-semibold">
              {row.value === null ? "Unavailable" : formatEuroCents(row.value)}
            </span>
          </div>
        ))}
      </div>
      {trip.routeEstimate?.hasUnpricedTolls ? (
        <p className="mt-3 text-sm text-amber-800">
          This route includes tolls whose price was not available from the route
          provider.
        </p>
      ) : null}
      <div className="mt-5 flex items-end justify-between gap-4">
        <p className="text-sm text-muted-foreground">Planning total</p>
        <p className="text-3xl font-semibold">
          {formatEuroCents(calculateUserTripTotalCents(trip))}
        </p>
      </div>
    </section>
  );
}
