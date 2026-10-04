'use client';

import { useRootDataContext } from '../context/RootDataContext';

export const useAdminSession = () => {
  const data = useRootDataContext();

  return {
    adminRoutePath: data.adminRoutePath,
    isAdminAuthenticated: data.isAdminAuthenticated,
  };
};
