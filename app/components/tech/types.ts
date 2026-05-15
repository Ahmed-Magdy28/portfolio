import type { AccordionItem, Framework, Language, RoadmapStep, Version } from "../../data/types";

export type TechCollection = "languages" | "frameworks";
export type TechEntity = Language | Framework;

export interface TechPageCopy {
  collection: TechCollection;
  singularLabel: string;
  pluralLabel: string;
  listPath: string;
  listLabel: string;
  backLabel: string;
  notFoundBackLabel: string;
  seoListTitle: string;
  seoListDescription: string;
  detailSeoType: string;
  heroBadgeLabel: string;
  listBadgeLabel: string;
  listDescription: string;
  adminDetailLabel: string;
  adminContentLabel: string;
  adminCollectionLabel: string;
  collectionManagerTitle: string;
  collectionManagerDescription: string;
  rawCollectionTitle: string;
  rawCollectionDescription: string;
  translationsTitle: string;
  translationsDescription: string;
  descriptionEditorTitle: string;
  descriptionEditorDescription: string;
  insightAboutCaption: string;
  interviewAboutCaption: string;
  insightsAdminDescription: string;
  interviewAdminDescription: string;
  emptyRoadmapDescription: string;
  roadmapAdminDescription: string;
  roadmapUrlHelp: string;
  emptyVersionsDescription: string;
  versionsAdminDescription: string;
  createItem: () => TechEntity;
}

export type TechEntityField = "insights" | "interviewQuestions" | "roadmap" | "versions";

export type EditableTechItems = AccordionItem[] | RoadmapStep[] | Version[];
