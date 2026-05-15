import { motion } from "motion/react";
import { Calendar, Milestone, Tag } from "lucide-react";
import { AdminArrayItemsEditor } from "../admin/AdminArrayItemsEditor";
import { Pagination } from "../Pagination";
import { Badge } from "../ui/badge";
import { useAdminSession } from "../../hooks/useAdminSession";
import { usePaginatedItems } from "../../hooks/usePaginatedItems";
import { useTranslation } from "../../i18n/useTranslation";
import type { Version } from "../../data/types";
import type { TechEntity, TechPageCopy } from "./types";

const ITEMS_PER_PAGE = 5;

const getTypeColor = (type: Version["type"]) => {
  switch (type) {
    case "major":
      return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300";
    case "minor":
      return "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300";
    case "patch":
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
  }
};

interface TechVersionsPageProps {
  copy: TechPageCopy;
  data: TechEntity;
}

export const TechVersionsPage = ({ copy, data }: TechVersionsPageProps) => {
  const { lang } = useTranslation();
  const { isAdminAuthenticated } = useAdminSession();
  const versions = data.versions || [];
  const { currentPage, paginatedItems, setCurrentPage } = usePaginatedItems(versions, ITEMS_PER_PAGE);

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        {versions.length > 0 ? paginatedItems.map((version, index) => (
          <motion.div
            key={version.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group p-6 rounded-2xl bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:shadow-black/5 transition-all"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 flex items-center justify-center rounded-xl font-black text-sm ${getTypeColor(version.type)}`}>
                  v{version.version}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{version.title || (lang === "en" ? "Release Update" : "تحديث جديد")}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium mt-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(version.releaseDate).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </div>
                </div>
              </div>
              <Badge variant="outline" className={`uppercase text-[9px] font-black tracking-widest border-none px-3 py-1 ${getTypeColor(version.type)}`}>
                {version.type} Update
              </Badge>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 opacity-70 flex items-center gap-2">
                <Milestone className="w-3 h-3" /> {lang === "en" ? "Key Changes" : "أهم التغييرات"}
              </h4>
              <ul className="grid gap-2">
                {version.changes.map((change, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-foreground/80 leading-relaxed">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                    {change}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )) : (
          <div className="py-20 text-center bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
            <Tag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-bold">No version history available</h4>
            <p className="text-sm text-muted-foreground">{copy.emptyVersionsDescription}</p>
          </div>
        )}
      </div>

      <Pagination
        totalItems={versions.length}
        itemsPerPage={ITEMS_PER_PAGE}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      {isAdminAuthenticated && (
        <div className="pt-16 border-t border-gray-100 dark:border-gray-800">
          <AdminArrayItemsEditor
            title="Version History Manager"
            description={copy.versionsAdminDescription}
            items={versions as any}
            entity={data}
            entityField="versions"
            collection={copy.collection}
            itemId={data.slug}
          />
        </div>
      )}
    </div>
  );
};
