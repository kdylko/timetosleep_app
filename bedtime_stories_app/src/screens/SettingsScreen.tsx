import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Switch, Button, List, Divider, Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { LANGUAGES, AGE_GROUPS } from '@/utils/constants';

export default function SettingsScreen() {
  const {
    preferences,
    isLoading,
    savePreferences,
    clearHistory,
    resetPreferences,
    isFavorite
  } = useUserPreferences();

  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [showAgeGroupPicker, setShowAgeGroupPicker] = useState(false);

  const handleToggle = (key: keyof typeof preferences, value: any) => {
    savePreferences({ [key]: value });
  };

  const handleLanguageChange = (language: string) => {
    savePreferences({ language });
    setShowLanguagePicker(false);
  };

  const handleAgeGroupToggle = (ageGroup: string) => {
    const newAgeGroups = preferences.ageGroup.includes(ageGroup)
      ? preferences.ageGroup.filter(age => age !== ageGroup)
      : [...preferences.ageGroup, ageGroup];
    savePreferences({ ageGroup: newAgeGroups });
  };

  const handleResetSettings = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings to default?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => resetPreferences()
        }
      ]
    );
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Clear Reading History',
      'Are you sure you want to clear your reading history?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => clearHistory()
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading settings...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* App Settings */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            App Settings
          </Text>
          
          <List.Item
            title="Language"
            description={LANGUAGES[preferences.language as keyof typeof LANGUAGES]?.name || 'English'}
            left={(props) => <List.Icon {...props} icon="translate" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => setShowLanguagePicker(!showLanguagePicker)}
          />
          
          {showLanguagePicker && (
            <View style={styles.pickerContainer}>
              {Object.entries(LANGUAGES).map(([code, lang]) => (
                <Chip
                  key={code}
                  mode={preferences.language === code ? 'flat' : 'outlined'}
                  selected={preferences.language === code}
                  onPress={() => handleLanguageChange(code)}
                  style={styles.languageChip}
                >
                  {lang.flag} {lang.name}
                </Chip>
              ))}
            </View>
          )}

          <List.Item
            title="Age Groups"
            description={`${preferences.ageGroup.length} selected`}
            left={(props) => <List.Icon {...props} icon="account-group" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => setShowAgeGroupPicker(!showAgeGroupPicker)}
          />
          
          {showAgeGroupPicker && (
            <View style={styles.pickerContainer}>
              {Object.entries(AGE_GROUPS).map(([age, config]) => (
                <Chip
                  key={age}
                  mode={preferences.ageGroup.includes(age) ? 'flat' : 'outlined'}
                  selected={preferences.ageGroup.includes(age)}
                  onPress={() => handleAgeGroupToggle(age)}
                  style={[styles.ageChip, { backgroundColor: config.color + '20' }]}
                >
                  {config.label}
                </Chip>
              ))}
            </View>
          )}

          <List.Item
            title="Font Size"
            description={preferences.fontSize.charAt(0).toUpperCase() + preferences.fontSize.slice(1)}
            left={(props) => <List.Icon {...props} icon="format-size" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {
              const sizes: Array<'small' | 'medium' | 'large'> = ['small', 'medium', 'large'];
              const currentIndex = sizes.indexOf(preferences.fontSize);
              const nextIndex = (currentIndex + 1) % sizes.length;
              handleToggle('fontSize', sizes[nextIndex]);
            }}
          />
        </Card.Content>
      </Card>

      {/* Audio Settings */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Audio Settings
          </Text>
          
          <List.Item
            title="Auto Play"
            description="Automatically start audio when opening stories"
            left={(props) => <List.Icon {...props} icon="play-circle" />}
            right={() => (
              <Switch
                value={preferences.autoPlay}
                onValueChange={(value) => handleToggle('autoPlay', value)}
              />
            )}
          />

          <List.Item
            title="Default Sleep Timer"
            description={`${preferences.sleepTimer} minutes`}
            left={(props) => <List.Icon {...props} icon="timer" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {
              const timers = [5, 10, 15, 30, 45, 60];
              const currentIndex = timers.indexOf(preferences.sleepTimer);
              const nextIndex = (currentIndex + 1) % timers.length;
              handleToggle('sleepTimer', timers[nextIndex]);
            }}
          />

          <List.Item
            title="Audio Speed"
            description={`${preferences.audioSpeed}x`}
            left={(props) => <List.Icon {...props} icon="speedometer" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {
              const speeds = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
              const currentIndex = speeds.indexOf(preferences.audioSpeed);
              const nextIndex = (currentIndex + 1) % speeds.length;
              handleToggle('audioSpeed', speeds[nextIndex]);
            }}
          />
        </Card.Content>
      </Card>

      {/* Display Settings */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Display Settings
          </Text>
          
          <List.Item
            title="Night Mode"
            description="Dark theme for comfortable reading"
            left={(props) => <List.Icon {...props} icon="weather-night" />}
            right={() => (
              <Switch
                value={preferences.nightMode}
                onValueChange={(value) => handleToggle('nightMode', value)}
              />
            )}
          />

          <List.Item
            title="Notifications"
            description="Receive bedtime story reminders"
            left={(props) => <List.Icon {...props} icon="bell" />}
            right={() => (
              <Switch
                value={preferences.notifications}
                onValueChange={(value) => handleToggle('notifications', value)}
              />
            )}
          />
        </Card.Content>
      </Card>

      {/* Data Management */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Data Management
          </Text>
          
          <List.Item
            title="Clear Reading History"
            description={`${preferences.readingHistory.length} stories in history`}
            left={(props) => <List.Icon {...props} icon="history" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={handleClearHistory}
          />

          <List.Item
            title="Favorites"
            description={`${preferences.favorites.length} favorite stories`}
            left={(props) => <List.Icon {...props} icon="heart" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {
              // Navigate to favorites screen
              console.log('Navigate to favorites');
            }}
          />
        </Card.Content>
      </Card>

      {/* Reset Settings */}
      <Card style={styles.card}>
        <Card.Content>
          <Button
            mode="outlined"
            onPress={handleResetSettings}
            style={styles.resetButton}
            textColor="#EF4444"
          >
            Reset All Settings
          </Button>
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
  },
  card: {
    margin: 16,
    marginBottom: 8,
    elevation: 1,
  },
  sectionTitle: {
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    marginBottom: 8,
  },
  languageChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  ageChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  resetButton: {
    borderColor: '#EF4444',
  },
});