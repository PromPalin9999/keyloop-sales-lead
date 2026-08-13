import type { ActivityType, LeadSource, LeadStatus } from '@/constants';
import type { FilterParam, SortParam } from '@/types';

export type Lead = {
  id: string;
  customer_name: string;
  email: string | null;
  phone: string | null;
  vehicle_interest: string;
  message: string | null;
  source: LeadSource;
  status: LeadStatus;
  assigned_to: string | null;
  assigned_to_name: string | null;
  created_by: string | null;
  next_follow_up_at: string | null;
  next_follow_up_note: string | null;
  next_follow_up_by: string | null;
  next_follow_up_by_name: string | null;
  created_at: string;
  updated_at: string;
};

export type LeadActivityPreview = {
  type: ActivityType;
  occurred_at: string;
  note: string | null;
};

export type LeadListItem = Lead & {
  activities: LeadActivityPreview[];
};

export type Activity = {
  id: string;
  lead_id: string;
  type: ActivityType;
  note: string | null;
  occurred_at: string;
  created_by: string | null;
  created_by_name: string | null;
  created_at: string;
};

export const DEFAULT_LEADS_SORT: SortParam<Lead>[] = [
  { key: 'created_at', direction: 'desc' },
];

export type LeadListParams = {
  search?: string;
  filters?: FilterParam<Lead>[];
  sorts?: SortParam<Lead>[];
  page: number;
  pageSize: number;
};

export type LeadListResult = {
  items: LeadListItem[];
  total: number;
};

export type CreateLeadPayload = {
  customer_name: string;
  email?: string | null;
  phone?: string | null;
  vehicle_interest: string;
  message?: string | null;
  assigned_to?: string | null;
};

export type CreateActivityPayload = {
  lead_id: string;
  type: Exclude<ActivityType, 'LEAD_RECEIVED'>;
  note?: string | null;
  occurred_at?: string;
};

export type UpdateNextFollowUpPayload = {
  id: string;
  next_follow_up_at: string | null;
  next_follow_up_note: string | null;
};
