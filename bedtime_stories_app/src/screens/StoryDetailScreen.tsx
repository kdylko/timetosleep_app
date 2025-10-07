import React from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Text, Button, ActivityIndicator, IconButton } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';

// Import services
import { storiesApi } from '@/services/supabase';

// Import components
import AudioPlayer from '@/components/AudioPlayer';
import StoryReader from '@/components/StoryReader';

// Import types
import type { Story } from '@/types';

const { width: screenWidth } = Dimensions.get('window');

export default function StoryDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation<NavigationProp<any>>();
  const { storyId, storySlug } = route.params as { storyId: string; storySlug: string };

  // Fetch story details
  const { data: story, isLoading, error } = useQuery({
    queryKey: ['story', storyId],
    queryFn: () => storiesApi.getBySlug(storySlug, 'en'),
    enabled: !!storySlug,
  });

  const handleAudioPress = () => {
    if (story?.audio) {
      (navigation as any).navigate('AudioPlayer', {
        storyId: story.id,
        audioUrl: story.audio.audioUrl,
      });
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading story...</Text>
      </View>
    );
  }

  if (error || !story) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load story</Text>
        <Button mode="contained" onPress={handleBackPress}>
          Go Back
        </Button>
      </View>
    );
  }

  const sortedImages = [...story.images].sort((a, b) => a.position - b.position);
  const heroImage = sortedImages[0];

  return (
    <View style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <IconButton
          icon="arrow-back"
          size={24}
          onPress={handleBackPress}
          style={styles.backButton}
        />
        <Text variant="titleMedium" style={styles.headerTitle}>
          Story
        </Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          {heroImage ? (
            <View style={styles.heroImageContainer}>
              <Image
                source={{ uri: heroImage.src }}
                style={styles.heroImage}
                resizeMode="cover"
              />
              <View style={styles.heroOverlay}>
                <View style={styles.heroContent}>
                  <Text variant="headlineMedium" style={styles.heroTitle}>
                    {story.title}
                  </Text>
                  <Text variant="bodyLarge" style={styles.heroDescription}>
                    {story.description}
                  </Text>
                  <View style={styles.heroMeta}>
                    <View style={styles.metaItem}>
                      <Ionicons name="time-outline" size={16} color="#FFFFFF" />
                      <Text style={styles.metaText}>{story.readingTime} min</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Ionicons name="person-outline" size={16} color="#FFFFFF" />
                      <Text style={styles.metaText}>{story.ageGroup}</Text>
                    </View>
                    {story.tags.length > 0 && (
                      <View style={styles.metaItem}>
                        <Ionicons name="pricetag-outline" size={16} color="#FFFFFF" />
                        <Text style={styles.metaText}>#{story.tags[0]}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.heroPlaceholder}>
              <Text style={styles.placeholderEmoji}>📖</Text>
              <Text variant="headlineMedium" style={styles.heroTitle}>
                {story.title}
              </Text>
              <Text variant="bodyLarge" style={styles.heroDescription}>
                {story.description}
              </Text>
              <View style={styles.heroMeta}>
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={16} color="#FFFFFF" />
                  <Text style={styles.metaText}>{story.readingTime} min</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="person-outline" size={16} color="#FFFFFF" />
                  <Text style={styles.metaText}>{story.ageGroup}</Text>
                </View>
                {story.tags.length > 0 && (
                  <View style={styles.metaItem}>
                    <Ionicons name="pricetag-outline" size={16} color="#FFFFFF" />
                    <Text style={styles.metaText}>#{story.tags[0]}</Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </View>

        {/* Audio Player */}
        {story.audio && (
          <View style={styles.audioSection}>
            <AudioPlayer
              audio={story.audio}
              storyTitle={story.title}
              onClose={() => {}}
              autoPlay={false}
            />
          </View>
        )}

        {/* Story Content */}
        <View style={styles.contentSection}>
          <View style={styles.contentContainer}>
            <StoryReader
              content={story.content}
              images={story.images}
              title={story.title}
            />
          </View>
        </View>

        {/* Back to Stories */}
        <View style={styles.backSection}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButtonContainer}>
            <Ionicons name="arrow-back" size={16} color="#577C8E" />
            <Text style={styles.backText}>Back to Stories</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    marginTop: 10,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  errorText: {
    color: '#EF4444',
    marginBottom: 10,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    margin: 0,
  },
  headerTitle: {
    fontWeight: '600',
    color: '#111827',
  },
  headerRight: {
    width: 48,
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    marginBottom: 16,
  },
  heroImageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 3/2,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 16,
  },
  heroContent: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 28,
  },
  heroDescription: {
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 12,
    lineHeight: 22,
  },
  heroMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  heroPlaceholder: {
    width: '100%',
    aspectRatio: 3/2,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  placeholderEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  audioSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  contentSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  contentContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  backSection: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  backButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  backText: {
    color: '#577C8E',
    fontSize: 16,
    fontWeight: '500',
  },
});