import { useTechEntity } from '../context/TechEntityContext';
import { TechAccordionPage } from '../components/tech/TechAccordionPage';
import type { Framework } from '../data/types';
import { useTechPageCopy } from '../hooks/useTechPageCopy';

export const FrameworkInsights = () => {
  const { data } = useTechEntity<Framework>();
  const copy = useTechPageCopy('frameworks');

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
