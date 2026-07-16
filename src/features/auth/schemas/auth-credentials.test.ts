import { describe, expect, it } from "vitest";

import { authCredentialsSchema } from "./auth-credentials";

describe("authCredentialsSchema", () => {
  it("normalizes valid credentials", () => {
    const result = authCredentialsSchema.parse({
      email: "  DRIVER@Example.COM ",
      password: "roadmate-2026",
    });

    expect(result).toEqual({
      email: "driver@example.com",
      password: "roadmate-2026",
    });
  });

  it.each([
    ["invalid email", { email: "driver", password: "roadmate-2026" }],
    ["empty email", { email: "", password: "roadmate-2026" }],
    ["short password", { email: "driver@example.com", password: "short" }],
    [
      "long password",
      { email: "driver@example.com", password: "a".repeat(73) },
    ],
  ])("rejects %s", (_name, credentials) => {
    expect(authCredentialsSchema.safeParse(credentials).success).toBe(false);
  });
});
