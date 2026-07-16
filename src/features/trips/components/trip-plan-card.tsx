import { ArrowRight, CalendarDays, Gauge, Users } from "lucide-react";
import Link from "next/link";

import {
  calculatePerTravellerCents,
  calculateTripTotalCents,
} from "../calculations/trip-costs";
import {
  formatEuroCents,
  formatTripDateRange,
} from "../calculations/trip-formatters";
import type { TripPlan } from "../types/trip-plan";
import { TripRouteSummary } from "./trip-route-summary";

type TripPlanCardProps = {
  tripPlan: TripPlan;
};

export function TripPlanCard({ tripPlan }: TripPlanCardProps) {
  const totalCents = calculateTripTotalCents(tripPlan.costs);
  const perTravellerCents = calculatePerTravellerCents(
    totalCents,
    tripPlan.travellerCount,
  );

  return (
    <article className="flex min-h-[340px] flex-col rounded-lg border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase text-[#3f6f55]">
            Sample plan
          </p>
          <h2 className="mt-2 text-xl font-semibold leading-snug">
            {tripPlan.title}
          </h2>
        </div>
        <span className="shrink-0 rounded-md bg-[#e9f1eb] px-2 py-1 text-xs font-semibold text-[#315c44]">
          {tripPlan.stops.length} stops
        </span>
      </div>

      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {tripPlan.summary}
      </p>

      <div className="mt-5 border-y py-4">
        <TripRouteSummary stops={tripPlan.stops} />
      </div>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <CalendarDays className="size-4" aria-hidden="true" />
          {formatTripDateRange(tripPlan.startDate, tripPlan.endDate)}
        </span>
        <span className="flex items-center gap-1.5">
          <Gauge className="size-4" aria-hidden="true" />
          {tripPlan.distanceKm} km
        </span>
        <span className="flex items-center gap-1.5">
          <Users className="size-4" aria-hidden="true" />
          {tripPlan.travellerCount}
        </span>
      </div>

      <div className="mt-auto flex items-end justify-between gap-4 pt-6">
        <div>
          <p className="text-xs text-muted-foreground">Estimated total</p>
          <p className="mt-1 text-2xl font-semibold">
            {formatEuroCents(totalCents)}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatEuroCents(perTravellerCents)} per person
          </p>
        </div>
        <Link
          href={`/templates/${tripPlan.id}`}
          className="inline-flex h-10 items-center gap-2 rounded-md bg-foreground px-3 text-sm font-semibold text-background transition-colors hover:bg-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Details
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
