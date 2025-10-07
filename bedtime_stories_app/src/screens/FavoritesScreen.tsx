import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, Card, Button, Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useStories } from '@/hooks/useStories';
import StoryCard from '@/components/StoryCard';
import type { Story } from '@/types';

export default function FavoritesScreen() {
  const { favorites, removeFromFavorites, isLoading: favoritesLoading } = useFavorites();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [refreshing, setRefreshing] = useState(false);
  const queryClient = useQueryClient();

  // Fetch all stories using the same hook as StoriesScreen
  const { stories: allStories, loading: isLoading, refetch } = useStories('en', 100);

  const favoriteStories = allStories?.filter(story => 
    favorites.includes(story.id)
  ) || [];

  // Debug logging
  console.log('FavoritesScreen - favorites:', favorites);
  console.log('FavoritesScreen - allStories count:', allStories?.length || 0);
  console.log('FavoritesScreen - favoriteStories count:', favoriteStories.length);

  const filteredStories = selectedCategory === 'all' 
    ? favoriteStories 
    : favoriteStories.filter(story => 
        story.tags.some((tag: string) => tag.toLowerCase() === selectedCategory.toLowerCase())
      );

  const categories = ['all', ...new Set(favoriteStories.flatMap(story => story.tags))];

  const handleStoryPress = (story: Story) => {
    // Navigate to story detail
    console.log('Navigate to story:', story.title);
  };

  const handleRemoveFavorite = async (story: Story) => {
    await removeFromFavorites(story.id);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const renderStory = ({ item }: { item: Story }) => (
    <StoryCard
      story={item}
      onPress={handleStoryPress}
      onFavoritePress={handleRemoveFavorite}
      isFavorite={true}
      showAudio={true}
      compact={false}
      layout="vertical"
    />
  );

  if (isLoading || favoritesLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading favorites...</Text>
      </View>
    );
  }

  if (favoriteStories.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="heart-outline" size={64} color="#6B7280" />
        <Text variant="headlineSmall" style={styles.emptyTitle}>
          No Favorites Yet
        </Text>
        <Text variant="bodyLarge" style={styles.emptySubtitle}>
          Start adding stories to your favorites by tapping the heart icon on any story.
        </Text>
        <Button 
          mode="contained" 
          onPress={() => {
            // Navigate to stories
            console.log('Navigate to stories');
          }}
          style={styles.browseButton}
        >
          Browse Stories
        </Button>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Favorites
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          {favoriteStories.length} favorite {favoriteStories.length === 1 ? 'story' : 'stories'}
        </Text>
      </View>

      {/* Category Filter */}
      {categories.length > 1 && (
        <View style={styles.filterContainer}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={categories}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Chip
                mode={selectedCategory === item ? 'flat' : 'outlined'}
                selected={selectedCategory === item}
                onPress={() => setSelectedCategory(item)}
                style={[
                  styles.categoryChip,
                  selectedCategory === item && styles.selectedChip
                ]}
                textStyle={styles.chipText}
              >
                {item === 'all' ? 'All' : item.charAt(0).toUpperCase() + item.slice(1)}
              </Chip>
            )}
            contentContainerStyle={styles.filterContent}
          />
        </View>
      )}

      {/* Stories List */}
      <FlatList
        data={filteredStories}
        renderItem={renderStory}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        extraData={favorites}
        ListEmptyComponent={
          <View style={styles.emptyFilterContainer}>
            <Text variant="bodyLarge" style={styles.emptyFilterText}>
              No stories found in this category
            </Text>
            <Button 
              mode="outlined" 
              onPress={() => setSelectedCategory('all')}
              style={styles.clearFilterButton}
            >
              Show All
            </Button>
          </View>
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
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  browseButton: {
    marginTop: 16,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    color: '#6B7280',
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  filterContent: {
    paddingRight: 16,
  },
  categoryChip: {
    marginRight: 8,
    height: 32,
  },
  selectedChip: {
    backgroundColor: '#3B82F6',
  },
  chipText: {
    fontSize: 12,
  },
  listContent: {
    padding: 16,
  },
  emptyFilterContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyFilterText: {
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  clearFilterButton: {
    marginTop: 8,
  },
});