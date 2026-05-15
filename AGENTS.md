# Repository Guidelines

## Project Structure & Module Organization

This is a React Router 7 SSR portfolio app using React 19, TypeScript, Bun, Redux Toolkit, and Tailwind CSS v4. Application code lives in `app/`. Route modules are in `app/routes/` and are wired through `app/routes.ts`; reusable page views live in `app/pages/`. Shared UI is in `app/components/`, with shadcn-style primitives under `app/components/ui/`. Layouts are in `app/layouts/`, Redux state is in `app/store/`, hooks are in `app/hooks/`, and server utilities are in `app/lib/`. Editable content is stored in `app/content/`, translations in `app/i18n/`, global styles in `styles/`, and static assets in `public/`.

## Build, Test, and Development Commands

Use Bun for package management and scripts:

```bash
bun install        # install dependencies from bun.lock
bun run dev        # start the local React Router dev server
bun run build      # create the production client/server build
bun run start      # serve ./build/server/index.js
bun run typecheck  # generate route types and run TypeScript checks
```

Run `bun run typecheck` before handing off changes. Run `bun run build` when touching routing, SSR behavior, content loading, or production-only code paths.

## Coding Style & Naming Conventions

Write TypeScript with `strict` mode in mind. Prefer functional React components, named exports where practical, and the `~/*` alias for imports from `app/`. Use PascalCase for components and page files (`ProjectDetail.tsx`), camelCase for hooks and utilities (`useSiteContent.ts`), and kebab-case for route filenames (`language-detail.tsx`). Keep route modules thin and place reusable UI or page logic in `app/pages/` or `app/components/`. Follow existing Tailwind and theme-token patterns in `styles/theme.css`.

## Testing Guidelines

No dedicated test runner is currently configured. Treat `bun run typecheck` as the minimum required validation, and use `bun run build` for broader regression checks. If adding tests later, colocate them near the feature or use a consistent `*.test.ts(x)` naming pattern, and add the script to `package.json`.

## Commit & Pull Request Guidelines

Recent commits use short, imperative summaries such as `fix the performance` or `Revert to stable version`. Keep commit titles concise and focused on one change. Pull requests should include a short description, affected routes/pages, validation commands run, linked issues when relevant, and screenshots for visible UI changes in both light/dark mode or English/Arabic content when applicable.

## Security & Configuration Tips

Admin settings are environment-driven. Keep `.env` local and never commit secrets such as `ADMIN_PASSWORD` or `ADMIN_SESSION_SECRET`. Use strong production values.
