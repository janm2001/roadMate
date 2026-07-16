"use server";

import { revalidatePath } from "next/cache";

import { getUserTrip } from "../queries/get-user-trips";
import { calculateAndStoreTripEstimate } from "../services/calculate-trip-estimate";

export async function recalculateTripAction(
  tripId: string,
): Promise<{ status: "success" } | { status: "error"; message: string }> {
  const trip = await getUserTrip(tripId);

  if (!trip) {
    return { status: "error", message: "Trip not found." };
  }

  try {
    await calculateAndStoreTripEstimate(tripId, trip);
    revalidatePath(`/trips/${tripId}`);
    revalidatePath("/");
    return { status: "success" };
  } catch {
    return {
      status: "error",
      message: "Live estimates are unavailable. Your trip is still saved.",
    };
  }
}
