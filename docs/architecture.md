# RoadMate Feature Architecture

RoadMate groups product code by feature under `src/features`. A feature adds only
the folders it currently needs; empty template directories are not created.

## Dependency direction

Application routes compose features. Feature components may depend on shared UI,
feature hooks, feature types, and feature actions. Server Actions validate input,
call feature API modules, map expected failures, and perform navigation. Feature
queries own server-side reads. API modules isolate calls to external SDKs such as
Supabase.

Shared code under `src/components` and infrastructure under `src/lib` must not
import from a feature. Move code into the shared layer only after it has at least
two real consumers.

## Feature folders

- `actions`: validated Server Actions and mutation orchestration
- `api`: external SDK or HTTP mutation calls
- `components`: feature UI with one meaningful responsibility per component
- `constants`: shared feature configuration and display copy
- `hooks`: browser-side state and interaction orchestration
- `queries`: server-side reads
- `schemas`: Zod schemas for external and mutation boundaries
- `types`: contracts used across multiple feature files

Tests are colocated with the behavior they cover. Do not add barrel `index.ts`
files; explicit imports keep dependencies visible and reduce circular imports.

Components are extracted when they own state, are reused, or can be tested as an
independent behavior. One-use static markup stays with its parent when extracting
it would only add indirection.
