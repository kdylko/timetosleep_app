// App Configuration
export const APP_CONFIG = {
  name: 'Time to Sleep',
  version: '1.0.0',
  description: 'Bedtime stories for children',
  supportEmail: 'support@timetosleep.org',
  website: 'https://timetosleep.org',
};

// API Configuration
export const API_CONFIG = {
  baseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
  anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
  timeout: 10000, // 10 seconds
  retryAttempts: 3,
};

// Storage Keys
export const STORAGE_KEYS = {
  userPreferences: 'user_preferences',
  downloadedStories: 'downloaded_stories',
  readingHistory: 'reading_history',
  favorites: 'favorites',
  lastSync: 'last_sync',
  audioSettings: 'audio_settings',
};

// Pagination
export const PAGINATION = {
  defaultLimit: 20,
  maxLimit: 100,
  loadMoreThreshold: 5,
};

// Audio Configuration
export const AUDIO_CONFIG = {
  defaultVolume: 1.0,
  minVolume: 0.0,
  maxVolume: 1.0,
  defaultPlaybackRate: 1.0,
  playbackRates: [0.5, 0.75, 1.0, 1.25, 1.5, 2.0],
  sleepTimerOptions: [5, 10, 15, 30, 45, 60], // in minutes
  backgroundMode: {
    staysActiveInBackground: true,
    playsInSilentModeIOS: true,
    shouldDuckAndroid: true,
    playThroughEarpieceAndroid: false,
  },
  fadeSettings: {
    fadeInDuration: 2000, // 2 seconds
    fadeOutDuration: 3000, // 3 seconds
  }
};

// Age Groups
export const AGE_GROUPS = {
  '3-5': { label: '3-5 years', color: '#FF6B6B' },
  '6-8': { label: '6-8 years', color: '#4ECDC4' },
  '9-12': { label: '9-12 years', color: '#45B7D1' },
} as const;

// Supported Languages
export const LANGUAGES = {
  en: { name: 'English', flag: '🇺🇸' },
  pl: { name: 'Polish', flag: '🇵🇱' },
  ru: { name: 'Russian', flag: '🇷🇺' },
} as const;

// Default Language
export const DEFAULT_LANGUAGE = 'en';

// Story Categories
export const STORY_CATEGORIES = {
  animals: { name: 'Animals', color: '#FF6B6B', icon: '🐾' },
  classic: { name: 'Classic', color: '#4ECDC4', icon: '📚' },
  originals: { name: 'Originals', color: '#45B7D1', icon: '✨' },
  adventure: { name: 'Adventure', color: '#96CEB4', icon: '🗺️' },
  friendship: { name: 'Friendship', color: '#FFEAA7', icon: '🤝' },
  magic: { name: 'Magic', color: '#DDA0DD', icon: '🪄' },
} as const;

// UI Constants
export const UI_CONFIG = {
  borderRadius: 12,
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
  },
  colors: {
    primary: '#3B82F6',
    secondary: '#6B7280',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    background: '#FFFFFF',
    surface: '#F9FAFB',
    text: '#111827',
    textSecondary: '#6B7280',
  },
};

// Animation Durations
export const ANIMATION_DURATION = {
  fast: 200,
  normal: 300,
  slow: 500,
};

// File Sizes
export const FILE_LIMITS = {
  maxImageSize: 5 * 1024 * 1024, // 5MB
  maxAudioSize: 50 * 1024 * 1024, // 50MB
  maxOfflineStorage: 500 * 1024 * 1024, // 500MB
};

// Error Messages
export const ERROR_MESSAGES = {
  networkError: 'Network connection error. Please check your internet connection.',
  serverError: 'Server error. Please try again later.',
  notFound: 'Content not found.',
  downloadError: 'Failed to download content.',
  audioError: 'Audio playback error.',
  storageError: 'Storage error. Please check available space.',
  permissionError: 'Permission denied. Please check app permissions.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  downloadComplete: 'Download completed successfully.',
  storySaved: 'Story saved to favorites.',
  storyRemoved: 'Story removed from favorites.',
  settingsSaved: 'Settings saved successfully.',
};
