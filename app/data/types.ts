export interface TextBlock {
  id: string;
  type: "text";
  text: string;
}

export interface VideoBlock {
  id: string;
  type: "video";
  url: string;
}

export interface CodeBlockItem {
  id: string;
  type: "code";
  code: string;
  language?: string;
}

export interface LinkBlock {
  id: string;
  type: "link";
  label: string;
  url: string;
}

export interface ImageBlock {
  id: string;
  type: "image";
  url: string;
  alt?: string;
  width?: string;
  height?: string;
  aspectRatio?: "auto" | "square" | "video" | "wide";
}

export interface HashtagsBlock {
  id: string;
  type: "hashtags";
  tags: string[];
}

export interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  status: "completed" | "in-progress" | "planned";
  priority?: "low" | "medium" | "high";
}

export interface Version {
  id: string;
  version: string;
  releaseDate: string;
  title?: string;
  changes: string[];
  type: "major" | "minor" | "patch";
}

export type ContentBlock =
  | TextBlock
  | VideoBlock
  | CodeBlockItem
  | LinkBlock
  | ImageBlock
  | HashtagsBlock;

export interface AccordionItem {
  id: string;
  title: string;
  content: string;
  code?: string;
  language?: string;
  video?: string;
  linkLabel?: string;
  linkUrl?: string;
  blocks?: ContentBlock[];
  difficulty?: "easy" | "medium" | "hard";
}

export interface ProjectCategory {
  id: string;
  nameEn: string;
  nameAr: string;
  isHidden?: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  featured?: boolean;
  featuredPro?: boolean;
  categoryIds?: string[];
  techStack: string[];
  liveUrl?: string;
  sourceUrl?: string;
  image?: string;
  icon?: string;
  fullDescription: string;
  challenges: string;
  video?: string;
}

export interface Language {
  slug: string;
  title: string;
  description: string;
  aboutDescription?: string;
  icon: string;
  insights: AccordionItem[];
  interviewQuestions: AccordionItem[];
  roadmap?: RoadmapStep[];
  roadmapUrl?: string;
  versions?: Version[];
}

export interface Framework {
  slug: string;
  title: string;
  description: string;
  aboutDescription?: string;
  icon: string;
  insights: AccordionItem[];
  interviewQuestions: AccordionItem[];
  roadmap?: RoadmapStep[];
  roadmapUrl?: string;
  versions?: Version[];
}
