import { createClient } from "@/lib/supabase/server";

import type { AuthenticatedUser } from "../types/authenticated-user";

export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const email = data?.claims?.email;

  if (error || typeof email !== "string") {
    return null;
  }

  return { email };
}
