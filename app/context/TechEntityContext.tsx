'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { TechEntity } from '../components/tech/types';

const TechEntityContext = createContext<{ data: any } | null>(null);

export const TechEntityProvider = ({
  data,
  children,
}: {
  data: any;
  children: ReactNode;
}) => (
  <TechEntityContext.Provider value={{ data }}>
    {children}
  </TechEntityContext.Provider>
);

export const useTechEntity = <T extends TechEntity = TechEntity>() => {
  const ctx = useContext(TechEntityContext);
  if (!ctx) {
    throw new Error('useTechEntity must be used within TechEntityProvider');
  }
  return ctx as { data: T };
};
