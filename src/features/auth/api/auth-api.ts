import { createClient } from "@/lib/supabase/server";

import type { AuthCredentials } from "../schemas/auth-credentials";
import type { AuthApiResult } from "../types/auth-api-result";

export async function signInWithPassword(
  credentials: AuthCredentials,
): Promise<AuthApiResult> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(credentials);

  return error ? { success: false } : { success: true };
}

export async function createAuthAccount(
  credentials: AuthCredentials,
): Promise<AuthApiResult> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp(credentials);

  return error || !data.session ? { success: false } : { success: true };
}

export async function signOutCurrentSession(): Promise<AuthApiResult> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut({ scope: "local" });

  return error ? { success: false } : { success: true };
}
