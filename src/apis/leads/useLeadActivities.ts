import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib";
import type { QueryConfig, QueryError } from "@/types";
import type { Activity } from "./types";

async function fetchLeadActivities(leadId: string): Promise<Activity[]> {
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .eq("lead_id", leadId)
    .order("occurred_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export const useLeadActivities = (
  leadId: string | undefined,
  config?: QueryConfig<Activity[], Activity[], QueryError>,
) => {
  const query = useQuery({
    queryKey: ["leads", "activities", leadId],
    queryFn: () => fetchLeadActivities(leadId as string),
    enabled: !!leadId,
    ...config,
  });

  return {
    ...query,
    activities: query.data,
    isGettingActivities: query.isFetching,
  };
};
