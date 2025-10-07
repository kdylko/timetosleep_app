import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Card, Text, IconButton } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

// Import types
import type { Story } from '@/types';

interface StoryCardProps {
  story: Story;
  onPress: (story: Story) => void;
  onFavoritePress?: (story: Story) => void;
  isFavorite?: boolean;
  showAudio?: boolean;
  compact?: boolean;
  layout?: 'vertical' | 'horizontal';
}

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = screenWidth - 32; // 16px padding on each side

export default function StoryCard({ 
  story, 
  onPress, 
  onFavoritePress,
  isFavorite = false,
  showAudio = true, 
  compact = false,
  layout = 'vertical'
}: StoryCardProps) {
  const handlePress = () => {
    onPress(story);
  };

  const handleFavoritePress = () => {
    if (onFavoritePress) {
      onFavoritePress(story);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.touchable}>
      <Card style={styles.card} elevation={1}>
        {/* Story Image with Reading Time Badge */}
        <View style={styles.imageContainer}>
          {story.images && story.images.length > 0 ? (
            <Image
              source={{ uri: story.images[0].src }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderEmoji}>🌙</Text>
            </View>
          )}
          
          {/* Reading Time Badge */}
          <View style={styles.readingTimeBadge}>
            <Text style={styles.readingTimeText}>⏱️ {story.readingTime} min</Text>
          </View>
          
          {/* Favorite Button */}
          {onFavoritePress && (
            <TouchableOpacity 
              style={styles.favoriteButton}
              onPress={handleFavoritePress}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons 
                name={isFavorite ? 'heart' : 'heart-outline'} 
                size={24} 
                color={isFavorite ? '#EF4444' : '#FFFFFF'} 
              />
            </TouchableOpacity>
          )}
        </View>
        
        {/* Story Content */}
        <View style={styles.content}>
          {/* Title */}
          <Text 
            variant="titleMedium" 
            style={styles.title}
            numberOfLines={2}
          >
            {story.title}
          </Text>
          
          {/* Description */}
          <Text 
            variant="bodyMedium" 
            style={styles.description}
            numberOfLines={2}
          >
            {story.description}
          </Text>
          
          {/* Meta Information */}
          <View style={styles.metaContainer}>
            <View style={styles.metaRow}>
              <Text style={styles.ageGroupText}>👶 {story.ageGroup}</Text>
              {story.tags.length > 0 && (
                <Text style={styles.tagText}>#{story.tags[0]}</Text>
              )}
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchable: {
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 3/2,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderEmoji: {
    fontSize: 32,
    color: '#FFFFFF',
  },
  readingTimeBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  readingTimeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 12,
    flex: 1,
  },
  title: {
    color: '#101619',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 8,
  },
  description: {
    color: '#577C8E',
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 12,
  },
  metaContainer: {
    marginTop: 'auto',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ageGroupText: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '500',
  },
  tagText: {
    color: '#3B82F6',
    fontSize: 12,
    fontWeight: '500',
  },
});