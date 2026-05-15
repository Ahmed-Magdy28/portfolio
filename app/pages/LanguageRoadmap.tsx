import { useOutletContext } from 'react-router';
import { TechRoadmapPage } from '../components/tech/TechRoadmapPage';
import type { Language } from '../data/types';
import { useTechPageCopy } from '../hooks/useTechPageCopy';

export const LanguageRoadmap = () => {
  const { data } = useOutletContext<{ data: Language }>();
  const copy = useTechPageCopy('languages');

  return <TechRoadmapPage copy={copy} data={data} />;
};
