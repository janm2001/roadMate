"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getAuthenticatedUser } from "@/features/auth/queries/get-authenticated-user";
import { createClient } from "@/lib/supabase/server";

import { tripFormSchema } from "../schemas/trip-form";
import { calculateAndStoreTripEstimate } from "../services/calculate-trip-estimate";
import type { TripActionState } from "../types/trip-action-state";

export async function createTripAction(
  input: unknown,
): Promise<TripActionState | void> {
  const user = await getAuthenticatedUser();

  if (!user) {
    return { status: "error", message: "Sign in to create a trip." };
  }

  const validation = tripFormSchema.safeParse(input);

  if (!validation.success) {
    return {
      status: "field-error",
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  const trip = validation.data;
  const supabase = await createClient();
  const args = {
    p_title: trip.title,
    p_start_date: trip.startDate,
    p_end_date: trip.endDate,
    p_traveller_count: trip.travellerCount,
    p_fuel_type: trip.fuelType,
    p_food_budget_cents: trip.foodBudgetCents,
    p_activities_budget_cents: trip.activitiesBudgetCents,
    p_stops: trip.stops.map((stop, position) => ({ ...stop, position })),
    ...(trip.fuelPriceOverrideCentsPerLitre === null
      ? {}
      : {
          p_fuel_price_override_cents_per_litre:
            trip.fuelPriceOverrideCentsPerLitre,
        }),
  };
  const { data: tripId, error } = await supabase.rpc(
    "create_trip_with_stops",
    args,
  );

  if (error || !tripId) {
    return {
      status: "error",
      message: "We couldn't save this trip. Please try again.",
    };
  }

  try {
    await calculateAndStoreTripEstimate(tripId, trip);
  } catch {
    // The saved draft remains available and can be recalculated from its detail page.
  }

  revalidatePath("/");
  redirect(`/trips/${tripId}`);
}
