import { BedDouble, CircleParking } from "lucide-react";

import {
  formatEuroCents,
  formatTripDate,
} from "../calculations/trip-formatters";
import type { TripStop } from "../types/trip-plan";

type TripStopTimelineProps = {
  stops: TripStop[];
};

export function TripStopTimeline({ stops }: TripStopTimelineProps) {
  return (
    <section aria-labelledby="route-heading">
      <h2 id="route-heading" className="text-xl font-semibold">
        Route & stays
      </h2>
      <ol className="mt-5">
        {stops.map((stop, index) => (
          <li className="relative grid grid-cols-[32px_1fr] gap-3" key={stop.id}>
            {index < stops.length - 1 ? (
              <span className="absolute top-7 bottom-0 left-[15px] w-px bg-border" />
            ) : null}
            <span className="relative z-10 mt-1 flex size-8 items-center justify-center rounded-full border bg-white text-xs font-semibold">
              {index + 1}
            </span>
            <div className="pb-7">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <h3 className="font-semibold">{stop.city}</h3>
                  <p className="text-xs text-muted-foreground">{stop.country}</p>
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  {formatTripDate(stop.date)}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {stop.note}
              </p>

              {stop.accommodation ? (
                <div className="mt-4 border-l-2 border-[#87a993] pl-3">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <BedDouble className="size-4" aria-hidden="true" />
                    {stop.accommodation.name}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span>
                      {stop.accommodation.nights} {stop.accommodation.nights === 1 ? "night" : "nights"}
                    </span>
                    <span>{formatEuroCents(stop.accommodation.amountCents)}</span>
                    <span className="flex items-center gap-1">
                      <CircleParking className="size-3.5" aria-hidden="true" />
                      {stop.accommodation.parkingIncluded
                        ? "Parking included"
                        : "Parking extra"}
                    </span>
                  </div>
                </div>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
