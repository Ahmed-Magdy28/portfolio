import { useOutletContext } from 'react-router';
import { TechAccordionPage } from '../components/tech/TechAccordionPage';
import type { Language } from '../data/types';
import { useTechPageCopy } from '../hooks/useTechPageCopy';

export const LanguageInterview = () => {
  const { data } = useOutletContext<{ data: Language }>();
  const copy = useTechPageCopy('languages');

  return (
    <TechAccordionPage
      copy={copy}
      data={data}
      description={copy.interviewAdminDescription}
      entityField="interviewQuestions"
      items={data.interviewQuestions}
      title="Interview Questions Manager"
    />
  );
};
