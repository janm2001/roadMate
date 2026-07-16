import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { AppHeader } from "@/components/app-header";
import { AppFooter } from "@/components/app-footer";
import { SignOutButton } from "@/features/auth/components/sign-out-button";
import { getAuthenticatedUser } from "@/features/auth/queries/get-authenticated-user";
import { getGoogleBrowserApiKey } from "@/features/trips/api/google-environment";
import { findGoogleParkingPlaces, getGooglePlaceEnrichment } from "@/features/trips/api/google-places-api";
import { UserTripDetail, type StopLiveData } from "@/features/trips/components/user-trip-detail";
import { getUserTrip } from "@/features/trips/queries/get-user-trips";

type TripPageProps = {
  params: Promise<{ tripId: string }>;
};

export async function generateMetadata({
  params,
}: TripPageProps): Promise<Metadata> {
  const { tripId } = await params;
  const tripPlan = await getUserTrip(tripId);

  return {
    title: tripPlan ? `${tripPlan.title} | RoadMate` : "Trip not found | RoadMate",
  };
}

export default async function TripPage({ params }: TripPageProps) {
  const { tripId } = await params;
  const [user, trip] = await Promise.all([
    getAuthenticatedUser(),
    getUserTrip(tripId),
  ]);

  if (!user) {
    redirect("/login");
  }

  if (!trip) {
    notFound();
  }

  const liveStops: StopLiveData[] = await Promise.all(
    trip.stops.map(async (stop) => {
      const place = await getGooglePlaceEnrichment(stop.googlePlaceId);
      const parking =
        stop.nights > 0 && place?.location
          ? await findGoogleParkingPlaces(place.location)
          : [];

      return { stopId: stop.id, place, parking };
    }),
  );

  return (
    <main className="min-h-svh bg-[#f7f8f4]">
      <AppHeader accountLabel={user.email} action={<SignOutButton />} />
      <UserTripDetail
        browserApiKey={getGoogleBrowserApiKey()}
        trip={trip}
        liveStops={liveStops}
      />
      <AppFooter />
    </main>
  );
}
