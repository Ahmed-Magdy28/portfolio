import { Outlet } from 'react-router';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setTheme } from '../store/themeSlice';
import { setLanguage } from '../store/langSlice';

export const RootLayout = () => {
  const theme = useAppSelector((state) => state.theme.mode);
  const lang = useAppSelector((state) => state.lang);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setTheme(theme));
    dispatch(setLanguage(lang.current));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
