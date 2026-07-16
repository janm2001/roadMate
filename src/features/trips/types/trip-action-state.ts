import type { TripFormValues } from "../schemas/trip-form";

export type TripFieldErrors = Partial<Record<keyof TripFormValues, string[]>>;

export type TripActionState =
  | { status: "field-error"; fieldErrors: TripFieldErrors }
  | { status: "error"; message: string };

export type TripAction = (
  input: unknown,
) => Promise<TripActionState | void>;
