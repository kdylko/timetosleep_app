import { useState, useEffect } from 'react';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { storiesApi, tagsApi } from '@/services/supabase';
import type { Story, Tag, UseStoriesReturn, SearchFilters } from '@/types';

// Hook for fetching all stories with pagination
export function useStories(language: string = 'en', limit: number = 20) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    tags: [],
    ageGroups: [],
    hasAudio: false,
    sortBy: 'newest'
  });

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch
  } = useInfiniteQuery({
    queryKey: ['stories', 'paginated', language, filters],
    initialPageParam: 0,
    queryFn: async ({ pageParam = 0 }) => {
      const stories = await storiesApi.getAllByLanguage(language);
      
      // Apply filters
      let filteredStories = stories;
      
      if (filters.query) {
        filteredStories = await storiesApi.search(filters.query, language);
      }
      
      if (filters.tags.length > 0) {
        filteredStories = filteredStories.filter(story =>
          story.tags.some(tag => filters.tags.includes(tag.toLowerCase()))
        );
      }
      
      if (filters.ageGroups.length > 0) {
        filteredStories = filteredStories.filter(story =>
          filters.ageGroups.includes(story.ageGroup)
        );
      }
      
      if (filters.hasAudio) {
        filteredStories = filteredStories.filter(story => story.audio);
      }
      
      // Apply sorting
      switch (filters.sortBy) {
        case 'oldest':
          filteredStories.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          break;
        case 'title':
          filteredStories.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'readingTime':
          filteredStories.sort((a, b) => a.readingTime - b.readingTime);
          break;
        default: // newest
          filteredStories.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
      
      // Apply pagination
      const start = pageParam * limit;
      const end = start + limit;
      const paginatedStories = filteredStories.slice(start, end);
      
      return {
        stories: paginatedStories,
        hasMore: end < filteredStories.length,
        total: filteredStories.length
      };
    },
    getNextPageParam: (lastPage: any, pages: any[]) => {
      return lastPage.hasMore ? pages.length : undefined;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const stories = data?.pages.flatMap((page: any) => page.stories) ?? [];
  const total = data?.pages[0]?.total ?? 0;

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      tags: [],
      ageGroups: [],
      hasAudio: false,
      sortBy: 'newest'
    });
  };

  return {
    stories,
    loading: isLoading,
    error: error?.message,
    refetch,
    loadMore,
    hasMore: hasNextPage,
    isFetchingMore: isFetchingNextPage,
    total,
    filters,
    updateFilters,
    clearFilters
  };
}

// Hook for fetching a single story
export function useStory(storySlug: string, language: string = 'en') {
  return useQuery({
    queryKey: ['story', storySlug, language],
    queryFn: () => storiesApi.getBySlug(storySlug, language),
    enabled: !!storySlug,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook for fetching stories by category
export function useStoriesByCategory(tagSlug: string, language: string = 'en') {
  return useQuery({
    queryKey: ['stories', 'category', tagSlug, language],
    queryFn: () => storiesApi.getByTagSlug(tagSlug, language),
    enabled: !!tagSlug,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for searching stories
export function useSearchStories(query: string, language: string = 'en') {
  return useQuery({
    queryKey: ['stories', 'search', query, language],
    queryFn: () => storiesApi.search(query, language),
    enabled: query.length > 2,
    staleTime: 0, // Always fresh for search
  });
}

// Hook for fetching categories
export function useCategories(language: string = 'en') {
  return useQuery({
    queryKey: ['categories', language],
    queryFn: () => tagsApi.getAllByLanguage(language),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook for fetching featured stories (home page)
export function useFeaturedStories(language: string = 'en', limit: number = 25) {
  return useQuery({
    queryKey: ['stories', 'featured', language],
    queryFn: () => storiesApi.getAllByLanguage(language).then(stories => 
      stories.slice(0, limit)
    ),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
