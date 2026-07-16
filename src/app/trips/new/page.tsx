import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AppHeader } from "@/components/app-header";
import { AppFooter } from "@/components/app-footer";
import { SignOutButton } from "@/features/auth/components/sign-out-button";
import { getAuthenticatedUser } from "@/features/auth/queries/get-authenticated-user";
import { createTripAction } from "@/features/trips/actions/create-trip-action";
import { getGoogleBrowserApiKey } from "@/features/trips/api/google-environment";
import { TripWizard } from "@/features/trips/components/trip-wizard";
import { getTripFormDefaults } from "@/features/trips/constants/trip-form-defaults";

export const metadata: Metadata = {
  title: "New trip | RoadMate",
};

type NewTripPageProps = {
  searchParams: Promise<{ template?: string }>;
};

export default async function NewTripPage({ searchParams }: NewTripPageProps) {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect("/login");
  }

  const { template } = await searchParams;

  return (
    <main className="min-h-svh bg-[#f7f8f4]">
      <AppHeader accountLabel={user.email} action={<SignOutButton />} />
      <div className="mx-auto max-w-2xl px-4 py-7 sm:px-6 sm:py-10">
        <Link
          href="/"
          className="text-sm font-semibold text-muted-foreground hover:text-foreground"
        >
          Back to trips
        </Link>
        <div className="mt-6">
          <p className="text-sm font-semibold text-[#3f6f55]">New road trip</p>
          <h1 className="mt-1 text-3xl font-semibold">Plan your route</h1>
        </div>
        <div className="mt-8">
          <TripWizard
            browserApiKey={getGoogleBrowserApiKey()}
            defaultValues={getTripFormDefaults(template)}
            submitAction={createTripAction}
          />
        </div>
      </div>
      <AppFooter />
    </main>
  );
}
