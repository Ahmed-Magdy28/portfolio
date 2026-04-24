import { motion } from "motion/react";
import { Link, useRouteLoaderData } from "react-router";
import { PageAdminEditor } from "../components/admin/PageAdminEditor";
import { VideoPlayer } from "../components/VideoPlayer";
import { Section } from "../components/Section";
import { useAdminSession } from "../hooks/useAdminSession";
import { useSiteContent } from "../hooks/useSiteContent";
import { useTranslation } from "../i18n/useTranslation";
import type { loader as rootLoader } from "../root";

export const About = () => {
  const { t, lang } = useTranslation();
  const { about } = useSiteContent();
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
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl md:text-5xl mb-8">{t.about.title}</h1>

        <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
          <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
            {t.about.description}
          </p>

          {about.paragraphs.map((paragraph, index) => (
            <p
              key={`${paragraph.slice(0, 20)}-${index}`}
              className={`text-gray-600 dark:text-gray-400 leading-relaxed ${index === 0 ? "mt-6" : "mt-4"}`}
            >
              {paragraph}
            </p>
          ))}
        </div>

        {about.video ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mb-12"
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-3xl">About Me Video</h2>
              <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200">
                YouTube
              </span>
            </div>
            <VideoPlayer url={about.video} title={`${t.about.title} video`} />
          </motion.div>
        ) : null}

        <h2 className="text-3xl mb-6">Skills & Technologies</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {about.skills.map((skillGroup, index) => (
            <motion.div
              key={skillGroup.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
            >
              <h3 className="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
                {skillGroup.category}
              </h3>
              <ul className="space-y-2">
                {skillGroup.items.map((skill) => (
                  <li
                    key={skill}
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
                  >
                    <svg
                      className="w-5 h-5 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {skill}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 p-8 bg-linear-to-r from-blue-500 to-purple-600 rounded-lg text-white"
        >
          <h2 className="text-2xl font-semibold mb-4">{about.ctaTitle}</h2>
          <p className="text-lg mb-6">{about.ctaText}</p>
          <Link
            to={about.ctaLinkUrl}
            className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            {about.ctaLinkLabel}
          </Link>
        </motion.div>

        {isAdminAuthenticated ? (
          <div className="mt-12 space-y-4">
            <PageAdminEditor
              title="About page content"
              description="Edit the long-form about text, skill groups, and the CTA block on this page."
              payload={JSON.stringify(about, null, 2)}
              intent="save-content-section"
              section="about"
            />
            <PageAdminEditor
              title="About translations"
              description="Edit the translated title and short description for the About page."
              payload={JSON.stringify(
                { [lang]: rootData.translations[lang].about },
                null,
                2,
              )}
              intent="save-translation-section"
              section="about"
              locale={lang}
            />
          </div>
        ) : null}
      </motion.div>
    </Section>
  );
};
