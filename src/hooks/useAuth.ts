import { useEffect } from 'react';
import { supabase, getCreatorProfile } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import type { CreatorProfile } from '../lib/types';

export function useAuth() {
  const {
    user, session, loading, creatorProfile, isAdmin, profileError,
    setUser, setSession, setCreatorProfile, setLoading, setProfileError,
  } = useAuthStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        fetchProfile(s.user.id);
      } else {
        setCreatorProfile(null);
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        (async () => {
          await fetchProfile(s.user.id);
        })();
      } else {
        setCreatorProfile(null);
        setProfileError(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, setSession, setCreatorProfile, setLoading, setProfileError]);

  async function fetchProfile(userId: string) {
    const { data, error } = await getCreatorProfile(userId);
    if (error) {
      setProfileError('Failed to load profile. Please try again.');
      setCreatorProfile(null);
    } else if (!data) {
      setProfileError('Account not configured. Contact your administrator.');
      setCreatorProfile(null);
    } else {
      setCreatorProfile(data as CreatorProfile);
    }
    setLoading(false);
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setCreatorProfile(null);
    setProfileError(null);
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return { error };
  };

  return { user, session, loading, creatorProfile, isAdmin, profileError, signIn, signOut, resetPassword };
}
