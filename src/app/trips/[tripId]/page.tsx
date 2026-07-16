import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { AppHeader } from "@/components/app-header";
import { SignOutButton } from "@/features/auth/components/sign-out-button";
import { getAuthenticatedUser } from "@/features/auth/queries/get-authenticated-user";
import { TripDetail } from "@/features/trips/components/trip-detail";
import { getTripPlan } from "@/features/trips/queries/get-trip-plans";

type TripPageProps = {
  params: Promise<{ tripId: string }>;
};

export async function generateMetadata({
  params,
}: TripPageProps): Promise<Metadata> {
  const { tripId } = await params;
  const tripPlan = await getTripPlan(tripId);

  return {
    title: tripPlan ? `${tripPlan.title} | RoadMate` : "Trip not found | RoadMate",
  };
}

export default async function TripPage({ params }: TripPageProps) {
  const { tripId } = await params;
  const [user, tripPlan] = await Promise.all([
    getAuthenticatedUser(),
    getTripPlan(tripId),
  ]);

  if (!user) {
    redirect("/login");
  }

  if (!tripPlan) {
    notFound();
  }

  return (
    <main className="min-h-svh bg-[#f7f8f4]">
      <AppHeader accountLabel={user.email} action={<SignOutButton />} />
      <TripDetail tripPlan={tripPlan} />
    </main>
  );
}
