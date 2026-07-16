import { createClient } from "@/lib/supabase/server";

import type { UserTrip } from "../types/user-trip";
import { mapUserTrip } from "./user-trip-mapper";

const userTripSelect = `
  *,
  trip_stops (*),
  trip_route_estimates (*)
`;

export async function getUserTrips(): Promise<UserTrip[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trips")
    .select(userTripSelect)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data.map(mapUserTrip);
}

export async function getUserTrip(tripId: string): Promise<UserTrip | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trips")
    .select(userTripSelect)
    .eq("id", tripId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapUserTrip(data) : null;
}
