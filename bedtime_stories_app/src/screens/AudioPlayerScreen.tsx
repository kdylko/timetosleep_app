import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, ActivityIndicator } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NavigationProp, RouteProp } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';

// Import services
import { storiesApi } from '@/services/supabase';

// Import components
import AudioPlayer from '@/components/AudioPlayer';

// Import types
import type { RootStackParamList } from '@/types';

type AudioPlayerScreenRouteProp = RouteProp<RootStackParamList, 'AudioPlayer'>;

export default function AudioPlayerScreen() {
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute<AudioPlayerScreenRouteProp>();
  const { storyId, audioUrl } = route.params;

  // Fetch story data
  const { 
    data: story, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['story', storyId],
    queryFn: () => storiesApi.getById(storyId),
    enabled: !!storyId,
  });

  const handleClose = () => {
    (navigation as any).goBack();
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading audio...</Text>
      </View>
    );
  }

  if (error || !story) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load story</Text>
        <Button mode="contained" onPress={handleClose}>
          Go Back
        </Button>
      </View>
    );
  }

  if (!story.audio) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No audio available for this story</Text>
        <Button mode="contained" onPress={handleClose}>
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Story Info Card */}
      <Card style={styles.storyInfoCard}>
        <Card.Content>
          <Text variant="headlineSmall" style={styles.storyTitle}>
            {story.title}
          </Text>
          <Text variant="bodyMedium" style={styles.storyDescription}>
            {story.description}
          </Text>
          
          {/* Story Meta */}
          <View style={styles.metaContainer}>
            <Text variant="bodySmall" style={styles.metaText}>
              Reading time: {story.readingTime} minutes
            </Text>
            <Text variant="bodySmall" style={styles.metaText}>
              Age: {story.ageGroup}
            </Text>
            {story.audio.narratorName && (
              <Text variant="bodySmall" style={styles.metaText}>
                Narrated by: {story.audio.narratorName}
              </Text>
            )}
          </View>
        </Card.Content>
      </Card>

      {/* Audio Player */}
      <AudioPlayer
        audio={story.audio}
        storyTitle={story.title}
        onClose={handleClose}
        autoPlay={true}
      />

      {/* Additional Controls */}
      <Card style={styles.controlsCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.controlsTitle}>
            Audio Controls
          </Text>
          <Text variant="bodySmall" style={styles.controlsDescription}>
            Use the audio player above to control playback, adjust volume, set sleep timer, and change playback speed.
          </Text>
          
          <View style={styles.quickActions}>
            <Button 
              mode="outlined" 
              onPress={() => (navigation as any).navigate('StoryDetail', { 
                storyId: story.id, 
                storySlug: story.slug 
              })}
              style={styles.actionButton}
              icon="book-open"
            >
              Read Story
            </Button>
            
            <Button 
              mode="outlined" 
              onPress={() => {
                // TODO: Implement share functionality
                console.log('Share story:', story.title);
              }}
              style={styles.actionButton}
              icon="share"
            >
              Share
            </Button>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
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
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    color: '#6B7280',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  storyInfoCard: {
    margin: 16,
    marginBottom: 8,
    elevation: 2,
  },
  storyTitle: {
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  storyDescription: {
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  metaText: {
    color: '#6B7280',
    fontSize: 12,
  },
  controlsCard: {
    margin: 16,
    marginTop: 8,
    elevation: 1,
  },
  controlsTitle: {
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  controlsDescription: {
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
});