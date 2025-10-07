import React, { useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, ActivityIndicator, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';

// Import hooks
import { useStories, useCategories } from '@/hooks/useStories';
import { useFavorites } from '@/contexts/FavoritesContext';

// Import components
import StoryCard from '@/components/StoryCard';
import StoryFilters from '@/components/StoryFilters';

// Import types
import type { Story, Tag, SearchFilters } from '@/types';

export default function StoriesScreen() {
  const navigation = useNavigation<NavigationProp<any>>();
  const [refreshing, setRefreshing] = useState(false);
  
  // Global favorites context
  const { toggleFavorite, isFavorite } = useFavorites();

  // Use custom hooks for data fetching
  const {
    stories,
    loading: storiesLoading,
    error: storiesError,
    refetch,
    loadMore,
    hasMore,
    isFetchingMore,
    total,
    filters,
    updateFilters,
    clearFilters
  } = useStories('en', 20);

  // Fetch categories
  const { data: categories } = useCategories('en');

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleStoryPress = (story: Story) => {
    (navigation as any).navigate('StoryDetail', { 
      storyId: story.id, 
      storySlug: story.slug 
    });
  };

  const handleFavoritePress = (story: Story) => {
    console.log('StoriesScreen - Toggling favorite for story:', story.id, story.title);
    toggleFavorite(story.id);
  };


  const handleLoadMore = () => {
    if (hasMore && !isFetchingMore) {
      loadMore();
    }
  };

  const renderStory = ({ item }: { item: Story }) => (
    <StoryCard
      story={item}
      onPress={handleStoryPress}
      onFavoritePress={handleFavoritePress}
      isFavorite={isFavorite(item.id)}
      showAudio={true}
      compact={false}
      layout="vertical"
    />
  );

  if (storiesLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading stories...</Text>
      </View>
    );
  }

  if (storiesError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load stories</Text>
        <Button mode="contained" onPress={() => refetch()}>
          Try Again
        </Button>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        {/* Story Filters */}
        {categories && categories.length > 0 && (
          <StoryFilters
            categories={categories}
            filters={filters}
            onFiltersChange={updateFilters}
            onClearFilters={clearFilters}
          />
        )}

        {/* Stories List */}
        <FlatList
          data={stories}
          renderItem={renderStory}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {filters.query || filters.tags.length > 0 || filters.ageGroups.length > 0
                  ? 'No stories found matching your criteria'
                  : 'No stories available'
                }
              </Text>
            </View>
          }
          ListFooterComponent={
            isFetchingMore ? (
              <View style={styles.loadingMore}>
                <ActivityIndicator size="small" />
                <Text style={styles.loadingMoreText}>Loading more stories...</Text>
              </View>
            ) : null
          }
        />
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
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    color: '#6B7280',
    textAlign: 'center',
    fontSize: 16,
  },
  loadingMore: {
    padding: 20,
    alignItems: 'center',
  },
  loadingMoreText: {
    marginTop: 8,
    color: '#6B7280',
    fontSize: 14,
  },
});
