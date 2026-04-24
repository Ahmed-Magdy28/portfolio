import { useOutletContext } from 'react-router';
import { Accordion } from '../components/Accordion';
import { AdminArrayItemsEditor } from '../components/admin/AdminArrayItemsEditor';
import type { Language } from '../data/types';
import { useAdminSession } from '../hooks/useAdminSession';

export const LanguageInsights = () => {
  const { data } = useOutletContext<{ data: Language }>();
  const { isAdminAuthenticated } = useAdminSession();

  return (
    <div className="space-y-6">
      <Accordion items={data.insights} />

      {isAdminAuthenticated ? (
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
    </div>
  );
};
