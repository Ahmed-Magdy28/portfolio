import { useOutletContext } from 'react-router';
import { TechAboutPage } from '../components/tech/TechAboutPage';
import type { Framework } from '../data/types';
import { useTechPageCopy } from '../hooks/useTechPageCopy';
import { useTranslation } from '../i18n/useTranslation';

export const FrameworkAbout = () => {
  const { t } = useTranslation();
  const { data } = useOutletContext<{ data: Framework }>();
  const copy = useTechPageCopy('frameworks');

  return (
    <TechAboutPage
      copy={copy}
      data={data}
      labels={{
        about: t.frameworks.about,
        insights: t.frameworks.insights,
        interview: t.frameworks.interview,
      }}
    />
  );
};
