import type { ReactNode } from "react";

import { RoadImagePanel } from "@/components/road-image-panel";

type AuthShellProps = {
  children: ReactNode;
};

export function AuthShell({ children }: AuthShellProps) {
  return (
    <main className="grid min-h-svh bg-[#f7f8f4] lg:grid-cols-[minmax(0,1.15fr)_minmax(400px,0.85fr)]">
      <RoadImagePanel
        className="min-h-[31svh] sm:min-h-[36svh] lg:min-h-svh"
        imageClassName="object-[center_66%]"
        tagline="Plan the road ahead, together."
      />

      <section className="flex min-h-[69svh] items-center px-6 py-9 pb-[max(2.25rem,env(safe-area-inset-bottom))] sm:min-h-[64svh] sm:px-10 lg:min-h-svh lg:px-14">
        <div className="mx-auto w-full max-w-md">{children}</div>
      </section>
    </main>
  );
}
