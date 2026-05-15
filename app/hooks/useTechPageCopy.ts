import { useMemo } from "react";
import { useTranslation } from "../i18n/useTranslation";
import type { TechCollection, TechPageCopy } from "../components/tech/types";

export const useTechPageCopy = (collection: TechCollection): TechPageCopy => {
  const { lang } = useTranslation();

  return useMemo(() => {
    const isEnglish = lang === "en";

    if (collection === "languages") {
      return {
        collection,
        singularLabel: "language",
        pluralLabel: "languages",
        listPath: "/languages",
        listLabel: isEnglish ? "All Languages" : "كل اللغات",
        backLabel: isEnglish ? "Back to Languages" : "العودة للغات",
        notFoundBackLabel: isEnglish ? "Back to Languages" : "العودة للغات",
        seoListTitle: "Programming Languages | Ahmed Magdy - Frontend Developer",
        seoListDescription: "Deep dive into the programming languages I use to build modern applications, including TypeScript, JavaScript, Python, Dart, and C.",
        detailSeoType: "Programming Language",
        heroBadgeLabel: "Language",
        listBadgeLabel: isEnglish ? "Core Expertise" : "الخبرات الأساسية",
        listDescription: isEnglish
          ? "Deep dives into the programming languages I use to architect and build high-performance web and mobile solutions."
          : "نظرة متعمقة على لغات البرمجة التي أستخدمها في هندسة وبناء حلول الويب والموبايل عالية الأداء.",
        adminDetailLabel: "Language Detail Admin",
        adminContentLabel: "Language Content Admin",
        adminCollectionLabel: "Language Administration",
        collectionManagerTitle: "Languages Manager",
        collectionManagerDescription: "Manage core language entries, reorder them, or add new ones.",
        rawCollectionTitle: "Languages Raw Collection",
        rawCollectionDescription: "Advanced JSON management for the languages collection.",
        translationsTitle: "Language Translations",
        translationsDescription: "Edit the shared translation keys used on language pages.",
        descriptionEditorTitle: "Language Description",
        descriptionEditorDescription: "Update the primary and long-form about text.",
        insightAboutCaption: isEnglish ? "Technical deep dives available" : "رؤى تقنية متوفرة",
        interviewAboutCaption: isEnglish ? "Common interview scenarios" : "أسئلة مقابلة شائعة",
        insightsAdminDescription: "Manage and reorder technical insights for this language.",
        interviewAdminDescription: "Manage and reorder common interview questions for this language.",
        emptyRoadmapDescription: "The developer hasn't outlined the roadmap for this technology yet.",
        roadmapAdminDescription: "Outline the learning or implementation path for this technology.",
        roadmapUrlHelp: "Paste a roadmap.sh URL, such as https://roadmap.sh/typescript.",
        emptyVersionsDescription: "Detailed version logs haven't been added for this tech stack.",
        versionsAdminDescription: "Track the evolution and key releases of this technology.",
        createItem: () => ({
          slug: `language-${Date.now()}`,
          title: "New Language",
          description: "Add a short description",
          icon: "New",
          insights: [],
          interviewQuestions: [],
        }),
      };
    }

    return {
      collection,
      singularLabel: "framework",
      pluralLabel: "frameworks",
      listPath: "/frameworks",
      listLabel: isEnglish ? "All Frameworks" : "كل أطر العمل",
      backLabel: isEnglish ? "Back to Frameworks" : "العودة لأطر العمل",
      notFoundBackLabel: isEnglish ? "Back to Frameworks" : "العودة لأطر العمل",
      seoListTitle: "Frameworks & Tools | Ahmed Magdy - Frontend Developer",
      seoListDescription: "Explore the frameworks and tools I use to build modern applications, including React, Next.js, Django, Flutter, and Tailwind CSS.",
      detailSeoType: "Framework & Tool",
      heroBadgeLabel: "Framework / Tool",
      listBadgeLabel: isEnglish ? "Tools of Choice" : "أدوات العمل",
      listDescription: isEnglish
        ? "Powerful frameworks and libraries I leverage to create scalable, maintainable, and user-centric digital products."
        : "أطر عمل ومكتبات قوية أعتمد عليها لإنشاء منتجات رقمية قابلة للتوسع وسهلة الصيانة وتتمحور حول المستخدم.",
      adminDetailLabel: "Framework Detail Admin",
      adminContentLabel: "Framework Content Admin",
      adminCollectionLabel: "Framework Administration",
      collectionManagerTitle: "Frameworks Manager",
      collectionManagerDescription: "Manage framework entries, reorder them, or add new tools.",
      rawCollectionTitle: "Frameworks Raw Collection",
      rawCollectionDescription: "Advanced JSON management for the frameworks collection.",
      translationsTitle: "Framework Translations",
      translationsDescription: "Manage static text keys for the frameworks section.",
      descriptionEditorTitle: "Framework Description",
      descriptionEditorDescription: "Update the primary and long-form about text.",
      insightAboutCaption: isEnglish ? "Expert technical tips" : "رؤى تقنية متخصصة",
      interviewAboutCaption: isEnglish ? "Core interview preparation" : "أسئلة مقابلة جوهرية",
      insightsAdminDescription: "Manage and reorder technical insights for this framework.",
      interviewAdminDescription: "Manage and reorder common interview questions for this framework.",
      emptyRoadmapDescription: "The developer hasn't outlined the roadmap for this framework yet.",
      roadmapAdminDescription: "Outline the learning or implementation path for this framework.",
      roadmapUrlHelp: "Paste a roadmap.sh URL, such as https://roadmap.sh/react.",
      emptyVersionsDescription: "Detailed version logs haven't been added for this framework.",
      versionsAdminDescription: "Track the evolution and key releases of this framework.",
      createItem: () => ({
        slug: `framework-${Date.now()}`,
        title: "New Framework",
        description: "Add a short description",
        icon: "New",
        insights: [],
        interviewQuestions: [],
      }),
    };
  }, [collection, lang]);
};
