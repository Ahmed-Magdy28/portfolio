import { useMemo, useState } from "react";
import type { Project } from "../data/types";

export const useProjectFilters = (projects: Project[]) => {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();

  const displayedProjects = useMemo(() => {
    const baseProjects = activeCategoryId
      ? projects.filter((project) =>
          project.categoryIds?.includes(activeCategoryId),
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
  }, [activeCategoryId, normalizedSearchQuery, projects]);

  return {
    activeCategoryId,
    displayedProjects,
    searchQuery,
    setActiveCategoryId,
    setSearchQuery,
  };
};
