import { describe, expect, it } from "vitest";

import { getCityImage } from "./city-images";

describe("getCityImage", () => {
  it("matches a city from a provider-formatted place label", () => {
    expect(getCityImage("Ljubljana, Slovenia")).toEqual({
      src: "/images/ljubljana.webp",
      alt: "Ljubljana riverfront and castle above the old town",
    });
  });

  it("returns null when no local fallback exists", () => {
    expect(getCityImage("Maribor, Slovenia")).toBeNull();
  });
});
