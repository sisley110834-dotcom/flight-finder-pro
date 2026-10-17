# Flight Finder Pro

building a saas landing page+ authenticated app shell for flight price notifier, a product could watch popular flight route from taipei, a targeted price you monitor,  we email you when the fares drop, and a primary CTA button labeled "sign-in/登入"  in the top-right corner, feature section with 3 feature cards 
card 1 : always on-route watching- monitor the route from taipei to paris, japan etc, automatically catch the lowest fares
card 2: targeted-price email alert- when price drop below the one you targeted, will remind you right away, with purchase link
card 3: cancel anytime- monthly subscription, you can unsubscribe anytime, no contract, no extra charge
footer with copright 『©flight price notifier』 
authentication using lovable's build-in supabase-style auth(use whatever auth backend lovable provided by default-lovable cloud is find for this vl; we will swap to a user-owned supabase project in the later step)
sign up page with email+password
sign in page with email+password
sign out functionality
email confirmation can be disable for simplicity in this vl
an authenticated app shell at/app that the user land on after signing in 
greet the sign-in user by email: 「Hi {user.email}」

A placeholder message: 「你的航線追蹤儀表板即將上線 — 下一個里程碑會加上訂閱航線的功能。」 (English: "Your dashboard is coming soon. Route-subscription will be added in the next milestone.")
a sign-out button in the header
design requirements

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/32fc6620-db6e-463d-83e5-f2a4acd82554).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
