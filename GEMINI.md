# Ahmed Magdy Portfolio - Gemini CLI Context

This project is a personal portfolio built with **React Router 7 (SSR mode)**, **React 19**, **TypeScript**, and **Tailwind CSS v4**. It features a robust content management system with an admin panel and supports localization (English/Arabic).

## Project Overview

- **Core Stack:** React 19, React Router 7 (Framework Mode), TypeScript, Bun.
- **Styling:** Tailwind CSS v4, Motion (for animations).
- **State Management:** Redux Toolkit (Theme, Language, and global UI state).
- **Content Management:** JSON-based content stored in `app/content/`, managed via an admin panel.
- **Localization:** Supports `en` and `ar`. Translations are in `app/i18n/locales/`.
- **UI Components:** Custom components built on Radix UI primitives (following shadcn/ui patterns).
- **SSR/SEO:** Server-side rendered with SEO metadata managed via `react-helmet-async`.

## Project Structure

- `app/components/`: Reusable UI and feature-specific components.
  - `ui/`: Radix-based primitive components (Button, Card, Tabs, etc.).
  - `admin/`: Components specifically for the content editor.
- `app/content/`: Source of truth for site data (`site-data.en.json`, `site-data.ar.json`).
- `app/data/`: TypeScript types and static data definitions.
- `app/hooks/`: Custom React hooks (e.g., `useSiteContent`, `useAdminSession`).
- `app/i18n/`: Localization logic and JSON translation files.
- `app/layouts/`: Core layout components (`Navbar`, `Footer`, `RootLayout`).
- `app/lib/`: Server-side utilities for auth, content reading/writing, and translations.
- `app/pages/`: Reusable page views that are mapped to routes.
- `app/routes/`: Route modules (the entry points for React Router).
- `app/store/`: Redux store configuration and slices (`langSlice`, `themeSlice`).
- `app/root.tsx`: The application's entry point, containing providers and the HTML shell.
- `styles/`: Global styles, theme tokens, and font configurations.

## Building and Running

This project uses **Bun** as the package manager and runtime.

- **Install Dependencies:** `bun install`
- **Development Server:** `bun run dev`
- **Production Build:** `bun run build`
- **Serve Production:** `bun run start`
- **Type Checking:** `bun run typecheck` (Runs `react-router typegen` then `tsc`)

## Development Conventions

- **Framework Mode:** Always use React Router's framework features (loaders, actions, `<Outlet />`).
- **Styling:** Use Tailwind CSS v4 utility classes. Prefer CSS variables defined in `styles/theme.css` for theming.
- **Typing:** Strict TypeScript is enforced. Define types in `app/data/types.ts` and use them consistently.
- **Server Utilities:** Logic that touches the filesystem or environment variables should reside in `app/lib/*.server.ts`.
- **State Management:** Use Redux for global UI state (theme, language). For page data, prefer React Router loaders.
- **Admin Flow:** Protected admin routes use session cookies. The `ADMIN_ROUTE_PATH` is configurable via `.env`.
- Localization: Use the `useTranslation` hook from `app/i18n/useTranslation.ts` for UI strings.
- **Item Display:** For programming languages and frameworks, display their icon and title horizontally, with the icon preceding the title, to ensure a clean and consistent presentation across relevant pages.

## Environment Variables

Ensure a `.env` file exists with the following:
- `ADMIN_ROUTE_PATH`: The secret path for the admin panel.
- `ADMIN_USERNAME`: Admin login username.
- `ADMIN_PASSWORD`: Admin login password.
- `ADMIN_SESSION_SECRET`: Secret key for session cookies.

## Deployment Notes

The project is designed for SSR. When deploying, ensure the build output (`build/server/index.js`) is served by a Node.js/Bun process.
