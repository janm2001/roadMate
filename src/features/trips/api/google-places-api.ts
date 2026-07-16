import { z } from "zod";

import type { ParkingPlace, PlaceEnrichment } from "../types/user-trip";
import { getGoogleServerApiKey } from "./google-environment";

const locationSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

const attributionSchema = z.object({
  displayName: z.string().optional(),
  uri: z.string().optional(),
});

const placeSchema = z.object({
  id: z.string(),
  displayName: z.object({ text: z.string() }),
  formattedAddress: z.string().optional(),
  googleMapsUri: z.string().optional(),
  location: locationSchema.optional(),
  currentOpeningHours: z.object({ openNow: z.boolean().optional() }).optional(),
  photos: z
    .array(
      z.object({
        name: z.string(),
        authorAttributions: z.array(attributionSchema).optional(),
      }),
    )
    .optional(),
});

const nearbyResponseSchema = z.object({
  places: z.array(placeSchema).optional(),
});

const photoResponseSchema = z.object({ photoUri: z.string().url() });

async function fetchPhoto(
  photoName: string,
  attribution: z.infer<typeof attributionSchema> | undefined,
  apiKey: string,
): Promise<PlaceEnrichment["photo"]> {
  const response = await fetch(
    `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=1200&skipHttpRedirect=true&key=${encodeURIComponent(apiKey)}`,
    { signal: AbortSignal.timeout(8_000), cache: "no-store" },
  );

  if (!response.ok) {
    return null;
  }

  const parsed = photoResponseSchema.safeParse(await response.json());

  return parsed.success
    ? {
        uri: parsed.data.photoUri,
        attributionName: attribution?.displayName ?? null,
        attributionUri: attribution?.uri ?? null,
      }
    : null;
}

export async function getGooglePlaceEnrichment(
  placeId: string,
): Promise<PlaceEnrichment | null> {
  const apiKey = getGoogleServerApiKey();

  if (!apiKey || placeId.startsWith("manual:")) {
    return null;
  }

  const response = await fetch(
    `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
    {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask":
          "id,displayName,googleMapsUri,location,photos",
      },
      signal: AbortSignal.timeout(8_000),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return null;
  }

  const parsed = placeSchema.safeParse(await response.json());

  if (!parsed.success) {
    return null;
  }

  const photo = parsed.data.photos?.[0];

  return {
    placeId: parsed.data.id,
    name: parsed.data.displayName.text,
    googleMapsUri: parsed.data.googleMapsUri ?? null,
    location: parsed.data.location ?? null,
    photo: photo
      ? await fetchPhoto(
          photo.name,
          photo.authorAttributions?.[0],
          apiKey,
        )
      : null,
  };
}

export async function findGoogleParkingPlaces(
  location: { latitude: number; longitude: number },
): Promise<ParkingPlace[]> {
  const apiKey = getGoogleServerApiKey();

  if (!apiKey) {
    return [];
  }

  const response = await fetch(
    "https://places.googleapis.com/v1/places:searchNearby",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask":
          "places.id,places.displayName,places.formattedAddress,places.googleMapsUri,places.location,places.currentOpeningHours",
      },
      body: JSON.stringify({
        includedPrimaryTypes: ["parking_garage"],
        maxResultCount: 5,
        rankPreference: "DISTANCE",
        locationRestriction: { circle: { center: location, radius: 5000 } },
      }),
      signal: AbortSignal.timeout(8_000),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return [];
  }

  const parsed = nearbyResponseSchema.safeParse(await response.json());

  if (!parsed.success) {
    return [];
  }

  return (parsed.data.places ?? []).flatMap((place) =>
    place.location
      ? [
          {
            id: place.id,
            name: place.displayName.text,
            address: place.formattedAddress ?? "Address unavailable",
            googleMapsUri: place.googleMapsUri ?? null,
            isOpenNow: place.currentOpeningHours?.openNow ?? null,
            location: place.location,
          },
        ]
      : [],
  );
}
