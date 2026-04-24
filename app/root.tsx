import type { ReactNode } from "react";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { Provider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";
import { store } from "./store";
import {
  getAdminRoutePath,
  isAuthenticatedAdmin,
} from "./lib/admin-auth.server";
import { readAllSiteContentLocales } from "./lib/content.server";
import { readAllLocales } from "./lib/translations.server";
import "../styles/index.css";

export async function loader({ request }: { request: Request }) {
  const siteUrl = new URL(request.url).origin;

  return {
    siteContentByLocale: await readAllSiteContentLocales(),
    translations: await readAllLocales(),
    adminRoutePath: getAdminRoutePath(),
    isAdminAuthenticated: await isAuthenticatedAdmin(request),
    siteUrl,
  };
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr" data-gramm="false" data-gramm_editor="false">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Ahmed Magdy</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400&display=swap"
        />
        <link rel="icon" type="image/svg+xml" href="/main-logo.svg" />
        <link rel="shortcut icon" href="/main-logo.svg" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return (
    <HelmetProvider>
      <Provider store={store}>
        <Outlet />
      </Provider>
    </HelmetProvider>
  );
}
