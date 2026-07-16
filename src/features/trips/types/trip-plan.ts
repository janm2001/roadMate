export type TripCostCategory =
  | "accommodation"
  | "activities"
  | "food"
  | "fuel"
  | "parking"
  | "tolls";

export type TripCost = {
  category: TripCostCategory;
  label: string;
  amountCents: number;
};

export type TripAccommodation = {
  name: string;
  nights: number;
  amountCents: number;
  parkingIncluded: boolean;
};

export type TripStop = {
  id: string;
  city: string;
  country: string;
  date: string;
  nights: number;
  note: string;
  accommodation?: TripAccommodation;
};

export type TripPlan = {
  id: string;
  title: string;
  summary: string;
  startDate: string;
  endDate: string;
  travellerCount: number;
  distanceKm: number;
  stops: TripStop[];
  costs: TripCost[];
};
