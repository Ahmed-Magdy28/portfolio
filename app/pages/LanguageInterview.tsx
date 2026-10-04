import { useTechEntity } from '../context/TechEntityContext';
import { TechAccordionPage } from '../components/tech/TechAccordionPage';
import type { Language } from '../data/types';
import { useTechPageCopy } from '../hooks/useTechPageCopy';

export const LanguageInterview = () => {
  const { data } = useTechEntity<Language>();
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
