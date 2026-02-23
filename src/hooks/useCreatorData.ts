import { useQuery } from '@tanstack/react-query';
import {
  getCreatorProfile,
  getMonthlyAnalytics,
  getMonthlyAnalyticsRange,
  getCreatorTitles,
  getPPVTransactions,
  getSVODPool,
  getPayoutHistory,
  getAllCreators,
} from '../lib/supabase';
import { muvi } from '../lib/muvi';
import { useAuthStore } from '../stores/authStore';

export function useCreatorProfile() {
  const { user } = useAuthStore();
  return useQuery({
    queryKey: ['creator-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await getCreatorProfile(user.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });
}

export function useMonthlyAnalytics(creatorId: string | undefined, month: string) {
  return useQuery({
    queryKey: ['monthly-analytics', creatorId, month],
    queryFn: async () => {
      if (!creatorId) return null;
      const { data, error } = await getMonthlyAnalytics(creatorId, month);
      if (error) throw error;
      return data;
    },
    enabled: !!creatorId && !!month,
  });
}

export function useMonthlyAnalyticsRange(creatorId: string | undefined) {
  return useQuery({
    queryKey: ['monthly-analytics-range', creatorId],
    queryFn: async () => {
      if (!creatorId) return [];
      const { data, error } = await getMonthlyAnalyticsRange(creatorId);
      if (error) throw error;
      return data;
    },
    enabled: !!creatorId,
  });
}

export function useCreatorTitles(creatorId: string | undefined) {
  return useQuery({
    queryKey: ['creator-titles', creatorId],
    queryFn: async () => {
      if (!creatorId) return [];
      const { data, error } = await getCreatorTitles(creatorId);
      if (error) throw error;
      return data;
    },
    enabled: !!creatorId,
  });
}

export function usePPVTransactions(creatorId: string | undefined, month: string) {
  return useQuery({
    queryKey: ['ppv-transactions', creatorId, month],
    queryFn: async () => {
      if (!creatorId) return [];
      const { data, error } = await getPPVTransactions(creatorId, month);
      if (error) throw error;
      return data;
    },
    enabled: !!creatorId && !!month,
  });
}

export function useSVODPool(month: string) {
  return useQuery({
    queryKey: ['svod-pool', month],
    queryFn: async () => {
      const { data, error } = await getSVODPool(month);
      if (error) throw error;
      return data;
    },
    enabled: !!month,
  });
}

export function usePayoutHistory(creatorId: string | undefined) {
  return useQuery({
    queryKey: ['payout-history', creatorId],
    queryFn: async () => {
      if (!creatorId) return [];
      const { data, error } = await getPayoutHistory(creatorId);
      if (error) throw error;
      return data;
    },
    enabled: !!creatorId,
  });
}

export function useAllCreators() {
  return useQuery({
    queryKey: ['all-creators'],
    queryFn: async () => {
      const { data, error } = await getAllCreators();
      if (error) throw error;
      return data;
    },
  });
}

export function useMuviContents() {
  return useQuery({
    queryKey: ['muvi-contents'],
    queryFn: () => muvi.getContents(),
    staleTime: 60 * 60 * 1000,
  });
}
