'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminCard } from "./ui/AdminCard";
import { AdminButton } from "./ui/AdminButton";
import { cn } from "../ui/utils";
import type { ContentLocale, SiteContent } from "../../lib/content.server";
import type { Locale, TranslationKeys } from "../../i18n/translations";
import { 
  LayoutDashboard, 
  Download, 
  Upload, 
  FileJson, 
  Languages, 
  LogOut, 
  User, 
  Lock, 
  Briefcase, 
  Code2, 
  Cpu, 
  Save, 
  AlertCircle, 
  CheckCircle2 
} from "lucide-react";

interface AdminViewProps {
  adminRoutePath: string;
  authenticated: boolean;
  siteContent: SiteContent | null;
  siteContentLocales: Record<ContentLocale, SiteContent> | null;
  translationLocales: Record<Locale, TranslationKeys> | null;
}

const locales: ContentLocale[] = ["en", "ar"];

export const AdminView = ({
  adminRoutePath,
  authenticated: initialAuth,
  siteContent,
  siteContentLocales,
  translationLocales,
}: AdminViewProps) => {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(initialAuth);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const fd = new FormData(e.currentTarget);
    fd.append("intent", "login");

    try {
      const res = await fetch("/api/__admin/auth", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        setMessage({ type: 'error', text: data.error || 'Invalid credentials' });
      } else {
        setAuthenticated(true);
        router.refresh();
      }
    } catch {
      setMessage({ type: 'error', text: 'Login request failed' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("intent", "logout");
      await fetch("/api/__admin/auth", { method: "POST", body: fd });
      setAuthenticated(false);
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImportContent = async (e: React.FormEvent<HTMLFormElement>, locale: ContentLocale) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const fd = new FormData(e.currentTarget);
    const file = fd.get("jsonFile");
    if (!file || !(file instanceof File) || file.size === 0) {
      setMessage({ type: 'error', text: 'Please select a valid JSON file.' });
      setIsSubmitting(false);
      return;
    }

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);

      const saveFd = new FormData();
      saveFd.append("intent", "save-collection");
      saveFd.append("locale", locale);

      const res = await fetch("/__admin/save", {
        method: "POST",
        body: new URLSearchParams({
          intent: "save-content-section",
          locale,
          section: "all",
          payload: JSON.stringify(parsed),
        }),
      });

      const resData = await res.json();
      if (resData.success) {
        setMessage({ type: 'success', text: `${locale.toUpperCase()} data imported successfully!` });
        router.refresh();
      } else {
        setMessage({ type: 'error', text: resData.error || 'Import failed.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Invalid JSON file content.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadJsonFile = (fileName: string, content: unknown) => {
    if (!content) return;
    const blob = new Blob([`${JSON.stringify(content, null, 2)}\n`], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!authenticated || !siteContent) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-xl items-center px-4 py-12">
        <AdminCard
          title="Vault Access"
          description={`Secure endpoint: /${adminRoutePath}`}
          className="w-full border-t-4 border-t-blue-600"
          icon={<LayoutDashboard className="w-6 h-6 text-blue-600" />}
        >
          <p className="mb-8 text-sm text-gray-500 dark:text-gray-400">
            Authentication required to modify portfolio data. Please enter your credentials.
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <label className="block">
                <div className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                  <User className="w-4 h-4" /> Username
                </div>
                <input
                  name="username"
                  type="text"
                  required
                  placeholder="admin"
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 px-4 py-3.5 text-sm outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 dark:border-gray-800 dark:bg-gray-800/50"
                />
              </label>

              <label className="block">
                <div className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                  <Lock className="w-4 h-4" /> Password
                </div>
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 px-4 py-3.5 text-sm outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 dark:border-gray-800 dark:bg-gray-800/50"
                />
              </label>
            </div>

            {message?.type === 'error' && (
              <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50/50 p-4 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-300">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {message.text}
              </div>
            )}

            <AdminButton type="submit" isLoading={isSubmitting} className="w-full" size="lg" variant="primary">
              Verify Credentials
            </AdminButton>
          </form>
        </AdminCard>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 space-y-8">
      <AdminCard
        className="border-l-4 border-l-blue-600"
        headerActions={
          <AdminButton
            type="button"
            onClick={handleLogout}
            variant="secondary"
            size="sm"
            leftIcon={<LogOut className="w-4 h-4" />}
          >
            Sign Out
          </AdminButton>
        }
      >
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
            <LayoutDashboard className="w-8 h-8" />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400 mb-1">
              Command Center
            </div>
            <h1 className="text-3xl font-black tracking-tight">Admin Dashboard</h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400 max-w-2xl text-sm">
              Global content management system. Edit localized data, manage collections, and handle translations for the entire portfolio.
            </p>
          </div>
        </div>
      </AdminCard>

      {message && (
        <div
          className={cn(
            "flex items-center gap-3 rounded-2xl p-4 text-sm font-bold animate-in fade-in slide-in-from-top-2 border",
            message.type === 'error'
              ? "border-red-200 bg-red-50/50 text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-300"
              : "border-green-200 bg-green-50/50 text-green-700 dark:border-green-900/50 dark:bg-green-950/20 dark:text-green-300"
          )}
        >
          {message.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
          {message.text}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {[
          { label: "Projects", count: siteContent.projects.length, icon: <Briefcase className="w-5 h-5" />, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
          { label: "Languages", count: siteContent.languages.length, icon: <Code2 className="w-5 h-5" />, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
          { label: "Frameworks", count: siteContent.frameworks.length, icon: <Cpu className="w-5 h-5" />, color: "text-fuchsia-600", bg: "bg-fuchsia-50 dark:bg-fuchsia-900/20" },
        ].map((stat) => (
          <AdminCard key={stat.label} className="group hover:border-blue-200 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{stat.label}</div>
                <div className="text-4xl font-black tracking-tight">{stat.count}</div>
              </div>
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                {stat.icon}
              </div>
            </div>
          </AdminCard>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <AdminCard
          title="Content Sync"
          description="Synchronize site-data JSON files for all supported languages."
          icon={<FileJson className="w-6 h-6 text-emerald-600" />}
          className="border-t-4 border-t-emerald-600"
        >
          <div className="space-y-6">
            {locales.map((locale) => (
              <div
                key={locale}
                className="rounded-[1.5rem] border border-gray-100 bg-gray-50/50 p-6 dark:border-gray-800 dark:bg-gray-800/30"
              >
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 flex items-center justify-center font-black text-xs">
                      {locale.toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-bold">Website Content</div>
                      <div className="text-[10px] text-gray-500 uppercase font-black tracking-tighter">site-data.{locale}.json</div>
                    </div>
                  </div>
                  <AdminButton
                    type="button"
                    variant="outline"
                    size="sm"
                    leftIcon={<Download className="w-3.5 h-3.5" />}
                    onClick={() =>
                      downloadJsonFile(
                        `site-data.${locale}.json`,
                        siteContentLocales?.[locale],
                      )
                    }
                  >
                    Export
                  </AdminButton>
                </div>

                <form onSubmit={(e) => handleImportContent(e, locale)} className="space-y-4">
                  <div className="relative group">
                    <input
                      name="jsonFile"
                      type="file"
                      accept="application/json,.json"
                      required
                      className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 cursor-pointer"
                    />
                  </div>
                  <AdminButton type="submit" isLoading={isSubmitting} variant="emerald" size="sm" className="w-full" leftIcon={<Upload className="w-3.5 h-3.5" />}>
                    Import {locale.toUpperCase()} Payload
                  </AdminButton>
                </form>
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminCard
          title="Translation Sync"
          description="Manage UI strings and labels across all supported locales."
          icon={<Languages className="w-6 h-6 text-fuchsia-600" />}
          className="border-t-4 border-t-fuchsia-600"
        >
          <div className="space-y-6">
            {locales.map((locale) => (
              <div
                key={locale}
                className="rounded-[1.5rem] border border-gray-100 bg-gray-50/50 p-6 dark:border-gray-800 dark:bg-gray-800/30"
              >
                <div className="mb-6 flex items-center justify-between gap-4">
                   <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 flex items-center justify-center font-black text-xs">
                      {locale.toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-bold">UI Translations</div>
                      <div className="text-[10px] text-gray-500 uppercase font-black tracking-tighter">{locale}.json</div>
                    </div>
                  </div>
                  <AdminButton
                    type="button"
                    variant="outline"
                    size="sm"
                    leftIcon={<Download className="w-3.5 h-3.5" />}
                    onClick={() =>
                      downloadJsonFile(`${locale}.json`, translationLocales?.[locale])
                    }
                  >
                    Export
                  </AdminButton>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>
    </div>
  );
};
