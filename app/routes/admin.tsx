import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "react-router";
import { redirect } from "react-router";
import {
  getAdminRoutePath,
  isAuthenticatedAdmin,
  loginAdmin,
  logoutAdmin,
} from "../lib/admin-auth.server";
import {
  readSiteContent,
  readAllSiteContentLocales,
  writeSiteContent,
  type ContentLocale,
  type SiteContent,
} from "../lib/content.server";
import {
  readAllLocales,
  writeLocale,
} from "../lib/translations.server";
import type { Locale, TranslationKeys } from "../i18n/translations";
import { AdminCard } from "../components/admin/ui/AdminCard";
import { AdminButton } from "../components/admin/ui/AdminButton";
import { cn } from "../components/ui/utils";
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


type ActionData = {
  error?: string;
  success?: string;
};

type LoaderData = {
  adminRoutePath: string;
  authenticated: boolean;
  siteContent: SiteContent | null;
  siteContentLocales: Record<ContentLocale, SiteContent> | null;
  translationLocales: Record<Locale, TranslationKeys> | null;
};

const locales = ["en", "ar"] as const;

const getSafeLocale = (value: FormDataEntryValue | null): ContentLocale =>
  value === "ar" ? "ar" : "en";

const mergeImportedContent = (
  imported: Partial<SiteContent>,
  currentContent: SiteContent,
): SiteContent => ({
  home: {
    ...currentContent.home,
    ...(imported.home ?? {}),
    features: Array.isArray(imported.home?.features)
      ? imported.home.features
      : currentContent.home.features,
  },
  about: {
    ...currentContent.about,
    ...(imported.about ?? {}),
    paragraphs: Array.isArray(imported.about?.paragraphs)
      ? imported.about.paragraphs
      : currentContent.about.paragraphs,
    skills: Array.isArray(imported.about?.skills)
      ? imported.about.skills
      : currentContent.about.skills,
  },
  contact: {
    ...currentContent.contact,
    ...(imported.contact ?? {}),
    links: Array.isArray(imported.contact?.links)
      ? imported.contact.links
      : currentContent.contact.links,
  },
  projects: Array.isArray(imported.projects) ? imported.projects : currentContent.projects,
  languages: Array.isArray(imported.languages)
    ? imported.languages
    : currentContent.languages,
  frameworks: Array.isArray(imported.frameworks)
    ? imported.frameworks
    : currentContent.frameworks,
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export async function loader({ request }: { request: Request }) {
  const authenticated = await isAuthenticatedAdmin(request);

  return {
    adminRoutePath: getAdminRoutePath(),
    authenticated,
    siteContent: authenticated ? await readSiteContent() : null,
    siteContentLocales: authenticated ? await readAllSiteContentLocales() : null,
    translationLocales: authenticated ? await readAllLocales() : null,
  };
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "logout") {
    return redirect(`/${getAdminRoutePath()}`, {
      headers: {
        "Set-Cookie": await logoutAdmin(request),
      },
    });
  }

  if (intent === "login") {
    const username = String(formData.get("username") ?? "");
    const password = String(formData.get("password") ?? "");
    const cookie = await loginAdmin(request, username, password);

    if (!cookie) {
      return { error: "Invalid username or password." } satisfies ActionData;
    }

    return redirect(`/${getAdminRoutePath()}`, {
      headers: {
        "Set-Cookie": cookie,
      },
    });
  }

  const authenticated = await isAuthenticatedAdmin(request);

  if (!authenticated) {
    return { error: "Please sign in first." } satisfies ActionData;
  }

  if (intent === "save") {
    try {
      const payload = String(formData.get("payload") ?? "");
      const parsed = JSON.parse(payload);
      const locale = getSafeLocale(formData.get("locale"));
      const currentContent = await readSiteContent(locale);

      await writeSiteContent(mergeImportedContent(parsed, currentContent), locale);

      return {
        success: `${locale.toUpperCase()} website data saved successfully.`,
      } satisfies ActionData;
    } catch {
      return {
        error: "The JSON payload is invalid. Please fix it and try again.",
      } satisfies ActionData;
    }
  }

  if (intent === "import-locale") {
    try {
      const locale = getSafeLocale(formData.get("locale"));
      const file = formData.get("jsonFile");

      if (
        !file ||
        typeof file === "string" ||
        typeof file.text !== "function" ||
        file.size === 0
      ) {
        return { error: "Choose a JSON file to import." } satisfies ActionData;
      }

      const parsed = JSON.parse(await file.text()) as Partial<SiteContent>;
      const currentContent = await readSiteContent(locale);

      await writeSiteContent(mergeImportedContent(parsed, currentContent), locale);

      return {
        success: `${locale.toUpperCase()} JSON imported successfully.`,
      } satisfies ActionData;
    } catch {
      return {
        error: "Import failed. Confirm the file is valid site content JSON.",
      } satisfies ActionData;
    }
  }

  if (intent === "import-translation-locale") {
    try {
      const locale = getSafeLocale(formData.get("locale"));
      const file = formData.get("jsonFile");

      if (
        !file ||
        typeof file === "string" ||
        typeof file.text !== "function" ||
        file.size === 0
      ) {
        return { error: "Choose a JSON file to import." } satisfies ActionData;
      }

      const parsed = JSON.parse(await file.text()) as unknown;

      if (!isRecord(parsed)) {
        return { error: "Translation JSON must be an object." } satisfies ActionData;
      }

      await writeLocale(locale, parsed as TranslationKeys);

      return {
        success: `${locale.toUpperCase()} translations imported successfully.`,
      } satisfies ActionData;
    } catch {
      return {
        error: "Import failed. Confirm the file is valid translation JSON.",
      } satisfies ActionData;
    }
  }

  return { error: "Unknown action." } satisfies ActionData;
}

export default function AdminRoute() {
  const {
    adminRoutePath,
    authenticated,
    siteContent,
    siteContentLocales,
    translationLocales,
  } =
    useLoaderData() as LoaderData;
  const actionData = useActionData() as ActionData | undefined;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

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

          <Form method="post" className="space-y-6">
            <input type="hidden" name="intent" value="login" />

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

            {actionData?.error && (
              <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50/50 p-4 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-300">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {actionData.error}
              </div>
            )}

            <AdminButton type="submit" isLoading={isSubmitting} className="w-full" size="lg" variant="primary">
              Verify Credentials
            </AdminButton>
          </Form>
        </AdminCard>
      </div>
    );
  }

  const downloadJsonFile = (fileName: string, content: unknown) => {
    if (!content) {
      return;
    }

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

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 space-y-8">
      <AdminCard 
        className="border-l-4 border-l-blue-600"
        headerActions={
          <Form method="post">
            <input type="hidden" name="intent" value="logout" />
            <AdminButton type="submit" variant="secondary" size="sm" leftIcon={<LogOut className="w-4 h-4" />}>
              Sign Out
            </AdminButton>
          </Form>
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

      {actionData?.error && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50/50 p-4 text-sm font-bold text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-300 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5" />
          {actionData.error}
        </div>
      )}

      {actionData?.success && (
        <div className="flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50/50 p-4 text-sm font-bold text-green-700 dark:border-green-900/50 dark:bg-green-950/20 dark:text-green-300 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5" />
          {actionData.success}
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

                <Form method="post" encType="multipart/form-data" className="space-y-4">
                  <input type="hidden" name="intent" value="import-locale" />
                  <input type="hidden" name="locale" value={locale} />
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
                </Form>
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

                <Form method="post" encType="multipart/form-data" className="space-y-4">
                  <input
                    type="hidden"
                    name="intent"
                    value="import-translation-locale"
                  />
                  <input type="hidden" name="locale" value={locale} />
                  <div className="relative group">
                    <input
                      name="jsonFile"
                      type="file"
                      accept="application/json,.json"
                      required
                      className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-fuchsia-600 file:text-white hover:file:bg-fuchsia-700 cursor-pointer"
                    />
                  </div>
                  <AdminButton type="submit" isLoading={isSubmitting} variant="fuchsia" size="sm" className="w-full" leftIcon={<Upload className="w-3.5 h-3.5" />}>
                    Import {locale.toUpperCase()} Translations
                  </AdminButton>
                </Form>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>

      <Form method="post">
        <input type="hidden" name="intent" value="save" />
        <input type="hidden" name="locale" value="en" />
        <AdminCard 
          title="Direct Source Editor" 
          description="Modify the raw English content JSON. Exercise caution: manual edits must maintain structural integrity."
          icon={<FileJson className="w-6 h-6 text-blue-600" />}
          className="border-t-4 border-t-blue-600"
          headerActions={
            <AdminButton type="submit" isLoading={isSubmitting} size="sm" leftIcon={<Save className="w-4 h-4" />}>
              Commit Changes
            </AdminButton>
          }
        >
          <div className="relative group">
            <div className="absolute -top-3 right-4 px-2 py-0.5 bg-gray-900 text-[9px] font-black text-gray-400 uppercase tracking-widest rounded-md border border-gray-800 z-10">
              Read-Only Safety Off
            </div>
            <textarea
              title="writing area"
              name="payload"
              defaultValue={JSON.stringify(siteContent, null, 2)}
              spellCheck={false}
              className="min-h-[30rem] w-full rounded-[1.5rem] border border-gray-200 bg-gray-50 p-6 font-mono text-xs leading-relaxed text-gray-800 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300"
            />
          </div>
        </AdminCard>
      </Form>
    </div>
  );
}
