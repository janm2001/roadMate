import { z } from "zod";

import type { TripFuelType } from "../types/trip-provider";
import type { TollAmount } from "../types/user-trip";
import { getGoogleServerApiKey } from "./google-environment";

const moneySchema = z.object({
  currencyCode: z.string().length(3),
  units: z.string().optional(),
  nanos: z.number().int().optional(),
});

const routeResponseSchema = z.object({
  routes: z
    .array(
      z.object({
        distanceMeters: z.number().int().nonnegative(),
        duration: z.string(),
        polyline: z.object({ encodedPolyline: z.string() }).optional(),
        travelAdvisory: z
          .object({
            fuelConsumptionMicroliters: z.string().optional(),
            tollInfo: z
              .object({ estimatedPrice: z.array(moneySchema).optional() })
              .optional(),
          })
          .optional(),
        legs: z
          .array(
            z.object({
              travelAdvisory: z
                .object({ tollInfo: z.object({}).passthrough().optional() })
                .optional(),
              steps: z
                .array(
                  z.object({
                    navigationInstruction: z
                      .object({ instructions: z.string().optional() })
                      .optional(),
                  }),
                )
                .optional(),
            }),
          )
          .optional(),
      }),
    )
    .min(1),
});

export type GoogleRouteResult = {
  distanceMetres: number;
  durationSeconds: number;
  encodedPolyline: string | null;
  fuelConsumptionMicrolitres: number | null;
  tollAmounts: TollAmount[];
  hasUnpricedTolls: boolean;
  majorRoads: string[];
};

const emissionTypes: Record<TripFuelType, "GASOLINE" | "DIESEL" | "HYBRID"> = {
  gasoline: "GASOLINE",
  diesel: "DIESEL",
  hybrid: "HYBRID",
};

function moneyToCents(money: z.infer<typeof moneySchema>): number {
  return Number(money.units ?? "0") * 100 + Math.round((money.nanos ?? 0) / 10_000_000);
}

export async function calculateGoogleRoute(input: {
  placeIds: string[];
  fuelType: TripFuelType;
}): Promise<GoogleRouteResult> {
  const apiKey = getGoogleServerApiKey();

  if (!apiKey) {
    throw new Error("Google Maps server API key is not configured.");
  }

  const locations = input.placeIds.map((placeId) => ({ placeId }));
  const response = await fetch(
    "https://routes.googleapis.com/directions/v2:computeRoutes",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask":
          "routes.distanceMeters,routes.duration,routes.polyline.encodedPolyline,routes.travelAdvisory,routes.legs.travelAdvisory,routes.legs.steps.navigationInstruction",
      },
      body: JSON.stringify({
        origin: locations[0],
        destination: locations.at(-1),
        intermediates: locations.slice(1, -1),
        travelMode: "DRIVE",
        routingPreference: "TRAFFIC_AWARE",
        extraComputations: ["TOLLS", "FUEL_CONSUMPTION"],
        routeModifiers: {
          vehicleInfo: { emissionType: emissionTypes[input.fuelType] },
        },
        languageCode: "en",
        units: "METRIC",
      }),
      signal: AbortSignal.timeout(12_000),
    },
  );

  if (!response.ok) {
    throw new Error(`Google Routes returned ${response.status}.`);
  }

  const parsed = routeResponseSchema.safeParse(await response.json());

  if (!parsed.success) {
    throw new Error("Google Routes returned an unexpected response.");
  }

  const route = parsed.data.routes[0];
  const tollInfo = route.travelAdvisory?.tollInfo;
  const tollAmounts = (tollInfo?.estimatedPrice ?? []).map((money) => ({
    currencyCode: money.currencyCode,
    amountCents: moneyToCents(money),
  }));
  const instructions = (route.legs ?? []).flatMap((leg) =>
    (leg.steps ?? [])
      .map((step) => step.navigationInstruction?.instructions)
      .filter((instruction): instruction is string => Boolean(instruction)),
  );

  return {
    distanceMetres: route.distanceMeters,
    durationSeconds: Number.parseInt(route.duration.replace("s", ""), 10),
    encodedPolyline: route.polyline?.encodedPolyline ?? null,
    fuelConsumptionMicrolitres: route.travelAdvisory?.fuelConsumptionMicroliters
      ? Number(route.travelAdvisory.fuelConsumptionMicroliters)
      : null,
    tollAmounts,
    hasUnpricedTolls: Boolean(tollInfo && tollAmounts.length === 0),
    majorRoads: [...new Set(instructions)].slice(0, 8),
  };
}
