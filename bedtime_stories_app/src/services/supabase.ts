import { createClient } from '@supabase/supabase-js';
import { API_CONFIG } from '@/utils/constants';
import type { Story, Tag, StoryAudio, Locale } from '@/types';

// Create Supabase client
export const supabase = createClient(API_CONFIG.baseUrl, API_CONFIG.anonKey);

// Helper function to transform story images
const transformStoryImages = (images: any[]): any[] => {
  return images?.map((img: any) => ({
    id: img.id,
    src: img.src,
    alt: img.alt,
    position: img.position,
    fileName: img.file_name,
    fileSize: img.file_size,
    mimeType: img.mime_type,
    storagePath: img.storage_path
  })) || [];
};

// Helper function to transform story audio
const transformStoryAudio = (audio: any): StoryAudio => ({
  id: audio.id,
  storyId: audio.story_id,
  language: audio.language,
  audioUrl: audio.audio_url,
  fileName: audio.file_name,
  fileSize: audio.file_size,
  duration: audio.duration,
  mimeType: audio.mime_type,
  storagePath: audio.storage_path,
  narratorName: audio.narrator_name,
  createdAt: audio.created_at,
  updatedAt: audio.updated_at
});

// Stories API
export const storiesApi = {
  // Get all stories with language support
  async getAllByLanguage(language: string = 'en'): Promise<Story[]> {
    const { data, error } = await supabase
      .from('stories')
      .select(`
        *,
        story_tags!inner (
          tag_id,
          tags!inner (
            id,
            name,
            slug,
            description,
            color
          )
        ),
        story_images (
          id,
          src,
          alt,
          position,
          file_name,
          file_size,
          mime_type,
          storage_path
        ),
        story_translation!inner (
          id,
          language,
          title,
          description,
          content,
          reading_time
        )
      `)
      .eq('story_translation.language', language)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching stories:', error);
      throw error;
    }

    return data?.map(story => {
      const storyTranslation = Array.isArray(story.story_translation) 
        ? story.story_translation[0] 
        : story.story_translation;

      return {
        id: story.id,
        title: storyTranslation?.title || story.title,
        description: storyTranslation?.description || story.description,
        content: storyTranslation?.content || story.content,
        tags: story.story_tags?.map((st: any) => st.tags.name) || [],
        images: transformStoryImages(story.story_images),
        readingTime: storyTranslation?.reading_time || story.reading_time,
        ageGroup: story.age_group,
        slug: story.slug,
        createdAt: story.created_at,
        updatedAt: story.updated_at
      };
    }) || [];
  },

  // Get story by slug with language support
  async getBySlug(slug: string, language: string = 'en'): Promise<Story | null> {
    const { data, error } = await supabase
      .from('stories')
      .select(`
        *,
        story_tags!inner (
          tag_id,
          tags!inner (
            id,
            name,
            slug,
            description,
            color
          )
        ),
        story_images (
          id,
          src,
          alt,
          position,
          file_name,
          file_size,
          mime_type,
          storage_path
        ),
        story_translation!inner (
          id,
          language,
          title,
          description,
          content,
          reading_time
        ),
        story_audio!left (
          id,
          language,
          audio_url,
          file_name,
          file_size,
          duration,
          mime_type,
          storage_path,
          narrator_name,
          created_at,
          updated_at
        )
      `)
      .eq('slug', slug)
      .eq('story_translation.language', language)
      .single();

    if (error || !data) {
      return null;
    }

    const storyTranslation = Array.isArray(data.story_translation) 
      ? data.story_translation[0] 
      : data.story_translation;

    // Get audio for the requested language
    const audioData = data.story_audio?.find((audio: any) => audio.language === language);
    const audio = audioData ? transformStoryAudio(audioData) : undefined;

    return {
      id: data.id,
      title: storyTranslation?.title || data.title,
      description: storyTranslation?.description || data.description,
      content: storyTranslation?.content || data.content,
      tags: data.story_tags?.map((st: any) => st.tags.name) || [],
      images: transformStoryImages(data.story_images),
      readingTime: storyTranslation?.reading_time || data.reading_time,
      ageGroup: data.age_group,
      slug: data.slug,
      audio,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  },

  // Get story by ID
  async getById(id: string): Promise<Story | null> {
    const { data, error } = await supabase
      .from('stories')
      .select(`
        *,
        story_tags!inner (
          tag_id,
          tags!inner (
            id,
            name,
            slug,
            description,
            color
          )
        ),
        story_images (
          id,
          src,
          alt,
          position,
          file_name,
          file_size,
          mime_type,
          storage_path
        ),
        story_translation!inner (
          id,
          language,
          title,
          description,
          content,
          reading_time
        ),
        story_audio!left (
          id,
          language,
          audio_url,
          file_name,
          file_size,
          duration,
          mime_type,
          storage_path,
          narrator_name,
          created_at,
          updated_at
        )
      `)
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
    }

    const storyTranslation = Array.isArray(data.story_translation) 
      ? data.story_translation[0] 
      : data.story_translation;

    // Get audio for the default language (en)
    const audioData = data.story_audio?.find((audio: any) => audio.language === 'en');
    const audio = audioData ? transformStoryAudio(audioData) : undefined;

    return {
      id: data.id,
      title: storyTranslation?.title || data.title,
      description: storyTranslation?.description || data.description,
      content: storyTranslation?.content || data.content,
      tags: data.story_tags?.map((st: any) => st.tags.name) || [],
      images: transformStoryImages(data.story_images),
      readingTime: storyTranslation?.reading_time || data.reading_time,
      ageGroup: data.age_group,
      slug: data.slug,
      audio,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  },

  // Get stories by tag with language support
  async getByTagSlug(tagSlug: string, language: string = 'en'): Promise<Story[]> {
    const { data, error } = await supabase
      .from('stories')
      .select(`
        *,
        story_tags!inner (
          tag_id,
          tags!inner (
            id,
            name,
            slug,
            description,
            color
          )
        ),
        story_images (
          id,
          src,
          alt,
          position,
          file_name,
          file_size,
          mime_type,
          storage_path
        ),
        story_translation!inner (
          id,
          language,
          title,
          description,
          content,
          reading_time
        )
      `)
      .eq('story_tags.tags.slug', tagSlug)
      .eq('story_translation.language', language)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching stories by tag:', error);
      throw error;
    }

    return data?.map(story => {
      const storyTranslation = Array.isArray(story.story_translation) 
        ? story.story_translation[0] 
        : story.story_translation;

      return {
        id: story.id,
        title: storyTranslation?.title || story.title,
        description: storyTranslation?.description || story.description,
        content: storyTranslation?.content || story.content,
        tags: story.story_tags?.map((st: any) => st.tags.name) || [],
        images: transformStoryImages(story.story_images),
        readingTime: storyTranslation?.reading_time || story.reading_time,
        ageGroup: story.age_group,
        slug: story.slug,
        createdAt: story.created_at,
        updatedAt: story.updated_at
      };
    }) || [];
  },

  // Search stories
  async search(query: string, language: string = 'en'): Promise<Story[]> {
    if (!query.trim()) {
      return [];
    }

    const { data, error } = await supabase
      .from('stories')
      .select(`
        *,
        story_tags!inner (
          tag_id,
          tags!inner (
            id,
            name,
            slug,
            description,
            color
          )
        ),
        story_images (
          id,
          src,
          alt,
          position,
          file_name,
          file_size,
          mime_type,
          storage_path
        ),
        story_translation!inner (
          id,
          language,
          title,
          description,
          content,
          reading_time
        )
      `)
      .eq('story_translation.language', language)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,content.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching stories:', error);
      throw error;
    }

    return data?.map(story => {
      const storyTranslation = Array.isArray(story.story_translation) 
        ? story.story_translation[0] 
        : story.story_translation;

      return {
        id: story.id,
        title: storyTranslation?.title || story.title,
        description: storyTranslation?.description || story.description,
        content: storyTranslation?.content || story.content,
        tags: story.story_tags?.map((st: any) => st.tags.name) || [],
        images: transformStoryImages(story.story_images),
        readingTime: storyTranslation?.reading_time || story.reading_time,
        ageGroup: story.age_group,
        slug: story.slug,
        createdAt: story.created_at,
        updatedAt: story.updated_at
      };
    }) || [];
  }
};

