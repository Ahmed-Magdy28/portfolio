import { useState } from "react";
import { useFetcher } from "../../lib/useFetcherCompat";
import { motion } from "motion/react";
import { CheckCircle2, Circle, Clock, Compass, ExternalLink, Flag, Globe, Layers } from "lucide-react";
import { AdminArrayItemsEditor } from "../admin/AdminArrayItemsEditor";
import { Badge } from "../ui/badge";
import { useAdminSession } from "../../hooks/useAdminSession";
import { useTranslation } from "../../i18n/useTranslation";
import type { RoadmapStep } from "../../data/types";
import type { TechEntity, TechPageCopy } from "./types";

const getStatusIcon = (status: RoadmapStep["status"] = "planned") => {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="w-6 h-6 text-emerald-500" />;
    case "in-progress":
      return <Clock className="w-6 h-6 text-blue-500 animate-pulse" />;
    case "planned":
      return <Circle className="w-6 h-6 text-gray-300" />;
  }
};

const getPriorityColor = (priority?: string) => {
  switch (priority) {
    case "high":
      return "text-red-600 bg-red-50 dark:bg-red-950/30";
    case "medium":
      return "text-amber-600 bg-amber-50 dark:bg-amber-950/30";
    case "low":
      return "text-blue-600 bg-blue-50 dark:bg-blue-950/30";
    default:
      return "text-gray-600 bg-gray-50";
  }
};

interface TechRoadmapPageProps {
  copy: TechPageCopy;
  data: TechEntity;
}

