# Repository Guidelines

## Project Structure & Module Organization

This is a personal portfolio built with Next.js 16 (App Router), React 19, TypeScript, Bun, Redux Toolkit, and Tailwind CSS v4. Application code lives in `app/`. App routes are organized using standard Next.js App Router conventions (`app/page.tsx`, `app/projects/`, etc.). Shared UI is in `app/components/`, with shadcn-style primitives under `app/components/ui/`. Layouts are in `app/layouts/`, Redux state is in `app/store/`, hooks are in `app/hooks/`, and server utilities are in `app/lib/`. Editable content is stored in `app/content/`, translations in `app/i18n/`, global styles in `styles/`, and static assets in `public/`.

## Build, Test, and Development Commands

Use Bun for package management and scripts:

```bash
bun install        # install dependencies from bun.lock
bun run dev        # start the local Next.js dev server on port 4000
bun run build      # create the production Next.js build
bun run start      # serve the production build on port 4000
bun run typecheck  # run TypeScript checks
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

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
