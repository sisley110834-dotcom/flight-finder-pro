# AGENTS.md

- Use the connected Lovable Cloud backend for authentication only, with built-in auth users and no custom tables or RPCs; application data belongs outside the auth backend in later milestones.
- Keep this a static Vite + React Router SPA: routes are declared in `src/router.tsx` and pages live in `src/routes/`, so deployment requires only static hosting.
- Signed-in pages are children of the authenticated loader gate; public pages remain top-level to keep access control consistent.
- Define visual tokens in `src/styles.css` and use shared UI controls; the brand font is a separate token so typography can change without editing every page.
- The v1 dashboard is a placeholder only and must not import flight subscription or payment modules, to keep later milestones out of the initial auth shell.
