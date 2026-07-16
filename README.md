# RoadMate

Mobile-first shared road-trip planning, built with Next.js and Supabase.

## Prerequisites

- Node.js 24
- npm 11 or newer
- Docker Desktop with the Linux container engine running

## Local setup

```bash
npm install
npm run supabase:start
npm run dev
```

The app runs at <http://localhost:3000>. Local Supabase Studio runs at
<http://localhost:54323>.

Copy `.env.example` to `.env.local` and populate it from `npm run
supabase:status` for local development, or from the Supabase Connect dialog for
a hosted project. Never expose a Supabase secret or service-role key in a
`NEXT_PUBLIC_` variable.

## Verification

```bash
npm run lint
npm run typecheck
npm test
npm run test:e2e
npm run build
```

Only Chromium is installed for end-to-end tests. Re-run `npx playwright install
chromium` after Playwright dependency upgrades.

## Hosted Supabase

When a hosted development environment is needed, create a Supabase project,
authenticate the CLI with `npx supabase login`, and link it with `npx supabase
link --project-ref <project-ref>`. Keep database changes in
`supabase/migrations` and validate them locally before pushing.
