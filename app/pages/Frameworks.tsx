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

export const Frameworks = () => {
  const { t } = useTranslation();
  const { frameworks } = useSiteContent();
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
        <h1 className="text-4xl md:text-5xl mb-4">{t.frameworks.title}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
          Frameworks and tools I use to build modern applications
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {frameworks.map((framework, index) => (
            <motion.div
              key={framework.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/frameworks/${framework.slug}`}>
                <Card hover className="h-full">
                  <div className="mb-4">
                    <IconValue
                      value={framework.icon}
                      alt={framework.title}
                      className="text-5xl"
                      imageClassName="h-16 w-16 rounded-2xl object-cover"
                    />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                    {framework.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {framework.description}
                  </p>

                  {framework.insights.length > 0 ||
                    (framework.interviewQuestions.length > 0 && (
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>{framework.insights.length} insights</span>
                        <span>•</span>
                        <span>
                          {framework.interviewQuestions.length} questions
                        </span>
                      </div>
                    ))}
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {isAdminAuthenticated ? (
          <div className="mt-12 space-y-4">
            <AdminEntityCollectionEditor
              title="Frameworks manager"
              description="Edit only the framework cards here. Open a framework to manage its insights and interview questions in place."
              items={frameworks}
              collection="frameworks"
              createItem={() => ({
                slug: `framework-${Date.now()}`,
                title: "New Framework",
                description: "Add a short description",
                icon: "🆕",
                insights: [],
                interviewQuestions: [],
              })}
              getId={(item) => item.slug}
              getEditPath={(item) => `/frameworks/${item.slug}`}
            />
            <PageAdminEditor
              title="Frameworks collection"
              description="Add new frameworks or tools, remove entries, and update the full framework collection from this page."
              payload={JSON.stringify(frameworks, null, 2)}
              intent="save-collection"
              collection="frameworks"
            />
            <PageAdminEditor
              title="Framework translations"
              description="Edit the shared translation keys used across framework pages."
              payload={JSON.stringify(
                {
                  en: rootData.translations.en.frameworks,
                  ar: rootData.translations.ar.frameworks,
                },
                null,
                2,
              )}
              intent="save-translation-section"
              section="frameworks"
            />
          </div>
        ) : null}
      </motion.div>
    </Section>
  );
};
