import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/utils/constants';

interface FavoritesContextType {
  favorites: string[];
  addToFavorites: (storyId: string) => Promise<void>;
  removeFromFavorites: (storyId: string) => Promise<void>;
  toggleFavorite: (storyId: string) => Promise<void>;
  isFavorite: (storyId: string) => boolean;
  isLoading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load favorites from storage on mount
  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.favorites);
      if (stored) {
        const parsed = JSON.parse(stored);
        setFavorites(parsed);
        console.log('FavoritesContext - Loaded favorites:', parsed);
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveFavorites = async (newFavorites: string[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(newFavorites));
      setFavorites(newFavorites);
      console.log('FavoritesContext - Saved favorites:', newFavorites);
    } catch (error) {
      console.error('Failed to save favorites:', error);
    }
  };

  const addToFavorites = async (storyId: string) => {
    if (!favorites.includes(storyId)) {
      const newFavorites = [...favorites, storyId];
      await saveFavorites(newFavorites);
    }
  };

  const removeFromFavorites = async (storyId: string) => {
    const newFavorites = favorites.filter(id => id !== storyId);
    await saveFavorites(newFavorites);
  };

  const toggleFavorite = async (storyId: string) => {
    console.log('FavoritesContext - Toggle favorite:', storyId);
    if (favorites.includes(storyId)) {
      await removeFromFavorites(storyId);
    } else {
      await addToFavorites(storyId);
    }
  };

  const isFavorite = (storyId: string) => favorites.includes(storyId);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        toggleFavorite,
        isFavorite,
        isLoading,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}

