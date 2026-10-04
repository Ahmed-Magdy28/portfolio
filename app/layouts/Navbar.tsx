'use client';

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Link } from "../components/Link";
import { useTranslation } from "../i18n/useTranslation";
import { useAdminSession } from "../hooks/useAdminSession";
import { ThemeToggle } from "../components/ThemeToggle";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import { BrandLogo } from "../components/BrandLogo";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../components/ui/utils";

export const Navbar = () => {
  const { t } = useTranslation();
  const { adminRoutePath, isAdminAuthenticated } = useAdminSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: t.nav.home, path: "/" },
    { label: t.nav.about, path: "/about" },
    { label: t.nav.projects, path: "/projects" },
    { label: t.nav.languages, path: "/languages" },
    { label: t.nav.frameworks, path: "/frameworks" },
    { label: t.nav.contact, path: "/contact" },
  ];

  const isActive = (path: string) => {
    if (!pathname) return false;
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/85 dark:bg-gray-900/85 backdrop-blur-md border-b border-gray-200/80 dark:border-gray-800/80 transition-colors">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="flex items-center gap-2.5 text-xl font-black text-gray-900 dark:text-white tracking-tight hover:opacity-90 transition-opacity"
          >
            <BrandLogo className="h-8 w-8" />
            <span>Ahmed Magdy</span>
          </Link>

          <div className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "px-3.5 py-1.5 rounded-full text-sm font-bold transition-all duration-200",
                    active
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 shadow-xs"
                      : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100/80 dark:hover:bg-gray-800/60"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2.5">
            {isAdminAuthenticated ? (
              <Link
                to={`/${adminRoutePath}/`}
                className="hidden rounded-full bg-amber-400 px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-black transition hover:bg-amber-300 md:inline-flex"
              >
                Admin
              </Link>
            ) : null}
            <ThemeToggle />
            <LanguageSwitcher />

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden border-t border-gray-100 dark:border-gray-800"
            >
              <div className="py-3 space-y-1">
                {navLinks.map((link) => {
                  const active = isActive(link.path);
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "block px-4 py-2.5 rounded-xl text-base font-bold transition-all",
                        active
                          ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};
