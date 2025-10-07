// Core Story Types
export interface Story {
  id: string;
  title: string;
  content: string;
  description: string;
  slug: string;
  readingTime: number;
  ageGroup: '3-5' | '6-8' | '9-12';
  tags: string[];
  images: StoryImage[];
  audio?: StoryAudio;
  hasAudio?: boolean; // Indicates if audio is available for this story in the current language
  createdAt: string;
  updatedAt: string;
}

export interface StoryImage {
  id: string;
  src: string;
  alt: string;
  position: number;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  storagePath?: string;
}

export interface StoryAudio {
  id: string;
  storyId: string;
  language: string;
  audioUrl: string;
  fileName?: string;
  fileSize?: number;
  duration?: number; // in seconds
  mimeType: string;
  storagePath?: string;
  narratorName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
}

export interface Locale {
  code: string; // e.g. "en", "pl", "ru"
  name: string; // e.g. "English", "Polish", "Russian"
}

// Navigation Types
export type RootStackParamList = {
  Main: undefined;
  StoryDetail: { storyId: string; storySlug: string };
  AudioPlayer: { storyId: string; audioUrl: string };
  Search: undefined;
  Category: { tagSlug: string; tagName: string };
};

export type MainTabParamList = {
  Stories: undefined;
  Search: undefined;
  Favorites: undefined;
  Settings: undefined;
};

// Navigation prop types
export type NavigationProp = any; // Will be properly typed when navigation is set up

// API Response Types
export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
  loading: boolean;
}

// User Preferences
export interface UserPreferences {
  language: string;
  ageGroup: string[];
  autoPlay: boolean;
  sleepTimer: number; // in minutes
  nightMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  audioSpeed: number;
}

// Audio Player State
export interface AudioPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
  isLoading: boolean;
  error?: string;
}

// Offline Content
export interface OfflineContent {
  storyId: string;
  downloadedAt: string;
  size: number;
  includesAudio: boolean;
  includesImages: boolean;
}

// Search and Filter Types
export interface SearchFilters {
  query: string;
  tags: string[];
  ageGroups: string[];
  hasAudio: boolean;
  sortBy: 'newest' | 'oldest' | 'title' | 'readingTime';
}

// Component Props
export interface StoryCardProps {
  story: Story;
  onPress: (story: Story) => void;
  showAudio?: boolean;
  compact?: boolean;
  layout?: 'vertical' | 'horizontal';
}

export interface AudioPlayerProps {
  audio: StoryAudio;
  storyTitle: string;
  onClose?: () => void;
  autoPlay?: boolean;
}

export interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  value?: string;
}

export interface CategoryFilterProps {
  categories: Tag[];
  selectedCategories: string[];
  onSelectionChange: (categories: string[]) => void;
}

// Hook Return Types
export interface UseStoriesReturn {
  stories: Story[];
  loading: boolean;
  error?: string;
  refetch: () => void;
  loadMore: () => void;
  hasMore: boolean;
}

export interface UseAudioReturn {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
  isLoading: boolean;
  error?: string;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  seek: (time: number) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  setPlaybackRate: (rate: number) => Promise<void>;
  stop: () => Promise<void>;
  togglePlayPause: () => Promise<void>;
}

export interface UseOfflineReturn {
  isOffline: boolean;
  downloadedStories: string[];
  downloadStory: (storyId: string) => Promise<void>;
  removeDownload: (storyId: string) => Promise<void>;
  getOfflineStory: (storyId: string) => Promise<Story | null>;
}
