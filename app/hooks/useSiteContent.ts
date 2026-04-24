import { useRouteLoaderData } from "react-router";
import { useAppSelector } from "../store/hooks";
import type { loader as rootLoader } from "../root";

export const useSiteContent = () => {
  const lang = useAppSelector((state) => state.lang.current);
  const data = useRouteLoaderData<typeof rootLoader>("root");

  if (!data) {
    throw new Error("Site content is not available from the root loader.");
  }

  return data.siteContentByLocale[lang];
};
