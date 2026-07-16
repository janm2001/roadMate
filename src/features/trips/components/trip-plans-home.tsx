import type { ReactNode } from "react";
import Link from "next/link";

import { RoadImagePanel } from "@/components/road-image-panel";
import { AppFooter } from "@/components/app-footer";

import type { TripPlan } from "../types/trip-plan";
import type { UserTrip } from "../types/user-trip";
import { TripPlansDashboard } from "./trip-plans-dashboard";
import { UserTripCard } from "./user-trip-card";

type TripPlansHomeProps = {
  accountAction: ReactNode;
  templates: TripPlan[];
  userTrips: UserTrip[];
  userEmail: string;
};

export function TripPlansHome({
  accountAction,
  templates,
  userTrips,
  userEmail,
}: TripPlansHomeProps) {
  return (
    <main className="min-h-svh bg-[#f7f8f4]">
      <RoadImagePanel
        className="h-[230px] sm:h-[280px]"
        imageClassName="object-[center_62%]"
        tagline="Plan the road ahead, together."
      />

      <div className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="flex min-h-20 items-center justify-between gap-4 border-b">
          <p className="min-w-0 text-xs text-muted-foreground sm:text-sm">
            Signed in as{" "}
            <span className="font-medium text-foreground">{userEmail}</span>
          </p>
          {accountAction}
        </div>
        <div className="pt-8 sm:pt-10">
          <section aria-labelledby="your-trips-heading">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[#3f6f55]">Personal plans</p>
                <h1 id="your-trips-heading" className="mt-1 text-3xl font-semibold">
                  Your trips
                </h1>
              </div>
              <Link
                href="/trips/new"
                className="inline-flex h-10 items-center rounded-md bg-foreground px-3 text-sm font-semibold text-background hover:bg-foreground/80"
              >
                New trip
              </Link>
            </div>
            {userTrips.length > 0 ? (
              <div className="grid gap-4 lg:grid-cols-2">
                {userTrips.map((trip) => (
                  <UserTripCard key={trip.id} trip={trip} />
                ))}
              </div>
            ) : (
              <div className="border-y py-10">
                <h2 className="text-lg font-semibold">No personal trips yet</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Start from scratch or use one of the templates below.
                </p>
              </div>
            )}
          </section>
        </div>
        <div className="pt-12">
          <TripPlansDashboard
            eyebrow="Start with a proven route"
            heading="Trip templates"
            tripPlans={templates}
          />
        </div>
      </div>
      <AppFooter />
    </main>
  );
}
