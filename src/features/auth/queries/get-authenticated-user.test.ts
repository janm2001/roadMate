import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createClient: vi.fn(),
  getClaims: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: mocks.createClient,
}));

import { getAuthenticatedUser } from "./get-authenticated-user";

describe("getAuthenticatedUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.createClient.mockResolvedValue({
      auth: { getClaims: mocks.getClaims },
    });
  });

  it("returns the authenticated user's email", async () => {
    mocks.getClaims.mockResolvedValue({
      data: { claims: { email: "driver@example.com" } },
      error: null,
    });

    await expect(getAuthenticatedUser()).resolves.toEqual({
      email: "driver@example.com",
    });
  });

  it("returns null when claims are unavailable", async () => {
    mocks.getClaims.mockResolvedValue({ data: null, error: new Error("bad") });

    await expect(getAuthenticatedUser()).resolves.toBeNull();
  });
});
