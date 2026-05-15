import type { ProjectCategory } from "../hooks/useProjectFilters";
import { cn } from "./ui/utils";
import { useTranslation } from "../i18n/useTranslation";

interface ProjectFilterBarProps {
  activeCategory: ProjectCategory | null;
  setActiveCategory: (category: ProjectCategory | null | ((curr: ProjectCategory | null) => ProjectCategory | null)) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchPlaceholder?: string;
}

export const ProjectFilterBar = ({
  activeCategory,
  setActiveCategory,
  searchQuery,
  setSearchQuery,
  searchPlaceholder = "Search projects...",
}: ProjectFilterBarProps) => {
  const { t } = useTranslation();
  const categories = Object.keys(t.projects.categories) as ProjectCategory[];

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
        {categories.map((category) => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() =>
                setActiveCategory((current) =>
                  current === category ? null : category,
                )
              }
              className={cn(
                "rounded-xl border px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition-all",
                isActive
                  ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "border-gray-100 bg-white text-muted-foreground hover:border-blue-200 hover:text-blue-600 dark:border-gray-800 dark:bg-gray-900"
              )}
            >
              {t.projects.categories[category]}
            </button>
          );
        })}
      </div>
    </div>
  );
};
