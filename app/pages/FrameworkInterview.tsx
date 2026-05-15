import { useOutletContext } from 'react-router';
import { TechAccordionPage } from '../components/tech/TechAccordionPage';
import type { Framework } from '../data/types';
import { useTechPageCopy } from '../hooks/useTechPageCopy';

export const FrameworkInterview = () => {
  const { data } = useOutletContext<{ data: Framework }>();
  const copy = useTechPageCopy('frameworks');

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
