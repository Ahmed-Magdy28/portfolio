import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type {
  AccordionItem,
  ContentBlock,
  Framework,
  Language,
  Project,
} from "../data/types";

export type ContentLocale = "en" | "ar";

export interface HomeFeature {
  icon: string;
  title: string;
  description: string;
}

export interface HomeContent {
  name: string;
  avatar: string;
  avatarSize: number;
  cvUrl: string;
  features: HomeFeature[];
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface AboutContent {
  video?: string;
  paragraphs: string[];
  skills: SkillGroup[];
  ctaTitle: string;
  ctaText: string;
  ctaLinkLabel: string;
  ctaLinkUrl: string;
}

export interface ContactLink {
  label: string;
  value: string;
  url: string;
  icon: "github" | "linkedin" | "email";
}

export interface ContactContent {
  intro: string;
  connectTitle: string;
  connectText: string;
  links: ContactLink[];
}

export interface SiteContent {
  home: HomeContent;
  about: AboutContent;
  contact: ContactContent;
  projects: Project[];
  languages: Language[];
  frameworks: Framework[];
}

const contentDir = path.join(process.cwd(), "app", "content");
const legacyContentFile = path.join(contentDir, "site-data.json");
const contentFileByLocale = (locale: ContentLocale) =>
  path.join(contentDir, `site-data.${locale}.json`);

const defaultSiteContent: SiteContent = {
  home: {
    name: "",
    avatar: "",
    avatarSize: 128,
    cvUrl: "",
    features: [],
  },
  about: {
    video: "",
    paragraphs: [],
    skills: [],
    ctaTitle: "",
    ctaText: "",
    ctaLinkLabel: "",
    ctaLinkUrl: "",
  },
  contact: {
    intro: "",
    connectTitle: "",
    connectText: "",
    links: [],
  },
  projects: [],
  languages: [],
  frameworks: [],
};

export const getContentFilePath = (locale: ContentLocale = "en") =>
  contentFileByLocale(locale);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const mergeWithFallback = (fallback: unknown, value: unknown): unknown => {
  if (value === undefined || value === null) {
    return fallback;
  }

  if (Array.isArray(fallback) && Array.isArray(value)) {
    const maxLength = Math.max(fallback.length, value.length);
    return Array.from({ length: maxLength }, (_, index) =>
      mergeWithFallback(fallback[index], value[index]),
    );
  }

  if (isRecord(fallback) && isRecord(value)) {
    const merged: Record<string, unknown> = {};
    const keys = new Set([...Object.keys(fallback), ...Object.keys(value)]);

    keys.forEach((key) => {
      merged[key] = mergeWithFallback(fallback[key], value[key]);
    });

    return merged;
  }

  return value;
};

const makeId = (prefix: string, index: number) => `${prefix}-${index + 1}`;

const normalizeBlocks = (item: AccordionItem): ContentBlock[] => {
  if (Array.isArray(item.blocks)) {
    return item.blocks;
  }

  const blocks: ContentBlock[] = [];

  if (item.content) {
    blocks.push({
      id: makeId(item.id, blocks.length),
      type: "text",
      text: item.content,
    });
  }

  if (item.code) {
    blocks.push({
      id: makeId(item.id, blocks.length),
      type: "code",
      code: item.code,
      language: item.language,
    });
  }

  if (item.video) {
    blocks.push({
      id: makeId(item.id, blocks.length),
      type: "video",
      url: item.video,
    });
  }

  if (item.linkLabel && item.linkUrl) {
    blocks.push({
      id: makeId(item.id, blocks.length),
      type: "link",
      label: item.linkLabel,
      url: item.linkUrl,
    });
  }

  return blocks;
};

const normalizeAccordionItems = (items: AccordionItem[]) =>
  items.map((item) => ({
    ...item,
    blocks: normalizeBlocks(item),
  }));

const normalizeLanguages = (languages: Language[]) =>
  languages.map((language) => ({
    ...language,
    aboutDescription: language.aboutDescription ?? language.description,
    insights: normalizeAccordionItems(language.insights),
    interviewQuestions: normalizeAccordionItems(language.interviewQuestions),
  }));

const normalizeFrameworks = (frameworks: Framework[]) =>
  frameworks.map((framework) => ({
    ...framework,
    aboutDescription: framework.aboutDescription ?? framework.description,
    insights: normalizeAccordionItems(framework.insights),
    interviewQuestions: normalizeAccordionItems(framework.interviewQuestions),
  }));

async function readRawSiteContent(
  locale: ContentLocale,
): Promise<Partial<SiteContent>> {
  const filePath = contentFileByLocale(locale);

  try {
    const raw = await readFile(filePath, "utf-8");
    return JSON.parse(raw) as Partial<SiteContent>;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      if (locale === "en") {
        try {
          const raw = await readFile(legacyContentFile, "utf-8");
          return JSON.parse(raw) as Partial<SiteContent>;
        } catch (legacyError) {
          if ((legacyError as NodeJS.ErrnoException).code === "ENOENT") {
            return defaultSiteContent;
          }

          throw legacyError;
        }
      }

      return {};
    }

    throw error;
  }
}

const normalizeSiteContent = (parsed: Partial<SiteContent>): SiteContent => ({
  home: parsed.home ?? defaultSiteContent.home,
  about: parsed.about ?? defaultSiteContent.about,
  contact: parsed.contact ?? defaultSiteContent.contact,
  projects: parsed.projects ?? [],
  languages: normalizeLanguages(parsed.languages ?? []),
  frameworks: normalizeFrameworks(parsed.frameworks ?? []),
});

export async function readSiteContent(
  locale: ContentLocale = "en",
): Promise<SiteContent> {
  if (locale === "en") {
    return normalizeSiteContent(await readRawSiteContent("en"));
  }

  const [englishRaw, localizedRaw] = await Promise.all([
    readRawSiteContent("en"),
    readRawSiteContent(locale),
  ]);

  const merged = mergeWithFallback(
    englishRaw,
    localizedRaw,
  ) as Partial<SiteContent>;
  return normalizeSiteContent(merged);
}

export async function readAllSiteContentLocales(): Promise<
  Record<ContentLocale, SiteContent>
> {
  const [en, ar] = await Promise.all([
    readSiteContent("en"),
    readSiteContent("ar"),
  ]);
  return { en, ar };
}

export async function writeSiteContent(
  content: SiteContent,
  locale: ContentLocale = "en",
) {
  await mkdir(contentDir, { recursive: true });
  await writeFile(
    contentFileByLocale(locale),
    `${JSON.stringify(content, null, 2)}\n`,
    "utf-8",
  );
}
