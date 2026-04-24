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
}

export interface HashtagsBlock {
  id: string;
  type: "hashtags";
  tags: string[];
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

export interface Project {
  id: string;
  title: string;
  description: string;
  featured?: boolean;
  techStack: string[];
  liveUrl?: string;
  sourceUrl?: string;
  image?: string;
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
}

export interface Framework {
  slug: string;
  title: string;
  description: string;
  aboutDescription?: string;
  icon: string;
  insights: AccordionItem[];
  interviewQuestions: AccordionItem[];
}
