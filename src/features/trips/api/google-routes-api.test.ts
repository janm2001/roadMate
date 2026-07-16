import { afterEach, describe, expect, it, vi } from "vitest";

import { calculateGoogleRoute } from "./google-routes-api";

describe("calculateGoogleRoute", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("converts the provider response into stored route units", async () => {
    vi.stubEnv("GOOGLE_MAPS_SERVER_API_KEY", "test-key");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            routes: [
              {
                distanceMeters: 213456,
                duration: "9876s",
                polyline: { encodedPolyline: "encoded-route" },
                travelAdvisory: {
                  fuelConsumptionMicroliters: "14500000",
                  tollInfo: {
                    estimatedPrice: [
                      { currencyCode: "EUR", units: "12", nanos: 340000000 },
                    ],
                  },
                },
                legs: [
                  {
                    steps: [
                      { navigationInstruction: { instructions: "Take A2" } },
                      { navigationInstruction: { instructions: "Take A2" } },
                      { navigationInstruction: { instructions: "Continue on A9" } },
                    ],
                  },
                ],
              },
            ],
          }),
          { status: 200 },
        ),
      ),
    );

    await expect(
      calculateGoogleRoute({
        placeIds: ["zagreb", "ljubljana", "graz"],
        fuelType: "gasoline",
      }),
    ).resolves.toEqual({
      distanceMetres: 213456,
      durationSeconds: 9876,
      encodedPolyline: "encoded-route",
      fuelConsumptionMicrolitres: 14500000,
      tollAmounts: [{ currencyCode: "EUR", amountCents: 1234 }],
      hasUnpricedTolls: false,
      majorRoads: ["Take A2", "Continue on A9"],
    });
  });

  it("marks toll roads when Google cannot price them", async () => {
    vi.stubEnv("GOOGLE_MAPS_SERVER_API_KEY", "test-key");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            routes: [
              {
                distanceMeters: 1000,
                duration: "60s",
                travelAdvisory: { tollInfo: {} },
              },
            ],
          }),
          { status: 200 },
        ),
      ),
    );

    const route = await calculateGoogleRoute({
      placeIds: ["origin", "destination"],
      fuelType: "diesel",
    });

    expect(route.hasUnpricedTolls).toBe(true);
    expect(route.tollAmounts).toEqual([]);
  });
});
