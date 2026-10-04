import { useTechEntity } from '../context/TechEntityContext';
import { TechVersionsPage } from '../components/tech/TechVersionsPage';
import type { Language } from '../data/types';
import { useTechPageCopy } from '../hooks/useTechPageCopy';

export const LanguageVersions = () => {
  const { data } = useTechEntity<Language>();
  const copy = useTechPageCopy('languages');

  return <TechVersionsPage copy={copy} data={data} />;
};
