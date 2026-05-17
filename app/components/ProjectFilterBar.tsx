import type { ProjectCategory } from "../data/types";
import { cn } from "./ui/utils";
import { useTranslation } from "../i18n/useTranslation";

interface ProjectFilterBarProps {
  categories: ProjectCategory[];
  activeCategoryId: string | null;
  setActiveCategoryId: (categoryId: string | null | ((curr: string | null) => string | null)) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchPlaceholder?: string;
  isAdmin?: boolean;
}

export const ProjectFilterBar = ({
  categories,
  activeCategoryId,
  setActiveCategoryId,
  searchQuery,
  setSearchQuery,
  searchPlaceholder = "Search projects...",
  isAdmin = false,
}: ProjectFilterBarProps) => {
  const { lang } = useTranslation();
  
  const visibleCategories = categories.filter(c => isAdmin || !c.isHidden);

  return (
    <div className="space-y-6">
      <div className="relative group max-w-xl mx-auto">
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder={searchPlaceholder}
          className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm text-foreground outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 dark:border-gray-800 dark:bg-gray-900"
        />
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {visibleCategories.map((category) => {
          const isActive = activeCategoryId === category.id;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() =>
                setActiveCategoryId((current) =>
                  current === category.id ? null : category.id,
                )
              }
              className={cn(
                "rounded-xl border px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition-all",
                isActive
                  ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "border-gray-100 bg-white text-muted-foreground hover:border-blue-200 hover:text-blue-600 dark:border-gray-800 dark:bg-gray-900",
                category.isHidden && "border-dashed border-red-200 text-red-500 hover:border-red-400 hover:text-red-600 dark:border-red-900/50"
              )}
            >
              {lang === "en" ? category.nameEn : category.nameAr}
              {category.isHidden && <span className="ml-1 opacity-50">(Hidden)</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};
