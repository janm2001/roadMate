import { calculateFuelCostCents, selectAverageFuelPrice } from "../calculations/live-trip-costs";
import { fetchEuFuelPrices } from "../api/eu-fuel-prices-api";
import { calculateGoogleRoute } from "../api/google-routes-api";
import type { TripFormValues } from "../schemas/trip-form";
import { createClient } from "@/lib/supabase/server";

export async function calculateAndStoreTripEstimate(
  tripId: string,
  trip: TripFormValues,
): Promise<void> {
  const supabase = await createClient();

  try {
    const route = await calculateGoogleRoute({
      placeIds: trip.stops.map((stop) => stop.googlePlaceId),
      fuelType: trip.fuelType,
    });

    let fuelPriceCentsPerLitre = trip.fuelPriceOverrideCentsPerLitre;
    let fuelPriceSourceDate: string | null = null;

    if (fuelPriceCentsPerLitre === null) {
      try {
        const prices = await fetchEuFuelPrices();
        const selected = selectAverageFuelPrice({
          prices,
          countryCodes: trip.stops.map((stop) => stop.countryCode),
          fuelType: trip.fuelType,
        });
        fuelPriceCentsPerLitre = selected?.priceCentsPerLitre ?? null;
        fuelPriceSourceDate = selected?.sourceDate ?? null;
      } catch {
        fuelPriceCentsPerLitre = null;
      }
    }

    const fuelCostCents =
      route.fuelConsumptionMicrolitres !== null &&
      fuelPriceCentsPerLitre !== null
        ? calculateFuelCostCents(
            route.fuelConsumptionMicrolitres,
            fuelPriceCentsPerLitre,
          )
        : null;

    const { error: estimateError } = await supabase
      .from("trip_route_estimates")
      .upsert({
        trip_id: tripId,
        distance_metres: route.distanceMetres,
        duration_seconds: route.durationSeconds,
        encoded_polyline: route.encodedPolyline,
        major_roads: route.majorRoads,
        fuel_consumption_microlitres: route.fuelConsumptionMicrolitres,
        fuel_price_cents_per_litre: fuelPriceCentsPerLitre,
        fuel_price_source_date: fuelPriceSourceDate,
        fuel_cost_cents: fuelCostCents,
        toll_amounts: route.tollAmounts,
        has_unpriced_tolls: route.hasUnpricedTolls,
        provider_generated_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 86_400_000).toISOString(),
      });

    if (estimateError) {
      throw estimateError;
    }

    const { error: statusError } = await supabase
      .from("trips")
      .update({ estimate_status: "ready" })
      .eq("id", tripId);

    if (statusError) {
      throw statusError;
    }
  } catch (error) {
    await supabase
      .from("trips")
      .update({ estimate_status: "failed" })
      .eq("id", tripId);
    throw error;
  }
}
