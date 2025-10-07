import { mockApi } from './mockData';
import type { Story, Tag } from '@/types';

// Mock Supabase service that uses local mock data
export const storiesApi = {
  async getAllByLanguage(language: string = 'en'): Promise<Story[]> {
    return mockApi.getAllStories();
  },

  async getById(id: string): Promise<Story | null> {
    return mockApi.getStoryById(id);
  },

  async getBySlug(slug: string, language: string = 'en'): Promise<Story | null> {
    return mockApi.getStoryBySlug(slug);
  },

  async getByTagSlug(tagSlug: string, language: string = 'en'): Promise<Story[]> {
    return mockApi.getStoriesByCategory(tagSlug);
  },

  async search(query: string, language: string = 'en'): Promise<Story[]> {
    return mockApi.searchStories(query);
  }
};

export const tagsApi = {
  async getAllByLanguage(language: string = 'en'): Promise<Tag[]> {
    return mockApi.getAllCategories();
  },

  async getBySlug(slug: string, language: string = 'en'): Promise<Tag | null> {
    return mockApi.getCategoryBySlug(slug);
  }
};

export const imagesApi = {
  async getByStoryId(storyId: string): Promise<any[]> {
    // Mock implementation
    return [];
  }
};

export const contactRequestsApi = {
  async create(data: any): Promise<any> {
    // Mock implementation
    return { success: true };
  }
};

export const localesApi = {
  async getAll(): Promise<any[]> {
    // Mock implementation
    return [
      { code: 'en', name: 'English' },
      { code: 'pl', name: 'Polish' },
      { code: 'ru', name: 'Russian' }
    ];
  }
};

export const audioApi = {
  async getByStoryId(storyId: string): Promise<any> {
    // Mock implementation
    return null;
  }
};
