import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNetwork } from '@/hooks/useNetwork';
import { storiesApi, tagsApi } from '@/services/supabase';
import type { Story, Tag } from '@/types';

interface UseOfflineDataOptions {
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
}

export function useOfflineStories(options: UseOfflineDataOptions = {}) {
  const { isOffline } = useNetwork();
  const queryClient = useQueryClient();
  
  const {
    enabled = true,
    staleTime = 5 * 60 * 1000, // 5 minutes
    gcTime = 30 * 60 * 1000, // 30 minutes
  } = options;

  const query = useQuery({
    queryKey: ['stories', 'offline'],
    queryFn: () => storiesApi.getAllByLanguage('en'),
    enabled: enabled && !isOffline,
    staleTime,
    gcTime,
    retry: (failureCount, error) => {
      // Don't retry if offline
      if (isOffline) return false;
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Get cached data when offline
  const cachedData = queryClient.getQueryData(['stories', 'offline']) as Story[] | undefined;

  return {
    ...query,
    data: isOffline ? cachedData : query.data,
    isOffline,
    hasCachedData: !!cachedData,
  };
}

export function useOfflineCategories(options: UseOfflineDataOptions = {}) {
  const { isOffline } = useNetwork();
  const queryClient = useQueryClient();
  
  const {
    enabled = true,
    staleTime = 10 * 60 * 1000, // 10 minutes
    gcTime = 60 * 60 * 1000, // 1 hour
  } = options;

  const query = useQuery({
    queryKey: ['categories', 'offline'],
    queryFn: () => tagsApi.getAllByLanguage('en'),
    enabled: enabled && !isOffline,
    staleTime,
    gcTime,
    retry: (failureCount, error) => {
      if (isOffline) return false;
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Get cached data when offline
  const cachedData = queryClient.getQueryData(['categories', 'offline']) as Tag[] | undefined;

  return {
    ...query,
    data: isOffline ? cachedData : query.data,
    isOffline,
    hasCachedData: !!cachedData,
  };
}

export function useOfflineStory(storyId: string, options: UseOfflineDataOptions = {}) {
  const { isOffline } = useNetwork();
  const queryClient = useQueryClient();
  
  const {
    enabled = true,
    staleTime = 10 * 60 * 1000, // 10 minutes
    gcTime = 60 * 60 * 1000, // 1 hour
  } = options;

  const query = useQuery({
    queryKey: ['story', storyId, 'offline'],
    queryFn: () => storiesApi.getById(storyId),
    enabled: enabled && !isOffline && !!storyId,
    staleTime,
    gcTime,
    retry: (failureCount, error) => {
      if (isOffline) return false;
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Get cached data when offline
  const cachedData = queryClient.getQueryData(['story', storyId, 'offline']) as Story | undefined;

  return {
    ...query,
    data: isOffline ? cachedData : query.data,
    isOffline,
    hasCachedData: !!cachedData,
  };
}

// Hook to preload data for offline use
export function usePreloadData() {
  const queryClient = useQueryClient();
  const { isOffline } = useNetwork();

  const preloadStories = async () => {
    if (isOffline) return;
    
    try {
      await queryClient.prefetchQuery({
        queryKey: ['stories', 'offline'],
        queryFn: () => storiesApi.getAllByLanguage('en'),
        staleTime: 5 * 60 * 1000,
      });
    } catch (error) {
      console.error('Failed to preload stories:', error);
    }
  };

  const preloadCategories = async () => {
    if (isOffline) return;
    
    try {
      await queryClient.prefetchQuery({
        queryKey: ['categories', 'offline'],
        queryFn: () => tagsApi.getAllByLanguage('en'),
        staleTime: 10 * 60 * 1000,
      });
    } catch (error) {
      console.error('Failed to preload categories:', error);
    }
  };

  const preloadAll = async () => {
    await Promise.all([
      preloadStories(),
      preloadCategories(),
    ]);
  };

  return {
    preloadStories,
    preloadCategories,
    preloadAll,
    isOffline,
  };
}
