import { z } from "zod";

import type { Database } from "@/types/database";

import type { UserTrip } from "../types/user-trip";

type TripRow = Database["public"]["Tables"]["trips"]["Row"];
type StopRow = Database["public"]["Tables"]["trip_stops"]["Row"];
type EstimateRow = Database["public"]["Tables"]["trip_route_estimates"]["Row"];

export type UserTripQueryRow = TripRow & {
  trip_stops: StopRow[];
  trip_route_estimates: EstimateRow | null;
};

const tollAmountsSchema = z.array(
  z.object({
    currencyCode: z.string().length(3),
    amountCents: z.number().int().nonnegative(),
  }),
);

export function mapUserTrip(row: UserTripQueryRow): UserTrip {
  const estimate = row.trip_route_estimates;

  return {
    id: row.id,
    ownerId: row.owner_id,
    title: row.title,
    startDate: row.start_date,
    endDate: row.end_date,
    travellerCount: row.traveller_count,
    fuelType: row.fuel_type as UserTrip["fuelType"],
    fuelPriceOverrideCentsPerLitre:
      row.fuel_price_override_cents_per_litre,
    foodBudgetCents: row.food_budget_cents,
    activitiesBudgetCents: row.activities_budget_cents,
    estimateStatus: row.estimate_status as UserTrip["estimateStatus"],
    createdAt: row.created_at,
    stops: row.trip_stops
      .sort((left, right) => left.position - right.position)
      .map((stop) => ({
        id: stop.id,
        position: stop.position,
        googlePlaceId: stop.google_place_id,
        placeLabel: stop.place_label,
        countryCode: stop.country_code,
        nights: stop.nights,
        accommodationBudgetCents: stop.accommodation_budget_cents,
        parkingBudgetCents: stop.parking_budget_cents,
        selectedParkingPlaceId: stop.selected_parking_place_id,
      })),
    routeEstimate: estimate
      ? {
          distanceMetres: estimate.distance_metres,
          durationSeconds: estimate.duration_seconds,
          encodedPolyline: estimate.encoded_polyline,
          majorRoads: estimate.major_roads,
          fuelConsumptionMicrolitres:
            estimate.fuel_consumption_microlitres === null
              ? null
              : Number(estimate.fuel_consumption_microlitres),
          fuelPriceCentsPerLitre: estimate.fuel_price_cents_per_litre,
          fuelPriceSourceDate: estimate.fuel_price_source_date,
          fuelCostCents: estimate.fuel_cost_cents,
          tollAmounts:
            tollAmountsSchema.safeParse(estimate.toll_amounts).data ?? [],
          hasUnpricedTolls: estimate.has_unpriced_tolls,
          generatedAt: estimate.provider_generated_at,
          expiresAt: estimate.expires_at,
        }
      : null,
  };
}
