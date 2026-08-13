import { useMutation } from '@tanstack/react-query';
import type { Lead } from './types';
import { LEADS_KEY, queryClient, queryKeys, supabase } from '@/lib';
import type { MutationConfig, QueryError } from '@/types';

export type AssignLeadPayload = {
  id: string;
  assigned_to: string | null;
};

const assignLead = async (payload: AssignLeadPayload): Promise<Lead> => {
  const { data, error } = await supabase
    .from('leads')
    .update({ assigned_to: payload.assigned_to })
    .eq('id', payload.id)
    .select('*')
    .single();

  if (error) throw error;
  return data;
};

type AssignLeadOptions = {
  config?: MutationConfig<Lead, QueryError, AssignLeadPayload>;
};

export const useAssignLead = (useProps?: AssignLeadOptions) => {
  const { config } = useProps || {};

  const mutation = useMutation<Lead, QueryError, AssignLeadPayload>({
    mutationFn: assignLead,
    ...config,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.leadDetails(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: [LEADS_KEY] });
      config?.onSuccess?.(data, variables, context);
    },
  });

  return {
    ...mutation,
    assignLead: mutation.mutate,
    isAssigningLead: mutation.isPending,
  };
};
