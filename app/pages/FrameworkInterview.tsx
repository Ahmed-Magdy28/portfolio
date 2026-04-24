import { useOutletContext } from 'react-router';
import { Accordion } from '../components/Accordion';
import { AdminArrayItemsEditor } from '../components/admin/AdminArrayItemsEditor';
import type { Framework } from '../data/types';
import { useAdminSession } from '../hooks/useAdminSession';

export const FrameworkInterview = () => {
  const { data } = useOutletContext<{ data: Framework }>();
  const { isAdminAuthenticated } = useAdminSession();

  return (
    <div className="space-y-6">
      <Accordion items={data.interviewQuestions} />

      {isAdminAuthenticated ? (
        <AdminArrayItemsEditor
          title="Interview questions manager"
          description="Edit and reorder only the interview questions for this framework here."
          items={data.interviewQuestions}
          entity={data}
          entityField="interviewQuestions"
          collection="frameworks"
          itemId={data.slug}
        />
      ) : null}
    </div>
  );
};
