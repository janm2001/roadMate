import { redirect } from "next/navigation";

import { AuthenticatedHome } from "@/features/auth/components/authenticated-home";
import { getAuthenticatedUser } from "@/features/auth/queries/get-authenticated-user";

export default async function Home() {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect("/login");
  }

  return <AuthenticatedHome user={user} />;
}
