import { useMemo, useState } from "react";
import type { Project } from "../data/types";

export type ProjectCategory =
  | "frontend"
  | "mobile"
  | "backend"
  | "systems"
  | "wordpress";

export const categoryLabels: Record<ProjectCategory, string> = {
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

export const useProjectFilters = (projects: Project[]) => {
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

  return {
    activeCategory,
    displayedProjects,
    searchQuery,
    setActiveCategory,
    setSearchQuery,
  };
};
