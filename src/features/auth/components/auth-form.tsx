"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useState, useSyncExternalStore, useTransition } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  authCredentialsSchema,
  type AuthCredentials,
} from "../schemas/auth-credentials";
import type { AuthAction } from "../types/auth-action-state";

type AuthFormProps = {
  mode: "login" | "signup";
  submitAction: AuthAction;
};

const subscribeToHydration = () => () => undefined;

const formCopy = {
  login: {
    title: "Welcome back",
    description: "Sign in to continue planning together.",
    submit: "Sign in",
    alternatePrompt: "New to RoadMate?",
    alternateLabel: "Create an account",
    alternateHref: "/signup",
  },
  signup: {
    title: "Create your account",
    description: "Start with your email. The trip details can wait.",
    submit: "Create account",
    alternatePrompt: "Already have an account?",
    alternateLabel: "Sign in",
    alternateHref: "/login",
  },
} as const;

export function AuthForm({ mode, submitAction }: AuthFormProps) {
  const isHydrated = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );
  const [showPassword, setShowPassword] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const copy = formCopy[mode];
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

  return (
    <div className="w-full">
      <div>
        <p className="text-sm font-medium text-[#3f6f55]">
          {mode === "login" ? "Good to see you" : "Your next road starts here"}
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-balance">{copy.title}</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {copy.description}
        </p>
      </div>

      <form
        className="mt-8 space-y-5"
        method="post"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="space-y-2">
          <Label htmlFor={`${mode}-email`}>Email</Label>
          <Input
            id={`${mode}-email`}
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="h-12 bg-white px-3"
            aria-invalid={Boolean(form.formState.errors.email)}
            aria-describedby={
              form.formState.errors.email ? `${mode}-email-error` : undefined
            }
            disabled={isPending}
            {...form.register("email")}
          />
          {form.formState.errors.email?.message ? (
            <p
              id={`${mode}-email-error`}
              className="text-sm text-destructive"
              role="alert"
            >
              {form.formState.errors.email.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${mode}-password`}>Password</Label>
          <div className="relative">
            <Input
              id={`${mode}-password`}
              type={showPassword ? "text" : "password"}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              className="h-12 bg-white px-3 pr-12"
              aria-invalid={Boolean(form.formState.errors.password)}
              aria-describedby={
                form.formState.errors.password
                  ? `${mode}-password-error`
                  : undefined
              }
              disabled={isPending}
              {...form.register("password")}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              title={showPassword ? "Hide password" : "Show password"}
              disabled={isPending}
            >
              {showPassword ? (
                <EyeOff className="size-5" aria-hidden="true" />
              ) : (
                <Eye className="size-5" aria-hidden="true" />
              )}
            </button>
          </div>
          {form.formState.errors.password?.message ? (
            <p
              id={`${mode}-password-error`}
              className="text-sm text-destructive"
              role="alert"
            >
              {form.formState.errors.password.message}
            </p>
          ) : null}
        </div>

        {submissionError ? (
          <div
            className="border-l-2 border-destructive bg-destructive/5 px-3 py-2 text-sm text-destructive"
            role="alert"
          >
            {submissionError}
          </div>
        ) : null}

        <Button
          type="submit"
          size="lg"
          className="h-12 w-full text-base"
          disabled={!isHydrated || isPending}
        >
          {isPending ? (
            <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
          ) : null}
          {isPending ? "Please wait" : copy.submit}
        </Button>
      </form>

      <p className="mt-7 text-center text-sm text-muted-foreground">
        {copy.alternatePrompt}{" "}
        <Link
          href={copy.alternateHref}
          className="font-semibold text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
        >
          {copy.alternateLabel}
        </Link>
      </p>
    </div>
  );
}
