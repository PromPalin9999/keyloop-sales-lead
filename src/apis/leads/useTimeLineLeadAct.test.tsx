import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useTimeLineLeadAct } from './useTimeLineLeadAct';
import { supabase } from '@/lib';

vi.mock('@/lib', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib')>();
  return {
    ...actual,
    supabase: { from: vi.fn() },
  };
});

function createWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
}

describe('useTimeLineLeadAct', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("requests the lead's activities sorted newest-occurred-first", async () => {
    const activities = [
      { id: 'act-2', lead_id: 'lead-1', occurred_at: '2026-08-13T10:00:00Z' },
      { id: 'act-1', lead_id: 'lead-1', occurred_at: '2026-08-12T09:00:00Z' },
    ];
    const order = vi.fn().mockResolvedValue({ data: activities, error: null });
    const eq = vi.fn().mockReturnValue({ order });
    const select = vi.fn().mockReturnValue({ eq });
    vi.mocked(supabase.from).mockReturnValue({ select } as never);

    const { result } = renderHook(() => useTimeLineLeadAct('lead-1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isGettingActivities).toBe(false));

    expect(supabase.from).toHaveBeenCalledWith('activities');
    expect(select).toHaveBeenCalledWith('*');
    expect(eq).toHaveBeenCalledWith('lead_id', 'lead-1');
    expect(order).toHaveBeenCalledWith('occurred_at', { ascending: false });
    expect(result.current.activities).toEqual(activities);
  });

  it('does not query until a leadId is provided', () => {
    const { result } = renderHook(() => useTimeLineLeadAct(undefined), {
      wrapper: createWrapper(),
    });

    expect(supabase.from).not.toHaveBeenCalled();
    expect(result.current.isGettingActivities).toBe(false);
    expect(result.current.activities).toBeUndefined();
  });

  it('surfaces a Supabase error through the query state', async () => {
    const error = { message: 'lead not found', code: 'PGRST116' };
    const order = vi.fn().mockResolvedValue({ data: null, error });
    const eq = vi.fn().mockReturnValue({ order });
    const select = vi.fn().mockReturnValue({ eq });
    vi.mocked(supabase.from).mockReturnValue({ select } as never);

    const { result } = renderHook(() => useTimeLineLeadAct('lead-1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(error);
  });
});
