"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import type { FieldError, UseFormRegister } from "react-hook-form";

import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { AuthCredentials } from "../schemas/auth-credentials";

type AuthPasswordFieldProps = {
  autoComplete: "current-password" | "new-password";
  disabled: boolean;
  error?: FieldError;
  id: string;
  register: UseFormRegister<AuthCredentials>;
};

export function AuthPasswordField({
  autoComplete,
  disabled,
  error,
  id,
  register,
}: AuthPasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const errorId = `${id}-error`;

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>Password</Label>
      <div className="relative">
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          autoComplete={autoComplete}
          className="h-12 bg-white px-3 pr-12"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          disabled={disabled}
          {...register("password")}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
          onClick={() => setShowPassword((visible) => !visible)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          title={showPassword ? "Hide password" : "Show password"}
          disabled={disabled}
        >
          {showPassword ? (
            <EyeOff className="size-5" aria-hidden="true" />
          ) : (
            <Eye className="size-5" aria-hidden="true" />
          )}
        </button>
      </div>
      {error?.message ? (
        <FormMessage id={errorId}>{error.message}</FormMessage>
      ) : null}
    </div>
  );
}
