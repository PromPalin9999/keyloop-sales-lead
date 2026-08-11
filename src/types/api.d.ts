import type { AuthError, PostgrestError } from "@supabase/supabase-js";
import type {
  DefaultError,
  QueryFunctionContext,
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";

// Supabase surfaces two distinct error shapes depending on the client used:
// PostgrestError from `supabase.from(...)` calls, AuthError from `supabase.auth.*`.
export type QueryError = PostgrestError | AuthError;

// Define a generic query function type
export type QueryFn<TQueryFnData = unknown> = (
  context: QueryFunctionContext,
) => Promise<TQueryFnData>;

// Define a generic mutation function type
export type MutationFn<TData, TVariables> = (
  variables: TVariables,
) => Promise<TData>;

// --- useQuery related configuration ---
export interface QueryConfig<
  TData = unknown,
  TQueryFnData = TData,
  TError = DefaultError,
  TQueryKey extends QueryKey = QueryKey,
> extends Omit<
    UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    "queryKey" | "queryFn"
  > {}

// --- useMutation related configuration ---
export interface MutationConfig<
  TData = unknown,
  TError = DefaultError,
  TVariables = unknown,
  TContext = unknown,
> extends Omit<
    UseMutationOptions<TData, TError, TVariables, TContext>,
    "mutationFn"
  > {
  onSuccess?: (
    data: TData,
    variables: TVariables,
    context: TContext | undefined,
  ) => void;
  onError?: (
    error: TError,
    variables: TVariables,
    context: TContext | undefined,
  ) => void;
}
