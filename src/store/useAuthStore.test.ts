import type { Session, User } from '@supabase/supabase-js';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuthStore } from './useAuthStore';
import { Role } from '@/constants';

vi.mock('@/lib', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn(),
    },
  },
}));

const asUser = (id: string) => ({ id }) as User;
const asSession = (id: string) => ({ user: asUser(id) }) as Session;

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      session: null,
      user: null,
      isLoggedIn: false,
      profile: null,
      isAdmin: false,
      isSessionLoading: false,
    });
  });

  it('marks the user logged in once a session is set', () => {
    useAuthStore.getState().setSession(asSession('user-1'));

    const state = useAuthStore.getState();
    expect(state.isLoggedIn).toBe(true);
    expect(state.user?.id).toBe('user-1');
    expect(state.isSessionLoading).toBe(false);
  });

  it('grants admin access only when the profile role is ADMIN', () => {
    useAuthStore.getState().setProfile({
      id: 'user-1',
      full_name: 'Admin User',
      email: 'admin@keyloop.test',
      role: Role.Admin,
      created_at: '',
      updated_at: '',
    });

    expect(useAuthStore.getState().isAdmin).toBe(true);
  });

  it('denies admin access for a salesperson profile', () => {
    useAuthStore.getState().setProfile({
      id: 'user-2',
      full_name: 'Sales Rep',
      email: 'sales@keyloop.test',
      role: Role.Salesperson,
      created_at: '',
      updated_at: '',
    });

    expect(useAuthStore.getState().isAdmin).toBe(false);
  });

  it('clears the profile and admin flag when the session is cleared', () => {
    useAuthStore.getState().setSession(asSession('user-1'));
    useAuthStore.getState().setProfile({
      id: 'user-1',
      full_name: 'Admin User',
      email: 'admin@keyloop.test',
      role: Role.Admin,
      created_at: '',
      updated_at: '',
    });
    expect(useAuthStore.getState().isAdmin).toBe(true);

    useAuthStore.getState().setSession(null);

    const state = useAuthStore.getState();
    expect(state.isLoggedIn).toBe(false);
    expect(state.profile).toBeNull();
    expect(state.isAdmin).toBe(false);
  });
});
