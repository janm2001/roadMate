"use server";

import { redirect } from "next/navigation";

import { signOutCurrentSession } from "../api/auth-api";
import { authErrorMessages } from "../constants/auth-error-messages";
import type { AuthActionState } from "../types/auth-action-state";

export async function signOutAction(): Promise<AuthActionState | void> {
  const result = await signOutCurrentSession();

  if (!result.success) {
    return { status: "error", message: authErrorMessages.signOut };
  }

  redirect("/login");
}
