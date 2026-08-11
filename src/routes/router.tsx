import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import RouteErrorBoundary from "./RouteErrorBoundary";
import { ROUTES } from "@/constants";
import { PrivateLayout, PublicLayout } from "@/layouts";
import { NotFoundPage } from "@/pages";

const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const DashboardPage = lazy(() => import("@/pages/dashboard/DashboardPage"));
const LeadInboxPage = lazy(() => import("@/pages/leads/LeadInboxPage"));
const LeadDetailPage = lazy(() => import("@/pages/leads/LeadDetailPage"));
const CreateLeadPage = lazy(() => import("@/pages/leads/CreateLeadPage"));

export const router = createBrowserRouter([
  {
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        path: ROUTES.ROOT,
        element: <Navigate to={ROUTES.LEADS} replace />,
      },
      {
        element: <PublicLayout />,
        children: [{ path: ROUTES.LOGIN, element: <LoginPage /> }],
      },

      {
        element: <PrivateLayout />,
        children: [
          { path: ROUTES.DASHBOARD, element: <DashboardPage /> },
          { path: ROUTES.LEADS, element: <LeadInboxPage /> },
          { path: ROUTES.LEAD_NEW, element: <CreateLeadPage /> },
          { path: ROUTES.LEAD_DETAIL, element: <LeadDetailPage /> },
        ],
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
