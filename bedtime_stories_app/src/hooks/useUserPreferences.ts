import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/utils/constants';

export interface UserPreferences {
  language: string;
  ageGroup: string[];
  autoPlay: boolean;
  sleepTimer: number;
  nightMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  audioSpeed: number;
  notifications: boolean;
  favorites: string[];
  readingHistory: string[];
}

const defaultPreferences: UserPreferences = {
  language: 'en',
  ageGroup: ['3-5', '6-8', '9-12'],
  autoPlay: false,
  sleepTimer: 15,
  nightMode: false,
  fontSize: 'medium',
  audioSpeed: 1.0,
  notifications: true,
  favorites: [],
  readingHistory: []
};

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);

  // Load preferences from storage
  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.userPreferences);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPreferences({ ...defaultPreferences, ...parsed });
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const savePreferences = async (newPreferences: Partial<UserPreferences>) => {
    try {
      const updated = { ...preferences, ...newPreferences };
      await AsyncStorage.setItem(STORAGE_KEYS.userPreferences, JSON.stringify(updated));
      setPreferences(updated);
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  };

  const addToFavorites = async (storyId: string) => {
    if (!preferences.favorites.includes(storyId)) {
      const newFavorites = [...preferences.favorites, storyId];
      await savePreferences({ favorites: newFavorites });
    }
  };

  const removeFromFavorites = async (storyId: string) => {
    const newFavorites = preferences.favorites.filter(id => id !== storyId);
    await savePreferences({ favorites: newFavorites });
  };

  const toggleFavorite = async (storyId: string) => {
    console.log('toggleFavorite called for storyId:', storyId);
    console.log('Current favorites before toggle:', preferences.favorites);
    if (preferences.favorites.includes(storyId)) {
      await removeFromFavorites(storyId);
    } else {
      await addToFavorites(storyId);
    }
    console.log('Current favorites after toggle:', preferences.favorites);
  };

  const addToHistory = async (storyId: string) => {
    const newHistory = [storyId, ...preferences.readingHistory.filter(id => id !== storyId)].slice(0, 50);
    await savePreferences({ readingHistory: newHistory });
  };

  const clearHistory = async () => {
    await savePreferences({ readingHistory: [] });
  };

  const resetPreferences = async () => {
    await AsyncStorage.removeItem(STORAGE_KEYS.userPreferences);
    setPreferences(defaultPreferences);
  };

  return {
    preferences,
    isLoading,
    savePreferences,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    addToHistory,
    clearHistory,
    resetPreferences,
    isFavorite: (storyId: string) => preferences.favorites.includes(storyId),
    hasRead: (storyId: string) => preferences.readingHistory.includes(storyId)
  };
}
