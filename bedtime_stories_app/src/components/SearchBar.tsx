import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, IconButton, Chip } from 'react-native-paper';

// Import types
import type { SearchBarProps } from '@/types';

export default function SearchBar({ 
  onSearch, 
  placeholder = "Search stories...", 
  value = "" 
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState(value);
  const [isSearching, setIsSearching] = useState(false);

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.length > 2) {
        setIsSearching(true);
        onSearch(searchQuery);
        setIsSearching(false);
      } else if (searchQuery.length === 0) {
        onSearch('');
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, onSearch]);

  const handleClear = () => {
    setSearchQuery('');
    onSearch('');
  };

  const handleSubmit = () => {
    onSearch(searchQuery);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          mode="outlined"
          placeholder={placeholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSubmit}
          style={styles.searchInput}
          left={
            <TextInput.Icon 
              icon="magnify" 
              size={20}
              color="#6B7280"
            />
          }
          right={
            searchQuery.length > 0 && (
              <TextInput.Icon 
                icon="close-circle" 
                onPress={handleClear}
                size={20}
                color="#6B7280"
              />
            )
          }
          outlineColor="#E5E7EB"
          activeOutlineColor="#3B82F6"
          contentStyle={styles.inputContent}
        />
        
        {isSearching && (
          <Chip 
            mode="flat" 
            compact 
            style={styles.searchingChip}
            textStyle={styles.searchingText}
          >
            Searching...
          </Chip>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchContainer: {
    position: 'relative',
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
  },
  inputContent: {
    fontSize: 16,
  },
  searchingChip: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#3B82F6',
  },
  searchingText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
});
