export const HOME_SEGMENT = "dashboard" as const;

export const ROUTES = {
  ROOT: "/",
  LOGIN: "/login",
  DASHBOARD: `/${HOME_SEGMENT}`,
  LEADS: "/leads",
  LEAD_NEW: "/leads/new",
  LEAD_DETAIL: "/leads/:id",
} as const;

export const buildLeadDetailRoute = (id: string) => `/leads/${id}`;
