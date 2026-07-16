import { ArrowRight, CalendarDays, Gauge, Users } from "lucide-react";
import Link from "next/link";

import { calculatePerTravellerCents } from "../calculations/trip-costs";
import { formatEuroCents, formatTripDateRange } from "../calculations/trip-formatters";
import { calculateUserTripTotalCents } from "../calculations/user-trip-costs";
import type { UserTrip } from "../types/user-trip";

type UserTripCardProps = {
  trip: UserTrip;
};

const statusCopy = {
  pending: "Calculating",
  ready: "Estimate ready",
  failed: "Needs calculation",
} as const;

export function UserTripCard({ trip }: UserTripCardProps) {
  const totalCents = calculateUserTripTotalCents(trip);
  const distanceKm = trip.routeEstimate
    ? Math.round(trip.routeEstimate.distanceMetres / 1000)
    : null;

  return (
    <article className="flex min-h-[300px] flex-col rounded-lg border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-[#3f6f55]">Your trip</p>
          <h2 className="mt-2 text-xl font-semibold leading-snug">{trip.title}</h2>
        </div>
        <span className="shrink-0 rounded-md bg-muted px-2 py-1 text-xs font-semibold">
          {statusCopy[trip.estimateStatus]}
        </span>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2 text-sm font-medium">
        {trip.stops.map((stop, index) => (
          <span className="flex items-center gap-2" key={stop.id}>
            {index > 0 ? <span className="text-muted-foreground">/</span> : null}
            {stop.placeLabel}
          </span>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-y py-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <CalendarDays className="size-4" aria-hidden="true" />
          {formatTripDateRange(trip.startDate, trip.endDate)}
        </span>
        <span className="flex items-center gap-1.5">
          <Gauge className="size-4" aria-hidden="true" />
          {distanceKm === null ? "Pending" : `${distanceKm} km`}
        </span>
        <span className="flex items-center gap-1.5">
          <Users className="size-4" aria-hidden="true" />
          {trip.travellerCount}
        </span>
      </div>

      <div className="mt-auto flex items-end justify-between gap-4 pt-6">
        <div>
          <p className="text-xs text-muted-foreground">Planning total</p>
          <p className="mt-1 text-2xl font-semibold">{formatEuroCents(totalCents)}</p>
          <p className="text-xs text-muted-foreground">
            {formatEuroCents(
              calculatePerTravellerCents(totalCents, trip.travellerCount),
            )}{" "}
            per person
          </p>
        </div>
        <Link
          href={`/trips/${trip.id}`}
          className="inline-flex h-10 items-center gap-2 rounded-md bg-foreground px-3 text-sm font-semibold text-background hover:bg-foreground/80"
        >
          Details
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
