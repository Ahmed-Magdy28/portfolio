import { useRouteLoaderData } from 'react-router';
import { useAppSelector } from '../store/hooks';
import type { loader as rootLoader } from '../root';

export const useTranslation = () => {
  const lang = useAppSelector((state) => state.lang.current);
  const data = useRouteLoaderData<typeof rootLoader>('root');

  if (!data) {
    throw new Error('Translations are not available from the root loader.');
  }

  return {
    t: data.translations[lang],
    lang,
    isRTL: lang === 'ar',
  };
};
