import { authCredentialsSchema } from "../schemas/auth-credentials";
import type { AuthCredentials } from "../schemas/auth-credentials";
import type { AuthActionState } from "../types/auth-action-state";

type ValidationResult =
  | { success: true; data: AuthCredentials }
  | { success: false; state: AuthActionState };

export function validateAuthCredentials(input: unknown): ValidationResult {
  const result = authCredentialsSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      state: {
        status: "field-error",
        fieldErrors: result.error.flatten().fieldErrors,
      },
    };
  }

  return { success: true, data: result.data };
}
