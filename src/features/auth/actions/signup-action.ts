"use server";

import { redirect } from "next/navigation";

import { createAuthAccount } from "../api/auth-api";
import { authErrorMessages } from "../constants/auth-error-messages";
import type { AuthActionState } from "../types/auth-action-state";
import { validateAuthCredentials } from "./validate-auth-credentials";

export async function signupAction(
  input: unknown,
): Promise<AuthActionState | void> {
  const validation = validateAuthCredentials(input);

  if (!validation.success) {
    return validation.state;
  }

  const result = await createAuthAccount(validation.data);

  if (!result.success) {
    return { status: "error", message: authErrorMessages.signup };
  }

  redirect("/");
}
