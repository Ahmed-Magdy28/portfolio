import { useEffect, useState } from "react";
import { useFetcher, useRevalidator } from "react-router";
import type { AccordionItem, ContentBlock, RoadmapStep } from "../../data/types";
import { Trash2, GripVertical, Save, Plus, Type, Video, Code, Link as LinkIcon, Image as ImageIcon, Hash, ChevronDown, ChevronUp, Star, Layers, AlertCircle, CheckCircle2, Linkedin } from "lucide-react";
import { Badge } from "../ui/badge";
import { IconValue } from "../IconValue";
import { useTranslation } from "../../i18n/useTranslation";
import { AdminCard } from "./ui/AdminCard";
import { AdminButton } from "./ui/AdminButton";
import { cn } from "../ui/utils";
import { toast } from "sonner";

interface AdminArrayItemsEditorProps {
  title: string;
  description: string;
  items: Array<AccordionItem | RoadmapStep>;
  entity: any;
  entityField: string;
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

const createEmptyRoadmapStep = (): RoadmapStep => ({
  id: `roadmap-${Date.now()}`,
  title: "",
  description: "",
  status: "planned",
  priority: "medium",
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
      return { id: createBlockId(), type: "image", url: "", alt: "", width: "100%", height: "auto", aspectRatio: "auto" };
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

export const AdminArrayItemsEditor = ({
  title,
  description,
  items = [],
  entity,
  entityField,
  collection,
  itemId,
}: AdminArrayItemsEditorProps) => {
  const { lang } = useTranslation();
  const fetcher = useFetcher<{ success?: string; error?: string }>();
  const revalidator = useRevalidator();
  const isRoadmapEditor = entityField === "roadmap";
  const [draftItems, setDraftItems] =
    useState<Array<AccordionItem | RoadmapStep>>(items);
  const [expandedId, setExpandedId] = useState<string | null>(
    items[0]?.id ?? null,
  );
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);

  useEffect(() => {
    if (items) setDraftItems(items);
  }, [itemId, entityField]);

  useEffect(() => {
    if (fetcher.data?.success) {
      revalidator.revalidate();
    }
  }, [fetcher.data?.success, revalidator]);

  const submitItems = (nextItems: Array<AccordionItem | RoadmapStep>) => {
    const payload = {
      ...entity,
      [entityField]: isRoadmapEditor
        ? nextItems.map((item) => {
            const step = item as RoadmapStep;
            return {
              id: step.id,
              title: step.title,
              description: step.description,
              status: step.status ?? "planned",
              priority: step.priority,
            };
          })
        : (nextItems as AccordionItem[]).map((item) => ({
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
        locale: lang,
        collection,
        itemId,
        payload: JSON.stringify(payload),
      },
      { method: "post", action: "/__admin/save" },
    );
  };

  const updateItem = (
    targetId: string,
    updater: (
      item: AccordionItem | RoadmapStep,
    ) => AccordionItem | RoadmapStep,
  ) => {
    setDraftItems((current) =>
      current.map((item) => (item.id === targetId ? updater(item) : item)),
    );
  };

  const deleteItem = (targetId: string) => {
    if (!confirm("Remove this entry?")) return;
    const nextItems = draftItems.filter((item) => item.id !== targetId);
    setDraftItems(nextItems);
    submitItems(nextItems);
    if (expandedId === targetId) {
      setExpandedId(nextItems[0]?.id ?? null);
    }
  };

  const addItem = () => {
    const newItem = isRoadmapEditor ? createEmptyRoadmapStep() : createEmptyItem();
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
    updateItem(targetId, (current) => ({
      ...(current as AccordionItem),
      blocks: nextBlocks,
    }));
  };

  const addBlock = (targetId: string, type: ContentBlock["type"]) => {
    updateItem(targetId, (current) => ({
      ...(current as AccordionItem),
      blocks: [...(((current as AccordionItem).blocks) ?? []), createBlock(type)],
    }));
  };

  const deleteBlock = (targetId: string, blockId: string) => {
    updateItem(targetId, (current) => ({
      ...(current as AccordionItem),
      blocks: (((current as AccordionItem).blocks) ?? []).filter(
        (block) => block.id !== blockId,
      ),
    }));
  };

  const moveBlock = (targetId: string, fromId: string, toId: string) => {
    const target = draftItems.find((item) => item.id === targetId) as
      | AccordionItem
      | undefined;
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

    const getIcon = () => {
        switch(block.type) {
            case "text": return <Type className="w-3 h-3" />;
            case "video": return <Video className="w-3 h-3" />;
            case "code": return <Code className="w-3 h-3" />;
            case "link": return <LinkIcon className="w-3 h-3" />;
            case "image": return <ImageIcon className="w-3 h-3" />;
            case "hashtags": return <Hash className="w-3 h-3" />;
            default: return null;
        }
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
        className="rounded-[1.5rem] border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950/30 group"
      >
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
             <div className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-emerald-500 transition-colors">
                <GripVertical className="w-4 h-4" />
             </div>
             <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50">
               {getIcon()}
               <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                 {block.type} Block
               </span>
             </div>
          </div>
          <AdminButton
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => deleteBlock(item.id, block.id)}
            className="text-red-300 hover:text-red-500 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </AdminButton>
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
            className="w-full rounded-xl border border-gray-100 bg-gray-50/30 px-4 py-3 text-sm leading-relaxed dark:border-gray-800 dark:bg-gray-900/30 outline-none focus:border-emerald-500 transition-all dark:text-gray-300"
            placeholder="Write your content here..."
          />
        ) : null}

        {block.type === "video" ? (
          <div className="space-y-3">
            <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Video Endpoint (YouTube/Vimeo)</div>
            <input
                value={block.url}
                onChange={(event) =>
                updateBlock((current) => ({
                    ...current,
                    url: event.target.value,
                }))
                }
                placeholder="https://youtube.com/watch?v=..."
                className="w-full rounded-xl border border-gray-100 bg-gray-50/30 px-4 py-3 text-sm font-mono dark:border-gray-800 dark:bg-gray-900/30 outline-none focus:border-emerald-500 transition-all"
            />
          </div>
        ) : null}

        {block.type === "code" ? (
          <div className="grid gap-4">
            <div className="grid md:grid-cols-2 gap-4">
                <label className="block">
                    <div className="mb-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400">Syntax Language</div>
                    <input
                        value={block.language ?? ""}
                        onChange={(event) =>
                            updateBlock((current) => ({
                            ...current,
                            language: event.target.value || undefined,
                            }))
                        }
                        placeholder="e.g. typescript, python, rust"
                        className="w-full rounded-xl border border-gray-100 bg-gray-50/30 px-4 py-2.5 text-xs font-mono dark:border-gray-800 dark:bg-gray-900/30 outline-none focus:border-emerald-500 transition-all"
                    />
                </label>
            </div>
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
              className="w-full rounded-xl border border-gray-100 bg-gray-50/30 px-4 py-4 font-mono text-xs leading-relaxed dark:border-gray-800 dark:bg-gray-900/30 outline-none focus:border-emerald-500 transition-all dark:text-gray-300"
              placeholder="// Insert your code snippets here..."
            />
          </div>
        ) : null}

        {block.type === "link" ? (
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
                <div className="mb-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400">Button Label</div>
                <input
                    value={block.label}
                    onChange={(event) =>
                        updateBlock((current) => ({
                        ...current,
                        label: event.target.value,
                        }))
                    }
                    placeholder="Action Title"
                    className="w-full rounded-xl border border-gray-100 bg-gray-50/30 px-4 py-3 text-sm font-bold dark:border-gray-800 dark:bg-gray-900/30 outline-none focus:border-emerald-500 transition-all"
                />
            </label>
            <label className="block">
                <div className="mb-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400">Destination URL</div>
                <input
                    value={block.url}
                    onChange={(event) =>
                        updateBlock((current) => ({
                        ...current,
                        url: event.target.value,
                        }))
                    }
                    placeholder="https://..."
                    className="w-full rounded-xl border border-gray-100 bg-gray-50/30 px-4 py-3 text-sm dark:border-gray-800 dark:bg-gray-900/30 outline-none focus:border-emerald-500 transition-all"
                />
            </label>
          </div>
        ) : null}

        {block.type === "image" ? (
          <div className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-4">
               <label className="block">
                  <div className="mb-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400">Asset Address (URL)</div>
                  <input
                    value={block.url}
                    onChange={(event) =>
                      updateBlock((current) => ({
                        ...current,
                        url: event.target.value,
                      }))
                    }
                    placeholder="Image URL"
                    className="w-full rounded-xl border border-gray-100 bg-gray-50/30 px-4 py-3 text-xs font-mono dark:border-gray-800 dark:bg-gray-900/30 outline-none focus:border-emerald-500 transition-all"
                  />
               </label>
               <label className="block">
                  <div className="mb-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400">Alt Descriptive Text</div>
                  <input
                    value={block.alt ?? ""}
                    onChange={(event) =>
                      updateBlock((current) => ({
                        ...current,
                        alt: event.target.value || undefined,
                      }))
                    }
                    placeholder="Brief caption..."
                    className="w-full rounded-xl border border-gray-100 bg-gray-50/30 px-4 py-3 text-sm dark:border-gray-800 dark:bg-gray-900/30 outline-none focus:border-emerald-500 transition-all"
                  />
               </label>
            </div>
            <div className="grid grid-cols-3 gap-4">
               <label className="block">
                  <div className="mb-1.5 text-[10px] font-black uppercase opacity-40">Width</div>
                  <input
                    value={block.width ?? "100%"}
                    onChange={(event) => updateBlock((current) => ({ ...current, width: event.target.value }))}
                    className="w-full rounded-xl border border-gray-100 bg-gray-50/30 px-3 py-2 text-xs font-bold dark:border-gray-800 dark:bg-gray-900/30 outline-none focus:border-emerald-500 transition-all"
                  />
               </label>
               <label className="block">
                  <div className="mb-1.5 text-[10px] font-black uppercase opacity-40">Height</div>
                  <input
                    value={block.height ?? "auto"}
                    onChange={(event) => updateBlock((current) => ({ ...current, height: event.target.value }))}
                    className="w-full rounded-xl border border-gray-100 bg-gray-50/30 px-3 py-2 text-xs font-bold dark:border-gray-800 dark:bg-gray-900/30 outline-none focus:border-emerald-500 transition-all"
                  />
               </label>
               <label className="block">
                  <div className="mb-1.5 text-[10px] font-black uppercase opacity-40">Aspect Ratio</div>
                  <select
                    value={block.aspectRatio ?? "auto"}
                    onChange={(event) => updateBlock((current) => ({ ...current, aspectRatio: event.target.value as any }))}
                    className="w-full rounded-xl border border-gray-100 bg-gray-50/30 px-3 py-2 text-xs font-bold dark:border-gray-800 dark:bg-gray-900/30 outline-none focus:border-emerald-500 transition-all"
                  >
                     <option value="auto">Default (Auto)</option>
                     <option value="square">1:1 (Square)</option>
                     <option value="video">16:9 (Video)</option>
                     <option value="wide">21:9 (Ultrawide)</option>
                  </select>
               </label>
            </div>
            {block.url && (
               <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-900/50 flex justify-center p-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
                  <IconValue value={block.url} alt="Preview" imageClassName="max-h-48 object-contain rounded-lg shadow-lg relative z-10" />
               </div>
            )}
          </div>
        ) : null}

        {block.type === "hashtags" ? (
          <div className="space-y-3">
             <div className="flex justify-between items-center">
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Semantic Tags</div>
                <div className="text-[9px] font-bold text-emerald-600 uppercase">Auto-formatted with #</div>
             </div>
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
                placeholder="react, web-dev, opensource"
                className="w-full rounded-xl border border-gray-100 bg-gray-50/30 px-4 py-3 text-sm font-medium dark:border-gray-800 dark:bg-gray-900/30 outline-none focus:border-emerald-500 transition-all"
            />
          </div>
        ) : null}
      </div>
    );
  };

  const isSubmitting = fetcher.state !== "idle";

  return (
    <AdminCard
      title={title}
      description={description}
      icon={<Star className="w-6 h-6 text-emerald-600" />}
      className="border-t-4 border-t-emerald-500 bg-emerald-50/10 dark:bg-emerald-950/5"
      headerActions={
        <AdminButton
          type="button"
          onClick={addItem}
          variant="emerald"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
        >
          New Entry
        </AdminButton>
      }
    >
      <div className="space-y-6">
        {draftItems.map((item, index) => {
          const isOpen = expandedId === item.id;
          const accordionItem = item as AccordionItem;
          const roadmapStep = item as RoadmapStep;

          return (
            <div
              key={item.id}
              className={cn(
                "group relative overflow-hidden rounded-[2rem] border bg-white transition-all duration-300 dark:bg-gray-900/40",
                isOpen 
                  ? "border-emerald-500 ring-4 ring-emerald-500/5 scale-[1.01] z-10" 
                  : "border-gray-100 dark:border-gray-800 hover:border-emerald-200 dark:hover:border-emerald-900 hover:shadow-lg"
              )}
            >
              <div 
                className={cn(
                    "flex items-center justify-between p-6 cursor-pointer select-none",
                    isOpen && "border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/30"
                )}
                onClick={() => setExpandedId(isOpen ? null : item.id)}
              >
                <div className="flex items-center gap-6 flex-1">
                   <button
                    type="button"
                    draggable
                    onDragStart={(e) => {
                       e.stopPropagation();
                       setDraggedItemId(item.id);
                    }}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(e) => {
                       e.stopPropagation();
                       if (draggedItemId) {
                         moveItem(draggedItemId, item.id);
                         setDraggedItemId(null);
                       }
                    }}
                    className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-emerald-500 transition-colors"
                   >
                     <GripVertical className="w-5 h-5" />
                   </button>
                   <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Position #{index + 1}</span>
                        {!isRoadmapEditor && accordionItem.difficulty && (
                            <Badge variant="outline" className="px-1.5 py-0 text-[8px] font-black uppercase tracking-widest border-emerald-500/20 text-emerald-600 bg-emerald-50/50">
                                {accordionItem.difficulty}
                            </Badge>
                        )}
                      </div>
                      <div className="font-black text-xl tracking-tight dark:text-gray-100">
                        {item.title || `Untitled ${entityField === "insights" ? "Insight" : "Question"}`}
                      </div>
                   </div>
                </div>
                
                <div className="flex items-center gap-3">
                   <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-400 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/30 group-hover:text-emerald-500 transition-colors">
                      {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                   </div>
                   <AdminButton
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                       e.stopPropagation();
                       deleteItem(item.id);
                    }}
                    className="text-red-200 hover:text-red-500 hover:bg-red-50"
                   >
                    <Trash2 className="w-4 h-4" />
                   </AdminButton>
                </div>
              </div>

              {isOpen && (
                <div className="p-8 space-y-10 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="grid gap-8 md:grid-cols-2">
                    <label className="block">
                      <div className="mb-2 text-[10px] font-black uppercase tracking-widest text-gray-400">Primary Headline</div>
                      <input
                        value={item.title}
                        onChange={(event) =>
                          updateItem(item.id, (current) => ({
                            ...current,
                            title: event.target.value,
                          }))
                        }
                        className="w-full rounded-xl border border-gray-100 bg-gray-50/30 px-4 py-3 text-sm font-bold dark:border-gray-800 dark:bg-gray-900/30 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all dark:text-gray-100"
                        placeholder="Enter entry title..."
                      />
                    </label>

                    {entityField === "interviewQuestions" && (
                      <label className="block">
                        <div className="mb-2 text-[10px] font-black uppercase tracking-widest text-gray-400">Skill Level Assessment</div>
                        <select
                          value={accordionItem.difficulty ?? ""}
                          onChange={(event) =>
                            updateItem(item.id, (current) => ({
                              ...current,
                              difficulty: event.target.value
                                ? (event.target
                                    .value as AccordionItem["difficulty"])
                                : undefined,
                            }))
                          }
                          className="w-full rounded-xl border border-gray-100 bg-gray-50/30 px-4 py-3 text-sm font-bold dark:border-gray-800 dark:bg-gray-900/30 outline-none focus:border-emerald-500 transition-all dark:text-gray-200"
                        >
                          <option value="">No Classification</option>
                          <option value="easy">Beginner / Easy</option>
                          <option value="medium">Intermediate / Medium</option>
                          <option value="hard">Advanced / Hard</option>
                        </select>
                      </label>
                    )}

                    {isRoadmapEditor && (
                      <>
                        <label className="block">
                          <div className="mb-2 text-[10px] font-black uppercase tracking-widest text-gray-400">Current Lifecycle Status</div>
                          <select
                            value={roadmapStep.status ?? "planned"}
                            onChange={(event) =>
                              updateItem(item.id, (current) => ({
                                ...(current as RoadmapStep),
                                status: event.target
                                  .value as RoadmapStep["status"],
                              }))
                            }
                            className="w-full rounded-xl border border-gray-100 bg-gray-50/30 px-4 py-3 text-sm font-bold dark:border-gray-800 dark:bg-gray-900/30 outline-none focus:border-emerald-500 transition-all dark:text-gray-200"
                          >
                            <option value="planned">⚪ Planned</option>
                            <option value="in-progress">🔵 In Progress</option>
                            <option value="completed">🟢 Completed</option>
                          </select>
                        </label>

                        <label className="block">
                          <div className="mb-2 text-[10px] font-black uppercase tracking-widest text-gray-400">Strategic Priority</div>
                          <select
                            value={roadmapStep.priority ?? ""}
                            onChange={(event) =>
                              updateItem(item.id, (current) => ({
                                ...(current as RoadmapStep),
                                priority: event.target.value
                                  ? (event.target
                                      .value as RoadmapStep["priority"])
                                  : undefined,
                              }))
                            }
                            className="w-full rounded-xl border border-gray-100 bg-gray-50/30 px-4 py-3 text-sm font-bold dark:border-gray-800 dark:bg-gray-900/30 outline-none focus:border-emerald-500 transition-all dark:text-gray-200"
                          >
                            <option value="">Unprioritized</option>
                            <option value="low">Low Priority</option>
                            <option value="medium">Medium Priority</option>
                            <option value="high">High Priority</option>
                          </select>
                        </label>
                      </>
                    )}
                  </div>

                  {isRoadmapEditor ? (
                    <label className="block">
                      <div className="mb-2 text-[10px] font-black uppercase tracking-widest text-gray-400">Strategic Brief / Description</div>
                      <textarea
                        value={roadmapStep.description}
                        onChange={(event) =>
                          updateItem(item.id, (current) => ({
                            ...(current as RoadmapStep),
                            description: event.target.value,
                          }))
                        }
                        rows={4}
                        className="w-full rounded-2xl border border-gray-100 bg-gray-50/30 px-5 py-4 text-sm leading-relaxed dark:border-gray-800 dark:bg-gray-900/30 outline-none focus:border-emerald-500 transition-all dark:text-gray-300"
                        placeholder="Detailed objectives and milestones..."
                      />
                    </label>
                  ) : (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                       <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Composite Content Blocks</div>
                       <div className="flex flex-wrap gap-2">
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
                            className="rounded-full border border-gray-100 bg-white px-3 py-1 text-[10px] font-black text-gray-500 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all shadow-sm flex items-center gap-1.5 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-emerald-950/20"
                          >
                            <Plus className="w-3 h-3" /> {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6 pt-6 border-t border-gray-50 dark:border-gray-800">
                      {(accordionItem.blocks ?? []).map((block) =>
                        renderBlockEditor(accordionItem, block),
                      )}
                      
                      {(accordionItem.blocks ?? []).length === 0 && (
                          <div className="py-12 text-center border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-3xl">
                              <Layers className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">No Content Blocks</div>
                          </div>
                      )}
                    </div>
                  </div>
                  )}

                  <div className="flex justify-between items-center pt-8 border-t border-gray-50 dark:border-gray-800">
                     <div>
                       {(entityField === "insights" || entityField === "interviewQuestions") && (
                         <AdminButton
                           type="button"
                           variant="outline"
                           size="md"
                           className="border-gray-200 dark:border-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-700 dark:text-gray-300 transition-colors"
                           leftIcon={<Linkedin className="w-4 h-4 text-[#0A66C2]" />}
                           onClick={() => {
                             const title = item.title || 'Untitled';
                             const diff = accordionItem.difficulty ? `Difficulty: ${accordionItem.difficulty.charAt(0).toUpperCase() + accordionItem.difficulty.slice(1)}\n` : '';
                             const content = (accordionItem.blocks || []).map(block => {
                               if (block.type === 'text') return block.text;
                               if (block.type === 'code') return `\n\`\`\`${block.language || ''}\n${block.code}\n\`\`\`\n`;
                               if (block.type === 'hashtags') return block.tags.map(t => `#${t}`).join(' ');
                               if (block.type === 'link') return `🔗 ${block.label}: ${block.url}`;
                               return '';
                             }).filter(Boolean).join('\n\n');
                             
                             const tagSuffix = entityField === "insights" ? "#TechInsights #SoftwareEngineering #WebDevelopment" : "#InterviewPrep #SoftwareEngineering #TechCareer";
                             const prefix = entityField === "insights" ? "💡" : "🧠";
                             
                             const text = `${prefix} ${title}\n\n${diff}${content}\n\n${tagSuffix}`;
                             
                             navigator.clipboard.writeText(text).then(() => {
                               toast.success("Copied to clipboard!", {
                                 description: "Ready to be pasted as a LinkedIn post.",
                                 icon: <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                               });
                             }).catch(() => {
                               toast.error("Failed to copy to clipboard.");
                             });
                           }}
                         >
                           Share on LinkedIn
                         </AdminButton>
                       )}
                     </div>
                     <AdminButton
                        type="button"
                        onClick={() => submitItems(draftItems)}
                        isLoading={isSubmitting}
                        variant="emerald"
                        size="md"
                        leftIcon={<Save className="w-4 h-4" />}
                      >
                        Finalize Entry
                      </AdminButton>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {draftItems.length === 0 && (
           <div className="py-24 text-center border-2 border-dashed border-emerald-100 dark:border-emerald-900/20 rounded-[3rem] bg-white/50 dark:bg-gray-900/20 animate-in fade-in zoom-in-95">
              <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-950/20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-emerald-500">
                <Plus className="w-12 h-12" />
              </div>
              <h4 className="font-black text-2xl tracking-tight mb-2">Empty Stream</h4>
              <p className="text-sm text-gray-500 mb-10 max-w-xs mx-auto">This collection is currently empty. Initialize it by adding your first content entry.</p>
              <AdminButton onClick={addItem} variant="emerald" size="lg" leftIcon={<Plus className="w-5 h-5" />}>
                Create First Entry
              </AdminButton>
           </div>
        )}
      </div>

      {fetcher.data?.error && (
        <div className="mt-6 p-4 rounded-2xl bg-red-50 text-red-700 border border-red-100 text-sm font-bold flex items-center gap-3 animate-in shake-1">
           <AlertCircle className="w-5 h-5" />
           {fetcher.data.error}
        </div>
      )}

      {fetcher.data?.success && (
        <div className="mt-6 p-4 rounded-2xl bg-green-50 text-green-700 border border-green-100 text-sm font-bold flex items-center gap-3 animate-in fade-in zoom-in-95">
           <CheckCircle2 className="w-5 h-5" />
           {fetcher.data.success}
        </div>
      )}
    </AdminCard>
  );
};
