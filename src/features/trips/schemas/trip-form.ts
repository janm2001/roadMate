import { differenceInCalendarDays, parseISO } from "date-fns";
import { z } from "zod";

export const tripFuelTypes = ["gasoline", "diesel", "hybrid"] as const;

export const tripStopFormSchema = z.object({
  googlePlaceId: z.string().trim().min(3, "Select a location."),
  placeLabel: z.string().trim().min(2, "Enter a location."),
  countryCode: z
    .string()
    .trim()
    .length(2, "Use a two-letter country code.")
    .transform((value) => value.toUpperCase()),
  nights: z.number().int().min(0).max(30),
  accommodationBudgetCents: z.number().int().min(0).max(10_000_000),
  parkingBudgetCents: z.number().int().min(0).max(1_000_000),
});

export const tripFormSchema = z
  .object({
    title: z.string().trim().min(2, "Enter a trip name.").max(80),
    startDate: z.iso.date("Select a valid start date."),
    endDate: z.iso.date("Select a valid end date."),
    travellerCount: z.number().int().min(1).max(20),
    fuelType: z.enum(tripFuelTypes),
    fuelPriceOverrideCentsPerLitre: z.number().int().min(1).max(1000).nullable(),
    foodBudgetCents: z.number().int().min(0).max(10_000_000),
    activitiesBudgetCents: z.number().int().min(0).max(10_000_000),
    stops: z.array(tripStopFormSchema).min(2).max(10),
  })
  .superRefine((value, context) => {
    const tripNights = differenceInCalendarDays(
      parseISO(value.endDate),
      parseISO(value.startDate),
    );

    if (tripNights < 0) {
      context.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "End date must be on or after the start date.",
      });
      return;
    }

    const plannedNights = value.stops.reduce(
      (total, stop) => total + stop.nights,
      0,
    );

    if (plannedNights > tripNights) {
      context.addIssue({
        code: "custom",
        path: ["stops"],
        message: "Stop nights exceed the trip date range.",
      });
    }
  });

export type TripFormValues = z.infer<typeof tripFormSchema>;
