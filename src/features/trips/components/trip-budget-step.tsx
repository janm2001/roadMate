import { Controller, type UseFormReturn } from "react-hook-form";

import { Label } from "@/components/ui/label";
import { MoneyInput } from "@/components/ui/money-input";

import type { TripFormValues } from "../schemas/trip-form";

type TripBudgetStepProps = {
  disabled: boolean;
  form: UseFormReturn<TripFormValues>;
};

export function TripBudgetStep({ disabled, form }: TripBudgetStepProps) {
  const stops = form.watch("stops");

  return (
    <fieldset className="space-y-6" disabled={disabled}>
      <div>
        <legend className="text-xl font-semibold">Vehicle & budgets</legend>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Live estimates cover the route, fuel use and available toll prices.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="trip-fuel-type">Fuel type</Label>
        <select
          id="trip-fuel-type"
          className="h-11 w-full rounded-lg border bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          {...form.register("fuelType")}
        >
          <option value="gasoline">Gasoline</option>
          <option value="diesel">Diesel</option>
          <option value="hybrid">Hybrid</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="trip-fuel-price">Fuel price per litre (optional)</Label>
        <Controller
          control={form.control}
          name="fuelPriceOverrideCentsPerLitre"
          render={({ field }) => (
            <MoneyInput
              id="trip-fuel-price"
              className="h-11 bg-white"
              nullable
              placeholder="Use weekly country average"
              valueCents={field.value}
              onValueCentsChange={field.onChange}
            />
          )}
        />
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold">Stop budgets</h2>
        {stops.map((stop, index) => (
          <div className="border-l-2 border-[#87a993] pl-4" key={`${stop.googlePlaceId}-${index}`}>
            <p className="text-sm font-semibold">
              {stop.placeLabel || `Stop ${index + 1}`}
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`accommodation-${index}`}>Apartment budget</Label>
                <Controller
                  control={form.control}
                  name={`stops.${index}.accommodationBudgetCents`}
                  render={({ field }) => (
                    <MoneyInput
                      id={`accommodation-${index}`}
                      className="h-10 bg-white"
                      valueCents={field.value}
                      onValueCentsChange={(value) => field.onChange(value ?? 0)}
                    />
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`parking-${index}`}>Parking budget</Label>
                <Controller
                  control={form.control}
                  name={`stops.${index}.parkingBudgetCents`}
                  render={({ field }) => (
                    <MoneyInput
                      id={`parking-${index}`}
                      className="h-10 bg-white"
                      valueCents={field.value}
                      onValueCentsChange={(value) => field.onChange(value ?? 0)}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="food-budget">Food budget</Label>
          <Controller
            control={form.control}
            name="foodBudgetCents"
            render={({ field }) => (
              <MoneyInput
                id="food-budget"
                className="h-11 bg-white"
                valueCents={field.value}
                onValueCentsChange={(value) => field.onChange(value ?? 0)}
              />
            )}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="activities-budget">Activities budget</Label>
          <Controller
            control={form.control}
            name="activitiesBudgetCents"
            render={({ field }) => (
              <MoneyInput
                id="activities-budget"
                className="h-11 bg-white"
                valueCents={field.value}
                onValueCentsChange={(value) => field.onChange(value ?? 0)}
              />
            )}
          />
        </div>
      </div>
    </fieldset>
  );
}
