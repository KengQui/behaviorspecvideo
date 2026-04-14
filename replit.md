# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   └── api-server/         # Express API server
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
│   └── src/                # Individual .ts scripts, run via `pnpm --filter @workspace/scripts run <script>`
├── pnpm-workspace.yaml     # pnpm workspace (artifacts/*, lib/*, lib/integrations/*, scripts)
├── tsconfig.base.json      # Shared TS options (composite, bundler resolution, es2022)
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck` (which runs `tsc --build --emitDeclarationOnly`). This builds the full dependency graph so that cross-package imports resolve correctly. Running `tsc` inside a single package will fail if its dependencies haven't been built yet.
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck; actual JS bundling is handled by esbuild/tsx/vite...etc, not `tsc`.
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array. `tsc --build` uses this to determine build order and skip up-to-date packages.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes live in `src/routes/` and use `@workspace/api-zod` for request and response validation and `@workspace/db` for persistence.

- Entry: `src/index.ts` — reads `PORT`, starts Express
- App setup: `src/app.ts` — mounts CORS, JSON/urlencoded parsing, routes at `/api`
- Routes: `src/routes/index.ts` mounts sub-routers; `src/routes/health.ts` exposes `GET /health` (full path: `/api/health`)
- Depends on: `@workspace/db`, `@workspace/api-zod`
- `pnpm --filter @workspace/api-server run dev` — run the dev server
- `pnpm --filter @workspace/api-server run build` — production esbuild bundle (`dist/index.cjs`)
- Build bundles an allowlist of deps (express, cors, pg, drizzle-orm, zod, etc.) and externalizes the rest

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL. Exports a Drizzle client instance and schema models.

- `src/index.ts` — creates a `Pool` + Drizzle instance, exports schema
- `src/schema/index.ts` — barrel re-export of all models
- `src/schema/<modelname>.ts` — table definitions with `drizzle-zod` insert schemas (no models definitions exist right now)
- `drizzle.config.ts` — Drizzle Kit config (requires `DATABASE_URL`, automatically provided by Replit)
- Exports: `.` (pool, db, schema), `./schema` (schema only)

Production migrations are handled by Replit when publishing. In development, we just use `pnpm --filter @workspace/db run push`, and we fallback to `pnpm --filter @workspace/db run push-force`.

### `lib/api-spec` (`@workspace/api-spec`)

Owns the OpenAPI 3.1 spec (`openapi.yaml`) and the Orval config (`orval.config.ts`). Running codegen produces output into two sibling packages:

1. `lib/api-client-react/src/generated/` — React Query hooks + fetch client
2. `lib/api-zod/src/generated/` — Zod schemas

Run codegen: `pnpm --filter @workspace/api-spec run codegen`

### `lib/api-zod` (`@workspace/api-zod`)

Generated Zod schemas from the OpenAPI spec (e.g. `HealthCheckResponse`). Used by `api-server` for response validation.

### `lib/api-client-react` (`@workspace/api-client-react`)

Generated React Query hooks and fetch client from the OpenAPI spec (e.g. `useHealthCheck`, `healthCheck`).

### `artifacts/behavior-spec-video` (`@workspace/behavior-spec-video`)

30-second educational explainer video (1920x1080 landscape/16:9, 30fps) teaching "How behavior spec should be implemented for AI agentic flow." Built with React, Framer Motion, and the video-js skill.

- **13 Scenes**: Hook → Context → Intro (spec-reveal → rule-sort → chat) → Compare → Inconsistency → Typeahead → Routing → Why It Fails → Inside Spec (title → sections → rule-sort → tagline) → Scale (agent-called → constellation → tagline) → Orchestrator → Agent → Closing
- **Scene durations**: 17s + 25s + 35s + 22.5s + 40s + 6s + 9s + 45s + 40s + 32s + 22s + 22s + 23s = ~5:38 total (338.5s)
- **Narrative model**: Centralized behavior spec — 3 markdown files (OrchestratorRules.md, AgentBehavior.md, WriteActions.md) injected at runtime into each agent's prompt. NOT copied per agent. Design team owns and maintains the spec.
- **Scene 2 (Intro) Spec Reveal**: Shows 4 behavior spec section cards that animate in sequentially, then the Guardrails card expands to show rule GRD-06 detail. Cards fade out and two target boxes ("Orchestrator" / "Agent") appear with rule tags animating/sorting into them. Then transitions to the chat UI
- **Inside Spec Scene (SceneInsideSpec)**: 4 phases — title ("Inside the Spec"), sections (8 spec section cards in 4×2 grid with rule tags), rule-sort (card chrome fades, orch tags fly to Orchestrator box, agent tags remain floating until Agent box slides in, then fly in; "Inside the Spec" title cross-fades to "At runtime, rules route to..."), tagline
- **Scale Scene (SceneScale)**: 3 phases — agent-called (runtime injection demo), constellation (64-dot agent visualization), tagline
- **Orchestrator Scene (Scene7)**: 3 phases — architecture overview, orchestrator spec detail, context flow/handoff. Trimmed from original 6 phases.
- **Agent Scene (Scene8)**: Single-pass flow — receive → guardrails-tone → formatting → handback. Shows centralized spec injection.
- **AI Voiceover**: Generated via OpenAI gpt-audio TTS (voice: alloy), stored in `public/audio/`
  - Regenerate all: `cd artifacts/behavior-spec-video && node scripts/generate-voiceover.mjs`
  - Regenerate single: `cd artifacts/behavior-spec-video && node scripts/generate-voiceover.mjs scene_spec_rules`
  - Audio segments: scene1, scene_transition, scene2, scene_inside_spec, scene3, scene4, scene6a, scene6b, scene_orch_tone, scene_orch_routing, scene_orchestration_scale, scene7b_p1, scene7b_p2, scene7b_c1-c4, scene5
  - Build combined track: `cd artifacts/behavior-spec-video && bash scripts/build-audio-track.sh`
- **Brand**: Bryte AI / UKG Ready, deep indigo background (#0C0820), primary #30258D, accent #8629FF
- **Fonts**: Space Grotesk (display), DM Sans (body), JetBrains Mono (mono)
- **Testing**: Use `?scene=N` URL parameter (0-10) to jump to a specific scene for preview
- **Recording validation**: `bash artifacts/behavior-spec-video/scripts/validate-recording.sh`
- **Pausable hooks**: All scene timers use `usePausableTimers`, `usePausableTypewriter`, and `usePausableElapsed` from `src/lib/video/hooks.ts` — these respect the `isPlaying` prop so pause halts both audio and scene animations
- **Audio Playback**: Browser audio uses `combined-audio-v2.mp3` (6MB, converted from 34MB WAV). The "Enable audio" button shows "Loading audio..." until the file is ready, then enables click-to-play. Audio syncs to video timeline via `canplaythrough` event and periodic drift correction.
- **Audio Export**: Replit's video export captures visuals only (browser limitation). The server-side merge uses `combined-audio-v2.wav` (full quality) for FFmpeg merging. After exporting the silent video, users click "Add Audio to Export" in the controls bar, upload their video, and the server merges it with the audio track via ffmpeg (libx264 high profile + yuv420p + movflags faststart for QuickTime compatibility), returning a downloadable MP4 with audio.
  - Combined audio build script: `scripts/build-audio-track.sh`
  - Merge endpoint: `POST /api/merge-audio` (in api-server)
  - Merge UI component: `src/components/video/MergeAudio.tsx`
- **Key files**: `src/components/video/VideoTemplate.tsx`, `Scene1-8.tsx`, `SceneScale.tsx`, `SceneInsideSpec.tsx`, `SceneTransition.tsx`, `src/lib/video/hooks.ts`, `src/components/video/MergeAudio.tsx`

### `scripts` (`@workspace/scripts`)

Utility scripts package. Each script is a `.ts` file in `src/` with a corresponding npm script in `package.json`. Run scripts via `pnpm --filter @workspace/scripts run <script>`. Scripts can import any workspace package (e.g., `@workspace/db`) by adding it as a dependency in `scripts/package.json`.
