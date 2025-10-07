import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Chip, Text } from 'react-native-paper';

// Import types
import type { CategoryFilterProps } from '@/types';

export default function CategoryFilter({ 
  categories, 
  selectedCategories, 
  onSelectionChange 
}: CategoryFilterProps) {
  const handleCategoryPress = (categorySlug: string) => {
    const isSelected = selectedCategories.includes(categorySlug);
    
    if (isSelected) {
      // Remove from selection
      onSelectionChange(selectedCategories.filter(slug => slug !== categorySlug));
    } else {
      // Add to selection
      onSelectionChange([...selectedCategories, categorySlug]);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={styles.title}>
        Categories
      </Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category.slug);
          
          return (
            <Chip
              key={category.id}
              mode={isSelected ? 'flat' : 'outlined'}
              selected={isSelected}
              onPress={() => handleCategoryPress(category.slug)}
              style={[
                styles.chip,
                isSelected && { backgroundColor: category.color + '20' }
              ]}
              textStyle={[
                styles.chipText,
                isSelected && { color: category.color }
              ]}
            >
              {category.name}
            </Chip>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  chip: {
    marginRight: 8,
    height: 32,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
