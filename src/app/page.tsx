import { Route } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";

import { SignOutButton } from "@/features/auth/components/sign-out-button";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const email =
    typeof data?.claims?.email === "string" ? data.claims.email : null;

  if (error || !email) {
    redirect("/login");
  }

  return (
    <main className="grid min-h-svh bg-[#f7f8f4] lg:grid-cols-[minmax(0,1.15fr)_minmax(400px,0.85fr)]">
      <section className="relative min-h-[42svh] overflow-hidden lg:min-h-svh">
        <Image
          src="/images/auth-road.webp"
          alt="An open road winding through green mountains"
          fill
          priority
          sizes="(min-width: 1024px) 58vw, 100vw"
          className="object-cover object-[center_70%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/20" />
        <div className="absolute inset-x-0 top-0 flex items-center gap-2 px-5 pt-[max(1.25rem,env(safe-area-inset-top))] text-white sm:px-8">
          <Route className="size-5" aria-hidden="true" />
          <span className="text-lg font-semibold">RoadMate</span>
        </div>
      </section>

      <section className="flex min-h-[58svh] items-center px-6 py-10 pb-[max(2.5rem,env(safe-area-inset-bottom))] sm:px-10 lg:min-h-svh lg:px-14">
        <div className="mx-auto w-full max-w-md">
          <p className="text-sm font-medium text-[#3f6f55]">Account ready</p>
          <h1 className="mt-2 text-3xl font-semibold">You&apos;re signed in</h1>
          <p className="mt-3 break-all text-sm text-muted-foreground">
            {email}
          </p>

          <div className="mt-8 border-t pt-6">
            <SignOutButton />
          </div>
        </div>
      </section>
    </main>
  );
}
