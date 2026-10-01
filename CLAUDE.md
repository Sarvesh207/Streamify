# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

Two independent apps in one repo (merged from `VStream_backend` / `VStream_client` with history preserved). There are **no npm workspaces** — install and run each app from its own directory.

- `server/` — Express + MongoDB (Mongoose) API, plain JavaScript, ES modules
- `client/` — React 19 + TypeScript SPA on Vite (aliased to `rolldown-vite`)

Stray files at `server/` root (`comment.routes.js`, `playlist.routes.js`, `tweet.route.js`) are stale copies not wired into the app; the live routes are in `server/src/routes/`.

## Commands

Server (`cd server`):
- `npm run dev` — nodemon on `src/index.js`, API at http://localhost:8000
- `npm run swagger` — regenerate Swagger spec via swagger-autogen. Note: it writes `./swagger-output.json` relative to cwd, but `src/app.js` serves `src/swagger-output.json` (UI at `/api-docs`) — move/copy the output there.
- `npx prettier --write .` — format (4 spaces, double quotes, semicolons, es5 trailing commas). No linter and no test suite exist on the server.

Client (`cd client`):
- `npm run dev` — Vite dev server at http://localhost:5173 (`npm run dev:prod` uses `--mode prod`)
- `npm run build` — `tsc -b && vite build` (type errors fail the build)
- `npm run lint` — ESLint
- `npm test` — Jest (ts-jest, jsdom, ESM via `--experimental-vm-modules`). Tests match `src/**/*.test.{ts,tsx}` / `*.spec.{ts,tsx}`; setup in `src/test/setup.ts`, render helpers in `src/test/test-utils.tsx`.
- Single test: `npm test -- src/path/to/File.test.tsx` or `npm test -- -t "test name"`
- Jest runs in native ESM: import `jest` from `@jest/globals`, and stub HTTP with `jest.spyOn(client, "get" | "post" | ...)` on the default export of `src/api/axiosClient.ts` rather than `jest.unstable_mockModule` (it resolves paths relative to `setup.ts`). See `src/components/comments/CommentSection.test.tsx`.

## Environment

- `server/.env` (see `.env.example`): `PORT`, `MONGODB_URI` (DB name `DB_NAME` from `src/constants.js` is appended; connection uses TLS), `CORS_ORIGIN` (must match client origin — cookies use `credentials: true`), JWT secrets/expiries, Cloudinary credentials.
- `client/.env`: `VITE_API_BASE_URL` (e.g. `http://localhost:8000/api/v1`) plus `VITE_CLOUDINARY_CLOUD_NAME`, `VITE_CLOUDINARY_UPLOAD_PRESET`, and optional `VITE_CLOUDINARY_VIDEO_UPLOAD_PRESET` / `VITE_CLOUDINARY_THUMBNAIL_UPLOAD_PRESET` (used by `src/hooks/useCloudinary.ts`, not listed in `.env.example`).

## Server architecture

`src/index.js` connects Mongo then starts `app` from `src/app.js`, which mounts routers under `/api/v1/{users,tweets,subscriptions,videos,comments,likes,playlist,dashboard}` followed by the global `utils/errorHandler.js`.

Layering: `routes/` → `middlewares/` → `controllers/` → `models/`. Conventions (from `server/AGENTS.md`):
- Wrap every controller in `asyncHandler`; throw `ApiError(status, message)` for expected failures; return successes as `res.status(n).json(new ApiResponse(n, data, message))`. `errorHandler` converts thrown errors to `{ success: false, message }`.
- ES modules only, named exports, `.js` extensions in imports.
- Use `mongoose-aggregate-paginate-v2` for paginated aggregation queries.
- Middleware filenames are spelled `*.middelware.js` — keep that spelling when importing.

Auth: `verifyJWT` / `optionalVerifyJWT` (`middlewares/auth.middelware.js`) read the access token from the `accessToken` cookie or an `Authorization: Bearer` header and set `req.user`. Routes mix public, optional-auth, and protected endpoints per route rather than `router.use(verifyJWT)`.

Uploads: two paths coexist.
- Avatar/cover image/thumbnail updates go through Multer (disk storage into `public/temp`) then `utils/cloudinary.js#uploadOnCloudinary`, which deletes the temp file.
- **Video publishing** (`POST /videos`): the client uploads video and thumbnail directly to Cloudinary (unsigned presets), then sends the resulting `{url, public_id, duration}` objects as JSON strings in `videoFile` / `thumbnail` form fields; `publishVideo` just parses and stores them. Media fields on models are `{ url, public_id }` objects.

## Client architecture

- `src/main.tsx` provides TanStack Query; `src/App.tsx` provides the Redux store (single `user` slice) and the router.
- Routing: everything sits under `AuthLayout`, which calls `getUser()` on mount to hydrate `state.user` before rendering. `PublicRoutes` (login/register) and `ProtectedRoutes` gate on `state.user`; `/` and `/video/:id` are open. Pages are wrapped in `Layout` (Navbar/Sidebar/BottomNav).
- API layer: `src/api/axiosClient.ts` is the shared axios instance (`withCredentials`). The access token is held **in memory** (`setAccessToken`, set on login), attached as a Bearer header; on a 401 it calls `/users/refresh-token` (refresh cookie), queues concurrent failures, and retries. Per-resource functions live in `src/api/*.api.ts`; server data is consumed through TanStack Query hooks in `src/hooks/` (e.g. `useFeed`, `useVideoById`, `useVideoMutations`).
- Playback uses video.js with `@videojs/http-streaming` (HLS) and `videojs-http-source-selector` (`components/videoJSPlayer.tsx`).
- Styling: Tailwind CSS v4 via `@tailwindcss/vite`.
