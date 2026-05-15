import { Link, Outlet, useParams } from "react-router";
import { Helmet } from "react-helmet-async";
import { motion } from "motion/react";
import { ArrowLeft, Sparkles } from "lucide-react";
import { PageAdminEditor } from "../admin/PageAdminEditor";
import { Badge } from "../ui/badge";
import { Button } from "../Button";
import { IconValue } from "../IconValue";
import { Section } from "../Section";
import type { Tab } from "../Tabs";
import { Tabs } from "../Tabs";
import { useAdminSession } from "../../hooks/useAdminSession";
import { useRootData } from "../../hooks/useRootData";
import { useTranslation } from "../../i18n/useTranslation";
import type { TechEntity, TechPageCopy } from "./types";

interface TechDetailLayoutProps {
  copy: TechPageCopy;
  items: TechEntity[];
  tabLabels: {
    about: string;
    insights: string;
    interview: string;
    roadmap: string;
    versions: string;
  };
  translationPayload: unknown;
}

export const TechDetailLayout = ({
  copy,
  items,
  tabLabels,
  translationPayload,
}: TechDetailLayoutProps) => {
  const { slug } = useParams();
  const { t } = useTranslation();
  const { isAdminAuthenticated } = useAdminSession();
  const rootData = useRootData();
  const item = items.find((candidate) => candidate.slug === slug);

  if (!item) {
    return (
      <Section className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">{t.common.notFound}</h1>
          <Button to={copy.listPath} variant="primary">
            <ArrowLeft className="w-4 h-4 mr-2" /> {copy.notFoundBackLabel}
          </Button>
        </div>
      </Section>
    );
  }

  const seoTitle = `${item.title} | ${copy.detailSeoType} - Ahmed Magdy`;
  const hasRoadmap = Boolean(item.roadmapUrl) || Boolean(item.roadmap?.length);
  const hasInsights = item.insights && item.insights.length > 0;
  const hasInterview = item.interviewQuestions && item.interviewQuestions.length > 0;
  const hasVersions = item.versions && item.versions.length > 0;

  const tabs: Tab[] = [
    { label: tabLabels.about, path: `${copy.listPath}/${slug}` },
    ...(hasInsights || isAdminAuthenticated
      ? [{ label: tabLabels.insights, path: `${copy.listPath}/${slug}/insights` }]
      : []),
    ...(hasInterview || isAdminAuthenticated
      ? [{ label: tabLabels.interview, path: `${copy.listPath}/${slug}/interview` }]
      : []),
    ...(hasRoadmap || isAdminAuthenticated
      ? [{ label: tabLabels.roadmap, path: `${copy.listPath}/${slug}/roadmap` }]
      : []),
    ...(hasVersions || isAdminAuthenticated
      ? [{ label: tabLabels.versions, path: `${copy.listPath}/${slug}/versions` }]
      : []),
  ];

  return (
    <Section className="pt-20 pb-32">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={item.description} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={item.description} />
        <meta property="og:url" content={`${rootData.siteUrl}${copy.listPath}/${slug}`} />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={item.description} />
      </Helmet>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto">
        <Link
          to={copy.listPath}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 rtl:group-hover:translate-x-1" />
          <span className="text-sm font-bold uppercase tracking-wider">{copy.listLabel}</span>
        </Link>

        <div className="relative mb-16">
          <div className="absolute inset-0 -z-10 bg-linear-to-br from-blue-500/5 to-purple-500/5 rounded-[3rem] blur-3xl" />

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
            <motion.div
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="w-32 h-32 md:w-40 md:h-40 flex items-center justify-center rounded-[2.5rem] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-2xl shadow-blue-500/10"
            >
              <IconValue
                value={item.icon}
                alt={item.title}
                className="text-7xl"
                imageClassName="h-20 w-20 md:h-24 md:w-24 object-contain"
              />
            </motion.div>

            <div className="flex-1 text-center md:text-left rtl:md:text-right">
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-4">
                <Badge variant="secondary" className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-none font-bold uppercase tracking-tighter text-[10px]">
                  {copy.heroBadgeLabel}
                </Badge>
                {item.insights.length > 0 && (
                  <Badge variant="outline" className="px-3 py-1 border-purple-500/20 text-purple-600 dark:text-purple-400 font-bold uppercase tracking-tighter text-[10px] flex gap-1 items-center">
                    <Sparkles className="w-3 h-3" /> {item.insights.length} Insights
                  </Badge>
                )}
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight text-foreground">
                {item.title}
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                {item.description}
              </p>
            </div>
          </div>
        </div>

        <div className="relative">
          <Tabs tabs={tabs} />
          <div className="mt-12">
            <Outlet context={{ data: item }} />
          </div>
        </div>

        {isAdminAuthenticated ? (
          <div className="mt-32 space-y-6 pt-16 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-blue-600">{copy.adminDetailLabel}</span>
              <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
            </div>

            <PageAdminEditor
              title={copy.translationsTitle}
              description={copy.translationsDescription}
              payload={JSON.stringify(translationPayload, null, 2)}
              intent="save-translation-section"
              section={copy.collection}
            />
          </div>
        ) : null}
      </motion.div>
    </Section>
  );
};
