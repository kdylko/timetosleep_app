import React from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';

// Import types
import type { StoryImage } from '@/types';

interface StoryReaderProps {
  content: string;
  images: StoryImage[];
  title: string;
}

const { width: screenWidth } = Dimensions.get('window');

export default function StoryReader({ content, images, title }: StoryReaderProps) {
  // Sort images by position and skip the first image (used in hero)
  const sortedImages = [...images].sort((a, b) => a.position - b.position).slice(1);
  
  // Function to render content with images inserted at character positions
  const renderContentWithImages = () => {
    const elements: React.ReactNode[] = [];
    let currentPosition = 0;
    let imageIndex = 0;
    
    // Split content into paragraphs
    const paragraphs = content
      .split(/\n\s*\n/) // Split on double line breaks
      .map(p => p.trim())
      .filter(p => p.length > 0);
    
    paragraphs.forEach((paragraph, paragraphIndex) => {
      const paragraphStart = currentPosition;
      const paragraphEnd = currentPosition + paragraph.length;
      
      // Check if there are any images that should be inserted before this paragraph
      while (imageIndex < sortedImages.length && sortedImages[imageIndex].position <= paragraphStart) {
        const image = sortedImages[imageIndex];
        elements.push(
          <View key={`img-${image.id}`} style={styles.imageContainer}>
            <Image
              source={{ uri: image.src }}
              style={styles.storyImage}
              resizeMode="cover"
            />
          </View>
        );
        imageIndex++;
      }
      
      // Add the paragraph with proper styling
      elements.push(
        <Text key={`p-${paragraphIndex}`} style={styles.paragraph}>
          {paragraph}
        </Text>
      );
      
      // Check if there are any images that should be inserted after this paragraph
      while (imageIndex < sortedImages.length && sortedImages[imageIndex].position <= paragraphEnd) {
        const image = sortedImages[imageIndex];
        elements.push(
          <View key={`img-${image.id}`} style={styles.imageContainer}>
            <Image
              source={{ uri: image.src }}
              style={styles.storyImage}
              resizeMode="cover"
            />
          </View>
        );
        imageIndex++;
      }
      
      currentPosition = paragraphEnd + 2; // +2 for the double line break
    });
    
    // Add any remaining images
    while (imageIndex < sortedImages.length) {
      const image = sortedImages[imageIndex];
      elements.push(
        <View key={`img-${image.id}`} style={styles.imageContainer}>
          <Image
            source={{ uri: image.src }}
            style={styles.storyImage}
            resizeMode="cover"
          />
        </View>
      );
      imageIndex++;
    }
    
    return elements;
  };

  return (
    <View style={styles.container}>
      {renderContentWithImages()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  paragraph: {
    fontSize: 18,
    lineHeight: 32,
    color: '#2D3748',
    marginBottom: 24,
    textAlign: 'justify',
    fontFamily: 'Georgia',
    letterSpacing: 0.01,
  },
  imageContainer: {
    marginVertical: 32,
    alignItems: 'center',
  },
  storyImage: {
    width: screenWidth - 64, // Account for padding
    height: ((screenWidth - 64) * 2) / 3, // 3:2 aspect ratio
    borderRadius: 12,
  },
});