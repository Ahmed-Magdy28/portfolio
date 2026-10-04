import { useTechEntity } from '../context/TechEntityContext';
import { TechRoadmapPage } from '../components/tech/TechRoadmapPage';
import type { Language } from '../data/types';
import { useTechPageCopy } from '../hooks/useTechPageCopy';

export const LanguageRoadmap = () => {
  const { data } = useTechEntity<Language>();
  const copy = useTechPageCopy('languages');

  return <TechRoadmapPage copy={copy} data={data} />;
};
