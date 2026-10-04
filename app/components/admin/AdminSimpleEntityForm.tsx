import { useEffect, useRef, useState } from "react";
import { useFetcher, useRevalidator } from "../../lib/useFetcherCompat";
import { useTranslation } from "../../i18n/useTranslation";
import type { Framework, Language, Project } from "../../data/types";
import { IconValue } from "../IconValue";
import {
  Save,
  ChevronDown,
  ChevronUp,
  Layout,
  Type,
  Globe,
  Github,
  Video,
  Info,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { AdminCard } from "./ui/AdminCard";
import { AdminButton } from "./ui/AdminButton";
import { AdminImageUpload } from "./AdminImageUpload";
import { cn } from "../ui/utils";
import { toast } from "sonner";
import { useSiteContent } from "../../hooks/useSiteContent";

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
  const { projectCategories = [] } = useSiteContent();
  const activeLocale = lang.toUpperCase();
  const fetcher = useFetcher<{ success?: string; error?: string }>();
  const revalidator = useRevalidator();
  const [draft, setDraft] = useState(entity);
  const [open, setOpen] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const lastSubmissionRef = useRef<string | null>(null);

  useEffect(() => {
    setDraft(entity);
  }, [itemId]);

  useEffect(() => {
    const isIdle = fetcher.state === "idle";
    const data = fetcher.data;

    if (isIdle && data) {
      const dataStr = JSON.stringify(data);
      if (lastSubmissionRef.current !== dataStr) {
        lastSubmissionRef.current = dataStr;
        if (data.success) {
          toast.success(data.success);
          setShowSuccessMessage(true);
          revalidator.revalidate();
          const timer = setTimeout(() => setShowSuccessMessage(false), 5000);
          return () => clearTimeout(timer);
        } else if (data.error) {
          toast.error(data.error);
        }
      }
    }
  }, [fetcher.state, fetcher.data, revalidator]);

  const updateField = (field: string, value: unknown) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const isSubmitting = fetcher.state !== "idle";

  return (
    <AdminCard
      title={title}
      description={description}
      icon={<Sparkles className="w-6 h-6 text-sky-600" />}
      className="border-t-4 border-t-sky-500 bg-sky-50/10 dark:bg-sky-950/5"
      headerActions={
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex rounded-full bg-sky-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">
            {activeLocale} Mode
          </div>
          <AdminButton
            type="button"
            onClick={() => setOpen((current) => !current)}
            variant="outline"
            size="sm"
            rightIcon={
              open ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )
            }
          >
            {open ? "Collapse" : "Edit Metadata"}
          </AdminButton>
        </div>
      }
    >
      <fetcher.Form
        method="post"
        action="/__admin/save"
        className={cn("space-y-8", !open && "hidden")}
      >
        <input type="hidden" name="intent" value="save-entity" />
        <input type="hidden" name="locale" value={lang} />
        <input type="hidden" name="collection" value={collection} />
        <input type="hidden" name="itemId" value={itemId} />
        <input type="hidden" name="payload" value={JSON.stringify(draft)} />

        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <label className="block">
              <div className="flex items-center gap-2 mb-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <Type className="w-3 h-3" /> Identity / Title
              </div>
              <input
                value={draft.title}
                onChange={(event) => updateField("title", event.target.value)}
                className="w-full rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm font-bold dark:border-gray-800 dark:bg-gray-950/50 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/5 transition-all"
              />
            </label>

            {(collection === "projects" || "icon" in draft) && (
              <AdminImageUpload
                label="Identity Icon / SVG"
                value={("icon" in draft ? draft.icon : "") || ""}
                onChange={(url) => updateField("icon", url)}
              />
            )}

            {(collection === "projects" || "image" in draft) && (
              <AdminImageUpload
                label="Showcase Thumbnail"
                value={("image" in draft ? (draft as any).image : "") || ""}
                onChange={(url) => updateField("image", url)}
              />
            )}
          </div>

          <div className="space-y-4">
            <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
              Visual Preview
            </div>
            <div className="relative group overflow-hidden rounded-[2rem] border border-gray-100 bg-gray-50/50 p-8 dark:border-gray-800 dark:bg-gray-950/30 flex flex-col items-center justify-center gap-6 transition-all hover:bg-white dark:hover:bg-gray-950/50 hover:shadow-xl hover:shadow-sky-500/5">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="flex gap-4 items-end">
                <div className="w-20 h-20 flex items-center justify-center rounded-[1.5rem] bg-white dark:bg-gray-900 shadow-2xl shadow-black/5 border border-gray-50 dark:border-gray-800 group-hover:scale-110 transition-transform duration-500">
                  <IconValue
                    value={"icon" in draft ? draft.icon : ""}
                    alt="Preview"
                    className="text-4xl"
                    imageClassName="h-12 w-12 object-contain"
                  />
                </div>
                {"image" in draft && (draft as any).image && (
                  <div className="w-32 h-20 flex items-center justify-center rounded-[1.5rem] bg-white dark:bg-gray-900 shadow-2xl shadow-black/5 border border-gray-50 dark:border-gray-800 overflow-hidden group-hover:scale-105 transition-transform duration-500">
                    <img
                      src={(draft as any).image}
                      alt="Project"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="text-center relative z-10">
                <div className="text-lg font-black tracking-tight mb-1">
                  {draft.title || "Untitled Entity"}
                </div>
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-600/60 dark:text-sky-400/60">
                  Live Snapshot
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <label className="block">
            <div className="flex items-center gap-2 mb-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
              <Layout className="w-3 h-3" /> Card Abstract
            </div>
            <textarea
              value={draft.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              rows={3}
              className="w-full rounded-2xl border border-gray-100 bg-white px-5 py-4 text-sm leading-relaxed dark:border-gray-800 dark:bg-gray-950/50 outline-none focus:border-sky-500 transition-all resize-none dark:text-gray-300"
              placeholder="A short, catchy description for listing pages..."
            />
          </label>

          {"aboutDescription" in draft && (
            <label className="block">
              <div className="flex items-center gap-2 mb-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <Info className="w-3 h-3" /> Detailed Narrative
              </div>
              <textarea
                value={draft.aboutDescription ?? ""}
                onChange={(event) =>
                  updateField("aboutDescription", event.target.value)
                }
                rows={5}
                className="w-full rounded-2xl border border-gray-100 bg-white px-5 py-4 text-sm leading-relaxed dark:border-gray-800 dark:bg-gray-950/50 outline-none focus:border-sky-500 transition-all dark:text-gray-300"
                placeholder="Write the comprehensive story for the detail page..."
              />
            </label>
          )}

          {"techStack" in draft ? (
            <div className="space-y-8 pt-8 border-t border-gray-100 dark:border-gray-800">
              <label className="block">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Infrastructure / Tech Stack
                  </div>
                  <div className="text-[9px] font-bold text-sky-600 uppercase">
                    Comma Separated
                  </div>
                </div>
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
                  className="w-full rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm font-medium dark:border-gray-800 dark:bg-gray-950/50 outline-none focus:border-sky-500 transition-all dark:text-gray-200"
                />
              </label>

              {collection === "projects" && (
                <div className="block">
                  <div className="flex items-center gap-2 mb-3 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Categories Assigment
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {projectCategories.map((category) => {
                      const isSelected =
                        (draft as Project).categoryIds?.includes(category.id) ??
                        false;
                      return (
                        <label
                          key={category.id}
                          className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950/30 hover:border-sky-200 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              const currentIds =
                                (draft as Project).categoryIds || [];
                              const newIds = e.target.checked
                                ? [...currentIds, category.id]
                                : currentIds.filter((id) => id !== category.id);
                              updateField("categoryIds", newIds);
                            }}
                            className="w-4 h-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500 dark:border-gray-700 dark:bg-gray-900"
                          />
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            {lang === "en" ? category.nameEn : category.nameAr}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="grid gap-8 md:grid-cols-2">
                <label className="block">
                  <div className="flex items-center gap-2 mb-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    <Globe className="w-3 h-3" /> Live Production URL
                  </div>
                  <input
                    value={draft.liveUrl ?? ""}
                    onChange={(event) =>
                      updateField("liveUrl", event.target.value || undefined)
                    }
                    className="w-full rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm dark:border-gray-800 dark:bg-gray-950/50 outline-none focus:border-sky-500 transition-all"
                    placeholder="https://..."
                  />
                </label>
                <label className="block">
                  <div className="flex items-center gap-2 mb-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    <Github className="w-3 h-3" /> Source Code / Repository
                  </div>
                  <input
                    value={draft.sourceUrl ?? ""}
                    onChange={(event) =>
                      updateField("sourceUrl", event.target.value || undefined)
                    }
                    className="w-full rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm dark:border-gray-800 dark:bg-gray-950/50 outline-none focus:border-sky-500 transition-all"
                    placeholder="https://github.com/..."
                  />
                </label>
              </div>

              {collection === "projects" && (
                <div className="grid gap-8 md:grid-cols-2 mt-8">
                  <label className="block">
                    <div className="flex items-center gap-2 mb-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Primary Role
                    </div>
                    <input
                      value={(draft as Project).primaryRole ?? ""}
                      onChange={(event) =>
                        updateField(
                          "primaryRole",
                          event.target.value || undefined,
                        )
                      }
                      className="w-full rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm dark:border-gray-800 dark:bg-gray-950/50 outline-none focus:border-sky-500 transition-all font-medium"
                      placeholder="e.g. Engineering Lead"
                    />
                  </label>
                  <label className="block">
                    <div className="flex items-center gap-2 mb-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Core Tech
                    </div>
                    <input
                      value={(draft as Project).coreTech ?? ""}
                      onChange={(event) =>
                        updateField("coreTech", event.target.value || undefined)
                      }
                      className="w-full rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm dark:border-gray-800 dark:bg-gray-950/50 outline-none focus:border-sky-500 transition-all font-medium"
                      placeholder="e.g. JavaScript (ES6+)"
                    />
                  </label>
                  <label className="block">
                    <div className="flex items-center gap-2 mb-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Category
                    </div>
                    <input
                      value={(draft as Project).category ?? ""}
                      onChange={(event) =>
                        updateField("category", event.target.value || undefined)
                      }
                      className="w-full rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm dark:border-gray-800 dark:bg-gray-950/50 outline-none focus:border-sky-500 transition-all font-medium"
                      placeholder="e.g. Full-Stack Solution"
                    />
                  </label>
                  <label className="block">
                    <div className="flex items-center gap-2 mb-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Timeline
                    </div>
                    <input
                      value={(draft as Project).timeline ?? ""}
                      onChange={(event) =>
                        updateField("timeline", event.target.value || undefined)
                      }
                      className="w-full rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm dark:border-gray-800 dark:bg-gray-950/50 outline-none focus:border-sky-500 transition-all font-medium"
                      placeholder="e.g. Q2 2026"
                    />
                  </label>
                </div>
              )}

              <label className="block">
                <div className="flex items-center gap-2 mb-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Full Project Brief (Markdown)
                </div>
                <textarea
                  value={draft.fullDescription}
                  onChange={(event) =>
                    updateField("fullDescription", event.target.value)
                  }
                  rows={6}
                  className="w-full rounded-2xl border border-gray-100 bg-white px-5 py-4 text-sm leading-relaxed dark:border-gray-800 dark:bg-gray-950/50 outline-none focus:border-sky-500 transition-all dark:text-gray-300"
                />
              </label>

              <label className="block">
                <div className="flex items-center gap-2 mb-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Technical Challenges & Solutions
                </div>
                <textarea
                  value={draft.challenges}
                  onChange={(event) =>
                    updateField("challenges", event.target.value)
                  }
                  rows={4}
                  className="w-full rounded-2xl border border-gray-100 bg-white px-5 py-4 text-sm leading-relaxed dark:border-gray-800 dark:bg-gray-950/50 outline-none focus:border-sky-500 transition-all dark:text-gray-300"
                />
              </label>

              <label className="block">
                <div className="flex items-center gap-2 mb-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  <Video className="w-3 h-3" /> Multimedia Showcase (Video URL)
                </div>
                <input
                  value={draft.video ?? ""}
                  onChange={(event) =>
                    updateField("video", event.target.value || undefined)
                  }
                  className="w-full rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm dark:border-gray-800 dark:bg-gray-950/50 outline-none focus:border-sky-500 transition-all"
                  placeholder="YouTube/Vimeo link"
                />
              </label>
            </div>
          ) : null}

          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            {showSuccessMessage && (
              <div className="flex items-center gap-2 text-xs font-bold text-green-600 dark:text-green-400 animate-in fade-in slide-in-from-right-2">
                <CheckCircle2 className="w-4 h-4" />
                Update published successfully
              </div>
            )}
            <AdminButton
              type="submit"
              isLoading={isSubmitting}
              variant="sky"
              size="lg"
              leftIcon={<Save className="w-4 h-4" />}
            >
              Commit Metadata
            </AdminButton>
          </div>
        </div>
      </fetcher.Form>

      {!open && (
        <div className="flex items-center justify-between mt-4 p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-800/20 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
              <IconValue
                value={"icon" in draft ? draft.icon : ""}
                alt="Preview"
                className="text-xl"
                imageClassName="h-6 w-6 object-contain"
              />
            </div>
            <div>
              <div className="text-sm font-bold">
                {draft.title || "Untitled"}
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest opacity-40">
                Static View
              </div>
            </div>
          </div>
          <AdminButton
            variant="ghost"
            size="sm"
            onClick={() => setOpen(true)}
            rightIcon={<ChevronDown className="w-4 h-4" />}
          >
            Expand
          </AdminButton>
        </div>
      )}
    </AdminCard>
  );
};
