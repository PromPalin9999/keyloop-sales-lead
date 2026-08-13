import { useMutation } from '@tanstack/react-query';
import { queryClient, supabase } from '@/lib';
import type { MutationConfig, QueryError } from '@/types';

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
    onSuccess: (data, variables, context) => {
      // Cached query results (e.g. leads list) are keyed without a user
      // id, so a stale cache would otherwise leak into the next session
      // until a hard page reload. Wipe it on every sign-out.
      queryClient.clear();
      config?.onSuccess?.(data, variables, context);
    },
  });

  return {
    ...mutation,
    logout: mutation.mutate,
    isLoggingOut: mutation.isPending,
  };
};
