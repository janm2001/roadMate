import type { Metadata } from "next";

import { signupAction } from "@/features/auth/actions/signup-action";
import { AuthForm } from "@/features/auth/components/auth-form";

export const metadata: Metadata = {
  title: "Create account | RoadMate",
};

export default function SignupPage() {
  return <AuthForm mode="signup" submitAction={signupAction} />;
}
