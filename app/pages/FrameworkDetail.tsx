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

export const FrameworkDetail = () => {
  const { slug } = useParams();
  const { t } = useTranslation();
  const { frameworks } = useSiteContent();
  const { isAdminAuthenticated } = useAdminSession();
  const rootData = useRouteLoaderData<typeof rootLoader>('root');
  const framework = frameworks.find((f) => f.slug === slug);

  if (!rootData) {
    throw new Error('Root data is not available.');
  }

  if (!framework) {
    return (
      <Section>
        <div className="text-center">
          <h1 className="text-4xl mb-4">{t.common.notFound}</h1>
          <Link
            to="/frameworks"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Back to Frameworks
          </Link>
        </div>
      </Section>
    );
  }

  const tabs: Tab[] = [{ label: t.frameworks.about, path: `/frameworks/${slug}` }];

  if (framework.insights.length > 0) {
    tabs.push({ label: t.frameworks.insights, path: `/frameworks/${slug}/insights` });
  }

  if (framework.interviewQuestions.length > 0) {
    tabs.push({ label: t.frameworks.interview, path: `/frameworks/${slug}/interview` });
  }

  return (
    <Section>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link
          to="/frameworks"
          className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-8"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Frameworks
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <IconValue
            value={framework.icon}
            alt={framework.title}
            className="text-6xl"
            imageClassName="h-20 w-20 rounded-3xl object-cover"
          />
          <div>
            <h1 className="text-4xl md:text-5xl mb-2">{framework.title}</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">{framework.description}</p>
          </div>
        </div>

        <Tabs tabs={tabs} />

        <Outlet context={{ data: framework }} />

        {isAdminAuthenticated ? (
          <div className="mt-10 space-y-4">
            <PageAdminEditor
              title="Framework translations"
              description="Edit the shared translation keys used on framework pages."
              payload={JSON.stringify(
                { en: rootData.translations.en.frameworks, ar: rootData.translations.ar.frameworks },
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
