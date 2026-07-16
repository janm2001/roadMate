import { describe, expect, it } from "vitest";

import { getTripPlan, getTripPlans } from "./get-trip-plans";

describe("trip plan queries", () => {
  it("returns the global sample plans", async () => {
    const plans = await getTripPlans();

    expect(plans).toHaveLength(3);
    expect(plans[0]?.stops.map((stop) => stop.city)).toEqual([
      "Zagreb",
      "Ljubljana",
      "Graz",
      "Zagreb",
    ]);
  });

  it("finds a plan by its stable id", async () => {
    await expect(getTripPlan("zagreb-ljubljana-graz")).resolves.toMatchObject({
      title: "Zagreb, Ljubljana & Graz",
    });
  });

  it("returns null for an unknown plan", async () => {
    await expect(getTripPlan("missing-trip")).resolves.toBeNull();
  });
});
