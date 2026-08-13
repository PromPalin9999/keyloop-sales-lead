export const HOME_SEGMENT = 'dashboard' as const;
export const LEAD_NEW = 'new' as const;
export const LEADS_SEGMENT = 'leads' as const;
export const LEAD_ID_PARAM = ':id' as const;

export const ROUTES = {
  ROOT: '/',
  LOGIN: '/login',
  DASHBOARD: `/${HOME_SEGMENT}`,
  LEAD_NEW: `/${HOME_SEGMENT}/${LEAD_NEW}`,
  LEAD_DETAIL: `/${LEADS_SEGMENT}/${LEAD_ID_PARAM}`,
} as const;

export const buildLeadDetailRoute = (id: string) =>
  ROUTES.LEAD_DETAIL.replace(LEAD_ID_PARAM, id);
