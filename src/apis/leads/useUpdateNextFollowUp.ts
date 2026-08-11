import { useMutation } from "@tanstack/react-query";
import { queryClient, supabase } from "@/lib";
import type { MutationConfig, QueryError } from "@/types";
import type { Lead, UpdateNextFollowUpPayload } from "./types";

const updateNextFollowUp = async (
  payload: UpdateNextFollowUpPayload,
): Promise<Lead> => {
  const { id, ...rest } = payload;

  const { data, error } = await supabase
    .from("leads")
    .update(rest)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return data;
};

type UpdateNextFollowUpOptions = {
  config?: MutationConfig<Lead, QueryError, UpdateNextFollowUpPayload>;
};

export const useUpdateNextFollowUp = (useProps?: UpdateNextFollowUpOptions) => {
  const { config } = useProps || {};

  const mutation = useMutation<Lead, QueryError, UpdateNextFollowUpPayload>({
    mutationFn: updateNextFollowUp,
    ...config,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["leads", "detail", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["leads", "list"] });
      config?.onSuccess?.(data, variables, context);
    },
  });

  return {
    ...mutation,
    updateNextFollowUp: mutation.mutate,
    isUpdatingNextFollowUp: mutation.isPending,
  };
};
