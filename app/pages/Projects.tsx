import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { Link } from "react-router";
import { useRouteLoaderData } from "react-router";
import { AdminEntityCollectionEditor } from "../components/admin/AdminEntityCollectionEditor";
import { Card } from "../components/Card";
import { PageAdminEditor } from "../components/admin/PageAdminEditor";
import { Section } from "../components/Section";
import { useAdminSession } from "../hooks/useAdminSession";
import { useSiteContent } from "../hooks/useSiteContent";
import { useTranslation } from "../i18n/useTranslation";
import type { loader as rootLoader } from "../root";

type ProjectCategory =
  | "frontend"
  | "mobile"
  | "backend"
  | "systems"
  | "wordpress";

const categoryLabels: Record<ProjectCategory, string> = {
  frontend: "Frontend Web (React)",
  mobile: "Mobile (Flutter)",
  backend: "Backend (Django)",
  systems: "Systems (C shell)",
  wordpress: "WordPress",
};

const hasTechKeyword = (techStack: string[], keyword: string) =>
  techStack.some((tech) => tech.toLowerCase().includes(keyword));

const matchesCategory = (techStack: string[], category: ProjectCategory) => {
  const normalized = techStack.map((tech) => tech.toLowerCase());

  if (category === "frontend") {
    return normalized.some(
      (tech) =>
        tech.includes("react") ||
        tech.includes("javascript") ||
        tech.includes("typescript") ||
        tech.includes("js"),
    );
  }

  if (category === "mobile") {
    return hasTechKeyword(normalized, "flutter");
  }

  if (category === "backend") {
    return hasTechKeyword(normalized, "django");
  }

  if (category === "wordpress") {
    return hasTechKeyword(normalized, "wordpress");
  }

  return normalized.some(
    (tech) =>
      tech === "c" ||
      tech.includes("c shell") ||
      tech.includes("shell") ||
      tech.includes("bash") ||
      tech.includes("zsh"),
  );
};

export const Projects = () => {
  const { t } = useTranslation();
  const { projects } = useSiteContent();
  const { isAdminAuthenticated } = useAdminSession();
  const rootData = useRouteLoaderData<typeof rootLoader>("root");
  const [activeCategory, setActiveCategory] = useState<ProjectCategory | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();

  const displayedProjects = useMemo(() => {
    const baseProjects = activeCategory
      ? projects.filter((project) =>
          matchesCategory(project.techStack, activeCategory),
        )
      : normalizedSearchQuery
        ? projects
        : projects.filter((project) => project.featured).slice(0, 5);

    if (!normalizedSearchQuery) {
      return baseProjects;
    }

    return baseProjects.filter(
      (project) =>
        project.title.toLowerCase().includes(normalizedSearchQuery) ||
        project.techStack.some((tech) =>
          tech.toLowerCase().includes(normalizedSearchQuery),
        ),
    );
  }, [activeCategory, normalizedSearchQuery, projects]);

  if (!rootData) {
    throw new Error("Root data is not available.");
  }

  return (
    <Section>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl md:text-5xl mb-4">{t.projects.title}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
          A showcase of my recent work and side projects
        </p>

        <div className="mb-4">
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search by project name or tech stack"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          />
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          {(Object.keys(categoryLabels) as ProjectCategory[]).map(
            (category) => {
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
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? "border-blue-500 bg-blue-500 text-white"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
                  }`}
                >
                  {categoryLabels[category]}
                </button>
              );
            },
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/projects/${project.id}`}>
                <Card hover className="h-full flex flex-col">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.techStack.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.techStack.length > 4 ? (
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                          ...
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex gap-3 mt-4">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center gap-1"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                        {t.projects.liveDemo}
                      </a>
                    )}
                    {project.sourceUrl && (
                      <a
                        href={project.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-gray-600 dark:text-gray-400 hover:underline text-sm flex items-center gap-1"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {t.projects.sourceCode}
                      </a>
                    )}
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {isAdminAuthenticated ? (
          <div className="mt-12 space-y-4">
            <AdminEntityCollectionEditor
              title="Projects manager"
              description="Edit project cards here, add new projects quickly, or open a project to manage all of its detailed content."
              items={projects}
              collection="projects"
              createItem={() => ({
                id: `project-${Date.now()}`,
                title: "New Project",
                description: "Add a short summary",
                featured: false,
                techStack: [],
                fullDescription: "Add the detailed project overview",
                challenges: "Add the challenges and solutions",
              })}
              getId={(item) => item.id}
              getEditPath={(item) => `/projects/${item.id}`}
            />
            <PageAdminEditor
              title="Projects collection"
              description="Add, remove, or reorder projects here. This controls the projects list and lets you create entirely new projects."
              payload={JSON.stringify(projects, null, 2)}
              intent="save-collection"
              collection="projects"
            />
            <PageAdminEditor
              title="Project page translations"
              description="Edit the translation keys used on the projects pages."
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
        ) : null}
      </motion.div>
    </Section>
  );
};
