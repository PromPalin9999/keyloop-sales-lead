import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib";
import type { MutationConfig, QueryError } from "@/types";

export type LogoutResponse = void;

const logout = async (): Promise<LogoutResponse> => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

type LogoutOptions = {
  config?: MutationConfig<LogoutResponse, QueryError, void>;
};

export const useLogout = (useProps?: LogoutOptions) => {
  const { config } = useProps || {};

  const mutation = useMutation<LogoutResponse, QueryError, void>({
    mutationFn: logout,
    ...config,
  });

  return {
    ...mutation,
    logout: mutation.mutate,
    isLoggingOut: mutation.isPending,
  };
};
