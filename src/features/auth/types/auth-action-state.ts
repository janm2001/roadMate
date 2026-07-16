import type { AuthCredentials } from "../schemas/auth-credentials";

export type AuthFieldErrors = Partial<
  Record<keyof AuthCredentials, string[]>
>;

export type AuthActionState =
  | { status: "field-error"; fieldErrors: AuthFieldErrors }
  | { status: "error"; message: string };

export type AuthAction = (input: unknown) => Promise<AuthActionState | void>;
