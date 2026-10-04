'use client';

import { useAppSelector } from '../store/hooks';
import { useRootDataContext } from '../context/RootDataContext';

export const useTranslation = () => {
  const lang = useAppSelector((state) => state.lang.current);
  const data = useRootDataContext();

  return {
    t: data.translations[lang],
    lang,
    isRTL: lang === 'ar',
  };
};
