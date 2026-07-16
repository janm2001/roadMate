"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";

const selectionSchema = z.object({
  tripId: z.uuid(),
  stopId: z.uuid(),
  parkingPlaceId: z.string().min(3).max(255),
});

export async function selectParkingAction(input: unknown): Promise<
  | { status: "success" }
  | { status: "error"; message: string }
> {
  const validation = selectionSchema.safeParse(input);

  if (!validation.success) {
    return { status: "error", message: "Invalid parking selection." };
  }

  const { parkingPlaceId, stopId, tripId } = validation.data;
  const supabase = await createClient();
  const { error } = await supabase
    .from("trip_stops")
    .update({ selected_parking_place_id: parkingPlaceId })
    .eq("id", stopId)
    .eq("trip_id", tripId);

  if (error) {
    return { status: "error", message: "Parking could not be saved." };
  }

  revalidatePath(`/trips/${tripId}`);
  return { status: "success" };
}
