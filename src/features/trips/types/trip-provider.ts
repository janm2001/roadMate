export type TripFuelType = "gasoline" | "diesel" | "hybrid";

export type FuelPrice = {
  countryCode: "AT" | "HR" | "SI";
  fuelType: "gasoline" | "diesel";
  priceCentsPerLitre: number;
  sourceDate: string;
};
