import {
  BedDouble,
  CarFront,
  CircleParking,
  Fuel,
  Landmark,
  Utensils,
  type LucideIcon,
} from "lucide-react";

import {
  calculatePerTravellerCents,
  calculateTripTotalCents,
} from "../calculations/trip-costs";
import { formatEuroCents } from "../calculations/trip-formatters";
import type { TripCost, TripCostCategory } from "../types/trip-plan";

const costIcons: Record<TripCostCategory, LucideIcon> = {
  accommodation: BedDouble,
  activities: Landmark,
  food: Utensils,
  fuel: Fuel,
  parking: CircleParking,
  tolls: CarFront,
};

type TripCostBreakdownProps = {
  costs: TripCost[];
  travellerCount: number;
};

export function TripCostBreakdown({
  costs,
  travellerCount,
}: TripCostBreakdownProps) {
  const totalCents = calculateTripTotalCents(costs);
  const perTravellerCents = calculatePerTravellerCents(
    totalCents,
    travellerCount,
  );

  return (
    <section aria-labelledby="cost-breakdown-heading">
      <h2 id="cost-breakdown-heading" className="text-xl font-semibold">
        Cost estimate
      </h2>
      <div className="mt-4 divide-y border-y">
        {costs.map((cost) => {
          const Icon = costIcons[cost.category];

          return (
            <div
              className="flex items-center justify-between gap-4 py-3"
              key={cost.category}
            >
              <span className="flex items-center gap-3 text-sm">
                <span className="flex size-9 items-center justify-center rounded-md bg-muted">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                {cost.label}
              </span>
              <span className="font-semibold">
                {formatEuroCents(cost.amountCents)}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Per person</p>
          <p className="mt-1 text-lg font-semibold">
            {formatEuroCents(perTravellerCents)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Estimated total</p>
          <p className="mt-1 text-3xl font-semibold">
            {formatEuroCents(totalCents)}
          </p>
        </div>
      </div>
      <p className="mt-4 text-xs leading-5 text-muted-foreground">
        Planning estimate only. Actual prices can change with dates, vehicle and
        availability.
      </p>
    </section>
  );
}
