import { useOutletContext } from 'react-router';
import { TechVersionsPage } from '../components/tech/TechVersionsPage';
import type { Language } from '../data/types';
import { useTechPageCopy } from '../hooks/useTechPageCopy';

export const LanguageVersions = () => {
  const { data } = useOutletContext<{ data: Language }>();
  const copy = useTechPageCopy('languages');

  return <TechVersionsPage copy={copy} data={data} />;
};
