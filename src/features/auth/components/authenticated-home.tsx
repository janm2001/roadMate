import { RoadImagePanel } from "@/components/road-image-panel";

import type { AuthenticatedUser } from "../types/authenticated-user";
import { SignOutButton } from "./sign-out-button";

type AuthenticatedHomeProps = {
  user: AuthenticatedUser;
};

export function AuthenticatedHome({ user }: AuthenticatedHomeProps) {
  return (
    <main className="grid min-h-svh bg-[#f7f8f4] lg:grid-cols-[minmax(0,1.15fr)_minmax(400px,0.85fr)]">
      <RoadImagePanel
        className="min-h-[42svh] lg:min-h-svh"
        imageClassName="object-[center_70%]"
      />

      <section className="flex min-h-[58svh] items-center px-6 py-10 pb-[max(2.5rem,env(safe-area-inset-bottom))] sm:px-10 lg:min-h-svh lg:px-14">
        <div className="mx-auto w-full max-w-md">
          <p className="text-sm font-medium text-[#3f6f55]">Account ready</p>
          <h1 className="mt-2 text-3xl font-semibold">You&apos;re signed in</h1>
          <p className="mt-3 break-all text-sm text-muted-foreground">
            {user.email}
          </p>

          <div className="mt-8 border-t pt-6">
            <SignOutButton />
          </div>
        </div>
      </section>
    </main>
  );
}