// Tags API
export const tagsApi = {
  // Get all tags with language support
  async getAllByLanguage(language: string = 'en'): Promise<Tag[]> {
    const { data, error } = await supabase
      .from('tags')
      .select(`
        id,
        name,
        description,
        slug,
        color,
        tag_translation!inner (
          id,
          name,
          description,
          language
        )
      `)
      .eq('tag_translation.language', language)
      .order('name');

    if (error) {
      console.error('Error fetching tags:', error);
      throw error;
    }

    return data?.map(tag => {
      const translation = Array.isArray(tag.tag_translation) 
        ? tag.tag_translation[0] 
        : tag.tag_translation;

      return {
        id: tag.id,
        name: translation?.name || tag.name,
        description: translation?.description || tag.description,
        slug: tag.slug,
        color: tag.color
      };
    }) || [];
  },

  // Get tag by slug with language support
  async getBySlug(slug: string, language: string = 'en'): Promise<Tag | null> {
    const { data, error } = await supabase
      .from('tags')
      .select(`
        id,
        name,
        description,
        slug,
        color,
        tag_translation!inner (
          id,
          name,
          description,
          language
        )
      `)
      .eq('slug', slug)
      .eq('tag_translation.language', language)
      .single();

    if (error || !data) {
      return null;
    }

    const translation = Array.isArray(data.tag_translation) 
      ? data.tag_translation[0] 
      : data.tag_translation;

    return {
      id: data.id,
      name: translation?.name || data.name,
      description: translation?.description || data.description,
      slug: data.slug,
      color: data.color
    };
  }
};

// Audio API
export const audioApi = {
  // Get audio for a specific story and language
  async getByStoryAndLanguage(storyId: string, language: string): Promise<StoryAudio | null> {
    const { data, error } = await supabase
      .from('story_audio')
      .select('*')
      .eq('story_id', storyId)
      .eq('language', language)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No audio found
      }
      console.error('Error fetching story audio:', error);
      throw error;
    }

    return transformStoryAudio(data);
  }
};

// Locales API
export const localesApi = {
  async getAll(): Promise<Locale[]> {
    const { data, error } = await supabase
      .from('locales')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      console.error('Error fetching locales:', error);
      throw error;
    }

    return data || [];
  }
};
