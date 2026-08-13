import { Navigate, Outlet } from 'react-router-dom';
import { useGetMe } from '@/apis';
import { FallbackLoading } from '@/components';
import { ROUTES } from '@/constants';
import { useAuthStore } from '@/store';

export const AdminRoute = () => {
  const isSessionLoading = useAuthStore((state) => state.isSessionLoading);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const profile = useAuthStore((state) => state.profile);
  const { isError: isGetMeError } = useGetMe();

  const isResolvingAuth =
    isSessionLoading || (isLoggedIn && !profile && !isGetMeError);

  if (isResolvingAuth) {
    return <FallbackLoading />;
  }

  return isAdmin ? <Outlet /> : <Navigate to={ROUTES.DASHBOARD} replace />;
};
