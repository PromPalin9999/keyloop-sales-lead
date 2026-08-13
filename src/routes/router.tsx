import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AdminRoute } from './AdminRoute';
import RouteErrorBoundary from './RouteErrorBoundary';
import { ROUTES } from '@/constants';
import { PrivateLayout, PublicLayout } from '@/layouts';
import { NotFoundPage } from '@/pages';

const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const LeadInboxPage = lazy(() => import('@/pages/leads/LeadInboxPage'));
const LeadDetailPage = lazy(() => import('@/pages/leads/LeadDetailPage'));
const CreateLeadPage = lazy(() => import('@/pages/leads/CreateLeadPage'));

export const router = createBrowserRouter([
  {
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        path: ROUTES.ROOT,
        element: <Navigate to={ROUTES.DASHBOARD} replace />,
      },
      {
        element: <PublicLayout />,
        children: [{ path: ROUTES.LOGIN, element: <LoginPage /> }],
      },

      {
        element: <PrivateLayout />,
        children: [
          { path: ROUTES.DASHBOARD, element: <LeadInboxPage /> },
          {
            element: <AdminRoute />,
            children: [{ path: ROUTES.LEAD_NEW, element: <CreateLeadPage /> }],
          },
          { path: ROUTES.LEAD_DETAIL, element: <LeadDetailPage /> },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
