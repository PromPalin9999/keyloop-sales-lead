import { useMutation } from '@tanstack/react-query';
import type { Activity, CreateActivityPayload } from './types';
import { LEADS_KEY, queryClient, queryKeys, supabase } from '@/lib';
import type { MutationConfig, QueryError } from '@/types';

const createActivity = async (
  payload: CreateActivityPayload,
): Promise<Activity> => {
  const { data, error } = await supabase
    .from('activities')
    .insert(payload)
    .select('*')
    .single();

  if (error) throw error;
  return data;
};

type CreateActivityOptions = {
  config?: MutationConfig<Activity, QueryError, CreateActivityPayload>;
};

export const useCreateActivity = (useProps?: CreateActivityOptions) => {
  const { config } = useProps || {};

  const mutation = useMutation<Activity, QueryError, CreateActivityPayload>({
    mutationFn: createActivity,
    ...config,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.timeLineLeadAct(variables.lead_id),
      });
      queryClient.invalidateQueries({
        queryKey: [LEADS_KEY],
      });
      config?.onSuccess?.(data, variables, context);
    },
  });

  return {
    ...mutation,
    createActivity: mutation.mutate,
    isCreatingActivity: mutation.isPending,
  };
};
