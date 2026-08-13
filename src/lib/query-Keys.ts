import type { LeadListParams } from '@/apis/leads/types';

export const LEADS_KEY = 'leads' as const;
export const LEAD_DETAILS_KEY = 'lead' as const;
export const TIMELINE_LEAD_ACT_KEY = 'time-line-lead-activities' as const;
export const ME_KEY = 'me' as const;
export const STAFF_DIRECTORY_KEY = 'staff-directory' as const;

export const queryKeys = {
  leads: (params?: LeadListParams) => [LEADS_KEY, params],
  leadDetails: (id?: string) => [LEAD_DETAILS_KEY, id],
  timeLineLeadAct: (leadId?: string) => [TIMELINE_LEAD_ACT_KEY, leadId],

  me: (userId?: string) => [ME_KEY, userId],
  staffDirectory: [STAFF_DIRECTORY_KEY],
};

export const getParamsFromQueryKey: <T>(
  queryKey: readonly unknown[],
  paramIndex?: number,
) => T | null = <T>(queryKey: readonly unknown[], paramIndex?: number) => {
  if (!Array.isArray(queryKey)) {
    return null;
  }
  const params = queryKey.at(paramIndex ?? 1) as T;
  return params;
};
