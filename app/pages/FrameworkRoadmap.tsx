import { useOutletContext } from 'react-router';
import { TechRoadmapPage } from '../components/tech/TechRoadmapPage';
import type { Framework } from '../data/types';
import { useTechPageCopy } from '../hooks/useTechPageCopy';

export const FrameworkRoadmap = () => {
  const { data } = useOutletContext<{ data: Framework }>();
  const copy = useTechPageCopy('frameworks');

  return <TechRoadmapPage copy={copy} data={data} />;
};
