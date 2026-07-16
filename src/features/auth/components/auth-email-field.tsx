import type { FieldError, UseFormRegister } from "react-hook-form";

import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { AuthCredentials } from "../schemas/auth-credentials";

type AuthEmailFieldProps = {
  disabled: boolean;
  error?: FieldError;
  id: string;
  register: UseFormRegister<AuthCredentials>;
};

export function AuthEmailField({
  disabled,
  error,
  id,
  register,
}: AuthEmailFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>Email</Label>
      <Input
        id={id}
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="you@example.com"
        className="h-12 bg-white px-3"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        disabled={disabled}
        {...register("email")}
      />
      {error?.message ? (
        <FormMessage id={errorId}>{error.message}</FormMessage>
      ) : null}
    </div>
  );
}
