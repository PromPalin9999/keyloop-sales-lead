import { useQuery } from '@tanstack/react-query';
import type { Activity } from './types';
import { queryKeys, supabase } from '@/lib';
import type { QueryConfig, QueryError } from '@/types';

async function fetchTimelineLeadAct(leadId: string): Promise<Activity[]> {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('lead_id', leadId)
    .order('occurred_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export const useTimeLineLeadAct = (
  leadId: string | undefined,
  config?: QueryConfig<Activity[], Activity[], QueryError>,
) => {
  const query = useQuery({
    queryKey: queryKeys.timeLineLeadAct(leadId),
    queryFn: () => fetchTimelineLeadAct(leadId as string),
    enabled: !!leadId,
    ...config,
  });

  return {
    ...query,
    activities: query.data,
    isGettingActivities: query.isFetching,
  };
};
