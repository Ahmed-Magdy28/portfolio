import { TechDetailLayout } from "../components/tech/TechDetailLayout";
import { useRootData } from "../hooks/useRootData";
import { useSiteContent } from '../hooks/useSiteContent';
import { useTechPageCopy } from "../hooks/useTechPageCopy";
import { useTranslation } from '../i18n/useTranslation';

export const FrameworkDetail = ({ children }: { children?: React.ReactNode }) => {
  const { t } = useTranslation();
  const { frameworks } = useSiteContent();
  const rootData = useRootData();
  const copy = useTechPageCopy("frameworks");

  return (
    <TechDetailLayout
      copy={copy}
      items={frameworks}
      tabLabels={t.frameworks}
      translationPayload={{
        en: rootData.translations.en.frameworks,
        ar: rootData.translations.ar.frameworks,
      }}
    >
      {children}
    </TechDetailLayout>
  );
};
