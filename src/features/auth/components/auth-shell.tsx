import { Route } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";

type AuthShellProps = {
  children: ReactNode;
};

export function AuthShell({ children }: AuthShellProps) {
  return (
    <main className="grid min-h-svh bg-[#f7f8f4] lg:grid-cols-[minmax(0,1.15fr)_minmax(400px,0.85fr)]">
      <section className="relative min-h-[31svh] overflow-hidden sm:min-h-[36svh] lg:min-h-svh">
        <Image
          src="/images/auth-road.webp"
          alt="An open road winding through green mountains"
          fill
          priority
          sizes="(min-width: 1024px) 58vw, 100vw"
          className="object-cover object-[center_66%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/25" />
        <div className="absolute inset-x-0 top-0 flex items-center gap-2 px-5 pt-[max(1.25rem,env(safe-area-inset-top))] text-white sm:px-8">
          <Route className="size-5" aria-hidden="true" />
          <span className="text-lg font-semibold">RoadMate</span>
        </div>
        <p className="absolute inset-x-5 bottom-5 max-w-sm text-xl font-medium leading-snug text-white sm:inset-x-8 sm:text-2xl lg:bottom-10">
          Plan the road ahead, together.
        </p>
      </section>

      <section className="flex min-h-[69svh] items-center px-6 py-9 pb-[max(2.25rem,env(safe-area-inset-bottom))] sm:min-h-[64svh] sm:px-10 lg:min-h-svh lg:px-14">
        <div className="mx-auto w-full max-w-md">{children}</div>
      </section>
    </main>
  );
}
