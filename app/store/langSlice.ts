import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type Language = 'en' | 'ar';

interface LangState {
  current: Language;
  direction: 'ltr' | 'rtl';
}

const isBrowser = typeof window !== 'undefined';

const getInitialLanguage = (): Language => {
  if (!isBrowser) return 'en';

  const stored = localStorage.getItem('language');
  if (stored === 'en' || stored === 'ar') return stored;
  return 'en';
};

const initialLanguage = getInitialLanguage();

const initialState: LangState = {
  current: initialLanguage,
  direction: initialLanguage === 'ar' ? 'rtl' : 'ltr',
};

const applyLanguage = (language: Language, direction: 'ltr' | 'rtl') => {
  if (!isBrowser) return;

  localStorage.setItem('language', language);
  document.documentElement.setAttribute('lang', language);
  document.documentElement.setAttribute('dir', direction);
};

const langSlice = createSlice({
  name: 'lang',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.current = action.payload;
      state.direction = action.payload === 'ar' ? 'rtl' : 'ltr';
      applyLanguage(action.payload, state.direction);
    },
    toggleLanguage: (state) => {
      const newLang: Language = state.current === 'en' ? 'ar' : 'en';
      state.current = newLang;
      state.direction = newLang === 'ar' ? 'rtl' : 'ltr';
      applyLanguage(newLang, state.direction);
    },
  },
});

export const { setLanguage, toggleLanguage } = langSlice.actions;
export default langSlice.reducer;
