import { motion } from "motion/react";
import { Link } from "../Link";
import { Helmet } from "react-helmet-async";
import { BookOpen, ChevronRight, Sparkles, type LucideIcon } from "lucide-react";
import { AdminEntityCollectionEditor } from "../admin/AdminEntityCollectionEditor";
import { PageAdminEditor } from "../admin/PageAdminEditor";
import { Badge } from "../ui/badge";
import { Card } from "../Card";
import { IconValue } from "../IconValue";
import { Section } from "../Section";
import { useAdminSession } from "../../hooks/useAdminSession";
import { useRootData } from "../../hooks/useRootData";
import { useTranslation } from "../../i18n/useTranslation";
import type { TechEntity, TechPageCopy } from "./types";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 100 },
  },
};

interface TechCollectionPageProps {
  copy: TechPageCopy;
  icon: LucideIcon;
  items: TechEntity[];
  title: string;
  translationPayload: unknown;
}

export const TechCollectionPage = ({
  copy,
  icon: Icon,
  items,
  title,
  translationPayload,
}: TechCollectionPageProps) => {
  const { lang } = useTranslation();
  const { isAdminAuthenticated } = useAdminSession();
  const rootData = useRootData();

  return (
    <Section className="pt-24 pb-32">
      <Helmet>
        <title>{copy.seoListTitle}</title>
        <meta name="description" content={copy.seoListDescription} />
        <meta property="og:title" content={copy.seoListTitle} />
        <meta property="og:description" content={copy.seoListDescription} />
        <meta property="og:url" content={`${rootData.siteUrl}${copy.listPath}`} />
        <meta name="twitter:title" content={copy.seoListTitle} />
        <meta name="twitter:description" content={copy.seoListDescription} />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <Badge variant="outline" className="mb-4 px-4 py-1 border-blue-500/30 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20">
            <Icon className="w-3 h-3 mr-2" />
            {copy.listBadgeLabel}
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight bg-linear-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-300 dark:to-purple-300 bg-clip-text text-transparent">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            {copy.listDescription}
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {items.map((item) => (
            <motion.div key={item.slug} variants={itemVariants}>
              <Link to={`${copy.listPath}/${item.slug}`} className="block h-full group">
                <Card hover className="h-full border-gray-200 dark:border-gray-800 group-hover:border-blue-500/50 transition-all duration-300 overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="w-5 h-5 text-blue-500 rtl:rotate-180" />
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-blue-500/10 transition-all duration-500 shrink-0">
                      <IconValue
                        value={item.icon}
                        alt={item.title}
                        className="text-4xl"
                        imageClassName="h-10 w-10 md:h-12 md:w-12 object-contain"
                      />
                    </div>
                    <h3 className="text-2xl font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-muted-foreground mb-6 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-4 mt-auto">
                    {item.insights.length > 0 && (
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        <Sparkles className="w-3 h-3" />
                        {item.insights.length} {lang === "en" ? "Insights" : "رؤى"}
                      </div>
                    )}
                    {item.interviewQuestions.length > 0 && (
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                        <BookOpen className="w-3 h-3" />
                        {item.interviewQuestions.length} {lang === "en" ? "Questions" : "أسئلة"}
                      </div>
                    )}
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {isAdminAuthenticated ? (
          <div className="mt-32 space-y-8 border-t border-gray-100 dark:border-gray-800 pt-16">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-blue-600">{copy.adminCollectionLabel}</span>
              <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
            </div>

            <AdminEntityCollectionEditor
              title={copy.collectionManagerTitle}
              description={copy.collectionManagerDescription}
              items={items}
              collection={copy.collection}
              createItem={copy.createItem}
              getId={(item) => item.slug}
              getEditPath={(item) => `${copy.listPath}/${item.slug}`}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PageAdminEditor
                title={copy.rawCollectionTitle}
                description={copy.rawCollectionDescription}
                payload={JSON.stringify(items, null, 2)}
                intent="save-collection"
                collection={copy.collection}
              />
              <PageAdminEditor
                title={copy.translationsTitle}
                description={copy.translationsDescription}
                payload={JSON.stringify(translationPayload, null, 2)}
                intent="save-translation-section"
                section={copy.collection}
              />
            </div>
          </div>
        ) : null}
      </motion.div>
    </Section>
  );
};
