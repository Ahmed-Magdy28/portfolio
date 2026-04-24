import { useOutletContext } from 'react-router';
import { Accordion } from '../components/Accordion';
import { AdminArrayItemsEditor } from '../components/admin/AdminArrayItemsEditor';
import type { Framework } from '../data/types';
import { useAdminSession } from '../hooks/useAdminSession';

export const FrameworkInsights = () => {
  const { data } = useOutletContext<{ data: Framework }>();
  const { isAdminAuthenticated } = useAdminSession();

  return (
    <div className="space-y-6">
      <Accordion items={data.insights} />

      {isAdminAuthenticated ? (
        <AdminArrayItemsEditor
          title="Insights manager"
          description="Edit and reorder only the insights for this framework here."
          items={data.insights}
          entity={data}
          entityField="insights"
          collection="frameworks"
          itemId={data.slug}
        />
      ) : null}
    </div>
  );
};
