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
  writeSiteContent,
  type SiteContent,
} from "../lib/content.server";

type ActionData = {
  error?: string;
  success?: string;
};

type LoaderData = {
  adminRoutePath: string;
  authenticated: boolean;
  siteContent: SiteContent | null;
};

export async function loader({ request }: { request: Request }) {
  const authenticated = await isAuthenticatedAdmin(request);

  return {
    adminRoutePath: getAdminRoutePath(),
    authenticated,
    siteContent: authenticated ? await readSiteContent() : null,
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
      const currentContent = await readSiteContent();

      await writeSiteContent({
        home: parsed.home ?? currentContent.home,
        about: parsed.about ?? currentContent.about,
        contact: parsed.contact ?? currentContent.contact,
        projects: Array.isArray(parsed.projects) ? parsed.projects : [],
        languages: Array.isArray(parsed.languages) ? parsed.languages : [],
        frameworks: Array.isArray(parsed.frameworks) ? parsed.frameworks : [],
      });

      return {
        success: "Website data saved successfully.",
      } satisfies ActionData;
    } catch {
      return {
        error: "The JSON payload is invalid. Please fix it and try again.",
      } satisfies ActionData;
    }
  }

  return { error: "Unknown action." } satisfies ActionData;
}

export default function AdminRoute() {
  const { adminRoutePath, authenticated, siteContent } =
    useLoaderData() as LoaderData;
  const actionData = useActionData() as ActionData | undefined;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  if (!authenticated || !siteContent) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-xl items-center px-4 py-12">
        <div className="w-full rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-8">
            <div className="text-sm font-medium uppercase tracking-[0.3em] text-gray-500">
              Hidden Route
            </div>
            <h1 className="mt-3 text-3xl font-semibold">Admin Dashboard</h1>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Sign in to manage the content used across the portfolio website.
            </p>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Current route: /{adminRoutePath}
            </p>
          </div>

          <Form method="post" className="space-y-5">
            <input type="hidden" name="intent" value="login" />

            <label className="block">
              <div className="mb-2 text-sm font-medium">Username</div>
              <input
                name="username"
                type="text"
                required
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800"
              />
            </label>

            <label className="block">
              <div className="mb-2 text-sm font-medium">Password</div>
              <input
                name="password"
                type="password"
                required
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800"
              />
            </label>

            {actionData?.error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                {actionData.error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </Form>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="text-sm font-medium uppercase tracking-[0.3em] text-gray-500">
            Secret Route
          </div>
          <h1 className="mt-3 text-3xl font-semibold">Admin Dashboard</h1>
          <p className="mt-3 max-w-3xl text-gray-600 dark:text-gray-400">
            Edit the JSON below to manage projects, languages, frameworks,
            insights, and interview questions used throughout the website.
          </p>
        </div>

        <Form method="post">
          <input type="hidden" name="intent" value="logout" />
          <button
            type="submit"
            className="rounded-xl border border-gray-300 px-4 py-2 font-medium transition hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            Log out
          </button>
        </Form>
      </div>

      {actionData?.error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {actionData.error}
        </div>
      )}

      {actionData?.success && (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300">
          {actionData.success}
        </div>
      )}

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Projects
          </div>
          <div className="mt-2 text-3xl font-semibold">
            {siteContent.projects.length}
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Languages
          </div>
          <div className="mt-2 text-3xl font-semibold">
            {siteContent.languages.length}
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Frameworks
          </div>
          <div className="mt-2 text-3xl font-semibold">
            {siteContent.frameworks.length}
          </div>
        </div>
      </div>

      <Form method="post" className="space-y-4">
        <input type="hidden" name="intent" value="save" />
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-3 text-lg font-semibold">Website data JSON</div>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            This JSON controls the content across your projects, language pages,
            framework pages, and their detail sections.
          </p>
          <textarea
            title="writing area"
            name="payload"
            defaultValue={JSON.stringify(siteContent, null, 2)}
            spellCheck={false}
            className="min-h-[36rem] w-full rounded-2xl border border-gray-300 bg-gray-950 p-4 font-mono text-sm text-gray-100 outline-none transition focus:border-blue-500 dark:border-gray-700"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Saving..." : "Save website data"}
        </button>
      </Form>
    </div>
  );
}
