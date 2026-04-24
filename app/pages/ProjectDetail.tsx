import { useParams, Link } from 'react-router';
import { useRouteLoaderData } from 'react-router';
import { motion } from 'motion/react';
import { AdminSimpleEntityForm } from '../components/admin/AdminSimpleEntityForm';
import { Section } from '../components/Section';
import { Button } from '../components/Button';
import { VideoPlayer } from '../components/VideoPlayer';
import { PageAdminEditor } from '../components/admin/PageAdminEditor';
import { useAdminSession } from '../hooks/useAdminSession';
import { useSiteContent } from '../hooks/useSiteContent';
import { useTranslation } from '../i18n/useTranslation';
import type { loader as rootLoader } from '../root';

export const ProjectDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { projects } = useSiteContent();
  const { isAdminAuthenticated } = useAdminSession();
  const rootData = useRouteLoaderData<typeof rootLoader>('root');
  const project = projects.find((p) => p.id === id);

  if (!rootData) {
    throw new Error('Root data is not available.');
  }

  if (!project) {
    return (
      <Section>
        <div className="text-center">
          <h1 className="text-4xl mb-4">{t.common.notFound}</h1>
          <Button to="/projects">{t.common.backHome}</Button>
        </div>
      </Section>
    );
  }

  return (
    <Section>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-8"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Projects
        </Link>

        <h1 className="text-4xl md:text-5xl mb-4">{project.title}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">{project.description}</p>

        <div className="flex flex-wrap gap-3 mb-8">
          {project.liveUrl && (
            <Button href={project.liveUrl} external variant="primary">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              {t.projects.liveDemo}
            </Button>
          )}
          {project.sourceUrl && (
            <Button href={project.sourceUrl} external variant="outline">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
              {t.projects.sourceCode}
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Overview</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {project.fullDescription}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">{t.projects.challenges}</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{project.challenges}</p>
            </div>

            {project.video && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">{t.projects.video}</h2>
                <VideoPlayer url={project.video} title={project.title} />
              </div>
            )}
          </div>

          <div>
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 sticky top-24">
              <h3 className="text-xl font-semibold mb-4">{t.projects.techStack}</h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {isAdminAuthenticated ? (
          <div className="mt-12 space-y-4">
            <AdminSimpleEntityForm
              title="Project details"
              description="Edit this project's text, links, tech stack, and video from simple fields."
              collection="projects"
              itemId={project.id}
              entity={project}
            />
            <PageAdminEditor
              title="Advanced project JSON"
              description="Fallback advanced editor if you want the entire project object."
              payload={JSON.stringify(project, null, 2)}
              intent="save-entity"
              collection="projects"
              itemId={project.id}
            />
            <PageAdminEditor
              title="Project translations"
              description="Edit the translation keys used on project detail pages."
              payload={JSON.stringify(
                { en: rootData.translations.en.projects, ar: rootData.translations.ar.projects },
                null,
                2,
              )}
              intent="save-translation-section"
              section="projects"
            />
          </div>
        ) : null}
      </motion.div>
    </Section>
  );
};
