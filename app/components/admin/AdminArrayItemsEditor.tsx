import { useEffect, useState } from "react";
import { useFetcher, useRevalidator } from "react-router";
import type { AccordionItem, ContentBlock } from "../../data/types";

interface AdminArrayItemsEditorProps<T> {
  title: string;
  description: string;
  items: AccordionItem[];
  entity: T;
  entityField: "insights" | "interviewQuestions";
  collection: "languages" | "frameworks";
  itemId: string;
}

const createBlockId = () =>
  `block-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const createEmptyItem = (): AccordionItem => ({
  id: `item-${Date.now()}`,
  title: "",
  content: "",
  blocks: [
    {
      id: createBlockId(),
      type: "text",
      text: "",
    },
  ],
});

const createBlock = (type: ContentBlock["type"]): ContentBlock => {
  switch (type) {
    case "text":
      return { id: createBlockId(), type: "text", text: "" };
    case "video":
      return { id: createBlockId(), type: "video", url: "" };
    case "code":
      return {
        id: createBlockId(),
        type: "code",
        code: "",
        language: "javascript",
      };
    case "link":
      return { id: createBlockId(), type: "link", label: "", url: "" };
    case "image":
      return { id: createBlockId(), type: "image", url: "", alt: "" };
    case "hashtags":
      return { id: createBlockId(), type: "hashtags", tags: [] };
    default:
      return { id: createBlockId(), type: "text", text: "" };
  }
};

const reorder = <T,>(items: T[], fromIndex: number, toIndex: number) => {
  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
};

export const AdminArrayItemsEditor = <T extends object>({
  title,
  description,
  items,
  entity,
  entityField,
  collection,
  itemId,
}: AdminArrayItemsEditorProps<T>) => {
  const fetcher = useFetcher<{ success?: string; error?: string }>();
  const revalidator = useRevalidator();
  const [draftItems, setDraftItems] = useState(items);
  const [expandedId, setExpandedId] = useState<string | null>(
    items[0]?.id ?? null,
  );
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);

  useEffect(() => {
    setDraftItems(items);
  }, [items]);

  useEffect(() => {
    if (fetcher.data?.success) {
      revalidator.revalidate();
    }
  }, [fetcher.data?.success, revalidator]);

  const submitItems = (nextItems: AccordionItem[]) => {
    const payload = {
      ...entity,
      [entityField]: nextItems.map((item) => ({
        ...item,
        content:
          item.blocks?.find(
            (block): block is Extract<ContentBlock, { type: "text" }> =>
              block.type === "text" && block.text.trim().length > 0,
          )?.text ?? item.content,
      })),
    };

    fetcher.submit(
      {
        intent: "save-entity",
        collection,
        itemId,
        payload: JSON.stringify(payload),
      },
      { method: "post", action: "/__admin/save" },
    );
  };

  const updateItem = (
    targetId: string,
    updater: (item: AccordionItem) => AccordionItem,
  ) => {
    setDraftItems((current) =>
      current.map((item) => (item.id === targetId ? updater(item) : item)),
    );
  };

  const deleteItem = (targetId: string) => {
    const nextItems = draftItems.filter((item) => item.id !== targetId);
    setDraftItems(nextItems);
    submitItems(nextItems);
    if (expandedId === targetId) {
      setExpandedId(nextItems[0]?.id ?? null);
    }
  };

  const addItem = () => {
    const newItem = createEmptyItem();
    const nextItems = [...draftItems, newItem];
    setDraftItems(nextItems);
    setExpandedId(newItem.id);
    submitItems(nextItems);
  };

  const moveItem = (fromId: string, toId: string) => {
    const fromIndex = draftItems.findIndex((item) => item.id === fromId);
    const toIndex = draftItems.findIndex((item) => item.id === toId);

    if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return;

    const nextItems = reorder(draftItems, fromIndex, toIndex);
    setDraftItems(nextItems);
    submitItems(nextItems);
  };

  const updateBlocks = (targetId: string, nextBlocks: ContentBlock[]) => {
    updateItem(targetId, (current) => ({ ...current, blocks: nextBlocks }));
  };

  const addBlock = (targetId: string, type: ContentBlock["type"]) => {
    updateItem(targetId, (current) => ({
      ...current,
      blocks: [...(current.blocks ?? []), createBlock(type)],
    }));
  };

  const deleteBlock = (targetId: string, blockId: string) => {
    updateItem(targetId, (current) => ({
      ...current,
      blocks: (current.blocks ?? []).filter((block) => block.id !== blockId),
    }));
  };

  const moveBlock = (targetId: string, fromId: string, toId: string) => {
    const target = draftItems.find((item) => item.id === targetId);
    if (!target?.blocks) return;

    const fromIndex = target.blocks.findIndex((block) => block.id === fromId);
    const toIndex = target.blocks.findIndex((block) => block.id === toId);
    if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return;

    updateBlocks(targetId, reorder(target.blocks, fromIndex, toIndex));
  };

  const renderBlockEditor = (item: AccordionItem, block: ContentBlock) => {
    const updateBlock = (updater: (current: ContentBlock) => ContentBlock) => {
      updateBlocks(
        item.id,
        (item.blocks ?? []).map((current) =>
          current.id === block.id ? updater(current) : current,
        ),
      );
    };

    return (
      <div
        key={block.id}
        draggable
        onDragStart={() => setDraggedBlockId(block.id)}
        onDragOver={(event) => event.preventDefault()}
        onDrop={() => {
          if (draggedBlockId) {
            moveBlock(item.id, draggedBlockId, block.id);
            setDraggedBlockId(null);
          }
        }}
        className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/60"
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-500">
            {block.type}
          </div>
          <button
            type="button"
            onClick={() => deleteBlock(item.id, block.id)}
            className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950/40"
          >
            Remove block
          </button>
        </div>

        {block.type === "text" ? (
          <textarea
            title="Text content"
            value={block.text}
            onChange={(event) =>
              updateBlock((current) => ({
                ...current,
                text: event.target.value,
              }))
            }
            rows={4}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 dark:border-gray-700 dark:bg-gray-900"
          />
        ) : null}

        {block.type === "video" ? (
          <input
            value={block.url}
            onChange={(event) =>
              updateBlock((current) => ({
                ...current,
                url: event.target.value,
              }))
            }
            placeholder="https://video-url"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 dark:border-gray-700 dark:bg-gray-900"
          />
        ) : null}

        {block.type === "code" ? (
          <div className="grid gap-4">
            <input
              value={block.language ?? ""}
              onChange={(event) =>
                updateBlock((current) => ({
                  ...current,
                  language: event.target.value || undefined,
                }))
              }
              placeholder="Language"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 dark:border-gray-700 dark:bg-gray-900"
            />
            <textarea
              title="code block content"
              value={block.code}
              onChange={(event) =>
                updateBlock((current) => ({
                  ...current,
                  code: event.target.value,
                }))
              }
              rows={8}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 font-mono text-sm dark:border-gray-700 dark:bg-gray-900"
            />
          </div>
        ) : null}

        {block.type === "link" ? (
          <div className="grid gap-4 md:grid-cols-2">
            <input
              value={block.label}
              onChange={(event) =>
                updateBlock((current) => ({
                  ...current,
                  label: event.target.value,
                }))
              }
              placeholder="Button label"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 dark:border-gray-700 dark:bg-gray-900"
            />
            <input
              value={block.url}
              onChange={(event) =>
                updateBlock((current) => ({
                  ...current,
                  url: event.target.value,
                }))
              }
              placeholder="https://link-url"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 dark:border-gray-700 dark:bg-gray-900"
            />
          </div>
        ) : null}

        {block.type === "image" ? (
          <div className="grid gap-4">
            <input
              value={block.url}
              onChange={(event) =>
                updateBlock((current) => ({
                  ...current,
                  url: event.target.value,
                }))
              }
              placeholder="https://image-url"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 dark:border-gray-700 dark:bg-gray-900"
            />
            <input
              value={block.alt ?? ""}
              onChange={(event) =>
                updateBlock((current) => ({
                  ...current,
                  alt: event.target.value || undefined,
                }))
              }
              placeholder="Image alt text"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 dark:border-gray-700 dark:bg-gray-900"
            />
          </div>
        ) : null}

        {block.type === "hashtags" ? (
          <input
            value={block.tags.join(", ")}
            onChange={(event) =>
              updateBlock((current) => ({
                ...current,
                tags: event.target.value
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter(Boolean),
              }))
            }
            placeholder="#react, #frontend, #career"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 dark:border-gray-700 dark:bg-gray-900"
          />
        ) : null}
      </div>
    );
  };

  return (
    <div className="rounded-2xl border border-emerald-300/70 bg-emerald-50/70 p-5 dark:border-emerald-900 dark:bg-emerald-950/20">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700 dark:text-emerald-300">
            Admin Editor
          </div>
          <h3 className="mt-1 text-lg font-semibold">{title}</h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>
        </div>
        <button
          type="button"
          onClick={addItem}
          className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-black transition hover:bg-emerald-400"
        >
          + Add item
        </button>
      </div>

      <div className="space-y-4">
        {draftItems.map((item, index) => {
          const isOpen = expandedId === item.id;

          return (
            <div
              key={item.id}
              draggable
              onDragStart={() => setDraggedItemId(item.id)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => {
                if (draggedItemId) {
                  moveItem(draggedItemId, item.id);
                  setDraggedItemId(null);
                }
              }}
              className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
            >
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setExpandedId(isOpen ? null : item.id)}
                  className="flex-1 text-left"
                >
                  <div className="text-xs uppercase tracking-[0.25em] text-gray-500">
                    Item {index + 1}
                  </div>
                  <div className="mt-1 text-lg font-semibold">
                    {item.title ||
                      `Untitled ${entityField === "insights" ? "insight" : "question"}`}
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => deleteItem(item.id)}
                  className="rounded-xl border border-red-300 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950/40"
                >
                  Delete
                </button>
              </div>

              {isOpen ? (
                <div className="mt-4 grid gap-4">
                  <label className="block">
                    <div className="mb-2 text-sm font-medium">Title</div>
                    <input
                      value={item.title}
                      onChange={(event) =>
                        updateItem(item.id, (current) => ({
                          ...current,
                          title: event.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 dark:border-gray-700 dark:bg-gray-800"
                    />
                  </label>

                  {entityField === "interviewQuestions" ? (
                    <label className="block">
                      <div className="mb-2 text-sm font-medium">Difficulty</div>
                      <select
                        value={item.difficulty ?? ""}
                        onChange={(event) =>
                          updateItem(item.id, (current) => ({
                            ...current,
                            difficulty: event.target.value
                              ? (event.target
                                  .value as AccordionItem["difficulty"])
                              : undefined,
                          }))
                        }
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 dark:border-gray-700 dark:bg-gray-800"
                      >
                        <option value="">None</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </label>
                  ) : null}

                  <div className="rounded-2xl border border-dashed border-emerald-300 bg-white/80 p-4 dark:border-emerald-800 dark:bg-gray-900">
                    <div className="mb-3 text-sm font-semibold">
                      Content blocks
                    </div>
                    <div className="mb-4 flex flex-wrap gap-2">
                      {(
                        [
                          "text",
                          "video",
                          "code",
                          "link",
                          "image",
                          "hashtags",
                        ] as const
                      ).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => addBlock(item.id, type)}
                          className="rounded-full border border-emerald-300 px-3 py-1.5 text-xs font-medium transition hover:bg-emerald-100 dark:border-emerald-800 dark:hover:bg-emerald-900/40"
                        >
                          + {type}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-3">
                      {(item.blocks ?? []).map((block) =>
                        renderBlockEditor(item, block),
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => submitItems(draftItems)}
                    className="w-fit rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-black transition hover:bg-emerald-400"
                  >
                    Save this item
                  </button>
                </div>
              ) : null}
            </div>
          );
        })}

        {fetcher.data?.error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
            {fetcher.data.error}
          </div>
        ) : null}
      </div>
    </div>
  );
};
