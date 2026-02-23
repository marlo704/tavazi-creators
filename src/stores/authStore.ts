import { create } from 'zustand';
import type { User, Session } from '@supabase/supabase-js';
import type { CreatorProfile } from '../lib/types';

interface AuthState {
  user: User | null;
  session: Session | null;
  creatorProfile: CreatorProfile | null;
  isAdmin: boolean;
  loading: boolean;
  profileError: string | null;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setCreatorProfile: (profile: CreatorProfile | null) => void;
  setLoading: (loading: boolean) => void;
  setProfileError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  creatorProfile: null,
  isAdmin: false,
  loading: true,
  profileError: null,
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setCreatorProfile: (profile) =>
    set({ creatorProfile: profile, isAdmin: profile?.role === 'admin', profileError: null }),
  setLoading: (loading) => set({ loading }),
  setProfileError: (error) => set({ profileError: error }),
}));
