import { useOutletContext } from 'react-router';
import { TechAccordionPage } from '../components/tech/TechAccordionPage';
import type { Framework } from '../data/types';
import { useTechPageCopy } from '../hooks/useTechPageCopy';

export const FrameworkInsights = () => {
  const { data } = useOutletContext<{ data: Framework }>();
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
