# RoadMate Engineering Guide

## Product

RoadMate is a mobile-first shared road-trip planning application.

The primary users are couples, friends, and small groups planning road trips together from their phones.

The first release should allow users to:

* Register and sign in
* Create and share trips
* Save vehicles
* Add route stops
* Estimate fuel costs
* Plan a trip budget
* Create an itinerary
* Maintain a shared checklist

Do not implement unrequested phase-two functionality.

## Technology stack

* Next.js App Router
* React
* TypeScript with strict mode
* npm
* Supabase PostgreSQL
* Supabase Auth
* Tailwind CSS
* shadcn/ui
* React Hook Form
* Zod
* date-fns
* Vitest
* React Testing Library
* Playwright

## Package manager

Use npm exclusively.

Allowed commands include:

* npm install
* npm uninstall
* npm run dev
* npm run lint
* npm run typecheck
* npm test
* npm run test:e2e
* npm run build
* npx

Never use:

* pnpm
* yarn
* bun

Never create:

* pnpm-lock.yaml
* yarn.lock
* bun.lock
* bun.lockb

Commit package-lock.json whenever dependencies change.

Do not manually edit package-lock.json.

## Required scripts

The project should provide these scripts where applicable:

* npm run dev
* npm run lint
* npm run typecheck
* npm test
* npm run test:e2e
* npm run build

Do not claim that work is complete if the relevant verification commands fail.

## Architecture

* Use Server Components by default.
* Add `"use client"` only when browser-side interaction is required.
* Do not turn an entire page or layout into a Client Component because one child is interactive.
* Use Server Actions for application mutations unless the task explicitly requires a route handler.
* Validate all mutations on the server with Zod.
* Client validation improves user experience but never replaces server validation.
* Place feature-specific code under `src/features`.
* Keep shared UI primitives under `src/components/ui`.
* Keep Supabase clients under `src/lib/supabase`.
* Keep database migrations under `supabase/migrations`.
* Do not manually edit generated Supabase database types.
* Do not fetch initial page data in `useEffect`.
* Do not mirror server data into local state without a clear reason.
* Keep calculations in pure TypeScript functions outside React components.

## Suggested feature structure

Each sufficiently large feature may contain:

* actions
* components
* queries
* schemas
* calculations
* types
* tests

Example:

```text
src/features/budget/
  actions/
  calculations/
  components/
  queries/
  schemas/
  types/
```

Do not create empty directories in advance.

Do not move code into a shared directory until it is genuinely reused.

## TypeScript

* Do not use `any`.
* Treat external input as `unknown` until it is validated.
* Avoid unsafe type assertions.
* Prefer inferred types from Zod schemas.
* Prefer discriminated unions for state variants.
* Use explicit domain names such as `tripId`, `vehicleId`, and `memberId`.
* Include units in numeric names such as `distanceKm` and `consumptionLitresPer100Km`.
* Store and name monetary values as integer cents, such as `amountCents`.
* Avoid broad types such as `object`, `Function`, and unstructured records when a domain type is appropriate.

## Forms

* Use React Hook Form with Zod.
* Define default values for every form field.
* Use empty strings for empty text fields in the form.
* Convert empty strings to database `null` values at the server boundary when appropriate.
* Display field-level validation errors.
* Display a general submission error when necessary.
* Disable submission while a mutation is pending.
* Prevent duplicate submissions.
* Preserve user-entered values after expected submission errors.

## Supabase and security

* Every table exposed through the Supabase API must have Row Level Security enabled.
* Add Row Level Security policies in migrations.
* Never expose the Supabase service-role key to client code.
* Never place secret keys in variables prefixed with `NEXT_PUBLIC_`.
* Verify authenticated users on the server.
* Do not trust a user ID, owner ID, role, or trip membership supplied by the client.
* Enforce authorization in the database and on the server.
* A user may read trip data only when they are a member of that trip.
* Only owners may perform owner-only operations.
* Add indexes for foreign keys and commonly filtered columns.
* Use database constraints as well as application validation.

## Database conventions

* Use UUID primary keys unless an existing table requires otherwise.
* Use snake_case in PostgreSQL.
* Use camelCase in TypeScript.
* Store money as integer cents.
* Store calendar-only trip dates as PostgreSQL `date`.
* Store event timestamps as `timestamptz`.
* Include `created_at` and `updated_at` where useful.
* Add migrations for every schema change.
* Do not make undocumented schema changes only through the hosted Supabase dashboard.
* Use cascading deletes only when the desired behavior is explicit.

## Mobile-first interface

* Design for approximately 360–390 pixel screens first.
* Do not rely on hover.
* Use touch-friendly controls.
* Prefer cards and lists over desktop tables.
* Use bottom navigation for primary trip sections.
* Account for mobile safe-area insets.
* Use sticky actions only when they do not cover important content.
* Every feature must include appropriate loading, empty, error, and success states.
* Keep desktop layouts centered and responsive without compromising mobile behavior.

## Testing

Add tests for behavior that could cause incorrect data, broken access control, or important user-flow failures.

Prioritize:

* Pure calculations
* Validation schemas
* Permission-sensitive behavior
* Server Actions
* Main user journeys
* Regression tests for fixed bugs

Do not test implementation details unnecessarily.

For calculations, include edge cases such as:

* Zero distance
* Missing values
* One traveller
* Multiple travellers
* Zero-cost entries
* Actual costs above and below estimates

## Git and scope

* Work only on the requested feature.
* Do not modify unrelated files.
* Do not perform broad refactoring unless the task requests it or it is required for correctness.
* Do not create commits, push branches, or open pull requests unless explicitly requested.
* Do not rewrite existing Git history.
* Do not remove another developer's changes to simplify the implementation.
* Keep changes small enough to review.

## Working procedure

Before making changes:

1. Read this file.
2. Inspect the relevant existing files.
3. Inspect `package.json` and available scripts.
4. Inspect existing conventions before introducing new ones.
5. State a concise implementation plan for non-trivial tasks.

During implementation:

1. Implement the smallest complete vertical slice.
2. Reuse established project conventions.
3. Add error and empty states.
4. Add relevant tests.
5. Avoid unrelated cleanup.

Before finishing:

1. Review the changed files.
2. Run the relevant tests.
3. Run `npm run lint`.
4. Run `npm run typecheck`.
5. Run `npm run build` when the task affects production code.
6. Correct failures caused by the changes.
7. Report any failures that cannot be resolved.

## Final response format

At the end of a task, report:

1. What was implemented
2. Important implementation decisions
3. Files changed
4. Commands executed
5. Verification results
6. Remaining limitations or follow-up work

Do not say that checks passed unless they were actually executed successfully.
