'use client';

import { type ReactNode, useEffect } from 'react';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { store } from './store';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { setTheme } from './store/themeSlice';
import { setLanguage } from './store/langSlice';
import { RootDataProvider, type RootData } from './context/RootDataContext';
import { Toaster } from './components/ui/sonner';

function StoreSynchronizer({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.mode);
  const lang = useAppSelector((state) => state.lang.current);

  useEffect(() => {
    dispatch(setTheme(theme));
    dispatch(setLanguage(lang));
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return <>{children}</>;
}

export function Providers({
  rootData,
  children,
}: {
  rootData: RootData;
  children: ReactNode;
}) {
  return (
    <Provider store={store}>
      <HelmetProvider>
        <RootDataProvider data={rootData}>
          <StoreSynchronizer>
            {children}
            <Toaster position="bottom-right" richColors />
          </StoreSynchronizer>
        </RootDataProvider>
      </HelmetProvider>
    </Provider>
  );
}
