import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { Text, Card, Button, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';

// Import hooks
import { useFeaturedStories, useCategories } from '@/hooks/useStories';
import { useOfflineStories, useOfflineCategories } from '@/hooks/useOfflineData';
import { useNetwork } from '@/hooks/useNetwork';

// Import components
import StoryCard from '@/components/StoryCard';
import CategoryFilter from '@/components/CategoryFilter';
import SearchBar from '@/components/SearchBar';
import OfflineIndicator from '@/components/OfflineIndicator';
import OfflineScreen from '@/components/OfflineScreen';

// Import types
import type { Story, Tag } from '@/types';

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp<any>>();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Network status
  const { isOffline } = useNetwork();

  // Fetch featured stories with offline support
  const { 
    data: stories, 
    isLoading: storiesLoading, 
    error: storiesError, 
    refetch: refetchStories,
    hasCachedData: hasCachedStories
  } = useOfflineStories();

  // Fetch categories with offline support
  const { 
    data: categories, 
    isLoading: categoriesLoading,
    hasCachedData: hasCachedCategories
  } = useOfflineCategories();

  // Filter stories by selected categories
  const filteredStories = stories?.filter(story => 
    selectedCategories.length === 0 || 
    story.tags.some(tag => selectedCategories.includes(tag.toLowerCase()))
  ) || [];

  const onRefresh = async () => {
    setRefreshing(true);
    await refetchStories();
    setRefreshing(false);
  };

  const handleStoryPress = (story: Story) => {
    (navigation as any).navigate('StoryDetail', { 
      storyId: story.id, 
      storySlug: story.slug 
    });
  };

  const handleCategoryChange = (categories: string[]) => {
    setSelectedCategories(categories);
  };

  const handleSearchPress = () => {
    (navigation as any).navigate('Search');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // For now, we'll just update the local state
    // In a real app, this would trigger a search API call
  };

  // Show offline screen if offline and no cached data
  if (isOffline && !hasCachedStories && !hasCachedCategories) {
    return (
      <OfflineScreen 
        onRetry={() => refetchStories()}
        title="You're Offline"
        message="No cached stories available. Please connect to the internet to load stories."
      />
    );
  }

  if (storiesLoading || categoriesLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>
          {isOffline ? 'Loading cached stories...' : 'Loading stories...'}
        </Text>
      </View>
    );
  }

  if (storiesError && !isOffline) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load stories</Text>
        <Button mode="contained" onPress={() => refetchStories()}>
          Try Again
        </Button>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        {/* Offline Indicator */}
        <OfflineIndicator 
          onRetry={() => refetchStories()}
          showRetryButton={!isOffline}
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              enabled={!isOffline}
            />
          }
        >
      {/* Header */}
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Time to Sleep
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Bedtime stories for your children
        </Text>
      </View>

      {/* Search Bar */}
      <SearchBar 
        onSearch={handleSearch}
        placeholder="Search bedtime stories..."
        value={searchQuery}
      />

      {/* Categories Filter */}
      {categories && categories.length > 0 && (
        <CategoryFilter
          categories={categories}
          selectedCategories={selectedCategories}
          onSelectionChange={handleCategoryChange}
        />
      )}

        {/* Featured Stories */}
        <View style={styles.section}>
          <Text variant="headlineSmall" style={styles.sectionTitle}>
            {selectedCategories.length > 0 ? 'Filtered Stories' : 'Featured Stories'}
          </Text>
          
          {filteredStories.length > 0 ? (
            <View style={styles.storiesList}>
              {filteredStories.slice(0, 6).map((story) => (
                <StoryCard
                  key={story.id}
                  story={story}
                  onPress={handleStoryPress}
                  compact={false}
                  layout="vertical"
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {selectedCategories.length > 0 
                  ? 'No stories found for selected categories'
                  : 'No stories available'
                }
              </Text>
            </View>
          )}

          {filteredStories.length > 6 && (
            <Button
              mode="contained"
              onPress={() => (navigation as any).navigate('Stories')}
              style={styles.viewAllButton}
            >
              View All Stories
            </Button>
          )}
        </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 8, // Reduced padding to prevent overlap with tab bar
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 20,
  },
  errorText: {
    marginBottom: 16,
    color: '#EF4444',
    textAlign: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    color: '#6B7280',
  },
  searchCard: {
    margin: 16,
    marginBottom: 8,
  },
  searchButton: {
    borderColor: '#3B82F6',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  storiesList: {
    flexDirection: 'column',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#6B7280',
    textAlign: 'center',
  },
  viewAllButton: {
    marginTop: 16,
  },
});
