import { ArrowLeft, CalendarDays, Gauge, Users } from "lucide-react";
import Link from "next/link";

import { formatTripDateRange } from "../calculations/trip-formatters";
import type { TripPlan } from "../types/trip-plan";
import { TripCostBreakdown } from "./trip-cost-breakdown";
import { TripRouteSummary } from "./trip-route-summary";
import { TripStopTimeline } from "./trip-stop-timeline";

type TripDetailProps = {
  tripPlan: TripPlan;
};

export function TripDetail({ tripPlan }: TripDetailProps) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        All trips
      </Link>

      <section className="mt-7 border-b pb-8">
        <p className="text-sm font-semibold text-[#3f6f55]">Sample trip plan</p>
        <h1 className="mt-2 max-w-3xl text-3xl font-semibold leading-tight sm:text-4xl">
          {tripPlan.title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
          {tripPlan.summary}
        </p>
        <div className="mt-6">
          <TripRouteSummary stops={tripPlan.stops} />
        </div>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <CalendarDays className="size-4" aria-hidden="true" />
            {formatTripDateRange(tripPlan.startDate, tripPlan.endDate)}
          </span>
          <span className="flex items-center gap-2">
            <Gauge className="size-4" aria-hidden="true" />
            {tripPlan.distanceKm} km
          </span>
          <span className="flex items-center gap-2">
            <Users className="size-4" aria-hidden="true" />
            {tripPlan.travellerCount} travellers
          </span>
        </div>
      </section>

      <div className="grid gap-10 py-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(300px,0.75fr)] lg:gap-16">
        <TripStopTimeline stops={tripPlan.stops} />
        <TripCostBreakdown
          costs={tripPlan.costs}
          travellerCount={tripPlan.travellerCount}
        />
      </div>
    </div>
  );
}
