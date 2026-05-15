import { useOutletContext } from 'react-router';
import { TechVersionsPage } from '../components/tech/TechVersionsPage';
import type { Framework } from '../data/types';
import { useTechPageCopy } from '../hooks/useTechPageCopy';

export const FrameworkVersions = () => {
  const { data } = useOutletContext<{ data: Framework }>();
  const copy = useTechPageCopy('frameworks');

  return <TechVersionsPage copy={copy} data={data} />;
};
