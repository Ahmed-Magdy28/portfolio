import { useTechEntity } from '../context/TechEntityContext';
import { TechAccordionPage } from '../components/tech/TechAccordionPage';
import type { Language } from '../data/types';
import { useTechPageCopy } from '../hooks/useTechPageCopy';

export const LanguageInsights = () => {
  const { data } = useTechEntity<Language>();
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
