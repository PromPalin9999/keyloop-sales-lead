import type { ActivityType, LeadSource, LeadStatus } from "@/constants";

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
  created_by: string | null;
  next_follow_up_at: string | null;
  next_follow_up_note: string | null;
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
  created_at: string;
};

export type LeadListSortField =
  | "created_at"
  | "next_follow_up_at"
  | "customer_name"
  | "status";

export type LeadListParams = {
  search?: string;
  status?: LeadStatus[];
  assignedTo?: string;
  sortBy?: LeadListSortField;
  sortDir?: "asc" | "desc";
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
  source?: LeadSource;
};

export type CreateActivityPayload = {
  lead_id: string;
  type: Exclude<ActivityType, "LEAD_RECEIVED">;
  note?: string | null;
  occurred_at?: string;
};

export type UpdateNextFollowUpPayload = {
  id: string;
  next_follow_up_at: string | null;
  next_follow_up_note: string | null;
};
