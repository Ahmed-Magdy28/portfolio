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
import { Toaster } from "./components/ui/sonner";
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
        <title>Ahmed Magdy | Frontend Web Developer & Software Engineer</title>
        <meta name="description" content="Ahmed Magdy is a professional Frontend Web Developer specializing in React, Next.js, and TypeScript, building high-performance and scalable web applications." />
        <meta name="keywords" content="Ahmed Magdy, Frontend Developer, React Developer, Next.js, TypeScript, Software Engineer, Portfolio, Egypt" />
        <meta name="author" content="Ahmed Magdy" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ahmedmagdy.dev/" />
        <meta property="og:title" content="Ahmed Magdy | Frontend Web Developer" />
        <meta property="og:description" content="Explore the portfolio of Ahmed Magdy, a Frontend Web Developer building modern web solutions with React and Next.js." />
        <meta property="og:image" content="/main-logo.svg" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://ahmedmagdy.dev/" />
        <meta name="twitter:title" content="Ahmed Magdy | Frontend Web Developer" />
        <meta name="twitter:description" content="Explore the portfolio of Ahmed Magdy, a Frontend Web Developer building modern web solutions with React and Next.js." />
        <meta name="twitter:image" content="/main-logo.svg" />

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
        <Toaster />
      </Provider>
    </HelmetProvider>
  );
}
