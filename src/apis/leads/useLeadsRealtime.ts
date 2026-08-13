import { useEffect } from 'react';
import {
  LEAD_DETAILS_KEY,
  LEADS_KEY,
  queryClient,
  supabase,
  TIMELINE_LEAD_ACT_KEY,
} from '@/lib';
import { useAuthStore } from '@/store';

// Cache invalidation from useAssignLead/useUpdateLeadStatus etc. only
// reaches the QueryClient in the tab that ran the mutation - a different
// tab/session (e.g. the salesperson who now owns the lead) never hears
// about it and stays stale until a manual reload.
//
// We can't rely on `postgres_changes` for this: its delivery check runs
// RLS against the NEW row, so a client that just lost visibility to a row
// (e.g. it was unassigned from them) is never notified it disappeared -
// assign works, unassign doesn't. Instead, DB triggers on `leads` and
// `activities` broadcast a content-free "something changed" ping to every
// logged-in client (see migrations `broadcast_leads_changes` and
// `broadcast_activities_changes`); the actual refetch that follows still
// goes through the normal RLS-protected `.select()`.
export const useLeadsRealtime = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) return;

    const channel = supabase
      .channel('leads-changes', { config: { private: true } })
      .on('broadcast', { event: 'leads_changed' }, () => {
        queryClient.invalidateQueries({ queryKey: [LEADS_KEY] });
        queryClient.invalidateQueries({ queryKey: [LEAD_DETAILS_KEY] });
      })
      .on('broadcast', { event: 'activities_changed' }, () => {
        queryClient.invalidateQueries({ queryKey: [TIMELINE_LEAD_ACT_KEY] });
        queryClient.invalidateQueries({ queryKey: [LEADS_KEY] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isLoggedIn]);
};
