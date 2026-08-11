import { useMutation } from "@tanstack/react-query";
import type { AuthTokenResponsePassword } from "@supabase/supabase-js";
import { supabase } from "@/lib";
import type { MutationConfig, QueryError } from "@/types";

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  id: string;
  fullName: string | null;
};

type LoginRes = AuthTokenResponsePassword["data"];

const login = async (payload: LoginPayload): Promise<LoginRes> => {
  const { data, error } = await supabase.auth.signInWithPassword(payload);
  if (error) throw error;
  return data;
};

type LoginOptions = {
  config?: MutationConfig<LoginRes, QueryError, LoginPayload>;
};

export const useLogin = (useProps?: LoginOptions) => {
  const { config } = useProps || {};

  const mutation = useMutation<LoginRes, QueryError, LoginPayload>({
    mutationFn: login,
    meta: { disableGlobalErrorHandler: true },
    ...config,
  });

  return {
    ...mutation,
    login: mutation.mutate,
    isLoggingIn: mutation.isPending,
  };
};
