"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="flex min-h-svh items-center justify-center bg-[#f7f8f4] px-6 py-12">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-2xl font-semibold">RoadMate hit a roadblock</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          The page could not be loaded. Try again in a moment.
        </p>
        <Button className="mt-6 h-11" onClick={reset}>
          Try again
        </Button>
      </div>
    </main>
  );
}
