import { dummyTripPlans } from "../constants/dummy-trip-plans";
import type { TripPlan } from "../types/trip-plan";

export async function getTripPlans(): Promise<TripPlan[]> {
  return dummyTripPlans;
}

export async function getTripPlan(tripId: string): Promise<TripPlan | null> {
  return dummyTripPlans.find((tripPlan) => tripPlan.id === tripId) ?? null;
}
