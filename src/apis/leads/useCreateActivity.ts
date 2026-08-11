import { useMutation } from "@tanstack/react-query";
import { queryClient, supabase } from "@/lib";
import type { MutationConfig, QueryError } from "@/types";
import type { Activity, CreateActivityPayload } from "./types";

const createActivity = async (
  payload: CreateActivityPayload,
): Promise<Activity> => {
  const { data, error } = await supabase
    .from("activities")
    .insert(payload)
    .select("*")
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
        queryKey: ["leads", "activities", variables.lead_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["leads", "list"],
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
