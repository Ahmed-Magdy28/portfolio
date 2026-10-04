'use client';

import { useAppSelector } from "../store/hooks";
import { useRootDataContext } from "../context/RootDataContext";

export const useSiteContent = () => {
  const lang = useAppSelector((state) => state.lang.current);
  const data = useRootDataContext();

  return data.siteContentByLocale[lang];
};
