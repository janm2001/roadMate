import { ChevronRight, MapPin } from "lucide-react";

import type { TripStop } from "../types/trip-plan";

type TripRouteSummaryProps = {
  stops: TripStop[];
};

export function TripRouteSummary({ stops }: TripRouteSummaryProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-1 gap-y-2 text-sm font-medium">
      {stops.map((stop, index) => (
        <div className="flex items-center gap-1" key={stop.id}>
          {index === 0 ? (
            <MapPin className="mr-0.5 size-4 text-[#3f6f55]" aria-hidden="true" />
          ) : (
            <ChevronRight
              className="size-4 text-muted-foreground"
              aria-hidden="true"
            />
          )}
          <span>{stop.city}</span>
        </div>
      ))}
    </div>
  );
}
