// Mirrors the `lead_source` enum on public.leads in Supabase.
export const LeadSource = {
  Website: 'WEBSITE',
  Manual: 'MANUAL',
} as const;
export type LeadSource = (typeof LeadSource)[keyof typeof LeadSource];

// Mirrors the `lead_status` enum on public.leads in Supabase.
export const LeadStatus = {
  New: 'NEW',
  Contacting: 'CONTACTING',
  Contacted: 'CONTACTED',
  Qualified: 'QUALIFIED',
  Appointment: 'APPOINTMENT',
  ProposalNegotiation: 'PROPOSAL_NEGOTIATION',
  Won: 'WON',
  Lost: 'LOST',
  Nurturing: 'NURTURING',
} as const;
export type LeadStatus = (typeof LeadStatus)[keyof typeof LeadStatus];

export const LEAD_STATUS_OPTIONS: LeadStatus[] = [
  LeadStatus.New,
  LeadStatus.Contacting,
  LeadStatus.Contacted,
  LeadStatus.Qualified,
  LeadStatus.Appointment,
  LeadStatus.ProposalNegotiation,
  LeadStatus.Won,
  LeadStatus.Lost,
  LeadStatus.Nurturing,
];

export const LEAD_STATUS_META: Record<
  LeadStatus,
  { label: string; className: string }
> = {
  [LeadStatus.New]: {
    label: 'New',
    className: 'bg-accent-100 text-accent-700',
  },
  [LeadStatus.Contacting]: {
    label: 'Contacting',
    className: 'bg-secondary-100 text-secondary-700',
  },
  [LeadStatus.Contacted]: {
    label: 'Contacted',
    className: 'bg-info/10 text-info',
  },
  [LeadStatus.Qualified]: {
    label: 'Qualified',
    className: 'bg-background-200 text-text-700',
  },
  [LeadStatus.Appointment]: {
    label: 'Appointment',
    className: 'bg-accent-200 text-accent-800',
  },
  [LeadStatus.ProposalNegotiation]: {
    label: 'Proposal / Negotiation',
    className: 'bg-secondary-200 text-secondary-800',
  },
  [LeadStatus.Won]: {
    label: 'Won',
    className: 'bg-success/15 text-success',
  },
  [LeadStatus.Lost]: {
    label: 'Lost',
    className: 'bg-error/10 text-error',
  },
  [LeadStatus.Nurturing]: {
    label: 'Nurturing',
    className: 'bg-text-100 text-text-500',
  },
};

// Mirrors the `activity_type` enum on public.activities in Supabase.
export const ActivityType = {
  Call: 'CALL',
  Email: 'EMAIL',
  Sms: 'SMS',
  LeadReceived: 'LEAD_RECEIVED',
} as const;
export type ActivityType = (typeof ActivityType)[keyof typeof ActivityType];

export const LOGGABLE_ACTIVITY_TYPES: ActivityType[] = [
  ActivityType.Call,
  ActivityType.Email,
  ActivityType.Sms,
];

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  [ActivityType.Call]: 'Call',
  [ActivityType.Email]: 'Email',
  [ActivityType.Sms]: 'SMS',
  [ActivityType.LeadReceived]: 'Lead Received',
};
