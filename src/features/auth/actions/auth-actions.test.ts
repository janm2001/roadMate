import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createClient: vi.fn(),
  redirect: vi.fn(),
  signInWithPassword: vi.fn(),
  signOut: vi.fn(),
  signUp: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: mocks.createClient,
}));

vi.mock("next/navigation", () => ({
  redirect: mocks.redirect,
}));

import { loginAction, signOutAction, signupAction } from "./auth-actions";

describe("auth actions", () => {
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

  it("rejects invalid credentials before calling Supabase", async () => {
    const result = await loginAction({ email: "bad", password: "short" });

    expect(result?.status).toBe("field-error");
    expect(mocks.createClient).not.toHaveBeenCalled();
  });

  it("returns a generic login error", async () => {
    mocks.signInWithPassword.mockResolvedValue({ error: new Error("invalid") });

    await expect(
      loginAction({ email: "driver@example.com", password: "roadmate-2026" }),
    ).resolves.toEqual({
      status: "error",
      message: "Email or password is incorrect.",
    });
  });

  it("redirects after successful login", async () => {
    mocks.signInWithPassword.mockResolvedValue({ error: null });

    await loginAction({
      email: "DRIVER@example.com",
      password: "roadmate-2026",
    });

    expect(mocks.signInWithPassword).toHaveBeenCalledWith({
      email: "driver@example.com",
      password: "roadmate-2026",
    });
    expect(mocks.redirect).toHaveBeenCalledWith("/");
  });

  it("does not report signup success without a session", async () => {
    mocks.signUp.mockResolvedValue({ data: { session: null }, error: null });

    const result = await signupAction({
      email: "driver@example.com",
      password: "roadmate-2026",
    });

    expect(result?.status).toBe("error");
    expect(mocks.redirect).not.toHaveBeenCalled();
  });

  it("signs out only the current session", async () => {
    mocks.signOut.mockResolvedValue({ error: null });

    await signOutAction();

    expect(mocks.signOut).toHaveBeenCalledWith({ scope: "local" });
    expect(mocks.redirect).toHaveBeenCalledWith("/login");
  });
});
