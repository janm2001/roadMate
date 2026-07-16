import { createClient } from "@/lib/supabase/server";

import type { AuthenticatedUser } from "../types/authenticated-user";

export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const email = data?.claims?.email;
  const id = data?.claims?.sub;

  if (error || typeof email !== "string" || typeof id !== "string") {
    return null;
  }

  return { id, email };
}
