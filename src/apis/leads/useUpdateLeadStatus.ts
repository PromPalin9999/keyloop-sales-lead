import { useMutation } from "@tanstack/react-query";
import type { LeadStatus } from "@/constants";
import { queryClient, supabase } from "@/lib";
import type { MutationConfig, QueryError } from "@/types";
import type { Lead } from "./types";

export type UpdateLeadStatusPayload = {
  id: string;
  status: LeadStatus;
};

const updateLeadStatus = async (
  payload: UpdateLeadStatusPayload,
): Promise<Lead> => {
  const { data, error } = await supabase
    .from("leads")
    .update({ status: payload.status })
    .eq("id", payload.id)
    .select("*")
    .single();

  if (error) throw error;
  return data;
};

type UpdateLeadStatusOptions = {
  config?: MutationConfig<Lead, QueryError, UpdateLeadStatusPayload>;
};

export const useUpdateLeadStatus = (useProps?: UpdateLeadStatusOptions) => {
  const { config } = useProps || {};

  const mutation = useMutation<Lead, QueryError, UpdateLeadStatusPayload>({
    mutationFn: updateLeadStatus,
    ...config,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["leads", "detail", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["leads", "list"] });
      config?.onSuccess?.(data, variables, context);
    },
  });

  return {
    ...mutation,
    updateLeadStatus: mutation.mutate,
    isUpdatingLeadStatus: mutation.isPending,
  };
};
