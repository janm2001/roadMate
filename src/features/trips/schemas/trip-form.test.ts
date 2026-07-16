import { describe, expect, it } from "vitest";

import { getTripFormDefaults } from "../constants/trip-form-defaults";
import { tripFormSchema } from "./trip-form";

describe("tripFormSchema", () => {
  it("accepts a multi-stop trip whose nights fit the date range", () => {
    const input = getTripFormDefaults("zagreb-ljubljana-graz");

    expect(tripFormSchema.safeParse(input).success).toBe(true);
  });

  it("rejects stop nights beyond the trip dates", () => {
    const input = getTripFormDefaults("zagreb-ljubljana-graz");
    input.endDate = input.startDate;

    const result = tripFormSchema.safeParse(input);

    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.stops).toContain(
      "Stop nights exceed the trip date range.",
    );
  });

  it("requires at least two stops", () => {
    const input = getTripFormDefaults();
    input.stops = input.stops.slice(0, 1);

    expect(tripFormSchema.safeParse(input).success).toBe(false);
  });
});
