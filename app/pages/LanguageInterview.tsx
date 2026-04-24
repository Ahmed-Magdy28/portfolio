import { useOutletContext } from 'react-router';
import { Accordion } from '../components/Accordion';
import { AdminArrayItemsEditor } from '../components/admin/AdminArrayItemsEditor';
import type { Language } from '../data/types';
import { useAdminSession } from '../hooks/useAdminSession';

export const LanguageInterview = () => {
  const { data } = useOutletContext<{ data: Language }>();
  const { isAdminAuthenticated } = useAdminSession();

  return (
    <div className="space-y-6">
      <Accordion items={data.interviewQuestions} />

      {isAdminAuthenticated ? (
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
