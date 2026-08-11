import { useMutation } from "@tanstack/react-query";
import { LeadSource } from "@/constants";
import { queryClient, supabase } from "@/lib";
import type { MutationConfig, QueryError } from "@/types";
import type { CreateLeadPayload, Lead } from "./types";

const createLead = async (payload: CreateLeadPayload): Promise<Lead> => {
  const { data, error } = await supabase
    .from("leads")
    .insert({ source: LeadSource.Manual, ...payload })
    .select("*")
    .single();

  if (error) throw error;
  return data;
};

type CreateLeadOptions = {
  config?: MutationConfig<Lead, QueryError, CreateLeadPayload>;
};

export const useCreateLead = (useProps?: CreateLeadOptions) => {
  const { config } = useProps || {};

  const mutation = useMutation<Lead, QueryError, CreateLeadPayload>({
    mutationFn: createLead,
    ...config,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["leads", "list"] });
      config?.onSuccess?.(data, variables, context);
    },
  });

  return {
    ...mutation,
    createLead: mutation.mutate,
    isCreatingLead: mutation.isPending,
  };
};
