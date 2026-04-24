import { useEffect, useState } from "react";
import { Link, useFetcher, useRevalidator } from "react-router";
import { useTranslation } from "../../i18n/useTranslation";
import type { Framework, Language, Project } from "../../data/types";

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

  useEffect(() => {
    setDraftItems(items);
  }, [items]);

  useEffect(() => {
    if (fetcher.data?.success) {
      revalidator.revalidate();
    }
  }, [fetcher.data?.success, revalidator]);

  const submitCollection = (nextItems: T[]) => {
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

  const updateItem = (id: string, field: string, value: unknown) => {
    setDraftItems((current) =>
      current.map((item) =>
        getId(item) === id ? ({ ...item, [field]: value } as T) : item,
      ),
    );
  };

  const deleteItem = (id: string) => {
    const nextItems = draftItems.filter((item) => getId(item) !== id);
    setDraftItems(nextItems);
    submitCollection(nextItems);
  };

  const addItem = () => {
    const nextItems = [...draftItems, createItem()];
    setDraftItems(nextItems);
    submitCollection(nextItems);
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

  return (
    <div className="rounded-2xl border border-fuchsia-300/70 bg-fuchsia-50/70 p-5 dark:border-fuchsia-900 dark:bg-fuchsia-950/20">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.3em] text-fuchsia-700 dark:text-fuchsia-300">
            Admin Editor
          </div>
          <h3 className="mt-1 text-lg font-semibold">{title}</h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Drag items by the handle to reorder.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="rounded-full border border-fuchsia-400/70 bg-white/70 px-3 py-1 text-xs font-semibold text-fuchsia-900 dark:border-fuchsia-700 dark:bg-fuchsia-900/40 dark:text-fuchsia-100">
            Editing {activeLocale}
          </div>
          <button
            type="button"
            onClick={addItem}
            className="rounded-xl bg-fuchsia-500 px-4 py-2 text-sm font-medium text-black transition hover:bg-fuchsia-400"
          >
            + Add item
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {draftItems.map((item) => {
          const id = getId(item);
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
              className={`rounded-2xl border bg-white p-4 dark:bg-gray-900 ${
                dragOverId === id
                  ? "border-fuchsia-400 ring-2 ring-fuchsia-300/60 dark:border-fuchsia-700 dark:ring-fuchsia-900/60"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              <div className="grid gap-4 lg:grid-cols-[1fr_1fr_auto]">
                {"icon" in item ? (
                  <label className="block">
                    <div className="mb-2 text-sm font-medium">Icon</div>
                    <input
                      value={item.icon}
                      onChange={(event) =>
                        updateItem(id, "icon", event.target.value)
                      }
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 dark:border-gray-700 dark:bg-gray-800"
                    />
                  </label>
                ) : null}

                <label className="block">
                  <div className="mb-2 text-sm font-medium">Title</div>
                  <input
                    value={item.title}
                    onChange={(event) =>
                      updateItem(id, "title", event.target.value)
                    }
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 dark:border-gray-700 dark:bg-gray-800"
                  />
                </label>

                <div className="flex items-end gap-2">
                  <button
                    type="button"
                    draggable
                    onDragStart={(event) => {
                      setDraggedId(id);
                      event.dataTransfer.effectAllowed = "move";
                      event.dataTransfer.setData("text/plain", id);
                    }}
                    onDragEnd={resetDragState}
                    className="rounded-xl border border-gray-300 px-3 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                    title="Drag to reorder"
                    aria-label="Drag to reorder"
                  >
                    Drag
                  </button>
                  <button
                    type="button"
                    onClick={() => submitCollection(draftItems)}
                    className="rounded-xl bg-fuchsia-500 px-4 py-3 text-sm font-medium text-black transition hover:bg-fuchsia-400"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteItem(id)}
                    className="rounded-xl border border-red-300 px-4 py-3 text-sm font-medium text-red-700 transition hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950/40"
                  >
                    Delete
                  </button>
                  <Link
                    to={getEditPath(item)}
                    className="rounded-xl border border-gray-300 px-4 py-3 text-sm font-medium transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                  >
                    Open
                  </Link>
                </div>
              </div>

              <label className="mt-4 block">
                <div className="mb-2 text-sm font-medium">Description</div>
                <textarea
                  value={item.description}
                  onChange={(event) =>
                    updateItem(id, "description", event.target.value)
                  }
                  rows={3}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 dark:border-gray-700 dark:bg-gray-800"
                />
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};
