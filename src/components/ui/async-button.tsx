import { LoaderCircle } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

import { Button } from "@/components/ui/button";

type AsyncButtonProps = ComponentProps<typeof Button> & {
  isPending: boolean;
  pendingLabel: ReactNode;
};

export function AsyncButton({
  children,
  disabled,
  isPending,
  pendingLabel,
  ...props
}: AsyncButtonProps) {
  return (
    <Button disabled={disabled || isPending} {...props}>
      {isPending ? (
        <LoaderCircle className="animate-spin" aria-hidden="true" />
      ) : null}
      {isPending ? pendingLabel : children}
    </Button>
  );
}
