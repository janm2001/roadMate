import { AsyncButton } from "@/components/ui/async-button";

type AuthSubmitButtonProps = {
  disabled: boolean;
  isPending: boolean;
  label: string;
};

export function AuthSubmitButton({
  disabled,
  isPending,
  label,
}: AuthSubmitButtonProps) {
  return (
    <AsyncButton
      type="submit"
      size="lg"
      className="h-12 w-full text-base"
      disabled={disabled}
      isPending={isPending}
      pendingLabel="Please wait"
    >
      {label}
    </AsyncButton>
  );
}
