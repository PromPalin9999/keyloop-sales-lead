import {
  type DefaultOptions,
  MutationCache,
  QueryCache,
  QueryClient,
} from '@tanstack/react-query';
import type { QueryError } from '@/types';
import { message } from '@/utils';

export const DEFAULT_STALE_TIME = 1000 * 60 * 5; // 5 minutes

const defaultOptions = {
  queries: {
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: DEFAULT_STALE_TIME,
  },
} satisfies DefaultOptions;

// Shows a toast for any query/mutation error, unless the caller opted out via
// `meta: { disableGlobalErrorHandler: true }` (e.g. a form that renders its
// own inline error instead of a generic toast).
function handleGlobalError(error: QueryError, meta?: Record<string, unknown>) {
  if (meta?.disableGlobalErrorHandler) return;
  message.error(error.message);
}

export const queryClient = new QueryClient({
  defaultOptions,
  queryCache: new QueryCache({
    onError: (error, query) =>
      handleGlobalError(error as QueryError, query.meta),
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) =>
      handleGlobalError(error as QueryError, mutation.meta),
  }),
});
