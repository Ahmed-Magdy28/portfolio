import { useState, useRef, useEffect } from "react";
import { useFetcher, useRevalidator } from "../../lib/useFetcherCompat";
import type { ProjectCategory } from "../../data/types";
import { AdminCard } from "./ui/AdminCard";
import { AdminButton } from "./ui/AdminButton";
import { useTranslation } from "../../i18n/useTranslation";
import { Tags, Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { cn } from "../ui/utils";

interface AdminProjectCategoriesEditorProps {
  categories: ProjectCategory[];
}

export const AdminProjectCategoriesEditor = ({
  categories,
}: AdminProjectCategoriesEditorProps) => {
  const { lang } = useTranslation();
  const fetcher = useFetcher<{ success?: string; error?: string }>();
  const revalidator = useRevalidator();
  const [draftCategories, setDraftCategories] =
    useState<ProjectCategory[]>(categories);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setDraftCategories(categories);
  }, [categories]);

  useEffect(() => {
    if (fetcher.data?.success) {
      toast.success("Categories updated successfully");
      revalidator.revalidate();
    } else if (fetcher.data?.error) {
      toast.error("Failed to update categories");
    }
  }, [fetcher.data, revalidator]);

  const submitCategories = (nextCategories: ProjectCategory[]) => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      fetcher.submit(
        {
          intent: "save-collection",
          collection: "projectCategories",
          payload: JSON.stringify(nextCategories),
        },
        { method: "post", action: "/__admin/save" },
      );
    }, 1000);
  };

  const updateCategory = (
    id: string,
    field: keyof ProjectCategory,
    value: string | boolean,
  ) => {
    setDraftCategories((current) => {
      const next = current.map((c) =>
        c.id === id ? { ...c, [field]: value } : c,
      );
      submitCategories(next);
      return next;
    });
  };

  const addCategory = () => {
    const newCategory: ProjectCategory = {
      id: `category-${Date.now()}`,
      nameEn: "New Category",
      nameAr: "فئة جديدة",
      isHidden: true,
    };

    setDraftCategories((current) => {
      const next = [newCategory, ...current];
      submitCategories(next);
      return next;
    });
  };

  const deleteCategory = (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this category? Projects assigned to it will retain the ID but the category will disappear from filters.",
      )
    )
      return;

    setDraftCategories((current) => {
      const next = current.filter((c) => c.id !== id);
      submitCategories(next);
      return next;
    });
  };

  return (
    <AdminCard
      title="Categories Editor"
      description="Manage project categories. Toggle visibility or rename labels in English and Arabic."
      icon={<Tags className="w-6 h-6 text-fuchsia-600" />}
      className="border-t-4 border-t-fuchsia-600"
      headerActions={
        <AdminButton
          type="button"
          onClick={addCategory}
          variant="fuchsia"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Category
        </AdminButton>
      }
    >
      <div className="space-y-4">
        {draftCategories.map((category) => (
          <div
            key={category.id}
            className={cn(
              "group relative overflow-hidden rounded-[1.75rem] border bg-white p-5 transition-all duration-300 dark:bg-gray-900/40 flex flex-col md:flex-row gap-4 items-start md:items-center",
              "border-gray-100 dark:border-gray-800 hover:border-fuchsia-200 dark:hover:border-fuchsia-900",
            )}
          >
            <div className="flex-1 w-full grid md:grid-cols-2 gap-4">
              <label className="block">
                <div className="mb-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  English Label
                </div>
                <input
                  value={category.nameEn}
                  onChange={(e) =>
                    updateCategory(category.id, "nameEn", e.target.value)
                  }
                  className="w-full rounded-xl border border-gray-100 bg-gray-50/30 px-4 py-2.5 text-sm font-bold dark:border-gray-800 dark:bg-gray-950/30 outline-none focus:border-fuchsia-500 focus:ring-4 focus:ring-fuchsia-500/5 transition-all dark:text-gray-200"
                />
              </label>
              <label className="block">
                <div className="mb-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Arabic Label
                </div>
                <input
                  value={category.nameAr}
                  onChange={(e) =>
                    updateCategory(category.id, "nameAr", e.target.value)
                  }
                  dir="rtl"
                  className="w-full rounded-xl border border-gray-100 bg-gray-50/30 px-4 py-2.5 text-sm font-bold dark:border-gray-800 dark:bg-gray-950/30 outline-none focus:border-fuchsia-500 focus:ring-4 focus:ring-fuchsia-500/5 transition-all dark:text-gray-200"
                />
              </label>
            </div>

            <div className="flex gap-2 w-full md:w-auto shrink-0 justify-end mt-2 md:mt-0 pt-2 md:pt-4">
              <button
                type="button"
                onClick={() =>
                  updateCategory(category.id, "isHidden", !category.isHidden)
                }
                className={cn(
                  "rounded-xl border p-3 transition-all shadow-sm flex items-center justify-center group/btn",
                  category.isHidden
                    ? "border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/40"
                    : "border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-500 hover:text-fuchsia-600 hover:border-fuchsia-200 dark:hover:border-fuchsia-900",
                )}
                title={
                  category.isHidden
                    ? "Currently Hidden (Click to Show)"
                    : "Currently Visible (Click to Hide)"
                }
              >
                {category.isHidden ? (
                  <EyeOff className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                ) : (
                  <Eye className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                )}
              </button>
              <button
                type="button"
                onClick={() => deleteCategory(category.id)}
                className="rounded-xl border border-red-50 dark:border-red-900/10 p-3 text-red-200 hover:bg-red-500 hover:text-white transition-all shadow-sm flex items-center justify-center group/btn"
                title="Remove Category"
              >
                <Trash2 className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminCard>
  );
};
