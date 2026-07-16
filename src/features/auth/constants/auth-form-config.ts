import type { AuthMode } from "../types/auth-mode";

type AuthFormConfig = {
  eyebrow: string;
  title: string;
  description: string;
  submitLabel: string;
  alternatePrompt: string;
  alternateLabel: string;
  alternateHref: "/login" | "/signup";
  passwordAutoComplete: "current-password" | "new-password";
};

export const authFormConfig: Record<AuthMode, AuthFormConfig> = {
  login: {
    eyebrow: "Good to see you",
    title: "Welcome back",
    description: "Sign in to continue planning together.",
    submitLabel: "Sign in",
    alternatePrompt: "New to RoadMate?",
    alternateLabel: "Create an account",
    alternateHref: "/signup",
    passwordAutoComplete: "current-password",
  },
  signup: {
    eyebrow: "Your next road starts here",
    title: "Create your account",
    description: "Start with your email. The trip details can wait.",
    submitLabel: "Create account",
    alternatePrompt: "Already have an account?",
    alternateLabel: "Sign in",
    alternateHref: "/login",
    passwordAutoComplete: "new-password",
  },
};
