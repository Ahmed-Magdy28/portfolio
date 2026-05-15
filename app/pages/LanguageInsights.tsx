import { useOutletContext } from 'react-router';
import { TechAccordionPage } from '../components/tech/TechAccordionPage';
import type { Language } from '../data/types';
import { useTechPageCopy } from '../hooks/useTechPageCopy';

export const LanguageInsights = () => {
  const { data } = useOutletContext<{ data: Language }>();
  const copy = useTechPageCopy('languages');

  return (
    <TechAccordionPage
      copy={copy}
      data={data}
      description={copy.insightsAdminDescription}
      entityField="insights"
      items={data.insights}
      title="Insights Manager"
    />
  );
};
