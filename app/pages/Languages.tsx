import { Code2 } from "lucide-react";
import { TechCollectionPage } from "../components/tech/TechCollectionPage";
import { useRootData } from "../hooks/useRootData";
import { useSiteContent } from "../hooks/useSiteContent";
import { useTechPageCopy } from "../hooks/useTechPageCopy";
import { useTranslation } from "../i18n/useTranslation";

export const Languages = () => {
  const { t } = useTranslation();
  const { languages } = useSiteContent();
  const rootData = useRootData();
  const copy = useTechPageCopy("languages");

  return (
    <TechCollectionPage
      copy={copy}
      icon={Code2}
      items={languages}
      title={t.languages.title}
      translationPayload={{
        en: rootData.translations.en.languages,
        ar: rootData.translations.ar.languages,
      }}
    />
  );
};
