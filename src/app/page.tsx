import { redirect } from "next/navigation";

import { SignOutButton } from "@/features/auth/components/sign-out-button";
import { getAuthenticatedUser } from "@/features/auth/queries/get-authenticated-user";
import { TripPlansHome } from "@/features/trips/components/trip-plans-home";
import { getTripPlans } from "@/features/trips/queries/get-trip-plans";
import { getUserTrips } from "@/features/trips/queries/get-user-trips";

export default async function Home() {
  const [user, templates, userTrips] = await Promise.all([
    getAuthenticatedUser(),
    getTripPlans(),
    getUserTrips(),
  ]);

  if (!user) {
    redirect("/login");
  }

  return (
    <TripPlansHome
      userEmail={user.email}
      templates={templates}
      userTrips={userTrips}
      accountAction={<SignOutButton />}
    />
  );
}
