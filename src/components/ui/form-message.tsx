import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type FormMessageProps = ComponentProps<"p"> & {
  prominent?: boolean;
};

export function FormMessage({
  className,
  prominent = false,
  role = "alert",
  ...props
}: FormMessageProps) {
  return (
    <p
      className={cn(
        "text-sm text-destructive",
        prominent &&
          "border-l-2 border-destructive bg-destructive/5 px-3 py-2",
        className,
      )}
      role={role}
      {...props}
    />
  );
}
