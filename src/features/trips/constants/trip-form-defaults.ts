import { addDays, format } from "date-fns";

import type { TripFormValues } from "../schemas/trip-form";
import { dummyTripPlans } from "./dummy-trip-plans";

const countryCodes: Record<string, string> = {
  Austria: "AT",
  Croatia: "HR",
  Slovenia: "SI",
};

function manualPlaceId(label: string, countryCode: string): string {
  return `manual:${label.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}-${countryCode.toLowerCase()}`;
}

export function getTripFormDefaults(templateId?: string): TripFormValues {
  const template = templateId
    ? dummyTripPlans.find((tripPlan) => tripPlan.id === templateId)
    : null;

  if (template) {
    const foodBudgetCents =
      template.costs.find((cost) => cost.category === "food")?.amountCents ?? 0;
    const activitiesBudgetCents =
      template.costs.find((cost) => cost.category === "activities")?.amountCents ?? 0;
    const parkingTotalCents =
      template.costs.find((cost) => cost.category === "parking")?.amountCents ?? 0;
    const overnightStops = template.stops.filter((stop) => stop.nights > 0).length;

    return {
      title: template.title,
      startDate: template.startDate,
      endDate: template.endDate,
      travellerCount: template.travellerCount,
      fuelType: "gasoline",
      fuelPriceOverrideCentsPerLitre: null,
      foodBudgetCents,
      activitiesBudgetCents,
      stops: template.stops.map((stop) => {
        const countryCode = countryCodes[stop.country] ?? "HR";

        return {
          googlePlaceId: manualPlaceId(stop.city, countryCode),
          placeLabel: stop.city,
          countryCode,
          nights: stop.nights,
          accommodationBudgetCents: stop.accommodation?.amountCents ?? 0,
          parkingBudgetCents:
            stop.nights > 0 && overnightStops > 0
              ? Math.round(parkingTotalCents / overnightStops)
              : 0,
        };
      }),
    };
  }

  const startDate = addDays(new Date(), 30);

  return {
    title: "",
    startDate: format(startDate, "yyyy-MM-dd"),
    endDate: format(addDays(startDate, 3), "yyyy-MM-dd"),
    travellerCount: 2,
    fuelType: "gasoline",
    fuelPriceOverrideCentsPerLitre: null,
    foodBudgetCents: 0,
    activitiesBudgetCents: 0,
    stops: [
      {
        googlePlaceId: "",
        placeLabel: "",
        countryCode: "HR",
        nights: 0,
        accommodationBudgetCents: 0,
        parkingBudgetCents: 0,
      },
      {
        googlePlaceId: "",
        placeLabel: "",
        countryCode: "HR",
        nights: 3,
        accommodationBudgetCents: 0,
        parkingBudgetCents: 0,
      },
    ],
  };
}
