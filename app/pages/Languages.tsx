import { motion } from "motion/react";
import { Link } from "react-router";
import { useRouteLoaderData } from "react-router";
import { AdminEntityCollectionEditor } from "../components/admin/AdminEntityCollectionEditor";
import { Card } from "../components/Card";
import { IconValue } from "../components/IconValue";
import { PageAdminEditor } from "../components/admin/PageAdminEditor";
import { Section } from "../components/Section";
import { useAdminSession } from "../hooks/useAdminSession";
import { useSiteContent } from "../hooks/useSiteContent";
import { useTranslation } from "../i18n/useTranslation";
import type { loader as rootLoader } from "../root";

export const Languages = () => {
  const { t } = useTranslation();
  const { languages } = useSiteContent();
  const { isAdminAuthenticated } = useAdminSession();
  const rootData = useRouteLoaderData<typeof rootLoader>("root");

  if (!rootData) {
    throw new Error("Root data is not available.");
  }

  return (
    <Section>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl md:text-5xl mb-4">{t.languages.title}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
          Deep dives into programming languages I work with
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {languages.map((language, index) => (
            <motion.div
              key={language.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/languages/${language.slug}`}>
                <Card hover className="h-full">
                  <div className="mb-4">
                    <IconValue
                      value={language.icon}
                      alt={language.title}
                      className="text-5xl"
                      imageClassName="h-16 w-16 rounded-2xl object-cover"
                    />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                    {language.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {language.description}
                  </p>

                  {language.insights.length > 0 ||
                  language.interviewQuestions.length > 0 ? (
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>{language.insights.length} insights</span>
                      <span>•</span>
                      <span>
                        {language.interviewQuestions.length} questions
                      </span>
                    </div>
                  ) : null}
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {isAdminAuthenticated ? (
          <div className="mt-12 space-y-4">
            <AdminEntityCollectionEditor
              title="Languages manager"
              description="Edit only the language cards here. Open a language to manage its insights and interview questions in place."
              items={languages}
              collection="languages"
              createItem={() => ({
                slug: `language-${Date.now()}`,
                title: "New Language",
                description: "Add a short description",
                icon: "🆕",
                insights: [],
                interviewQuestions: [],
              })}
              getId={(item) => item.slug}
              getEditPath={(item) => `/languages/${item.slug}`}
            />
            <PageAdminEditor
              title="Languages collection"
              description="Add new languages, remove old ones, and manage the full set of language entries from this page."
              payload={JSON.stringify(languages, null, 2)}
              intent="save-collection"
              collection="languages"
            />
            <PageAdminEditor
              title="Language page translations"
              description="Edit the translation keys used across language pages."
              payload={JSON.stringify(
                {
                  en: rootData.translations.en.languages,
                  ar: rootData.translations.ar.languages,
                },
                null,
                2,
              )}
              intent="save-translation-section"
              section="languages"
            />
          </div>
        ) : null}
      </motion.div>
    </Section>
  );
};
