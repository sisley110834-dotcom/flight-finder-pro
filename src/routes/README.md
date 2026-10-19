# Routes

This is a client-side SPA using **React Router** (data router). Routes are
declared in `src/router.tsx`; each file here exports a page component.

| Path | Component | Notes |
| --- | --- | --- |
| `/` | `index.tsx` → `Index` | public landing page |
| `/auth` | `auth.tsx` → `SignIn` | public |
| `/signup` | `signup.tsx` → `SignUp` | public |
| `/app` | `app.tsx` → `AppPage` | child of the `authenticated` route (loader redirects to `/auth` when signed out) |
| `*` | `root.tsx` → `NotFoundComponent` | 404 |

`root.tsx` holds the app shell (`RootComponent`) — preserve its `<Outlet />`.
Per-page `<title>`/meta tags are set with `usePageMeta` from `src/lib/head.ts`.
Deep links work in production because `vercel.json` rewrites every path to `index.html`.
