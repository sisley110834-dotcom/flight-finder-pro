<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

# AGENTS.md

- Auth uses only the built-in auth users; no custom tables in v1 (app data will live outside the auth backend later).
- Signed-in pages live under `src/routes/_authenticated/` (client-only gate redirecting to `/auth`); public pages stay top-level.
- Colors, gradients and glows are tokens/utilities in `src/styles.css`; components use them, never raw colors.
