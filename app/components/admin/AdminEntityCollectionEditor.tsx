import { useEffect, useState, useCallback, useRef } from "react";
import { Link, useFetcher, useRevalidator } from "react-router";
import { useTranslation } from "../../i18n/useTranslation";
import type { Framework, Language, Project } from "../../data/types";
import { IconValue } from "../IconValue";
import { GripVertical, Plus, Trash2, Edit3, Settings2, Sparkles, Database, Layers } from "lucide-react";
import { toast } from "sonner";
import { AdminCard } from "./ui/AdminCard";
import { AdminButton } from "./ui/AdminButton";
import { cn } from "../ui/utils";

type Entity = Language | Framework | Project;

interface AdminEntityCollectionEditorProps<T extends Entity> {
  title: string;
  description: string;
  items: T[];
  collection: "languages" | "frameworks" | "projects";
  createItem: () => T;
  getId: (item: T) => string;
  getEditPath: (item: T) => string;
}

export const AdminEntityCollectionEditor = <T extends Entity>({
  title,
  description,
  items,
  collection,
  createItem,
  getId,
  getEditPath,
}: AdminEntityCollectionEditorProps<T>) => {
  const { lang } = useTranslation();
  const activeLocale = lang.toUpperCase();
  const fetcher = useFetcher<{ success?: string; error?: string }>();
  const revalidator = useRevalidator();
  const [draftItems, setDraftItems] = useState(items);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setDraftItems(items);
  }, [collection]);

  useEffect(() => {
    if (fetcher.data?.success) {
      toast.success(`${title} updated successfully`);
      revalidator.revalidate();
    } else if (fetcher.data?.error) {
      toast.error(`Failed to update ${title.toLowerCase()}`);
    }
  }, [fetcher.data, revalidator, title]);

  const submitCollection = useCallback((nextItems: T[], instant = false) => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    const performSubmit = () => {
      fetcher.submit(
        {
          intent: "save-collection",
          locale: lang,
          collection,
          payload: JSON.stringify(nextItems),
        },
        { method: "post", action: "/__admin/save" },
      );
    };

    if (instant) {
      performSubmit();
    } else {
      debounceTimeout.current = setTimeout(performSubmit, 1000);
    }
  }, [fetcher, lang, collection]);

  const updateItem = (id: string, field: string, value: unknown) => {
    const nextItems = draftItems.map((item) =>
      getId(item) === id ? ({ ...item, [field]: value } as T) : item
    );
    setDraftItems(nextItems);
    submitCollection(nextItems);
  };

  const deleteItem = (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    const nextItems = draftItems.filter((item) => getId(item) !== id);
    setDraftItems(nextItems);
    submitCollection(nextItems, true);
  };

  const addItem = () => {
    const nextItems = [...draftItems, createItem()];
    setDraftItems(nextItems);
    submitCollection(nextItems, true);
  };

  const reorderItems = (sourceId: string, targetId: string) => {
    if (sourceId === targetId) {
      return;
    }

    setDraftItems((current) => {
      const sourceIndex = current.findIndex((item) => getId(item) === sourceId);
      const targetIndex = current.findIndex((item) => getId(item) === targetId);

      if (sourceIndex === -1 || targetIndex === -1) {
        return current;
      }

      const nextItems = [...current];
      const [movedItem] = nextItems.splice(sourceIndex, 1);
      nextItems.splice(targetIndex, 0, movedItem);
      submitCollection(nextItems);
      return nextItems;
    });
  };

  const resetDragState = () => {
    setDraggedId(null);
    setDragOverId(null);
  };

  const getCollectionIcon = () => {
    switch (collection) {
      case "projects": return <Layers className="w-6 h-6 text-fuchsia-600" />;
      case "languages": return <Database className="w-6 h-6 text-fuchsia-600" />;
      case "frameworks": return <Sparkles className="w-6 h-6 text-fuchsia-600" />;
      default: return <Settings2 className="w-6 h-6 text-fuchsia-600" />;
    }
  };

  return (
    <AdminCard
      title={title}
      description={description}
      icon={getCollectionIcon()}
      className="border-t-4 border-t-fuchsia-600 bg-fuchsia-50/10 dark:bg-fuchsia-950/5"
      headerActions={
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex rounded-full bg-fuchsia-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-fuchsia-700 dark:bg-fuchsia-900/40 dark:text-fuchsia-300">
            {activeLocale} Content
          </div>
          <AdminButton
            type="button"
            onClick={addItem}
            variant="fuchsia"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Item
          </AdminButton>
        </div>
      }
    >
      <div className="space-y-4">
        {draftItems.map((item, index) => {
          const id = getId(item);
          const iconValue = "icon" in item ? item.icon : null;
          
          return (
            <div
              key={id}
              onDragOver={(event) => {
                event.preventDefault();
                if (dragOverId !== id) {
                  setDragOverId(id);
                }
              }}
              onDrop={(event) => {
                event.preventDefault();
                if (draggedId) {
                  reorderItems(draggedId, id);
                }
                resetDragState();
              }}
              onDragLeave={(event) => {
                if (
                  !event.currentTarget.contains(event.relatedTarget as Node)
                ) {
                  setDragOverId((current) => (current === id ? null : current));
                }
              }}
              className={cn(
                "group relative overflow-hidden rounded-[1.75rem] border bg-white p-5 transition-all duration-300 dark:bg-gray-900/40",
                dragOverId === id
                  ? "border-fuchsia-500 ring-4 ring-fuchsia-500/10 scale-[1.01] z-10"
                  : "border-gray-100 dark:border-gray-800 hover:border-fuchsia-200 dark:hover:border-fuchsia-900 hover:shadow-lg hover:shadow-fuchsia-500/5"
              )}
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Visual Preview & Drag Handle */}
                <div className="flex items-start gap-4">
                   <button
                    type="button"
                    draggable
                    onDragStart={(event) => {
                      setDraggedId(id);
                      event.dataTransfer.effectAllowed = "move";
                      event.dataTransfer.setData("text/plain", id);
                    }}
                    onDragEnd={resetDragState}
                    className="mt-3 cursor-grab active:cursor-grabbing text-gray-300 hover:text-fuchsia-500 transition-colors"
                    title="Drag to reorder"
                   >
                     <GripVertical className="w-5 h-5" />
                   </button>

                   {iconValue !== null && (
                      <div className="relative w-14 h-14 shrink-0 flex items-center justify-center rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 shadow-inner group-hover:border-fuchsia-200 dark:group-hover:border-fuchsia-900 transition-colors overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <IconValue
                          value={iconValue}
                          alt="Preview"
                          className="text-2xl relative z-10"
                          imageClassName="h-8 w-8 object-contain"
                        />
                      </div>
                   )}
                </div>

                <div className="flex-1 grid gap-4 md:grid-cols-2">
                  <div className="space-y-4">
                     <label className="block">
                      <div className="mb-1.5 flex justify-between items-center">
                        <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Title</div>
                        <div className="text-[9px] font-black uppercase text-fuchsia-600/50">Entry #{index + 1}</div>
                      </div>
                      <input
                        value={item.title}
                        onChange={(event) =>
                          updateItem(id, "title", event.target.value)
                        }
                        className="w-full rounded-xl border border-gray-100 bg-gray-50/30 px-4 py-2.5 text-sm font-bold dark:border-gray-800 dark:bg-gray-950/30 outline-none focus:border-fuchsia-500 focus:ring-4 focus:ring-fuchsia-500/5 transition-all dark:text-gray-200"
                      />
                    </label>

                    {"icon" in item && (
                      <label className="block">
                        <div className="mb-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400">Visual Asset</div>
                        <input
                          value={item.icon}
                          onChange={(event) =>
                            updateItem(id, "icon", event.target.value)
                          }
                          placeholder="Icon URL or Emoji"
                          className="w-full rounded-xl border border-gray-100 bg-gray-50/30 px-4 py-2.5 text-xs font-mono dark:border-gray-800 dark:bg-gray-950/30 outline-none focus:border-fuchsia-500 transition-all dark:text-gray-400"
                        />
                      </label>
                    )}
                  </div>

                  <div className="space-y-4 flex flex-col">
                    <label className="block flex-1">
                      <div className="mb-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400">Short Summary</div>
                      <textarea
                        value={item.description}
                        onChange={(event) =>
                          updateItem(id, "description", event.target.value)
                        }
                        rows={3}
                        className="w-full h-[calc(100%-1.5rem-0.375rem)] rounded-xl border border-gray-100 bg-gray-50/30 px-4 py-2.5 text-xs dark:border-gray-800 dark:bg-gray-950/30 outline-none focus:border-fuchsia-500 transition-all resize-none dark:text-gray-400 leading-relaxed"
                        placeholder="Brief overview for the card display..."
                      />
                    </label>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-row lg:flex-col gap-2 shrink-0 justify-end lg:justify-start">
                  <Link
                    to={getEditPath(item)}
                    className="flex-1 lg:flex-none rounded-xl border border-gray-100 dark:border-gray-800 p-3 text-gray-400 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-950/20 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 transition-all shadow-sm flex items-center justify-center group/btn"
                    title="Deep Edit"
                  >
                    <Edit3 className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => deleteItem(id)}
                    className="flex-1 lg:flex-none rounded-xl border border-red-50 dark:border-red-900/10 p-3 text-red-200 hover:bg-red-500 hover:text-white transition-all shadow-sm flex items-center justify-center group/btn"
                    title="Remove Item"
                  >
                    <Trash2 className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {draftItems.length === 0 && (
         <div className="py-20 text-center border-2 border-dashed border-fuchsia-100 dark:border-fuchsia-900/30 rounded-[2.5rem] bg-white/50 dark:bg-gray-900/20 animate-in fade-in zoom-in-95">
            <div className="w-20 h-20 bg-fuchsia-50 dark:bg-fuchsia-900/20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-fuchsia-500">
               <Database className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-black tracking-tight">Empty Collection</h4>
            <p className="text-sm text-gray-500 mb-8 max-w-xs mx-auto">This section is currently empty. Add your first item to populate this collection.</p>
            <AdminButton onClick={addItem} variant="fuchsia" leftIcon={<Plus className="w-5 h-5" />}>
              Initialize Collection
            </AdminButton>
         </div>
      )}
    </AdminCard>
  );
};
