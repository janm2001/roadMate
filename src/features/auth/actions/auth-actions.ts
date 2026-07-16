"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import { authCredentialsSchema } from "../schemas/auth-credentials";
import type { AuthActionState } from "../types/auth-action-state";

const invalidCredentialsMessage = "Email or password is incorrect.";
const signupErrorMessage =
  "We couldn't create your account. Try signing in if you already have one.";

function validateCredentials(input: unknown):
  | { success: true; data: { email: string; password: string } }
  | { success: false; state: AuthActionState } {
  const result = authCredentialsSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      state: {
        status: "field-error",
        fieldErrors: result.error.flatten().fieldErrors,
      },
    };
  }

  return { success: true, data: result.data };
}

export async function loginAction(
  input: unknown,
): Promise<AuthActionState | void> {
  const result = validateCredentials(input);

  if (!result.success) {
    return result.state;
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(result.data);

  if (error) {
    return { status: "error", message: invalidCredentialsMessage };
  }

  redirect("/");
}

export async function signupAction(
  input: unknown,
): Promise<AuthActionState | void> {
  const result = validateCredentials(input);

  if (!result.success) {
    return result.state;
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp(result.data);

  if (error || !data.session) {
    return { status: "error", message: signupErrorMessage };
  }

  redirect("/");
}

export async function signOutAction(): Promise<AuthActionState | void> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut({ scope: "local" });

  if (error) {
    return {
      status: "error",
      message: "We couldn't sign you out. Please try again.",
    };
  }

  redirect("/login");
}
