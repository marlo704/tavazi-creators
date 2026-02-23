import { create } from 'zustand';
import type { User, Session } from '@supabase/supabase-js';
import type { Creator } from '../lib/mockData';

interface AuthState {
  user: User | null;
  session: Session | null;
  creatorProfile: Creator | null;
  isAdmin: boolean;
  loading: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setCreatorProfile: (profile: Creator | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  creatorProfile: null,
  isAdmin: false,
  loading: true,
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setCreatorProfile: (profile) =>
    set({ creatorProfile: profile, isAdmin: profile?.role === 'admin' }),
  setLoading: (loading) => set({ loading }),
}));
