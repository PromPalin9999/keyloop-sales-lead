import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { act, type ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useCreateActivity } from './useCreateActivity';
import { queryClient as realQueryClient, supabase } from '@/lib';

vi.mock('@/lib', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib')>();
  return {
    ...actual,
    supabase: { from: vi.fn() },
  };
});

function createWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
}

describe('useCreateActivity', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("inserts the activity payload and invalidates the lead's timeline and list", async () => {
    const insertedActivity = {
      id: 'act-1',
      lead_id: 'lead-1',
      type: 'CALL',
      note: 'Called customer',
      occurred_at: '2026-08-13T00:00:00.000Z',
      created_by: null,
      created_by_name: null,
      created_at: '2026-08-13T00:00:00.000Z',
    };

    const single = vi.fn().mockResolvedValue({
      data: insertedActivity,
      error: null,
    });
    const select = vi.fn().mockReturnValue({ single });
    const insert = vi.fn().mockReturnValue({ select });
    vi.mocked(supabase.from).mockReturnValue({ insert } as never);

    const invalidateSpy = vi.spyOn(realQueryClient, 'invalidateQueries');

    const { result } = renderHook(() => useCreateActivity(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.createActivity({
        lead_id: 'lead-1',
        type: 'CALL',
        note: 'Called customer',
      });
    });

    await waitFor(() => expect(result.current.isCreatingActivity).toBe(false));

    expect(supabase.from).toHaveBeenCalledWith('activities');
    expect(insert).toHaveBeenCalledWith({
      lead_id: 'lead-1',
      type: 'CALL',
      note: 'Called customer',
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['time-line-lead-activities', 'lead-1'],
    });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['leads'] });
  });

  it('surfaces a Supabase error through the mutation state instead of throwing silently', async () => {
    const error = { message: 'insert failed', code: '23505' };
    const single = vi.fn().mockResolvedValue({ data: null, error });
    const select = vi.fn().mockReturnValue({ single });
    const insert = vi.fn().mockReturnValue({ select });
    vi.mocked(supabase.from).mockReturnValue({ insert } as never);

    const { result } = renderHook(() => useCreateActivity(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.createActivity({ lead_id: 'lead-1', type: 'EMAIL' });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(error);
  });
});
