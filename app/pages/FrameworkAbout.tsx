import { useOutletContext } from 'react-router';
import { AdminSimpleEntityForm } from '../components/admin/AdminSimpleEntityForm';
import { useAdminSession } from '../hooks/useAdminSession';
import type { Framework } from '../data/types';
import { useTranslation } from '../i18n/useTranslation';

export const FrameworkAbout = () => {
  const { t } = useTranslation();
  const { data } = useOutletContext<{ data: Framework }>();
  const { isAdminAuthenticated } = useAdminSession();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-3 text-2xl font-semibold">{t.frameworks.about}</h2>
        <p className="text-base leading-7 text-gray-700 dark:text-gray-300">
          {data.aboutDescription || data.description}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {t.frameworks.insights}
          </div>
          <div className="mt-2 text-3xl font-semibold">{data.insights.length}</div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {t.frameworks.interview}
          </div>
          <div className="mt-2 text-3xl font-semibold">{data.interviewQuestions.length}</div>
        </div>
      </div>

      {isAdminAuthenticated ? (
        <AdminSimpleEntityForm
          title="Framework about"
          description="Edit the card description and the longer about text for this framework here."
          collection="frameworks"
          itemId={data.slug}
          entity={data}
        />
      ) : null}
    </div>
  );
};
