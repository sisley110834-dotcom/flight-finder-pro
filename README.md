# Flight Finder Pro

building a saas landing page+ authenticated app shell for flight price notifier, a product could watch popular flight route from taipei, a targeted price you monitor,  we email you when the fares drop, and a primary CTA button labeled "sign-in/登入"  in the top-right corner, feature section with 3 feature cards 
card 1 : always on-route watching- monitor the route from taipei to paris, japan etc, automatically catch the lowest fares
card 2: targeted-price email alert- when price drop below the one you targeted, will remind you right away, with purchase link
card 3: cancel anytime- monthly subscription, you can unsubscribe anytime, no contract, no extra charge
footer with copright 『©flight price notifier』 
authentication using Supabase Auth on the project's own Supabase project
sign up page with email+password
sign in page with email+password
sign out functionality
email confirmation can be disable for simplicity in this vl
an authenticated app shell at/app that the user land on after signing in 
greet the sign-in user by email: 「Hi {user.email}」

A placeholder message: 「你的航線追蹤儀表板即將上線 — 下一個里程碑會加上訂閱航線的功能。」 (English: "Your dashboard is coming soon. Route-subscription will be added in the next milestone.")
a sign-out button in the header
design requirements

## Development

You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

The app is a static Vite + React Router SPA backed by Supabase (project `kgguzqmlmgbflfxjgtji`).
`.env` holds the browser-safe Supabase settings (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`);
`sb_publishable_*` keys replace the legacy anon key and are protected by RLS. `npm run build` writes the site to `dist/`.

### Deploying to Vercel

Import the repo in Vercel (framework preset: Vite). `vercel.json` sets the build output to `dist/`
and rewrites all paths to `index.html` so deep links such as `/app` resolve client-side.
Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in the Vercel project's environment variables.
