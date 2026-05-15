import { Library } from "lucide-react";
import { TechCollectionPage } from "../components/tech/TechCollectionPage";
import { useRootData } from "../hooks/useRootData";
import { useSiteContent } from "../hooks/useSiteContent";
import { useTechPageCopy } from "../hooks/useTechPageCopy";
import { useTranslation } from "../i18n/useTranslation";

export const Frameworks = () => {
  const { t } = useTranslation();
  const { frameworks } = useSiteContent();
  const rootData = useRootData();
  const copy = useTechPageCopy("frameworks");

  return (
    <TechCollectionPage
      copy={copy}
      icon={Library}
      items={frameworks}
      title={t.frameworks.title}
      translationPayload={{
        en: rootData.translations.en.frameworks,
        ar: rootData.translations.ar.frameworks,
      }}
    />
  );
};
