import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Role } from '@/constants';
import { DEFAULT_STALE_TIME, queryKeys, supabase } from '@/lib';
import type { QueryConfig, QueryError } from '@/types';

export type StaffMember = {
  id: string;
  full_name: string | null;
  role: Role;
};

async function fetchStaffDirectory(): Promise<StaffMember[]> {
  const { data, error } = await supabase
    .from('staff_directory')
    .select('id, full_name, role');

  if (error) throw error;
  return data ?? [];
}

export const useStaffDirectory = (
  config?: QueryConfig<StaffMember[], StaffMember[], QueryError>,
) => {
  const query = useQuery({
    queryKey: queryKeys.staffDirectory,
    queryFn: fetchStaffDirectory,
    staleTime: DEFAULT_STALE_TIME,
    ...config,
  });

  const staffById = useMemo(() => {
    const map = new Map<string, StaffMember>();
    query.data?.forEach((member) => map.set(member.id, member));
    return map;
  }, [query.data]);

  return {
    ...query,
    staff: query.data,
    staffById,
  };
};

export const useSalespeople = (
  config?: QueryConfig<StaffMember[], StaffMember[], QueryError>,
) => {
  const query = useStaffDirectory(config);

  const salespeople = useMemo(
    () =>
      query.staff?.filter((member) => member.role === Role.Salesperson) ?? [],
    [query.staff],
  );

  return { ...query, salespeople };
};
