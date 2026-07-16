import type { Metadata } from "next";
import Link from "next/link";

import { RoadMateBrand } from "@/components/roadmate-brand";

export const metadata: Metadata = { title: "Terms | RoadMate" };

export default function TermsPage() {
  return (
    <main className="min-h-svh bg-[#f7f8f4] px-5 py-10">
      <div className="mx-auto max-w-2xl">
        <RoadMateBrand />
        <h1 className="mt-10 text-3xl font-semibold">Terms</h1>
        <div className="mt-6 space-y-5 text-sm leading-7 text-muted-foreground">
          <p>
            RoadMate provides approximate route and cost information for trip
            planning. Verify road rules, toll products, prices and parking
            availability with the linked official provider before travelling.
          </p>
          <p>
            Maps, place information and imagery may be supplied by Google Maps
            Platform and remain subject to Google&apos;s applicable terms.
          </p>
          <p>
            External purchase and map links open third-party services. RoadMate
            is not responsible for transactions completed on those services.
          </p>
        </div>
        <Link href="/" className="mt-8 inline-block text-sm font-semibold underline">
          Return to RoadMate
        </Link>
      </div>
    </main>
  );
}
