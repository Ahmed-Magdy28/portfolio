import { useOutletContext } from "react-router";
import { TechAboutPage } from "../components/tech/TechAboutPage";
import type { Language } from "../data/types";
import { useTechPageCopy } from "../hooks/useTechPageCopy";
import { useTranslation } from "../i18n/useTranslation";

export const LanguageAbout = () => {
  const { t } = useTranslation();
  const { data } = useOutletContext<{ data: Language }>();
  const copy = useTechPageCopy("languages");

  return (
    <TechAboutPage
      copy={copy}
      data={data}
      labels={{
        about: t.languages.about,
        insights: t.languages.insights,
        interview: t.languages.interview,
      }}
    />
  );
};
