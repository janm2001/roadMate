import type { UseFormReturn } from "react-hook-form";

import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { TripFormValues } from "../schemas/trip-form";

type TripBasicsStepProps = {
  disabled: boolean;
  form: UseFormReturn<TripFormValues>;
};

export function TripBasicsStep({ disabled, form }: TripBasicsStepProps) {
  const errors = form.formState.errors;

  return (
    <fieldset className="space-y-5" disabled={disabled}>
      <legend className="text-xl font-semibold">Trip basics</legend>
      <p className="text-sm leading-6 text-muted-foreground">
        Set the dates and group size for this road trip.
      </p>

      <div className="space-y-2">
        <Label htmlFor="trip-title">Trip name</Label>
        <Input
          id="trip-title"
          className="h-11 bg-white"
          placeholder="Summer road trip"
          {...form.register("title")}
        />
        {errors.title?.message ? (
          <FormMessage>{errors.title.message}</FormMessage>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="trip-start-date">Start date</Label>
          <Input
            id="trip-start-date"
            type="date"
            className="h-11 bg-white"
            {...form.register("startDate")}
          />
          {errors.startDate?.message ? (
            <FormMessage>{errors.startDate.message}</FormMessage>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="trip-end-date">End date</Label>
          <Input
            id="trip-end-date"
            type="date"
            className="h-11 bg-white"
            {...form.register("endDate")}
          />
          {errors.endDate?.message ? (
            <FormMessage>{errors.endDate.message}</FormMessage>
          ) : null}
        </div>
      </div>

      <div className="max-w-40 space-y-2">
        <Label htmlFor="trip-travellers">Travellers</Label>
        <Input
          id="trip-travellers"
          type="number"
          min="1"
          max="20"
          className="h-11 bg-white"
          {...form.register("travellerCount", { valueAsNumber: true })}
        />
        {errors.travellerCount?.message ? (
          <FormMessage>{errors.travellerCount.message}</FormMessage>
        ) : null}
      </div>
    </fieldset>
  );
}
