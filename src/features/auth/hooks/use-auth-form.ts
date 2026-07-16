"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useSyncExternalStore, useTransition } from "react";
import { useForm } from "react-hook-form";

import {
  authCredentialsSchema,
  type AuthCredentials,
} from "../schemas/auth-credentials";
import type { AuthAction } from "../types/auth-action-state";

const subscribeToHydration = () => () => undefined;

export function useAuthForm(submitAction: AuthAction) {
  const isHydrated = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<AuthCredentials>({
    resolver: zodResolver(authCredentialsSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleSubmit = form.handleSubmit((values) => {
    setSubmissionError(null);
    form.clearErrors();

    startTransition(async () => {
      try {
        const result = await submitAction(values);

        if (!result) {
          return;
        }

        if (result.status === "field-error") {
          for (const [field, messages] of Object.entries(result.fieldErrors)) {
            const message = messages?.[0];

            if (message && (field === "email" || field === "password")) {
              form.setError(field, { message });
            }
          }
          return;
        }

        setSubmissionError(result.message);
      } catch {
        setSubmissionError("Something went wrong. Please try again.");
      }
    });
  });

  return {
    form,
    handleSubmit,
    isHydrated,
    isPending,
    submissionError,
  };
}
