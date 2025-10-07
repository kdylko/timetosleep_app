import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';

// Import navigation
import AppNavigator from '@/navigation/AppNavigator';

// Import theme
import { theme } from '@/utils/theme';

// Import services
import { audioService } from '@/services/audioService';

// Import hooks
import { usePreloadData } from '@/hooks/useOfflineData';

// Import contexts
import { FavoritesProvider } from '@/contexts/FavoritesContext';

// Use mock data service instead of Supabase
import '@/services/mockSupabase';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

export default function App() {
  // Initialize audio service on app start
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize audio service
        await audioService.initialize();
        console.log('Audio service initialized successfully');
      } catch (error) {
        console.error('Failed to initialize app:', error);
      }
    };

    initializeApp();

    // Cleanup on app unmount
    return () => {
      audioService.cleanup();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={theme}>
        <SafeAreaProvider>
          <FavoritesProvider>
            <NavigationContainer>
              <AppNavigator />
              <StatusBar style="auto" />
            </NavigationContainer>
          </FavoritesProvider>
        </SafeAreaProvider>
      </PaperProvider>
    </QueryClientProvider>
  );
}