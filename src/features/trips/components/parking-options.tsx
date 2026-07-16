"use client";

import { ExternalLink, ParkingCircle } from "lucide-react";
import { useState, useTransition } from "react";

import { AsyncButton } from "@/components/ui/async-button";
import { FormMessage } from "@/components/ui/form-message";

import { selectParkingAction } from "../actions/select-parking-action";
import type { ParkingPlace } from "../types/user-trip";

type ParkingOptionsProps = {
  options: ParkingPlace[];
  selectedParkingPlaceId: string | null;
  stopId: string;
  tripId: string;
};

export function ParkingOptions({
  options,
  selectedParkingPlaceId,
  stopId,
  tripId,
}: ParkingOptionsProps) {
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (options.length === 0) {
    return (
      <p className="mt-3 text-sm text-muted-foreground">
        Live parking suggestions are currently unavailable.
      </p>
    );
  }

  return (
    <div className="mt-4 space-y-3">
      {options.map((parking) => {
        const selected = parking.id === selectedParkingPlaceId;
        return (
          <div className="border-l-2 border-border pl-3" key={parking.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <ParkingCircle className="size-4" aria-hidden="true" />
                  {parking.name}
                </p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {parking.address}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {parking.isOpenNow === null
                    ? "Hours unavailable"
                    : parking.isOpenNow
                      ? "Open now"
                      : "Closed now"}
                  {" · Price unavailable"}
                </p>
              </div>
              <AsyncButton
                type="button"
                size="sm"
                variant={selected ? "secondary" : "outline"}
                isPending={isPending && pendingId === parking.id}
                pendingLabel="Saving"
                disabled={selected}
                onClick={() => {
                  setPendingId(parking.id);
                  setError(null);
                  startTransition(async () => {
                    const result = await selectParkingAction({
                      tripId,
                      stopId,
                      parkingPlaceId: parking.id,
                    });
                    if (result.status === "error") setError(result.message);
                    setPendingId(null);
                  });
                }}
              >
                {selected ? "Selected" : "Choose"}
              </AsyncButton>
            </div>
            {parking.googleMapsUri ? (
              <a
                href={parking.googleMapsUri}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-xs font-semibold underline underline-offset-4"
              >
                Open in Google Maps
                <ExternalLink className="size-3" aria-hidden="true" />
              </a>
            ) : null}
          </div>
        );
      })}
      {error ? <FormMessage>{error}</FormMessage> : null}
    </div>
  );
}
