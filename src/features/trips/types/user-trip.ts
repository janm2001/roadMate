import type { TripFormValues } from "../schemas/trip-form";

export type EstimateStatus = "pending" | "ready" | "failed";

export type TollAmount = {
  currencyCode: string;
  amountCents: number;
};

export type RouteEstimate = {
  distanceMetres: number;
  durationSeconds: number;
  encodedPolyline: string | null;
  majorRoads: string[];
  fuelConsumptionMicrolitres: number | null;
  fuelPriceCentsPerLitre: number | null;
  fuelPriceSourceDate: string | null;
  fuelCostCents: number | null;
  tollAmounts: TollAmount[];
  hasUnpricedTolls: boolean;
  generatedAt: string;
  expiresAt: string;
};

export type UserTripStop = TripFormValues["stops"][number] & {
  id: string;
  position: number;
  selectedParkingPlaceId: string | null;
};

export type UserTrip = Omit<TripFormValues, "stops"> & {
  id: string;
  ownerId: string;
  estimateStatus: EstimateStatus;
  stops: UserTripStop[];
  routeEstimate: RouteEstimate | null;
  createdAt: string;
};

export type ParkingPlace = {
  id: string;
  name: string;
  address: string;
  googleMapsUri: string | null;
  isOpenNow: boolean | null;
  location: { latitude: number; longitude: number };
};

export type PlaceEnrichment = {
  placeId: string;
  name: string;
  googleMapsUri: string | null;
  location: { latitude: number; longitude: number } | null;
  photo: {
    uri: string;
    attributionName: string | null;
    attributionUri: string | null;
  } | null;
};
