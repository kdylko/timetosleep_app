import type { Story, Tag, StoryAudio, StoryImage } from '@/types';

// Mock Stories Data
export const mockStories: Story[] = [
  {
    id: '1',
    title: 'The Little Star',
    content: 'Once upon a time, in a faraway galaxy, there was a little star who felt very lonely. Every night, the little star would look down at Earth and see all the children sleeping peacefully. The star wished it could help them have sweet dreams.\n\nOne magical night, the little star discovered it had a special power - it could sprinkle stardust that would create beautiful dreams for children. From that night on, the little star made sure every child had wonderful dreams filled with adventures and happiness.\n\nAnd that\'s why we see stars twinkling in the sky - they\'re watching over us and making sure we have the sweetest dreams.',
    description: 'A heartwarming story about a little star who helps children have sweet dreams.',
    slug: 'the-little-star',
    readingTime: 3,
    ageGroup: '3-5',
    tags: ['magic', 'stars', 'dreams'],
    images: [
      {
        id: '1',
        src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
        alt: 'A beautiful starry night sky',
        position: 0
      },
      {
        id: '2',
        src: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400',
        alt: 'Children sleeping peacefully',
        position: 1
      }
    ],
    audio: {
      id: '1',
      storyId: '1',
      language: 'en',
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      duration: 180,
      mimeType: 'audio/wav',
      narratorName: 'Sarah Johnson',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    title: 'The Brave Little Rabbit',
    content: 'In a cozy burrow deep in the forest, lived a little rabbit named Ruby. Ruby was smaller than all the other rabbits, but she had the biggest heart. One day, when the other animals were scared of a loud noise coming from the edge of the forest, Ruby decided to investigate.\n\nAs she hopped through the trees, Ruby discovered that the "scary noise" was just a family of humans having a picnic. The children were laughing and playing, and Ruby realized there was nothing to be afraid of.\n\nRuby returned to her friends and told them about the kind humans. From that day on, Ruby was known as the bravest rabbit in the forest, proving that courage comes in all sizes.',
    description: 'An inspiring tale about a small rabbit with a big heart and even bigger courage.',
    slug: 'the-brave-little-rabbit',
    readingTime: 4,
    ageGroup: '6-8',
    tags: ['animals', 'courage', 'friendship'],
    images: [
      {
        id: '3',
        src: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400',
        alt: 'A cute little rabbit in the forest',
        position: 0
      }
    ],
    audio: {
      id: '2',
      storyId: '2',
      language: 'en',
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      duration: 240,
      mimeType: 'audio/wav',
      narratorName: 'Michael Brown',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    title: 'The Magic Garden',
    content: 'In the heart of a bustling city, hidden behind tall buildings, there was a secret magic garden. Only children with pure hearts could find it. The garden was filled with flowers that sang lullabies and trees that whispered stories.\n\nOne evening, a little girl named Emma discovered the garden. As she walked through the singing flowers and listening trees, she felt all her worries melt away. The garden taught her that magic exists everywhere - in the kindness of others, in the beauty of nature, and in the power of imagination.\n\nFrom that night on, Emma visited the magic garden whenever she needed comfort, and she learned that the real magic was the love and wonder she carried in her heart.',
    description: 'A magical story about finding wonder and comfort in unexpected places.',
    slug: 'the-magic-garden',
    readingTime: 5,
    ageGroup: '9-12',
    tags: ['magic', 'garden', 'imagination'],
    images: [
      {
        id: '4',
        src: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
        alt: 'A beautiful magical garden',
        position: 0
      }
    ],
    audio: {
      id: '3',
      storyId: '3',
      language: 'en',
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      duration: 300,
      mimeType: 'audio/wav',
      narratorName: 'Emma Wilson',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

// Mock Categories Data
export const mockCategories: Tag[] = [
  {
    id: '1',
    name: 'Magic',
    slug: 'magic',
    description: 'Stories filled with wonder and enchantment',
    color: '#DDA0DD'
  },
  {
    id: '2',
    name: 'Animals',
    slug: 'animals',
    description: 'Adventures with our furry and feathered friends',
    color: '#FF6B6B'
  },
  {
    id: '3',
    name: 'Adventure',
    slug: 'adventure',
    description: 'Exciting journeys and thrilling quests',
    color: '#96CEB4'
  },
  {
    id: '4',
    name: 'Friendship',
    slug: 'friendship',
    description: 'Stories about the power of friendship',
    color: '#FFEAA7'
  },
  {
    id: '5',
    name: 'Classic',
    slug: 'classic',
    description: 'Timeless tales that never grow old',
    color: '#4ECDC4'
  }
];

// Mock API Service
export const mockApi = {
  // Stories
  async getAllStories(): Promise<Story[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockStories), 500);
    });
  },

  async getStoryById(id: string): Promise<Story | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const story = mockStories.find(s => s.id === id);
        resolve(story || null);
      }, 300);
    });
  },

  async getStoryBySlug(slug: string): Promise<Story | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const story = mockStories.find(s => s.slug === slug);
        resolve(story || null);
      }, 300);
    });
  },

  async searchStories(query: string): Promise<Story[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = mockStories.filter(story => 
          story.title.toLowerCase().includes(query.toLowerCase()) ||
          story.content.toLowerCase().includes(query.toLowerCase()) ||
          story.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );
        resolve(filtered);
      }, 400);
    });
  },

  // Categories
  async getAllCategories(): Promise<Tag[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockCategories), 300);
    });
  },

  async getCategoryBySlug(slug: string): Promise<Tag | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const category = mockCategories.find(c => c.slug === slug);
        resolve(category || null);
      }, 200);
    });
  },

  // Stories by category
  async getStoriesByCategory(categorySlug: string): Promise<Story[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = mockStories.filter(story => 
          story.tags.some(tag => tag.toLowerCase() === categorySlug.toLowerCase())
        );
        resolve(filtered);
      }, 400);
    });
  }
};
