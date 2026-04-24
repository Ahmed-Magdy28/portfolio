import { useRouteLoaderData } from 'react-router';
import type { loader as rootLoader } from '../root';

export const useAdminSession = () => {
  const data = useRouteLoaderData<typeof rootLoader>('root');

  if (!data) {
    throw new Error('Admin session data is not available from the root loader.');
  }

  return {
    adminRoutePath: data.adminRoutePath,
    isAdminAuthenticated: data.isAdminAuthenticated,
  };
};
