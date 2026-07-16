import { authFormConfig } from "../constants/auth-form-config";
import type { AuthMode } from "../types/auth-mode";

type AuthFormHeaderProps = {
  mode: AuthMode;
};

export function AuthFormHeader({ mode }: AuthFormHeaderProps) {
  const config = authFormConfig[mode];

  return (
    <header>
      <p className="text-sm font-medium text-[#3f6f55]">{config.eyebrow}</p>
      <h1 className="mt-2 text-3xl font-semibold text-balance">
        {config.title}
      </h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {config.description}
      </p>
    </header>
  );
}
