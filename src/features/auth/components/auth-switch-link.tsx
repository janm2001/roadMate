import Link from "next/link";

import { authFormConfig } from "../constants/auth-form-config";
import type { AuthMode } from "../types/auth-mode";

type AuthSwitchLinkProps = {
  mode: AuthMode;
};

export function AuthSwitchLink({ mode }: AuthSwitchLinkProps) {
  const config = authFormConfig[mode];

  return (
    <p className="mt-7 text-center text-sm text-muted-foreground">
      {config.alternatePrompt}{" "}
      <Link
        href={config.alternateHref}
        className="font-semibold text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
      >
        {config.alternateLabel}
      </Link>
    </p>
  );
}
