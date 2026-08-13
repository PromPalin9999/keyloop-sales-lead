import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  DEFAULT_LEADS_SORT,
  type Lead,
  type LeadListItem,
  type LeadListParams,
  type LeadListResult,
} from './types';
import { DEFAULT_STALE_TIME, queryKeys, supabase } from '@/lib';
import type { FilterParam, QueryConfig, QueryError } from '@/types';

export function applyFilter(query: any, filter: FilterParam<Lead>) {
  const column = filter.key as string;

  switch (filter.operator) {
    case 'eq':
      return query.eq(column, filter.value);
    case 'ne':
      return query.neq(column, filter.value);
    case 'in':
      return query.in(column, filter.value as Array<string | number>);
    case 'c':
      return query.ilike(column, `%${filter.value}%`);
    case 'sw':
      return query.ilike(column, `${filter.value}%`);
    case 'ew':
      return query.ilike(column, `%${filter.value}`);
    case 'gt':
      return query.gt(column, filter.value);
    case 'gte':
      return query.gte(column, filter.value);
    case 'lt':
      return query.lt(column, filter.value);
    case 'lte':
      return query.lte(column, filter.value);
    default:
      return query;
  }
}

async function fetchLeads(params: LeadListParams): Promise<LeadListResult> {
  const { search, filters, sorts, page, pageSize } = params;

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('leads')
    .select('*, activities(type, occurred_at, note)', { count: 'exact' })
    .order('occurred_at', { ascending: false, foreignTable: 'activities' })
    .limit(1, { foreignTable: 'activities' });

  if (search) query = query.ilike('search_blob', `%${search}%`);

  for (const filter of filters ?? []) {
    query = applyFilter(query, filter);
  }

  for (const sort of sorts?.length ? sorts : DEFAULT_LEADS_SORT) {
    query = query.order(sort.key as string, {
      ascending: sort.direction === 'asc',
      nullsFirst: false,
    });
  }

  const { data, error, count } = await query.range(from, to);
  if (error) throw error;

  return { items: (data ?? []) as LeadListItem[], total: count ?? 0 };
}

export const useLeads = (
  params: LeadListParams,
  config?: QueryConfig<LeadListResult, LeadListResult, QueryError>,
) => {
  const query = useQuery({
    queryKey: queryKeys.leads(params),
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
