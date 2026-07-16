import type { Metadata } from "next";

import { loginAction } from "@/features/auth/actions/auth-actions";
import { AuthForm } from "@/features/auth/components/auth-form";

export const metadata: Metadata = {
  title: "Sign in | RoadMate",
};

export default function LoginPage() {
  return <AuthForm mode="login" submitAction={loginAction} />;
}
