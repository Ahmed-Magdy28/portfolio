import { motion } from "motion/react";
import { AdminEntityCollectionEditor } from "../components/admin/AdminEntityCollectionEditor";
import { AdminProjectCategoriesEditor } from "../components/admin/AdminProjectCategoriesEditor";
import { PageAdminEditor } from "../components/admin/PageAdminEditor";
import { Section } from "../components/Section";
import { useAdminSession } from "../hooks/useAdminSession";
import { useProjectFilters } from "../hooks/useProjectFilters";
import { useRootData } from "../hooks/useRootData";
import { useSiteContent } from "../hooks/useSiteContent";
import { useTranslation } from "../i18n/useTranslation";
import { PageSEO } from "../components/PageSEO";
import { AdminSectionWrapper } from "../components/admin/AdminSectionWrapper";
import { ProjectFilterBar } from "../components/ProjectFilterBar";
import { ProjectCard } from "../components/ProjectCard";
import { cn } from "../components/ui/utils";

export const Projects = () => {
  const { t, lang } = useTranslation();
  const { projects, projectCategories = [] } = useSiteContent();
  const { isAdminAuthenticated } = useAdminSession();
  const rootData = useRootData();
  const {
    activeCategoryId,
    displayedProjects,
    searchQuery,
    setActiveCategoryId,
    setSearchQuery,
  } = useProjectFilters(projects);

  const seoTitle = `Portfolio Projects | Ahmed Magdy - Frontend Developer`;
  const seoDescription =
    "Explore a showcase of web and mobile applications developed by Ahmed Magdy, featuring React, Next.js, Django, and Flutter projects.";

  return (
    <Section className="pt-32 pb-40 relative">
      <PageSEO
        title={seoTitle}
        description={seoDescription}
        url={`${rootData.siteUrl}/projects`}
      />

      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-full max-w-7xl px-4 pointer-events-none opacity-[0.05] dark:opacity-[0.1] overflow-hidden select-none text-center">
        <span className="text-[10vw] font-black leading-none uppercase whitespace-nowrap inline-block">
          Portfolio Showcase
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto px-6 relative z-10"
      >
        <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 dark:text-blue-400">
                Engineering Directory
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter text-foreground leading-none">
              {t.projects.title}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed font-medium">
              {t.projects.description}
            </p>
          </div>

          <div className="md:mb-2">
            <ProjectFilterBar
              categories={projectCategories}
              activeCategoryId={activeCategoryId}
              setActiveCategoryId={setActiveCategoryId}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchPlaceholder="Quick filter..."
              isAdmin={isAdminAuthenticated}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {displayedProjects.map((project, index) => (
            <div
              key={project.id}
              className={cn(index % 2 === 1 ? "md:translate-y-20" : "")}
            >
              <ProjectCard
                project={project}
                index={index}
                liveLabel={t.projects.liveDemo}
                sourceLabel={t.projects.sourceCode}
              />
            </div>
          ))}
        </div>

        {isAdminAuthenticated && (
          <AdminSectionWrapper title="Projects Inventory Management">
            <div className="space-y-8">
              <AdminEntityCollectionEditor
                title="Main Collection"
                description="Add, remove, or reorder projects. This syncs with the main grid display."
                items={projects}
                collection="projects"
                createItem={() => {
                  const date = new Date();
                  const quarter = Math.floor(date.getMonth() / 3) + 1;
                  return {
                    id: `project-${Date.now()}`,
                    title: "New Project",
                    description: "Add a short summary",
                    featured: false,
                    techStack: ["none"],
                    categoryIds: ["category-1779137983480"],
                    fullDescription: "Add the detailed project overview",
                    challenges: "Add the challenges and solutions",
                    primaryRole: "software engineer",
                    coreTech: "none",
                    category: "other",
                    timeline: `Q${quarter} ${date.getFullYear()}`,
                  };
                }}
                getId={(item) => item.id}
                getEditPath={(item) => `/projects/${item.id}`}
              />

              <div className="space-y-6">
                <AdminProjectCategoriesEditor categories={projectCategories} />

                <div className="grid gap-6 md:grid-cols-2">
                  <PageAdminEditor
                    title="Projects JSON"
                    description="Bulk edit or review the raw project data."
                    payload={JSON.stringify(projects, null, 2)}
                    intent="save-collection"
                    collection="projects"
                  />
                  <PageAdminEditor
                    title="Translations"
                    description="Modify UI strings for the projects listing."
                    payload={JSON.stringify(
                      {
                        en: rootData.translations.en.projects,
                        ar: rootData.translations.ar.projects,
                      },
                      null,
                      2,
                    )}
                    intent="save-translation-section"
                    section="projects"
                  />
                </div>
              </div>
            </div>
          </AdminSectionWrapper>
        )}
      </motion.div>
    </Section>
  );
};
