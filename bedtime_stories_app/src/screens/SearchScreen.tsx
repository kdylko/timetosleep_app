import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, TextInput, ActivityIndicator, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';

// Import services
import { storiesApi } from '@/services/supabase';

// Import components
import StoryCard from '@/components/StoryCard';

// Import types
import type { Story } from '@/types';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  // Search stories
  const { data: stories, isLoading, error, refetch } = useQuery({
    queryKey: ['stories', 'search', searchQuery],
    queryFn: () => storiesApi.search(searchQuery, 'en'),
    enabled: searchQuery.length > 2,
    staleTime: 0, // Always fresh for search
  });

  const handleSearch = () => {
    if (searchQuery.trim().length > 2) {
      refetch();
    }
  };

  const handleStoryPress = (story: Story) => {
    // Navigate to story detail
    console.log('Navigate to story:', story.id);
  };

  const renderStory = ({ item }: { item: Story }) => (
    <StoryCard
      story={item}
      onPress={handleStoryPress}
      showAudio={true}
      compact={false}
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        {/* Search Input */}
        <View style={styles.searchContainer}>
        <TextInput
          mode="outlined"
          placeholder="Search stories..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          right={
            <TextInput.Icon 
              icon="magnify" 
              onPress={handleSearch}
            />
          }
          style={styles.searchInput}
        />
      </View>

      {/* Search Results */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Search failed</Text>
          <Button mode="contained" onPress={handleSearch}>
            Try Again
          </Button>
        </View>
      )}

      {stories && stories.length > 0 && (
        <FlatList
          data={stories}
          renderItem={renderStory}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {searchQuery.length > 2 && stories && stories.length === 0 && !isLoading && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No stories found for "{searchQuery}"
          </Text>
        </View>
      )}

      {searchQuery.length <= 2 && (
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderText}>
            Enter at least 3 characters to search
          </Text>
        </View>
      )}
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
  searchContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
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
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  placeholderText: {
    color: '#6B7280',
    textAlign: 'center',
    fontSize: 16,
  },
});
