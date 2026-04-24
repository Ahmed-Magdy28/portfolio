import { useOutletContext, useRouteLoaderData } from "react-router";
import { AdminSimpleEntityForm } from "../components/admin/AdminSimpleEntityForm";
import { useAdminSession } from "../hooks/useAdminSession";
import type { Language } from "../data/types";
import { useTranslation } from "../i18n/useTranslation";
import { PageAdminEditor } from "~/components/admin/PageAdminEditor";
import type { loader as rootLoader } from "../root";
import { AdminArrayItemsEditor } from "~/components/admin/AdminArrayItemsEditor";

export const LanguageAbout = () => {
  const rootData = useRouteLoaderData<typeof rootLoader>("root");
  if (!rootData) {
    throw new Error("Root data is not available.");
  }

  const { t } = useTranslation();
  const { data } = useOutletContext<{ data: Language }>();
  const { isAdminAuthenticated } = useAdminSession();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-3 text-2xl font-semibold">{t.languages.about}</h2>
        <p className="text-base leading-7 text-gray-700 dark:text-gray-300">
          {data.aboutDescription || data.description}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {t.languages.insights}
          </div>
          <div className="mt-2 text-3xl font-semibold">
            {data.insights.length}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {t.languages.interview}
          </div>
          <div className="mt-2 text-3xl font-semibold">
            {data.interviewQuestions.length}
          </div>
        </div>
      </div>
      {/* about */}
      {isAdminAuthenticated ? (
        <AdminSimpleEntityForm
          title="Language about"
          description="Edit the card description and the longer about text for this language here."
          collection="languages"
          itemId={data.slug}
          entity={data}
        />
      ) : null}

      {/* insights */}
      {isAdminAuthenticated && data.insights.length === 0 ? (
        <AdminArrayItemsEditor
          title="Insights manager"
          description="Edit and reorder only the insights for this language here."
          items={data.insights}
          entity={data}
          entityField="insights"
          collection="languages"
          itemId={data.slug}
        />
      ) : null}
      {/* interview questions */}
      {isAdminAuthenticated && data.interviewQuestions.length === 0 ? (
        <AdminArrayItemsEditor
          title="Interview questions manager"
          description="Edit and reorder only the interview questions for this language here."
          items={data.interviewQuestions}
          entity={data}
          entityField="interviewQuestions"
          collection="languages"
          itemId={data.slug}
        />
      ) : null}
    </div>
  );
};
