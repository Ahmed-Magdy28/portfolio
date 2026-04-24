import en from './locales/en.json';
import ar from './locales/ar.json';

export type TranslationKeys = typeof en;
export type Locale = 'en' | 'ar';

export const translations = {
  en,
  ar,
} satisfies Record<Locale, TranslationKeys>;
