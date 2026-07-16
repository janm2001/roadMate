import { Route } from "lucide-react";

import { cn } from "@/lib/utils";

type RoadMateBrandProps = {
  className?: string;
};

export function RoadMateBrand({ className }: RoadMateBrandProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Route className="size-5" aria-hidden="true" />
      <span className="text-lg font-semibold">RoadMate</span>
    </div>
  );
}
