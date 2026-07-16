import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import type { UseFieldArrayReturn, UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { TripFormValues } from "../schemas/trip-form";
import { GooglePlaceInput } from "./google-place-input";

type TripRouteStepProps = {
  apiKey: string | null;
  disabled: boolean;
  fieldArray: UseFieldArrayReturn<TripFormValues, "stops", "fieldId">;
  form: UseFormReturn<TripFormValues>;
};

const emptyStop: TripFormValues["stops"][number] = {
  googlePlaceId: "",
  placeLabel: "",
  countryCode: "HR",
  nights: 0,
  accommodationBudgetCents: 0,
  parkingBudgetCents: 0,
};

export function TripRouteStep({
  apiKey,
  disabled,
  fieldArray,
  form,
}: TripRouteStepProps) {
  const stops = form.watch("stops");
  const stopsError = form.formState.errors.stops;

  return (
    <fieldset disabled={disabled}>
      <legend className="text-xl font-semibold">Route & stops</legend>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Add locations in driving order. Use the arrows to reorder them.
      </p>

      <div className="mt-5 space-y-3">
        {fieldArray.fields.map((field, index) => {
          const stop = stops[index] ?? emptyStop;

          return (
            <div className="rounded-lg border bg-white p-4" key={field.fieldId}>
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-sm font-semibold">
                  {index === 0
                    ? "Start"
                    : index === fieldArray.fields.length - 1
                      ? "Destination"
                      : `Stop ${index + 1}`}
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    title="Move up"
                    aria-label={`Move stop ${index + 1} up`}
                    disabled={index === 0}
                    onClick={() => fieldArray.move(index, index - 1)}
                  >
                    <ArrowUp aria-hidden="true" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    title="Move down"
                    aria-label={`Move stop ${index + 1} down`}
                    disabled={index === fieldArray.fields.length - 1}
                    onClick={() => fieldArray.move(index, index + 1)}
                  >
                    <ArrowDown aria-hidden="true" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    title="Remove stop"
                    aria-label={`Remove stop ${index + 1}`}
                    disabled={fieldArray.fields.length <= 2}
                    onClick={() => fieldArray.remove(index)}
                  >
                    <Trash2 aria-hidden="true" />
                  </Button>
                </div>
              </div>

              <GooglePlaceInput
                apiKey={apiKey}
                id={`trip-stop-${index}`}
                disabled={disabled}
                value={stop}
                onChange={(place) => {
                  form.setValue(
                    `stops.${index}.googlePlaceId`,
                    place.googlePlaceId,
                    { shouldDirty: true, shouldValidate: true },
                  );
                  form.setValue(`stops.${index}.placeLabel`, place.placeLabel, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                  form.setValue(
                    `stops.${index}.countryCode`,
                    place.countryCode,
                    { shouldDirty: true, shouldValidate: true },
                  );
                }}
              />
              {form.formState.errors.stops?.[index]?.placeLabel?.message ? (
                <FormMessage className="mt-2">
                  {form.formState.errors.stops[index]?.placeLabel?.message}
                </FormMessage>
              ) : null}

              <div className="mt-3 max-w-32 space-y-2">
                <Label htmlFor={`trip-stop-${index}-nights`}>Nights</Label>
                <Input
                  id={`trip-stop-${index}-nights`}
                  type="number"
                  min="0"
                  max="30"
                  className="h-10"
                  {...form.register(`stops.${index}.nights`, {
                    valueAsNumber: true,
                  })}
                />
              </div>
            </div>
          );
        })}
      </div>

      {stopsError?.message ? (
        <FormMessage className="mt-3">{stopsError.message}</FormMessage>
      ) : null}

      <Button
        type="button"
        variant="outline"
        className="mt-4"
        disabled={fieldArray.fields.length >= 10}
        onClick={() => fieldArray.append(emptyStop)}
      >
        <Plus aria-hidden="true" />
        Add stop
      </Button>
    </fieldset>
  );
}