export const TechRoadmapPage = ({ copy, data }: TechRoadmapPageProps) => {
  const { lang } = useTranslation();
  const { isAdminAuthenticated } = useAdminSession();
  const fetcher = useFetcher();
  const roadmap = data.roadmap || [];
  const roadmapUrl = data.roadmapUrl;
  const [viewMode, setViewMode] = useState<"all" | "curated" | "website">("all");
  const isAr = lang === "ar";

  const deleteRoadmapUrl = () => {
    fetcher.submit(
      {
        intent: "save-entity-field",
        locale: lang,
        collection: copy.collection,
        itemId: data.slug,
        field: "roadmapUrl",
        value: "",
      },
      { method: "post", action: "/__admin/save" },
    );
  };

  const showWebsite = Boolean(roadmapUrl) && (viewMode === "all" || viewMode === "website");
  const showCurated = viewMode === "all" || viewMode === "curated";

  return (
    <div className="space-y-12">
      {/* Roadmap Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-2 rounded-2xl bg-gray-100/80 dark:bg-gray-900/70 border border-gray-200/70 dark:border-gray-800">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode("all")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              viewMode === "all"
                ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            {isAr ? "كل خرائط الطريق (2)" : "All Roadmaps (2)"}
          </button>
          <button
            type="button"
            onClick={() => setViewMode("curated")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              viewMode === "curated"
                ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            {isAr ? `خارطة ${data.title}` : `${data.title} Skill Roadmap`}
          </button>
          {roadmapUrl && (
            <button
              type="button"
              onClick={() => setViewMode("website")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === "website"
                  ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              {isAr ? "خارطة الموقع (roadmap.sh)" : "Website Roadmap (roadmap.sh)"}
            </button>
          )}
        </div>

        {roadmapUrl && (
          <a
            href={roadmapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-500 transition-colors shadow-sm"
          >
            {isAr ? "فتح على roadmap.sh" : "View on roadmap.sh"}
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {/* 1. Website Roadmap (roadmap.sh) */}
      {showWebsite && roadmapUrl && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600" />
                {isAr ? "1. خارطة الموقع الرسمية (roadmap.sh)" : "1. Official Website Roadmap (roadmap.sh)"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {isAr
                  ? "خارطة الطريق التفاعلية المجتمعية من موقع roadmap.sh — يمكنك تصفحها هنا أو فتحها في نافذة مستقلة."
                  : "Interactive community roadmap from roadmap.sh — preview below or open directly in a new tab."}
              </p>
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl">
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex flex-wrap justify-between items-center gap-3 bg-gray-50/50 dark:bg-gray-800/50">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="ml-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  roadmap.sh Viewer
                </span>
              </div>
              <a
                href={roadmapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                {isAr ? "فتح في نافذة جديدة" : "Open in new tab"} <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <iframe
              src={roadmapUrl}
              title={`${data.title} Roadmap`}
              className="w-full h-[700px] border-none bg-white"
              loading="lazy"
            />
            <div className="px-4 py-3 text-xs text-muted-foreground bg-gray-50/80 dark:bg-gray-800/40 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-2">
              <span>
                {isAr
                  ? "إذا لم يظهر الإطار بسبب قيود المتصفح على التضمين، اضغط على زر الفتح في نافذة جديدة."
                  : "If the embedded frame is blocked by browser framing policies, use the Open in new tab button."}
              </span>
              <a
                href={roadmapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
              >
                {roadmapUrl} <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </motion.div>
      )}

      {/* 2. Curated Technology Roadmap */}
      {showCurated && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-600" />
              {isAr ? `2. خارطة تعلم وإتقان ${data.title}` : `2. Curated ${data.title} Skill Roadmap`}
            </h2>
            <p className="text-sm text-muted-foreground">
              {isAr
                ? `مسار عملي متدرج لإتقان ${data.title} من الأساسيات حتى مستوى الإنتاج والأنظمة المتقدمة.`
                : `Structured step-by-step mastery path for ${data.title}, progressing from core fundamentals to production architecture.`}
            </p>
          </div>

          <div className="relative pl-8 rtl:pl-0 rtl:pr-8 space-y-12">
            <div className="absolute left-3 rtl:left-auto rtl:right-3 top-2 bottom-2 w-0.5 bg-gray-100 dark:bg-gray-800" />

            {roadmap.length > 0 ? roadmap.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                className="relative"
              >
                <div className="absolute -left-8 rtl:-left-auto rtl:-right-8 top-1 flex items-center justify-center w-6.5 h-6.5 bg-white dark:bg-gray-900 rounded-full z-10">
                  {getStatusIcon(step.status ?? "planned")}
                </div>

                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">
                      {isAr ? `المرحلة ${index + 1}` : `Step ${String(index + 1).padStart(2, "0")}`}
                    </span>
                    <h3 className="text-xl font-bold">{step.title}</h3>
                    {step.priority && (
                      <Badge variant="outline" className={`uppercase text-[9px] font-black tracking-tighter border-none ${getPriorityColor(step.priority)}`}>
                        {step.priority} Priority
                      </Badge>
                    )}
                    <Badge variant="secondary" className="uppercase text-[9px] font-black tracking-tighter opacity-70">
                      {(step.status ?? "planned").replace("-", " ")}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground leading-relaxed max-w-2xl">{step.description}</p>
                </div>
              </motion.div>
            )) : !roadmapUrl && (
              <div className="py-20 text-center bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
                <Flag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-bold">No roadmap entries yet</h4>
                <p className="text-sm text-muted-foreground">{copy.emptyRoadmapDescription}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {isAdminAuthenticated && (
        <div className="pt-16 border-t border-gray-100 dark:border-gray-800 space-y-12">
          <fetcher.Form
            method="post"
            action="/__admin/save"
            className="p-8 rounded-3xl border border-blue-200 bg-blue-50/30 dark:border-blue-900/30 dark:bg-blue-950/10"
          >
            <input type="hidden" name="intent" value="save-entity-field" />
            <input type="hidden" name="locale" value={lang} />
            <input type="hidden" name="collection" value={copy.collection} />
            <input type="hidden" name="itemId" value={data.slug} />
            <input type="hidden" name="field" value="roadmapUrl" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                <h3 className="text-lg font-bold">External Roadmap URL</h3>
                <p className="text-sm text-muted-foreground">{copy.roadmapUrlHelp}</p>
              </div>
              <div className="flex flex-1 max-w-xl flex-wrap gap-2">
                <input
                  name="value"
                  defaultValue={roadmapUrl || ""}
                  placeholder="https://roadmap.sh/..."
                  className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-50"
                  disabled={fetcher.state !== "idle"}
                >
                  {fetcher.state === "submitting" ? "Saving..." : "Save URL"}
                </button>
                {roadmapUrl && (
                  <button
                    type="button"
                    onClick={deleteRoadmapUrl}
                    className="px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-500 transition-colors shadow-lg shadow-red-500/20 disabled:opacity-50"
                    disabled={fetcher.state !== "idle"}
                  >
                    Delete URL
                  </button>
                )}
              </div>
            </div>
          </fetcher.Form>

          <AdminArrayItemsEditor
            title="Roadmap Manager"
            description={copy.roadmapAdminDescription}
            items={roadmap as any}
            entity={data}
            entityField="roadmap"
            collection={copy.collection}
            itemId={data.slug}
          />
        </div>
      )}
    </div>
  );
};
