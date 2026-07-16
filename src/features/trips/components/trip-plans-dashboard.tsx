import type { TripPlan } from "../types/trip-plan";
import { TripPlanCard } from "./trip-plan-card";

type TripPlansDashboardProps = {
  heading?: string;
  eyebrow?: string;
  tripPlans: TripPlan[];
};

export function TripPlansDashboard({
  eyebrow = "Ready to explore",
  heading = "Trip templates",
  tripPlans,
}: TripPlansDashboardProps) {
  return (
    <section aria-labelledby="trip-plans-heading">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#3f6f55]">{eyebrow}</p>
          <h1 id="trip-plans-heading" className="mt-1 text-3xl font-semibold">
            {heading}
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          {tripPlans.length} sample routes
        </p>
      </div>

      {tripPlans.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-3">
          {tripPlans.map((tripPlan) => (
            <TripPlanCard key={tripPlan.id} tripPlan={tripPlan} />
          ))}
        </div>
      ) : (
        <div className="border-y py-12 text-center">
          <h2 className="text-lg font-semibold">No templates available</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Your saved road trips will appear here.
          </p>
        </div>
      )}
    </section>
  );
}
