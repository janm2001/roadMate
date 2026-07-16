import type { ChangeEvent } from "react";

import { Input } from "./input";

type MoneyInputProps = Omit<
  React.ComponentProps<typeof Input>,
  "onChange" | "type" | "value"
> & {
  valueCents: number | null;
  onValueCentsChange: (valueCents: number | null) => void;
  nullable?: boolean;
};

export function MoneyInput({
  nullable = false,
  onValueCentsChange,
  valueCents,
  ...props
}: MoneyInputProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (value === "") {
      onValueCentsChange(nullable ? null : 0);
      return;
    }

    onValueCentsChange(Math.round(Number(value) * 100));
  };

  return (
    <Input
      {...props}
      type="number"
      min="0"
      step="0.01"
      value={valueCents === null ? "" : valueCents / 100}
      onChange={handleChange}
    />
  );
}
