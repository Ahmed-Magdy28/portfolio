import { useParams, Link, Outlet } from 'react-router';
import { useRouteLoaderData } from 'react-router';
import { motion } from 'motion/react';
import { PageAdminEditor } from '../components/admin/PageAdminEditor';
import { IconValue } from '../components/IconValue';
import { Section } from '../components/Section';
import type { Tab } from '../components/Tabs';
import { Tabs } from '../components/Tabs';
import { useAdminSession } from '../hooks/useAdminSession';
import { useSiteContent } from '../hooks/useSiteContent';
import { useTranslation } from '../i18n/useTranslation';
import type { loader as rootLoader } from '../root';

export const LanguageDetail = () => {
  const { slug } = useParams();
  const { t } = useTranslation();
  const { languages } = useSiteContent();
  const { isAdminAuthenticated } = useAdminSession();
  const rootData = useRouteLoaderData<typeof rootLoader>('root');
  const language = languages.find((l) => l.slug === slug);

  if (!rootData) {
    throw new Error('Root data is not available.');
  }

  if (!language) {
    return (
      <Section>
        <div className="text-center">
          <h1 className="text-4xl mb-4">{t.common.notFound}</h1>
          <Link
            to="/languages"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Back to Languages
          </Link>
        </div>
      </Section>
    );
  }

  const tabs: Tab[] = [{ label: t.languages.about, path: `/languages/${slug}` }];

  if (language.insights.length > 0) {
    tabs.push({ label: t.languages.insights, path: `/languages/${slug}/insights` });
  }

  if (language.interviewQuestions.length > 0) {
    tabs.push({ label: t.languages.interview, path: `/languages/${slug}/interview` });
  }

  return (
    <Section>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link
          to="/languages"
          className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-8"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Languages
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <IconValue
            value={language.icon}
            alt={language.title}
            className="text-6xl"
            imageClassName="h-20 w-20 rounded-3xl object-cover"
          />
          <div>
            <h1 className="text-4xl md:text-5xl mb-2">{language.title}</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">{language.description}</p>
          </div>
        </div>

        <Tabs tabs={tabs} />

        <Outlet context={{ data: language }} />

        {isAdminAuthenticated ? (
          <div className="mt-10 space-y-4">
            <PageAdminEditor
              title="Language translations"
              description="Edit the shared translation keys used on language pages."
              payload={JSON.stringify(
                { en: rootData.translations.en.languages, ar: rootData.translations.ar.languages },
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
