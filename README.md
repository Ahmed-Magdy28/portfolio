# Portfolio

A personal portfolio built with React Router 7, React 19, TypeScript, Redux Toolkit, Tailwind CSS, and Motion. The app includes project, language, and framework detail pages, plus theme and language toggles persisted in the browser.

## Stack

- React Router 7 framework mode with SSR enabled
- React 19 and TypeScript
- Redux Toolkit for theme and language state
- Tailwind CSS v4 for styling
- Motion for page and UI animations
- Bun for local development

## Getting Started

Install dependencies:

```bash
bun install
```

Start the dev server:

```bash
bun run dev
```

The app runs on `http://localhost:5173` by default.

## Available Scripts

```bash
bun run dev
bun run build
bun run start
bun run typecheck
```

## Project Structure

```text
app/
  components/   Reusable UI building blocks
  data/         Portfolio content and typed data models
  i18n/         Translation dictionaries and translation hook
  layouts/      Shared page chrome
  pages/        Reusable page components
  routes/       React Router route modules
  store/        Redux store and slices
styles/         Global CSS, fonts, and theme styles
public/         Static assets
```

## Notes

- Theme and language preferences are applied only in the browser, which keeps the SSR/dev server safe from `window` and `localStorage` errors.
- Route definitions live in [app/routes.ts](/home/ahmed/projects/Portfolio/app/routes.ts) and point to route modules in [app/routes](/home/ahmed/projects/Portfolio/app/routes.ts).

## Production

Build the app:

```bash
bun run build
```

Serve the production build:

```bash
bun run start
```
