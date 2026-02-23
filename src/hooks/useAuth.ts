import { useEffect } from 'react';
import { supabase, getCreatorProfile } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';

export function useAuth() {
  const { user, session, loading, creatorProfile, isAdmin, setUser, setSession, setCreatorProfile, setLoading } = useAuthStore();

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
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, setSession, setCreatorProfile, setLoading]);

  async function fetchProfile(userId: string) {
    const { data } = await getCreatorProfile(userId);
    setCreatorProfile(data as import('../lib/mockData').Creator | null);
    setLoading(false);
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setCreatorProfile(null);
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return { error };
  };

  return { user, session, loading, creatorProfile, isAdmin, signIn, signOut, resetPassword };
}
