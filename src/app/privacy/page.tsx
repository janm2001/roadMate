import type { Metadata } from "next";
import Link from "next/link";

import { RoadMateBrand } from "@/components/roadmate-brand";

export const metadata: Metadata = { title: "Privacy | RoadMate" };

export default function PrivacyPage() {
  return (
    <main className="min-h-svh bg-[#f7f8f4] px-5 py-10">
      <div className="mx-auto max-w-2xl">
        <RoadMateBrand />
        <h1 className="mt-10 text-3xl font-semibold">Privacy</h1>
        <div className="mt-6 space-y-5 text-sm leading-7 text-muted-foreground">
          <p>
            RoadMate stores account details and trip information in Supabase so
            authenticated members can access their plans.
          </p>
          <p>
            Google Maps Platform processes place searches, routes, maps, parking
            searches and place photos. Google content is displayed with required
            attribution and is not retained beyond permitted caching periods.
          </p>
          <p>
            Trip cost estimates are planning aids. RoadMate does not sell
            accommodation, parking, fuel, tolls or vignettes.
          </p>
        </div>
        <Link href="/" className="mt-8 inline-block text-sm font-semibold underline">
          Return to RoadMate
        </Link>
      </div>
    </main>
  );
}
