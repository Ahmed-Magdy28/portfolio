import { useTechEntity } from '../context/TechEntityContext';
import { TechRoadmapPage } from '../components/tech/TechRoadmapPage';
import type { Framework } from '../data/types';
import { useTechPageCopy } from '../hooks/useTechPageCopy';

export const FrameworkRoadmap = () => {
  const { data } = useTechEntity<Framework>();
  const copy = useTechPageCopy('frameworks');

  return <TechRoadmapPage copy={copy} data={data} />;
};
