import { useEffect, useId, useRef, useState } from "react";
import { useFetcher, useRevalidator } from "react-router";
import { useTranslation } from "../../i18n/useTranslation";
import { AdminCard } from "../admin/ui/AdminCard";
import { AdminButton } from "../admin/ui/AdminButton";
import { Copy, ClipboardPaste, Save, FileJson, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

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
  const lastSubmissionRef = useRef<string | null>(null);
  const editorId = useId();

  useEffect(() => {
    setValue(payload);
  }, [intent, section, collection, itemId, locale]);

  useEffect(() => {
    const isIdle = fetcher.state === "idle";
    const data = fetcher.data;

    if (isIdle && data) {
      const dataStr = JSON.stringify(data);
      if (lastSubmissionRef.current !== dataStr) {
        lastSubmissionRef.current = dataStr;
        if (data.success) {
          toast.success(data.success);
          revalidator.revalidate();
        } else if (data.error) {
          toast.error(data.error);
        }
      }
    }
  }, [fetcher.state, fetcher.data, revalidator]);

  useEffect(() => {
    if (clipboardNotice) {
      const timer = setTimeout(() => setClipboardNotice(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [clipboardNotice]);

  const copyPayload = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setClipboardNotice("Copied to clipboard");
    } catch {
      setClipboardNotice("Copy failed");
    }
  };

  const pastePayload = async () => {
    try {
      const pastedText = await navigator.clipboard.readText();
      setValue(pastedText);
      setClipboardNotice("Pasted from clipboard");
    } catch {
      setClipboardNotice("Paste failed");
    }
  };

  const isSubmitting = fetcher.state !== "idle";

  return (
    <AdminCard
      title={title}
      description={description}
      icon={<FileJson className="w-6 h-6 text-amber-600" />}
      className="border-t-4 border-t-amber-500 bg-amber-50/20 dark:bg-amber-950/5"
      headerActions={
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex rounded-full bg-amber-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
            {activeLocale} Mode
          </div>
          <AdminButton
            type="submit"
            form={`${editorId}-form`}
            variant="amber"
            size="sm"
            isLoading={isSubmitting}
            leftIcon={<Save className="w-3.5 h-3.5" />}
          >
            Save
          </AdminButton>
        </div>
      }
    >
      <fetcher.Form id={`${editorId}-form`} method="post" action="/__admin/save" className="space-y-6">
        <input type="hidden" name="intent" value={intent} />
        {section ? (
          <input type="hidden" name="section" value={section} />
        ) : null}
        <input type="hidden" name="locale" value={locale ?? lang} />
        {collection ? (
          <input type="hidden" name="collection" value={collection} />
        ) : null}
        {itemId ? <input type="hidden" name="itemId" value={itemId} /> : null}

        <div className="flex items-center justify-between">
           <div className="flex items-center gap-2">
            <AdminButton
              type="button"
              variant="outline"
              size="sm"
              onClick={copyPayload}
              leftIcon={<Copy className="w-3.5 h-3.5" />}
            >
              Copy
            </AdminButton>
            <AdminButton
              type="button"
              variant="outline"
              size="sm"
              onClick={pastePayload}
              leftIcon={<ClipboardPaste className="w-3.5 h-3.5" />}
            >
              Paste
            </AdminButton>
          </div>
          {clipboardNotice && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 animate-in fade-in slide-in-from-right-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {clipboardNotice}
            </div>
          )}
        </div>

        <div className="relative group">
          <div className="absolute top-3 right-4 px-2 py-0.5 bg-gray-900 text-[9px] font-black text-gray-500 uppercase tracking-widest rounded border border-gray-800 z-10 opacity-50 group-hover:opacity-100 transition-opacity">
            JSON Editor
          </div>
          <textarea
            id={editorId}
            name="payload"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            spellCheck={false}
            className="min-h-80 w-full rounded-2xl border border-amber-200 bg-white p-6 font-mono text-xs leading-relaxed text-gray-800 outline-none transition-all focus:border-amber-500 focus:ring-4 focus:ring-amber-500/5 dark:border-amber-900/50 dark:bg-gray-950 dark:text-gray-300"
          />
        </div>

        {fetcher.data?.error && (
          <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50/50 p-4 text-sm font-bold text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-300 animate-in fade-in zoom-in-95">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {fetcher.data.error}
          </div>
        )}

        {fetcher.data?.success && (
          <div className="flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50/50 p-4 text-sm font-bold text-green-700 dark:border-green-900/50 dark:bg-green-950/20 dark:text-green-300 animate-in fade-in zoom-in-95">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            {fetcher.data.success}
          </div>
        )}
      </fetcher.Form>
    </AdminCard>
  );
};
