"use client";

import { LoaderCircle, LogOut } from "lucide-react";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";

import { signOutAction } from "../actions/auth-actions";

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
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="h-11"
        onClick={handleSignOut}
        disabled={isPending}
      >
        {isPending ? (
          <LoaderCircle className="animate-spin" aria-hidden="true" />
        ) : (
          <LogOut aria-hidden="true" />
        )}
        {isPending ? "Signing out" : "Sign out"}
      </Button>
      {error ? (
        <p className="mt-3 text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
