import { redirect } from "next/navigation";

import { SignOutButton } from "@/features/auth/components/sign-out-button";
import { getAuthenticatedUser } from "@/features/auth/queries/get-authenticated-user";
import { TripPlansHome } from "@/features/trips/components/trip-plans-home";
import { getTripPlans } from "@/features/trips/queries/get-trip-plans";

export default async function Home() {
  const [user, tripPlans] = await Promise.all([
    getAuthenticatedUser(),
    getTripPlans(),
  ]);

  if (!user) {
    redirect("/login");
  }

  return (
    <TripPlansHome
      userEmail={user.email}
      tripPlans={tripPlans}
      accountAction={<SignOutButton />}
    />
  );
}
