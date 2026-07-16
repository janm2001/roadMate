import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Fuel,
  Gauge,
  Users,
} from "lucide-react";
import Link from "next/link";

import { formatTripDateRange } from "../calculations/trip-formatters";
import { getCityImage } from "../constants/city-images";
import type {
  ParkingPlace,
  PlaceEnrichment,
  UserTrip,
} from "../types/user-trip";
import { CityImage } from "./city-image";
import { ParkingOptions } from "./parking-options";
import { RecalculateTripButton } from "./recalculate-trip-button";
import { RoadPaymentPanel } from "./road-payment-panel";
import { TripMap } from "./trip-map";
import { UserTripCostBreakdown } from "./user-trip-cost-breakdown";

export type StopLiveData = {
  stopId: string;
  place: PlaceEnrichment | null;
  parking: ParkingPlace[];
};

type UserTripDetailProps = {
  browserApiKey: string | null;
  liveStops: StopLiveData[];
  trip: UserTrip;
};

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);
  return `${hours} hr ${minutes} min`;
}

export function UserTripDetail({
  browserApiKey,
  liveStops,
  trip,
}: UserTripDetailProps) {
  const mapPoints = liveStops.flatMap((liveStop) =>
    liveStop.place?.location
      ? [
          {
            ...liveStop.place.location,
            label: liveStop.place.name,
          },
        ]
      : [],
  );
  const estimate = trip.routeEstimate;

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
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="text-sm font-semibold text-[#3f6f55]">Your trip</p>
            <h1 className="mt-2 max-w-3xl text-3xl font-semibold leading-tight sm:text-4xl">
              {trip.title}
            </h1>
          </div>
          {trip.estimateStatus !== "pending" ? (
            <RecalculateTripButton tripId={trip.id} />
          ) : null}
        </div>

        {trip.estimateStatus === "failed" ? (
          <div className="mt-5 border-l-2 border-amber-600 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Your trip is saved. Live route estimates are unavailable until a
            Google Maps server key is configured or the provider recovers.
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <CalendarDays className="size-4" aria-hidden="true" />
            {formatTripDateRange(trip.startDate, trip.endDate)}
          </span>
          <span className="flex items-center gap-2">
            <Users className="size-4" aria-hidden="true" />
            {trip.travellerCount} travellers
          </span>
          {estimate ? (
            <>
              <span className="flex items-center gap-2">
                <Gauge className="size-4" aria-hidden="true" />
                {Math.round(estimate.distanceMetres / 1000)} km
              </span>
              <span className="flex items-center gap-2">
                <Clock3 className="size-4" aria-hidden="true" />
                {formatDuration(estimate.durationSeconds)}
              </span>
            </>
          ) : null}
        </div>
      </section>

      <section
        className="mt-8 overflow-hidden rounded-lg border bg-white"
        aria-label="Trip route map"
      >
        <TripMap
          apiKey={browserApiKey}
          encodedPolyline={estimate?.encodedPolyline ?? null}
          points={mapPoints}
        />
      </section>

      {estimate?.majorRoads.length ? (
        <section className="mt-8" aria-labelledby="major-roads-heading">
          <h2 id="major-roads-heading" className="text-xl font-semibold">
            Important roads
          </h2>
          <ol className="mt-4 grid gap-2 sm:grid-cols-2">
            {estimate.majorRoads.map((instruction, index) => (
              <li
                className="flex gap-3 border-l-2 border-[#87a993] pl-3 text-sm leading-6"
                key={`${instruction}-${index}`}
              >
                <span className="font-semibold">{index + 1}</span>
                {instruction}
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      <div className="grid gap-12 py-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)] lg:gap-16">
        <section aria-labelledby="stops-heading">
          <h2 id="stops-heading" className="text-xl font-semibold">
            Stops, stays & parking
          </h2>
          <div className="mt-5 space-y-8">
            {trip.stops.map((stop, index) => {
              const live = liveStops.find((item) => item.stopId === stop.id);
              const localPhoto = getCityImage(stop.placeLabel);
              return (
                <article className="border-b pb-8" key={stop.id}>
                  <div className="flex items-baseline justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold text-[#3f6f55]">
                        Stop {index + 1}
                      </p>
                      <h3 className="mt-1 text-lg font-semibold">
                        {stop.placeLabel}
                      </h3>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {stop.nights} {stop.nights === 1 ? "night" : "nights"}
                    </span>
                  </div>

                  {live?.place?.photo || localPhoto ? (
                    <figure className="mt-4 overflow-hidden rounded-lg border bg-white">
                      {live?.place?.photo ? (
                        /* Google photo URLs are ephemeral and must not be optimized or cached. */
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={live.place.photo.uri}
                          alt={live.place.name}
                          className="aspect-[16/9] w-full object-cover"
                        />
                      ) : localPhoto ? (
                        <CityImage
                          city={stop.placeLabel}
                          className="aspect-[16/9] w-full"
                          sizes="(min-width: 1024px) 55vw, 100vw"
                        />
                      ) : null}
                      {live?.place?.photo?.attributionName ? (
                        <figcaption className="px-3 py-2 text-xs text-muted-foreground">
                          Photo by{" "}
                          {live.place.photo.attributionUri ? (
                            <a
                              href={live.place.photo.attributionUri}
                              target="_blank"
                              rel="noreferrer"
                              className="underline"
                            >
                              {live.place.photo.attributionName}
                            </a>
                          ) : (
                            live.place.photo.attributionName
                          )}
                        </figcaption>
                      ) : null}
                    </figure>
                  ) : null}

                  {stop.nights > 0 ? (
                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Apartment budget
                        </p>
                        <p className="mt-1 font-semibold">
                          €{(stop.accommodationBudgetCents / 100).toFixed(0)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Parking budget
                        </p>
                        <p className="mt-1 font-semibold">
                          €{(stop.parkingBudgetCents / 100).toFixed(0)}
                        </p>
                      </div>
                    </div>
                  ) : null}

                  {stop.nights > 0 ? (
                    <ParkingOptions
                      tripId={trip.id}
                      stopId={stop.id}
                      options={live?.parking ?? []}
                      selectedParkingPlaceId={stop.selectedParkingPlaceId}
                    />
                  ) : null}
                </article>
              );
            })}
          </div>
        </section>

        <div className="space-y-12">
          <UserTripCostBreakdown trip={trip} />
          {estimate?.fuelConsumptionMicrolitres !== null && estimate ? (
            <section aria-labelledby="fuel-assumptions-heading">
              <h2
                id="fuel-assumptions-heading"
                className="text-xl font-semibold"
              >
                Fuel assumptions
              </h2>
              <div className="mt-4 border-y py-4 text-sm">
                <p className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-2">
                    <Fuel className="size-4" /> Predicted use
                  </span>
                  <strong>
                    {(estimate.fuelConsumptionMicrolitres / 1_000_000).toFixed(
                      1,
                    )}{" "}
                    L
                  </strong>
                </p>
                <p className="mt-3 flex items-center justify-between gap-4">
                  <span>Price per litre</span>
                  <strong>
                    {estimate.fuelPriceCentsPerLitre === null
                      ? "Unavailable"
                      : `€${(estimate.fuelPriceCentsPerLitre / 100).toFixed(2)}`}
                  </strong>
                </p>
                {estimate.fuelPriceSourceDate ? (
                  <p className="mt-3 text-xs text-muted-foreground">
                    EU Weekly Oil Bulletin, {estimate.fuelPriceSourceDate}
                  </p>
                ) : null}
              </div>
            </section>
          ) : null}
          <RoadPaymentPanel
            countryCodes={trip.stops.map((stop) => stop.countryCode)}
          />
        </div>
      </div>
    </div>
  );
}
