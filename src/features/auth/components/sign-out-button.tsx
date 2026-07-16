"use client";

import { LogOut } from "lucide-react";
import { useState, useTransition } from "react";

import { AsyncButton } from "@/components/ui/async-button";
import { FormMessage } from "@/components/ui/form-message";

import { signOutAction } from "../actions/sign-out-action";

export function SignOutButton() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    setError(null);
    startTransition(async () => {
      try {
        const result = await signOutAction();

        if (result?.status === "error") {
          setError(result.message);
        }
      } catch {
        setError("Something went wrong. Please try again.");
      }
    });
  };

  return (
    <div>
      <AsyncButton
        type="button"
        variant="outline"
        size="lg"
        className="h-11"
        onClick={handleSignOut}
        isPending={isPending}
        pendingLabel="Signing out"
      >
        <LogOut aria-hidden="true" />
        Sign out
      </AsyncButton>
      {error ? (
        <FormMessage className="mt-3">{error}</FormMessage>
      ) : null}
    </div>
  );
}
