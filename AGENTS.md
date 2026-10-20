# AGENTS.md

- Backend is the project's own Supabase project (`kgguzqmlmgbflfxjgtji`); auth uses only Supabase `auth.users`; no custom tables in v1 (app data will live outside the auth backend later).
- This is a static Vite + React Router SPA (no SSR). Routes are declared in `src/router.tsx`; page components live in `src/routes/`.
- Signed-in pages are children of the `authenticated` route in `src/router.tsx` (client-only loader gate redirecting to `/auth`); public pages stay top-level.
- Colors, gradients and glows are tokens/utilities in `src/styles.css`; components use them, never raw colors. The visual theme is a light "air" look (sky-blue room, white clouds, clear glass): page backgrounds use `bg-sky`, surfaces use `glass`, decorative clouds use `cloud`.
