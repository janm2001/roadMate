import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { AuthAction } from "../types/auth-action-state";
import { AuthForm } from "./auth-form";

describe("AuthForm", () => {
  it("shows client validation errors without submitting", async () => {
    const user = userEvent.setup();
    const submitAction = vi.fn<AuthAction>();

    render(<AuthForm mode="signup" submitAction={submitAction} />);

    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(await screen.findByText("Enter a valid email address.")).toBeVisible();
    expect(
      screen.getByText("Password must be at least 8 characters."),
    ).toBeVisible();
    expect(submitAction).not.toHaveBeenCalled();
  });

  it("toggles password visibility", async () => {
    const user = userEvent.setup();
    const submitAction = vi.fn<AuthAction>();

    render(<AuthForm mode="login" submitAction={submitAction} />);

    const password = screen.getByLabelText("Password");
    expect(password).toHaveAttribute("type", "password");

    await user.click(screen.getByRole("button", { name: "Show password" }));
    expect(password).toHaveAttribute("type", "text");

    await user.click(screen.getByRole("button", { name: "Hide password" }));
    expect(password).toHaveAttribute("type", "password");
  });

  it("preserves values and shows a server error", async () => {
    const user = userEvent.setup();
    const submitAction = vi.fn<AuthAction>().mockResolvedValue({
      status: "error",
      message: "Email or password is incorrect.",
    });

    render(<AuthForm mode="login" submitAction={submitAction} />);

    const email = screen.getByLabelText("Email");
    await user.type(email, "driver@example.com");
    await user.type(screen.getByLabelText("Password"), "roadmate-2026");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(
      await screen.findByText("Email or password is incorrect."),
    ).toBeVisible();
    expect(email).toHaveValue("driver@example.com");
    expect(submitAction).toHaveBeenCalledTimes(1);
  });

  it("disables submission while the action is pending", async () => {
    const user = userEvent.setup();
    let resolveAction: (() => void) | undefined;
    const submitAction = vi.fn<AuthAction>(
      () =>
        new Promise<void>((resolve) => {
          resolveAction = resolve;
        }),
    );

    render(<AuthForm mode="login" submitAction={submitAction} />);

    await user.type(screen.getByLabelText("Email"), "driver@example.com");
    await user.type(screen.getByLabelText("Password"), "roadmate-2026");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    const pendingButton = await screen.findByRole("button", {
      name: "Please wait",
    });
    expect(pendingButton).toBeDisabled();
    expect(submitAction).toHaveBeenCalledTimes(1);

    resolveAction?.();
    await waitFor(() => expect(pendingButton).not.toBeDisabled());
  });
});
