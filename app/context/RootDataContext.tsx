'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { ContentLocale, SiteContent } from '../lib/content.server';
import type { Locale, TranslationKeys } from '../i18n/translations';

export interface RootData {
  siteContentByLocale: Record<ContentLocale, SiteContent>;
  translations: Record<Locale, TranslationKeys>;
  adminRoutePath: string;
  isAdminAuthenticated: boolean;
  siteUrl: string;
}

const RootDataContext = createContext<RootData | null>(null);

export const RootDataProvider = ({
  data,
  children,
}: {
  data: RootData;
  children: ReactNode;
}) => {
  return (
    <RootDataContext.Provider value={data}>
      {children}
    </RootDataContext.Provider>
  );
};

export const useRootDataContext = () => {
  const context = useContext(RootDataContext);
  if (!context) {
    throw new Error('useRootDataContext must be used within a RootDataProvider');
  }
  return context;
};
