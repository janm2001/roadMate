"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import { FormMessage } from "@/components/ui/form-message";

import {
  tripFormSchema,
  type TripFormValues,
} from "../schemas/trip-form";
import type { TripAction } from "../types/trip-action-state";
import { TripBasicsStep } from "./trip-basics-step";
import { TripBudgetStep } from "./trip-budget-step";
import { TripRouteStep } from "./trip-route-step";
import { TripWizardNavigation } from "./trip-wizard-navigation";

const stepLabels = ["Basics", "Route", "Budgets"] as const;

type TripWizardProps = {
  browserApiKey: string | null;
  defaultValues: TripFormValues;
  submitAction: TripAction;
};

export function TripWizard({
  browserApiKey,
  defaultValues,
  submitAction,
}: TripWizardProps) {
  const [step, setStep] = useState(0);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<TripFormValues>({
    resolver: zodResolver(tripFormSchema),
    defaultValues,
  });
  const fieldArray = useFieldArray({
    control: form.control,
    name: "stops",
    keyName: "fieldId",
  });

  const handleNext = async () => {
    const fields: Array<keyof TripFormValues> =
      step === 0
        ? ["title", "startDate", "endDate", "travellerCount"]
        : ["stops", "startDate", "endDate"];

    if (await form.trigger(fields)) {
      setStep((current) => Math.min(current + 1, 2));
    }
  };

  const handleSubmit = form.handleSubmit((values) => {
    setSubmissionError(null);

    startTransition(async () => {
      try {
        const result = await submitAction(values);

        if (!result) {
          return;
        }

        if (result.status === "field-error") {
          for (const [field, messages] of Object.entries(result.fieldErrors)) {
            const message = messages?.[0];

            if (message && field in values) {
              form.setError(field as keyof TripFormValues, { message });
            }
          }
          setSubmissionError("Review the highlighted trip details.");
          return;
        }

        setSubmissionError(result.message);
      } catch {
        setSubmissionError("Something went wrong. Please try again.");
      }
    });
  });

  return (
    <div>
      <ol className="mb-8 grid grid-cols-3 border-b" aria-label="Trip form progress">
        {stepLabels.map((label, index) => (
          <li
            className={`border-b-2 px-1 pb-3 text-center text-xs font-semibold ${
              index === step
                ? "border-[#3f6f55] text-foreground"
                : "border-transparent text-muted-foreground"
            }`}
            aria-current={index === step ? "step" : undefined}
            key={label}
          >
            {index + 1}. {label}
          </li>
        ))}
      </ol>

      <form onSubmit={handleSubmit} noValidate>
        {step === 0 ? (
          <TripBasicsStep disabled={isPending} form={form} />
        ) : null}
        {step === 1 ? (
          <TripRouteStep
            apiKey={browserApiKey}
            disabled={isPending}
            fieldArray={fieldArray}
            form={form}
          />
        ) : null}
        {step === 2 ? (
          <TripBudgetStep disabled={isPending} form={form} />
        ) : null}

        {submissionError ? (
          <FormMessage prominent className="mt-6">
            {submissionError}
          </FormMessage>
        ) : null}

        <TripWizardNavigation
          isFirstStep={step === 0}
          isLastStep={step === 2}
          isPending={isPending}
          onBack={() => setStep((current) => Math.max(current - 1, 0))}
          onNext={() => void handleNext()}
        />
      </form>
    </div>
  );
}
