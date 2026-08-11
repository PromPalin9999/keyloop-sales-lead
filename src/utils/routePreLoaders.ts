import { ROUTES } from "@/constants";

export const routePreloaders: Record<string, () => Promise<unknown>> = {
  [ROUTES.DASHBOARD]: () => import("@/pages/dashboard/DashboardPage"),
  [ROUTES.LEADS]: () => import("@/pages/leads/LeadInboxPage"),
  [ROUTES.LEAD_NEW]: () => import("@/pages/leads/CreateLeadPage"),
  // [ROUTES.LOGIN]:() => import('@/pages/dashboard/DashboardPage');
};
