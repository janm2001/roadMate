import type { ReactNode } from "react";

import { RoadImagePanel } from "@/components/road-image-panel";

import type { TripPlan } from "../types/trip-plan";
import { TripPlansDashboard } from "./trip-plans-dashboard";

type TripPlansHomeProps = {
  accountAction: ReactNode;
  tripPlans: TripPlan[];
  userEmail: string;
};

export function TripPlansHome({
  accountAction,
  tripPlans,
  userEmail,
}: TripPlansHomeProps) {
  return (
    <main className="min-h-svh bg-[#f7f8f4]">
      <RoadImagePanel
        className="h-[230px] sm:h-[280px]"
        imageClassName="object-[center_62%]"
        tagline="Three roads worth taking."
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
          <TripPlansDashboard tripPlans={tripPlans} />
        </div>
      </div>
    </main>
  );
}
