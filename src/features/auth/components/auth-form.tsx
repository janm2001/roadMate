"use client";

import { FormMessage } from "@/components/ui/form-message";

import { authFormConfig } from "../constants/auth-form-config";
import { useAuthForm } from "../hooks/use-auth-form";
import type { AuthAction } from "../types/auth-action-state";
import type { AuthMode } from "../types/auth-mode";
import { AuthEmailField } from "./auth-email-field";
import { AuthFormHeader } from "./auth-form-header";
import { AuthPasswordField } from "./auth-password-field";
import { AuthSubmitButton } from "./auth-submit-button";
import { AuthSwitchLink } from "./auth-switch-link";

type AuthFormProps = {
  mode: AuthMode;
  submitAction: AuthAction;
};

export function AuthForm({ mode, submitAction }: AuthFormProps) {
  const config = authFormConfig[mode];
  const { form, handleSubmit, isHydrated, isPending, submissionError } =
    useAuthForm(submitAction);

  return (
    <div className="w-full">
      <AuthFormHeader mode={mode} />

      <form
        className="mt-8 space-y-5"
        method="post"
        onSubmit={handleSubmit}
        noValidate
      >
        <AuthEmailField
          id={`${mode}-email`}
          register={form.register}
          error={form.formState.errors.email}
          disabled={!isHydrated || isPending}
        />
        <AuthPasswordField
          id={`${mode}-password`}
          autoComplete={config.passwordAutoComplete}
          register={form.register}
          error={form.formState.errors.password}
          disabled={!isHydrated || isPending}
        />

        {submissionError ? (
          <FormMessage prominent>
            {submissionError}
          </FormMessage>
        ) : null}

        <AuthSubmitButton
          label={config.submitLabel}
          isPending={isPending}
          disabled={!isHydrated}
        />
      </form>

      <AuthSwitchLink mode={mode} />
    </div>
  );
}
