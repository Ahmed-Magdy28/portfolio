# Ahmed Magdy Portfolio

A production-ready personal portfolio built with React Router 7 (SSR), React 19, TypeScript, Redux Toolkit, Tailwind CSS v4, and Motion.

The project showcases:

- Projects with details pages
- Programming languages and framework knowledge pages
- Arabic and English content
- Light and dark mode
- Admin content editing flow
- SEO-focused metadata and structured data

## Highlights

- Server-side rendering enabled for better SEO and first paint
- Dynamic route-driven content architecture
- Global theming and language state with Redux Toolkit
- Modern reusable component system (including shadcn/ui style primitives)
- SEO setup with react-helmet-async, Open Graph, Twitter tags, and JSON-LD
- Custom SVG brand logo used as website identity and favicon
- Typography system based on Inter and JetBrains Mono

## Tech Stack

- Runtime and package manager: Bun
- Frontend framework: React 19
- Routing and SSR: React Router 7 framework mode
- Language: TypeScript
- State: Redux Toolkit + React Redux
- Styling: Tailwind CSS v4 + custom theme tokens
- Animation: Motion
- SEO metadata management: react-helmet-async

## Project Structure

```text
app/
  components/       Shared UI and feature components
  content/          Editable site content JSON (en/ar/base)
  data/             Typed data models and exports
  hooks/            Shared app hooks
  i18n/             Translation hooks and locale resources
  layouts/          Navbar/Footer/root layout shells
  lib/              Server utilities (auth/content/translations)
  pages/            Page-level reusable views
  routes/           Route modules mapped in app/routes.ts
  store/            Redux store and slices
  root.tsx          App root loader, HTML shell, providers
styles/
  index.css         Global style entry
  theme.css         Theme tokens and base layer styles
  fonts.css         Inter + JetBrains Mono setup
public/
  main-logo.svg     Primary brand SVG (also favicon)
build/
  client/           Production client output
  server/           Production server output
```

## Routing Overview

Defined in app/routes.ts:

- /
- /about
- /projects
- /projects/:id
- /languages
- /languages/:slug
- /languages/:slug/insights
- /languages/:slug/interview
- /frameworks
- /frameworks/:slug
- /frameworks/:slug/insights
- /frameworks/:slug/interview
- /contact
- /{ADMIN_ROUTE_PATH}
- /\_\_admin/save

## SEO Setup

Current SEO implementation includes:

- SSR-enabled rendering
- Per-page Helmet metadata on the home page
- Optimized title and description for personal branding
- Target keywords for frontend and software engineering search intents
- Canonical URL support
- Open Graph and Twitter card tags
- Person JSON-LD structured data

Important note:
SEO settings improve discoverability, but search ranking depends on additional factors such as domain authority, backlinks, page speed, indexing, and content quality.

## Branding and Typography

- Main logo: custom SVG in public/main-logo.svg
- Favicon: wired to the same main SVG
- Primary typeface: Inter (UI, headings, body)
- Code typeface: JetBrains Mono (code, pre, kbd, samp)

## Environment Variables

Create a .env file in the project root and configure:

```env
ADMIN_ROUTE_PATH=vault-7f3a-admin
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change-me
ADMIN_SESSION_SECRET=change-this-admin-session-secret-in-production
```

Notes:

- ADMIN_ROUTE_PATH controls the admin URL segment.
- ADMIN_SESSION_SECRET must be strong and unique in production.
- secure cookies are automatically enabled in production mode.

## Getting Started

1. Install dependencies:

```bash
bun install
```

1. Run development server:

```bash
bun run dev
```

1. Open:

```text
http://localhost:5173
```

## Scripts

```bash
bun run dev       # start dev server
bun run build     # create production build
bun run start     # serve production build
bun run typecheck # route typegen + TypeScript check
```

## Production

Build:

```bash
bun run build
```

Serve:

```bash
bun run start
```

## Content and Localization

Content lives in:

- app/content/site-data.json
- app/content/site-data.en.json
- app/content/site-data.ar.json

Translations live in:

- app/i18n/locales
- app/lib/translations.server.ts

This allows editing content and language-specific text independently.

## Admin Editing Flow

- Admin auth uses cookie sessions.
- Login path is controlled by ADMIN_ROUTE_PATH.
- Content and translation updates post to /\_\_admin/save.
- Home page includes authenticated admin editors for quick updates.

## Troubleshooting

- If styles look wrong, verify styles/index.css imports fonts.css, tailwind.css, and theme.css.
- If admin login fails, re-check .env credentials and restart the dev server.
- If SEO tags appear missing, verify HelmetProvider is mounted in app/root.tsx and page-level Helmet tags are present.

## Author

Ahmed Magdy

- GitHub: [github.com/Ahmed-Magdy28](https://github.com/Ahmed-Magdy28)
- LinkedIn: [linkedin.com/in/ahmedmagdy2849](https://linkedin.com/in/ahmedmagdy2849)
