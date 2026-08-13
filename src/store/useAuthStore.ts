import type { Session, User } from '@supabase/supabase-js';
import { create } from 'zustand';
import type { Profile } from '@/apis';
import { Role } from '@/constants';
import { supabase } from '@/lib';

type AuthStoreState = {
  session: Session | null;
  user: User | null;
  isLoggedIn: boolean;
  profile: Profile | null;
  isAdmin: boolean;
  isSessionLoading: boolean;
};

interface AuthStore extends AuthStoreState {
  setSession: (session: Session | null) => void;
  setProfile: (profile: Profile) => void;
}

const init: AuthStoreState = {
  session: null,
  user: null,
  isLoggedIn: false,
  profile: null,
  isAdmin: false,
  isSessionLoading: true,
};

export const useAuthStore = create<AuthStore>((set) => ({
  ...init,
  setSession: (session) =>
    set(() => ({
      session,
      user: session?.user ?? null,
      isLoggedIn: !!session,
      isSessionLoading: false,
      // A cleared session invalidates any previously loaded profile.
      ...(session ? {} : { profile: null, isAdmin: false }),
    })),
  setProfile: (profile) =>
    set(() => ({ profile, isAdmin: profile.role === Role.Admin })),
}));

supabase.auth.getSession().then(({ data: { session } }) => {
  useAuthStore.getState().setSession(session);
});

supabase.auth.onAuthStateChange((_event, session) => {
  useAuthStore.getState().setSession(session);
});
