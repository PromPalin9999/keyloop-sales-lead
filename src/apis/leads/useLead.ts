import { useQuery } from '@tanstack/react-query';
import type { Lead } from './types';
import { queryKeys, supabase } from '@/lib';
import type { QueryConfig, QueryError } from '@/types';

async function fetchLead(id: string): Promise<Lead> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export const useLead = (
  id: string | undefined,
  config?: QueryConfig<Lead, Lead, QueryError>,
) => {
  const query = useQuery({
    queryKey: queryKeys.leadDetails(id),
    queryFn: () => fetchLead(id as string),
    enabled: !!id,
    ...config,
  });

  return {
    ...query,
    lead: query.data,
    isGettingLead: query.isFetching,
  };
};
