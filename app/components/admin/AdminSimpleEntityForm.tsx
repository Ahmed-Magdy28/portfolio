import { useEffect, useState } from "react";
import { useFetcher, useRevalidator } from "react-router";
import { useTranslation } from "../../i18n/useTranslation";
import type { Framework, Language, Project } from "../../data/types";

type EditableEntity = Language | Framework | Project;

interface AdminSimpleEntityFormProps {
  title: string;
  description: string;
  collection: "languages" | "frameworks" | "projects";
  itemId: string;
  entity: EditableEntity;
}

export const AdminSimpleEntityForm = ({
  title,
  description,
  collection,
  itemId,
  entity,
}: AdminSimpleEntityFormProps) => {
  const { lang } = useTranslation();
  const activeLocale = lang.toUpperCase();
  const fetcher = useFetcher<{ success?: string; error?: string }>();
  const revalidator = useRevalidator();
  const [draft, setDraft] = useState(entity);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setDraft(entity);
  }, [entity]);

  useEffect(() => {
    if (fetcher.data?.success) {
      revalidator.revalidate();
    }
  }, [fetcher.data?.success, revalidator]);

  const updateField = (field: string, value: unknown) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  return (
    <fetcher.Form
      method="post"
      action="/__admin/save"
      className="rounded-2xl border border-sky-300/70 bg-sky-50/70 p-5 dark:border-sky-900 dark:bg-sky-950/20"
    >
      <input type="hidden" name="intent" value="save-entity" />
      <input type="hidden" name="locale" value={lang} />
      <input type="hidden" name="collection" value={collection} />
      <input type="hidden" name="itemId" value={itemId} />
      <input type="hidden" name="payload" value={JSON.stringify(draft)} />

      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-700 dark:text-sky-300">
            Admin Editor
          </div>
          <h3 className="mt-1 text-lg font-semibold">{title}</h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="rounded-full border border-sky-400/70 bg-white/70 px-3 py-1 text-xs font-semibold text-sky-900 dark:border-sky-700 dark:bg-sky-900/40 dark:text-sky-100">
            Editing {activeLocale}
          </div>
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            className="rounded-full bg-sky-200 px-3 py-1 text-md font-medium text-sky-900 transition hover:bg-sky-300 dark:bg-sky-800 dark:text-sky-100 dark:hover:bg-sky-700"
          >
            {open ? "Collapse" : "Edit"}
          </button>
        </div>
      </div>

      {open ? (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            {"icon" in draft ? (
              <label className="block">
                <div className="mb-2 text-sm font-medium">Icon</div>
                <input
                  value={draft.icon}
                  onChange={(event) => updateField("icon", event.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 dark:border-gray-700 dark:bg-gray-800"
                />
              </label>
            ) : null}

            <label className="block">
              <div className="mb-2 text-sm font-medium">Title</div>
              <input
                value={draft.title}
                onChange={(event) => updateField("title", event.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 dark:border-gray-700 dark:bg-gray-800"
              />
            </label>
          </div>

          <label className="mt-4 block">
            <div className="mb-2 text-sm font-medium">Description</div>
            <textarea
              value={draft.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              rows={3}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 dark:border-gray-700 dark:bg-gray-800"
            />
          </label>

          {"aboutDescription" in draft ? (
            <label className="mt-4 block">
              <div className="mb-2 text-sm font-medium">
                About page description
              </div>
              <textarea
                value={draft.aboutDescription ?? ""}
                onChange={(event) =>
                  updateField("aboutDescription", event.target.value)
                }
                rows={5}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 dark:border-gray-700 dark:bg-gray-800"
              />
            </label>
          ) : null}

          {"techStack" in draft ? (
            <>
              <label className="mt-4 block">
                <div className="mb-2 text-sm font-medium">Tech stack</div>
                <input
                  value={draft.techStack.join(", ")}
                  onChange={(event) =>
                    updateField(
                      "techStack",
                      event.target.value
                        .split(",")
                        .map((part) => part.trim())
                        .filter(Boolean),
                    )
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 dark:border-gray-700 dark:bg-gray-800"
                />
              </label>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label className="block">
                  <div className="mb-2 text-sm font-medium">Live URL</div>
                  <input
                    value={draft.liveUrl ?? ""}
                    onChange={(event) =>
                      updateField("liveUrl", event.target.value || undefined)
                    }
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 dark:border-gray-700 dark:bg-gray-800"
                  />
                </label>
                <label className="block">
                  <div className="mb-2 text-sm font-medium">Source URL</div>
                  <input
                    value={draft.sourceUrl ?? ""}
                    onChange={(event) =>
                      updateField("sourceUrl", event.target.value || undefined)
                    }
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 dark:border-gray-700 dark:bg-gray-800"
                  />
                </label>
              </div>

              <label className="mt-4 block">
                <div className="mb-2 text-sm font-medium">Full description</div>
                <textarea
                  value={draft.fullDescription}
                  onChange={(event) =>
                    updateField("fullDescription", event.target.value)
                  }
                  rows={5}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 dark:border-gray-700 dark:bg-gray-800"
                />
              </label>

              <label className="mt-4 block">
                <div className="mb-2 text-sm font-medium">Challenges</div>
                <textarea
                  value={draft.challenges}
                  onChange={(event) =>
                    updateField("challenges", event.target.value)
                  }
                  rows={4}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 dark:border-gray-700 dark:bg-gray-800"
                />
              </label>

              <label className="mt-4 block">
                <div className="mb-2 text-sm font-medium">Video URL</div>
                <input
                  value={draft.video ?? ""}
                  onChange={(event) =>
                    updateField("video", event.target.value || undefined)
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 dark:border-gray-700 dark:bg-gray-800"
                />
              </label>
            </>
          ) : null}

          <button
            type="submit"
            className="mt-4 rounded-xl bg-sky-500 px-4 py-2 text-sm font-medium text-black transition hover:bg-sky-400"
          >
            Save details
          </button>
        </>
      ) : null}
    </fetcher.Form>
  );
};
