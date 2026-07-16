import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createAuthAccount: vi.fn(),
  redirect: vi.fn(),
  signInWithPassword: vi.fn(),
  signOutCurrentSession: vi.fn(),
}));

vi.mock("../api/auth-api", () => ({
  createAuthAccount: mocks.createAuthAccount,
  signInWithPassword: mocks.signInWithPassword,
  signOutCurrentSession: mocks.signOutCurrentSession,
}));

vi.mock("next/navigation", () => ({
  redirect: mocks.redirect,
}));

import { loginAction } from "./login-action";
import { signOutAction } from "./sign-out-action";
import { signupAction } from "./signup-action";

describe("auth actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects invalid credentials before calling Supabase", async () => {
    const result = await loginAction({ email: "bad", password: "short" });

    expect(result?.status).toBe("field-error");
    expect(mocks.signInWithPassword).not.toHaveBeenCalled();
  });

  it("returns a generic login error", async () => {
    mocks.signInWithPassword.mockResolvedValue({ success: false });

    await expect(
      loginAction({ email: "driver@example.com", password: "roadmate-2026" }),
    ).resolves.toEqual({
      status: "error",
      message: "Email or password is incorrect.",
    });
  });

  it("redirects after successful login", async () => {
    mocks.signInWithPassword.mockResolvedValue({ success: true });

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

  it("returns a generic signup error", async () => {
    mocks.createAuthAccount.mockResolvedValue({ success: false });

    const result = await signupAction({
      email: "driver@example.com",
      password: "roadmate-2026",
    });

    expect(result).toEqual({
      status: "error",
      message:
        "We couldn't create your account. Try signing in if you already have one.",
    });
    expect(mocks.redirect).not.toHaveBeenCalled();
  });

  it("redirects after signing out", async () => {
    mocks.signOutCurrentSession.mockResolvedValue({ success: true });

    await signOutAction();

    expect(mocks.signOutCurrentSession).toHaveBeenCalledOnce();
    expect(mocks.redirect).toHaveBeenCalledWith("/login");
  });
});
