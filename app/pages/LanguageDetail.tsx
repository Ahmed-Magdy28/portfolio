import { TechDetailLayout } from "../components/tech/TechDetailLayout";
import { useRootData } from "../hooks/useRootData";
import { useSiteContent } from '../hooks/useSiteContent';
import { useTechPageCopy } from "../hooks/useTechPageCopy";
import { useTranslation } from '../i18n/useTranslation';

export const LanguageDetail = ({ children }: { children?: React.ReactNode }) => {
  const { t } = useTranslation();
  const { languages } = useSiteContent();
  const rootData = useRootData();
  const copy = useTechPageCopy("languages");

  return (
    <TechDetailLayout
      copy={copy}
      items={languages}
      tabLabels={t.languages}
      translationPayload={{
        en: rootData.translations.en.languages,
        ar: rootData.translations.ar.languages,
      }}
    >
      {children}
    </TechDetailLayout>
  );
};
