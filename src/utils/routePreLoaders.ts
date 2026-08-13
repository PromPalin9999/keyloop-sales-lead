import { ROUTES } from '@/constants';

export const routePreloaders: Record<string, () => Promise<unknown>> = {
  [ROUTES.DASHBOARD]: () => import('@/pages/leads/LeadInboxPage'),
  [ROUTES.LEAD_NEW]: () => import('@/pages/leads/CreateLeadPage'),
  [ROUTES.LEAD_DETAIL]: () => import('@/pages/leads/LeadDetailPage'),
};
