import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Chip, Button, Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

// Import types
import type { Tag, SearchFilters } from '@/types';

interface StoryFiltersProps {
  categories: Tag[];
  filters: SearchFilters;
  onFiltersChange: (filters: Partial<SearchFilters>) => void;
  onClearFilters: () => void;
}

export default function StoryFilters({ 
  categories, 
  filters, 
  onFiltersChange, 
  onClearFilters 
}: StoryFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  const ageGroups = [
    { value: '3-5', label: '3-5 years', color: '#FF6B6B' },
    { value: '6-8', label: '6-8 years', color: '#4ECDC4' },
    { value: '9-12', label: '9-12 years', color: '#45B7D1' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'title', label: 'Title A-Z' },
    { value: 'readingTime', label: 'Reading Time' },
  ];

  const handleCategoryToggle = (categorySlug: string) => {
    const newTags = filters.tags.includes(categorySlug)
      ? filters.tags.filter(tag => tag !== categorySlug)
      : [...filters.tags, categorySlug];
    
    onFiltersChange({ tags: newTags });
  };

  const handleAgeGroupToggle = (ageGroup: string) => {
    const newAgeGroups = filters.ageGroups.includes(ageGroup)
      ? filters.ageGroups.filter(age => age !== ageGroup)
      : [...filters.ageGroups, ageGroup];
    
    onFiltersChange({ ageGroups: newAgeGroups });
  };

  const handleSortChange = (sortBy: string) => {
    onFiltersChange({ sortBy: sortBy as any });
  };

  const handleAudioToggle = () => {
    onFiltersChange({ hasAudio: !filters.hasAudio });
  };

  const hasActiveFilters = 
    filters.tags.length > 0 || 
    filters.ageGroups.length > 0 || 
    filters.hasAudio || 
    filters.sortBy !== 'newest';

  return (
    <Card style={styles.container}>
      <Card.Content>
        {/* Filter Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Ionicons name="filter-outline" size={20} color="#6B7280" />
            <Text variant="titleMedium" style={styles.headerTitle}>
              Filters
            </Text>
            {hasActiveFilters && (
              <Chip 
                mode="flat" 
                compact 
                style={styles.activeChip}
                textStyle={styles.activeChipText}
              >
                {filters.tags.length + filters.ageGroups.length + (filters.hasAudio ? 1 : 0)}
              </Chip>
            )}
          </View>
          
          <View style={styles.headerRight}>
            {hasActiveFilters && (
              <Button 
                mode="text" 
                onPress={onClearFilters}
                style={styles.clearButton}
                labelStyle={styles.clearButtonText}
              >
                Clear
              </Button>
            )}
            <Button 
              mode="text" 
              onPress={() => setShowFilters(!showFilters)}
              icon={showFilters ? "chevron-up" : "chevron-down"}
              style={styles.toggleButton}
            >
              {showFilters ? 'Hide' : 'Show'}
            </Button>
          </View>
        </View>

        {/* Filter Content */}
        {showFilters && (
          <View style={styles.content}>
            {/* Categories */}
            <View style={styles.filterSection}>
              <Text variant="titleSmall" style={styles.sectionTitle}>
                Categories
              </Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipContainer}
              >
                {categories.map((category) => {
                  const isSelected = filters.tags.includes(category.slug);
                  return (
                    <Chip
                      key={category.id}
                      mode={isSelected ? 'flat' : 'outlined'}
                      selected={isSelected}
                      onPress={() => handleCategoryToggle(category.slug)}
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

            {/* Age Groups */}
            <View style={styles.filterSection}>
              <Text variant="titleSmall" style={styles.sectionTitle}>
                Age Groups
              </Text>
              <View style={styles.chipContainer}>
                {ageGroups.map((ageGroup) => {
                  const isSelected = filters.ageGroups.includes(ageGroup.value);
                  return (
                    <Chip
                      key={ageGroup.value}
                      mode={isSelected ? 'flat' : 'outlined'}
                      selected={isSelected}
                      onPress={() => handleAgeGroupToggle(ageGroup.value)}
                      style={[
                        styles.chip,
                        isSelected && { backgroundColor: ageGroup.color + '20' }
                      ]}
                      textStyle={[
                        styles.chipText,
                        isSelected && { color: ageGroup.color }
                      ]}
                    >
                      {ageGroup.label}
                    </Chip>
                  );
                })}
              </View>
            </View>

            {/* Audio Filter */}
            <View style={styles.filterSection}>
              <Text variant="titleSmall" style={styles.sectionTitle}>
                Content
              </Text>
              <Chip
                mode={filters.hasAudio ? 'flat' : 'outlined'}
                selected={filters.hasAudio}
                onPress={handleAudioToggle}
                style={[
                  styles.chip,
                  filters.hasAudio && { backgroundColor: '#3B82F6' + '20' }
                ]}
                textStyle={[
                  styles.chipText,
                  filters.hasAudio && { color: '#3B82F6' }
                ]}
                icon="musical-notes"
              >
                Has Audio
              </Chip>
            </View>

            {/* Sort Options */}
            <View style={styles.filterSection}>
              <Text variant="titleSmall" style={styles.sectionTitle}>
                Sort By
              </Text>
              <View style={styles.chipContainer}>
                {sortOptions.map((option) => {
                  const isSelected = filters.sortBy === option.value;
                  return (
                    <Chip
                      key={option.value}
                      mode={isSelected ? 'flat' : 'outlined'}
                      selected={isSelected}
                      onPress={() => handleSortChange(option.value)}
                      style={[
                        styles.chip,
                        isSelected && { backgroundColor: '#3B82F6' + '20' }
                      ]}
                      textStyle={[
                        styles.chipText,
                        isSelected && { color: '#3B82F6' }
                      ]}
                    >
                      {option.label}
                    </Chip>
                  );
                })}
              </View>
            </View>
          </View>
        )}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    marginBottom: 8,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    marginLeft: 8,
    fontWeight: '600',
    color: '#111827',
  },
  activeChip: {
    marginLeft: 8,
    backgroundColor: '#3B82F6',
  },
  activeChipText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearButton: {
    marginRight: 8,
  },
  clearButtonText: {
    color: '#EF4444',
    fontSize: 14,
  },
  toggleButton: {
    margin: 0,
  },
  content: {
    marginTop: 16,
  },
  filterSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
    height: 32,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
