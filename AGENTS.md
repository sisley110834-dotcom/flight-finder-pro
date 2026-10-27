# AGENTS.md

- Auth runs on the connected Lovable Cloud backend; auth uses only the built-in auth users, no custom tables (app data lives on the external flight API).
- This is a static Vite + React Router SPA (no SSR). Routes are declared in `src/router.tsx`; page components live in `src/routes/`.
- Signed-in pages are children of the `authenticated` route in `src/router.tsx` (client-only loader gate redirecting to `/auth`); public pages stay top-level.
- Colors, gradients and glows are tokens/utilities in `src/styles.css`; components use them, never raw colors. The visual theme is a beige "sardine label" look (paper, cobalt ink, olive, lemon): page backgrounds use `bg-paper`, panels use `label-card`, the product name uses `brand-name` (white PMingLiU on cobalt); ornaments live in `src/components/Ornaments.tsx`. No text fade-in.
