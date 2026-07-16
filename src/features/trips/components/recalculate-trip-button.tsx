"use client";

import { RefreshCw } from "lucide-react";
import { useState, useTransition } from "react";

import { AsyncButton } from "@/components/ui/async-button";
import { FormMessage } from "@/components/ui/form-message";

import { recalculateTripAction } from "../actions/recalculate-trip-action";

export function RecalculateTripButton({ tripId }: { tripId: string }) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div>
      <AsyncButton
        type="button"
        variant="outline"
        isPending={isPending}
        pendingLabel="Calculating"
        onClick={() => {
          setError(null);
          startTransition(async () => {
            const result = await recalculateTripAction(tripId);
            if (result.status === "error") setError(result.message);
          });
        }}
      >
        <RefreshCw aria-hidden="true" />
        Recalculate
      </AsyncButton>
      {error ? <FormMessage className="mt-2">{error}</FormMessage> : null}
    </div>
  );
}
