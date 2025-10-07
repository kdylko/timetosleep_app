import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, ActivityIndicator, Button } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';

// Import services
import { storiesApi, tagsApi } from '@/services/supabase';

// Import components
import StoryCard from '@/components/StoryCard';

// Import types
import type { Story, Tag } from '@/types';

export default function CategoryScreen() {
  const route = useRoute();
  const navigation = useNavigation<NavigationProp<any>>();
  const { tagSlug, tagName } = route.params as { tagSlug: string; tagName: string };

  // Fetch stories by category
  const { data: stories, isLoading, error, refetch } = useQuery({
    queryKey: ['stories', 'category', tagSlug],
    queryFn: () => storiesApi.getByTagSlug(tagSlug, 'en'),
    enabled: !!tagSlug,
  });

  // Fetch category info
  const { data: category } = useQuery({
    queryKey: ['category', tagSlug],
    queryFn: () => tagsApi.getBySlug(tagSlug, 'en'),
    enabled: !!tagSlug,
  });

  const handleStoryPress = (story: Story) => {
    (navigation as any).navigate('StoryDetail', { 
      storyId: story.id, 
      storySlug: story.slug 
    });
  };

  const renderStory = ({ item }: { item: Story }) => (
    <StoryCard
      story={item}
      onPress={handleStoryPress}
      showAudio={true}
      compact={false}
    />
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading stories...</Text>
      </View>
    );
  }

  if (error) {
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
    <View style={styles.container}>
      {/* Category Header */}
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          {category?.name || tagName}
        </Text>
        {category?.description && (
          <Text variant="bodyLarge" style={styles.description}>
            {category.description}
          </Text>
        )}
        <Text variant="bodySmall" style={styles.count}>
          {stories?.length || 0} stories
        </Text>
      </View>

      {/* Stories List */}
      <FlatList
        data={stories}
        renderItem={renderStory}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No stories found in this category
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
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
    marginBottom: 8,
  },
  description: {
    color: '#6B7280',
    marginBottom: 8,
  },
  count: {
    color: '#6B7280',
  },
  listContent: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
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
});
