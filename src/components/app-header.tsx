import type { ReactNode } from "react";

import { RoadMateBrand } from "./roadmate-brand";

type AppHeaderProps = {
  accountLabel: string;
  action: ReactNode;
};

export function AppHeader({ accountLabel, action }: AppHeaderProps) {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <RoadMateBrand />
        <div className="flex min-w-0 items-center gap-3">
          <span
            className="max-w-28 truncate text-xs text-muted-foreground sm:max-w-64 sm:text-sm"
            title={accountLabel}
          >
            {accountLabel}
          </span>
          {action}
        </div>
      </div>
    </header>
  );
}
