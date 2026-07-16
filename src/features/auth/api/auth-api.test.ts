import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createClient: vi.fn(),
  signInWithPassword: vi.fn(),
  signOut: vi.fn(),
  signUp: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: mocks.createClient,
}));

import {
  createAuthAccount,
  signInWithPassword,
  signOutCurrentSession,
} from "./auth-api";

const credentials = {
  email: "driver@example.com",
  password: "roadmate-2026",
};

describe("auth API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.createClient.mockResolvedValue({
      auth: {
        signInWithPassword: mocks.signInWithPassword,
        signOut: mocks.signOut,
        signUp: mocks.signUp,
      },
    });
  });

  it("signs in with validated credentials", async () => {
    mocks.signInWithPassword.mockResolvedValue({ error: null });

    await expect(signInWithPassword(credentials)).resolves.toEqual({
      success: true,
    });
    expect(mocks.signInWithPassword).toHaveBeenCalledWith(credentials);
  });

  it("requires an active session after signup", async () => {
    mocks.signUp.mockResolvedValue({ data: { session: null }, error: null });

    await expect(createAuthAccount(credentials)).resolves.toEqual({
      success: false,
    });
  });

  it("signs out only the current session", async () => {
    mocks.signOut.mockResolvedValue({ error: null });

    await expect(signOutCurrentSession()).resolves.toEqual({ success: true });
    expect(mocks.signOut).toHaveBeenCalledWith({ scope: "local" });
  });
});
