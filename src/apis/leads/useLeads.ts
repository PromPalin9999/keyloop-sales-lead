import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { DEFAULT_STALE_TIME, supabase } from "@/lib";
import type { QueryConfig, QueryError } from "@/types";
import type { LeadListItem, LeadListParams, LeadListResult } from "./types";

async function fetchLeads(params: LeadListParams): Promise<LeadListResult> {
  const {
    search,
    status,
    assignedTo,
    sortBy = "created_at",
    sortDir = "desc",
    page,
    pageSize,
  } = params;

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("leads")
    .select("*, activities(type, occurred_at, note)", { count: "exact" })
    .order("occurred_at", { ascending: false, foreignTable: "activities" })
    .limit(1, { foreignTable: "activities" })
    .order(sortBy, { ascending: sortDir === "asc", nullsFirst: false })
    .range(from, to);

  if (search) query = query.ilike("search_blob", `%${search}%`);
  if (status?.length) query = query.in("status", status);
  if (assignedTo) query = query.eq("assigned_to", assignedTo);

  const { data, error, count } = await query;
  if (error) throw error;

  return { items: (data ?? []) as LeadListItem[], total: count ?? 0 };
}

export const useLeads = (
  params: LeadListParams,
  config?: QueryConfig<LeadListResult, LeadListResult, QueryError>,
) => {
  const query = useQuery({
    queryKey: ["leads", "list", params],
    queryFn: () => fetchLeads(params),
    placeholderData: keepPreviousData,
    staleTime: DEFAULT_STALE_TIME,
    ...config,
  });

  return {
    ...query,
    leads: query.data,
    isGettingLeads: query.isFetching,
  };
};
