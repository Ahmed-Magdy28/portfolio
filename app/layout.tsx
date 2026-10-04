import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Providers } from "./providers";
import { Navbar } from "./layouts/Navbar";
import { Footer } from "./layouts/Footer";
import { readAllSiteContentLocales } from "./lib/content.server";
import { readAllLocales } from "./lib/translations.server";
import {
  getAdminRoutePath,
  isAuthenticatedAdmin,
} from "./lib/admin-auth.server";
import "../styles/index.css";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#111827" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://ahmedmagdy.site"),
  title: {
    default: "Ahmed Magdy | Front-End & Full-Stack Web Developer",
    template: "%s | Ahmed Magdy",
  },
  description:
    "Ahmed Magdy is a Front-End & Full-Stack Web Developer specializing in React, Next.js, and TypeScript, building high-performance and scalable web applications.",
  keywords: [
    "Ahmed Magdy",
    "Frontend Developer",
    "Full-Stack Developer",
    "React",
    "Next.js",
    "TypeScript",
    "NestJS",
    "Django",
    "Software Engineer",
    "Portfolio",
    "Cairo Egypt",
  ],
  authors: [{ name: "Ahmed Magdy", url: "https://ahmedmagdy.site" }],
  creator: "Ahmed Magdy",
  publisher: "Ahmed Magdy",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["ar_EG"],
    url: "https://ahmedmagdy.site",
    title: "Ahmed Magdy | Front-End & Full-Stack Web Developer",
    description:
      "Explore the portfolio of Ahmed Magdy, a Front-End & Full-Stack Web Developer building modern web solutions with React, Next.js, NestJS, and Django.",
    siteName: "Ahmed Magdy Portfolio",
    images: [
      {
        url: "/main-logo.svg",
        width: 1200,
        height: 630,
        alt: "Ahmed Magdy Portfolio Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ahmed Magdy | Front-End & Full-Stack Web Developer",
    description:
      "Explore the portfolio of Ahmed Magdy, a Front-End & Full-Stack Web Developer building modern web solutions with React, Next.js, NestJS, and Django.",
    images: ["/main-logo.svg"],
  },
  icons: {
    icon: [{ url: "/main-logo.svg", type: "image/svg+xml" }],
    shortcut: "/main-logo.svg",
    apple: "/main-logo.svg",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Ahmed Magdy",
  jobTitle: "Front-End & Full-Stack Web Developer",
  url: "https://ahmedmagdy.site",
  sameAs: [
    "https://github.com/Ahmed-Magdy28",
    "https://linkedin.com/in/ahmedmagdy2849",
  ],
  knowsAbout: [
    "React",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "Tailwind CSS",
    "NestJS",
    "Django",
    "PostgreSQL",
    "GraphQL",
    "REST APIs",
  ],
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [siteContentByLocale, translations, adminAuth] = await Promise.all([
    readAllSiteContentLocales(),
    readAllLocales(),
    isAuthenticatedAdmin(),
  ]);

  const rootData = {
    siteContentByLocale,
    translations,
    adminRoutePath: getAdminRoutePath(),
    isAdminAuthenticated: adminAuth,
    siteUrl: "https://ahmedmagdy.site",
  };

  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors antialiased">
        <Providers rootData={rootData}>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
