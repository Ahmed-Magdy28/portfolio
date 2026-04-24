import { useEffect, useId, useState } from "react";
import { useFetcher, useRevalidator } from "react-router";
import { useTranslation } from "../../i18n/useTranslation";

interface PageAdminEditorProps {
  title: string;
  description: string;
  payload: string;
  intent: string;
  section?: string;
  locale?: "en" | "ar";
  collection?: string;
  itemId?: string;
}

type SaveResult = {
  error?: string;
  success?: string;
};

export const PageAdminEditor = ({
  title,
  description,
  payload,
  intent,
  section,
  locale,
  collection,
  itemId,
}: PageAdminEditorProps) => {
  const { lang } = useTranslation();
  const activeLocale = (locale ?? lang).toUpperCase();
  const fetcher = useFetcher<SaveResult>();
  const revalidator = useRevalidator();
  const [value, setValue] = useState(payload);
  const [clipboardNotice, setClipboardNotice] = useState<string | null>(null);
  const editorId = useId();

  useEffect(() => {
    setValue(payload);
  }, [payload]);

  useEffect(() => {
    if (fetcher.data?.success) {
      revalidator.revalidate();
    }
  }, [fetcher.data?.success, revalidator]);

  const copyPayload = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setClipboardNotice("Copied JSON payload.");
    } catch {
      setClipboardNotice("Copy failed. Clipboard permissions may be blocked.");
    }
  };

  const pastePayload = async () => {
    try {
      const pastedText = await navigator.clipboard.readText();
      setValue(pastedText);
      setClipboardNotice("Pasted JSON payload.");
    } catch {
      setClipboardNotice("Paste failed. Clipboard permissions may be blocked.");
    }
  };

  return (
    <details className="rounded-2xl border border-amber-300/70 bg-amber-50/80 shadow-sm open:shadow-md dark:border-amber-800 dark:bg-amber-950/20">
      <summary className="cursor-pointer list-none px-5 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700 dark:text-amber-300">
              Admin Editor
            </div>
            <h3 className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded-full border border-amber-400/70 bg-white/70 px-3 py-1 text-xs font-semibold text-amber-900 dark:border-amber-700 dark:bg-amber-900/40 dark:text-amber-100">
              Editing {activeLocale}
            </div>
            <div className="rounded-full bg-amber-200 px-3 py-1 text-xs font-medium text-amber-900 dark:bg-amber-800 dark:text-amber-100">
              Inline Save
            </div>
          </div>
        </div>
      </summary>

      <div className="border-t border-amber-200 px-5 py-5 dark:border-amber-900">
        <fetcher.Form
          method="post"
          action="/__admin/save"
          className="space-y-4"
        >
          <input type="hidden" name="intent" value={intent} />
          {section ? (
            <input type="hidden" name="section" value={section} />
          ) : null}
          <input type="hidden" name="locale" value={locale ?? lang} />
          {collection ? (
            <input type="hidden" name="collection" value={collection} />
          ) : null}
          {itemId ? <input type="hidden" name="itemId" value={itemId} /> : null}

          <label
            htmlFor={editorId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            JSON payload
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={copyPayload}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              Copy JSON
            </button>
            <button
              type="button"
              onClick={pastePayload}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              Paste JSON
            </button>
            {clipboardNotice ? (
              <span className="text-xs text-gray-600 dark:text-gray-300">
                {clipboardNotice}
              </span>
            ) : null}
          </div>
          <textarea
            id={editorId}
            name="payload"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            spellCheck={false}
            className="min-h-80 w-full rounded-2xl border border-gray-300 bg-gray-950 p-4 font-mono text-sm text-gray-100 outline-none transition focus:border-blue-500 dark:border-gray-700"
          />

          {fetcher.data?.error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
              {fetcher.data.error}
            </div>
          ) : null}

          {fetcher.data?.success ? (
            <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300">
              {fetcher.data.success}
            </div>
          ) : null}

          <button
            type="submit"
            className="rounded-xl bg-amber-500 px-4 py-2 font-medium text-black transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={fetcher.state !== "idle"}
          >
            {fetcher.state === "submitting" ? "Saving..." : "Save changes"}
          </button>
        </fetcher.Form>
      </div>
    </details>
  );
};
