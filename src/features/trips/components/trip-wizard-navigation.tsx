import { ArrowLeft, ArrowRight } from "lucide-react";

import { AsyncButton } from "@/components/ui/async-button";
import { Button } from "@/components/ui/button";

type TripWizardNavigationProps = {
  isFirstStep: boolean;
  isLastStep: boolean;
  isPending: boolean;
  onBack: () => void;
  onNext: () => void;
};

export function TripWizardNavigation({
  isFirstStep,
  isLastStep,
  isPending,
  onBack,
  onNext,
}: TripWizardNavigationProps) {
  return (
    <div className="mt-8 flex items-center justify-between gap-3 border-t pt-5">
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="h-11"
        disabled={isFirstStep || isPending}
        onClick={onBack}
      >
        <ArrowLeft aria-hidden="true" />
        Back
      </Button>

      {isLastStep ? (
        <AsyncButton
          type="submit"
          size="lg"
          className="h-11"
          isPending={isPending}
          pendingLabel="Saving trip"
        >
          Save & calculate
        </AsyncButton>
      ) : (
        <Button
          type="button"
          size="lg"
          className="h-11"
          disabled={isPending}
          onClick={onNext}
        >
          Continue
          <ArrowRight aria-hidden="true" />
        </Button>
      )}
    </div>
  );
}
