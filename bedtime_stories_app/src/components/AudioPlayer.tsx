import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, Button, Card, Chip, IconButton } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';

// Import hooks
import { useAudio } from '@/hooks/useAudio';
import { useSleepTimer } from '@/hooks/useSleepTimer';

// Import types
import type { AudioPlayerProps } from '@/types';
import { AUDIO_CONFIG } from '@/utils/constants';

const { width: screenWidth } = Dimensions.get('window');

export default function AudioPlayer({ audio, storyTitle, onClose, autoPlay = false }: AudioPlayerProps) {
  const [showSleepTimer, setShowSleepTimer] = useState(false);
  const [showSpeedControls, setShowSpeedControls] = useState(false);

  // Audio hook
  const {
    isPlaying,
    currentTime,
    duration,
    volume,
    playbackRate,
    isLoading,
    error,
    play,
    pause,
    seek,
    setVolume,
    setPlaybackRate,
    togglePlayPause
  } = useAudio({ audio, autoPlay });

  // Sleep timer hook
  const {
    isActive: timerActive,
    timeRemaining,
    selectedDuration,
    startTimer,
    stopTimer,
    pauseTimer,
    resumeTimer,
    isPaused: timerPaused
  } = useSleepTimer({
    onTimerEnd: () => {
      pause();
      setShowSleepTimer(false);
    },
    isPlaying
  });

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (value: number) => {
    seek(value);
  };

  const handleVolumeChange = (value: number) => {
    setVolume(value);
  };

  const handleSpeedChange = (rate: number) => {
    setPlaybackRate(rate);
    setShowSpeedControls(false);
  };

  const handleSleepTimer = (minutes: number) => {
    if (timerActive) {
      stopTimer();
    } else {
      startTimer(minutes);
      setShowSleepTimer(false);
    }
  };

  if (!audio) {
    return null;
  }

  return (
    <Card style={styles.container}>
      <Card.Content>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.iconContainer}>
              <Ionicons 
                name={isPlaying ? "musical-notes" : "musical-notes-outline"} 
                size={24} 
                color="#3B82F6" 
              />
            </View>
            <View style={styles.titleContainer}>
              <Text variant="titleMedium" style={styles.title}>
                {storyTitle}
              </Text>
              <Text variant="bodySmall" style={styles.subtitle}>
                {audio.narratorName && `Narrated by ${audio.narratorName}`}
              </Text>
            </View>
          </View>
          
          <View style={styles.headerRight}>
            <IconButton
              icon="timer-outline"
              size={20}
              onPress={() => setShowSleepTimer(!showSleepTimer)}
              style={[styles.headerButton, timerActive && styles.activeButton]}
            />
            <IconButton
              icon="speedometer-outline"
              size={20}
              onPress={() => setShowSpeedControls(!showSpeedControls)}
              style={[styles.headerButton, playbackRate !== 1 && styles.activeButton]}
            />
            {onClose && (
              <IconButton
                icon="close"
                size={20}
                onPress={onClose}
                style={styles.headerButton}
              />
            )}
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Text variant="bodySmall" style={styles.timeText}>
            {formatTime(currentTime)}
          </Text>
          
          <Slider
            style={styles.progressSlider}
            value={currentTime}
            minimumValue={0}
            maximumValue={duration}
            onValueChange={handleSeek}
            minimumTrackTintColor="#3B82F6"
            maximumTrackTintColor="#E5E7EB"
            thumbTintColor="#3B82F6"
          />
          
          <Text variant="bodySmall" style={styles.timeText}>
            {formatTime(duration)}
          </Text>
        </View>

        {/* Sleep Timer */}
        {showSleepTimer && (
          <View style={styles.sleepTimerContainer}>
            <Text variant="titleSmall" style={styles.sectionTitle}>
              Sleep Timer
            </Text>
            <View style={styles.timerOptions}>
              {AUDIO_CONFIG.sleepTimerOptions.map((minutes) => (
                <Chip
                  key={minutes}
                  mode={selectedDuration === minutes ? 'flat' : 'outlined'}
                  selected={selectedDuration === minutes}
                  onPress={() => handleSleepTimer(minutes)}
                  style={[
                    styles.timerChip,
                    selectedDuration === minutes && styles.selectedChip
                  ]}
                  textStyle={styles.timerChipText}
                >
                  {minutes} min
                </Chip>
              ))}
            </View>
            {timerActive && (
              <View style={styles.timerStatus}>
                <Text variant="bodySmall" style={styles.timerText}>
                  Timer: {formatTime(timeRemaining)}
                </Text>
                <View style={styles.timerControls}>
                  <IconButton
                    icon={timerPaused ? "play" : "pause"}
                    size={16}
                    onPress={timerPaused ? resumeTimer : pauseTimer}
                    style={styles.timerButton}
                  />
                  <IconButton
                    icon="stop"
                    size={16}
                    onPress={stopTimer}
                    style={styles.timerButton}
                  />
                </View>
              </View>
            )}
          </View>
        )}

        {/* Speed Controls */}
        {showSpeedControls && (
          <View style={styles.speedContainer}>
            <Text variant="titleSmall" style={styles.sectionTitle}>
              Playback Speed
            </Text>
            <View style={styles.speedOptions}>
              {AUDIO_CONFIG.playbackRates.map((rate) => (
                <Chip
                  key={rate}
                  mode={playbackRate === rate ? 'flat' : 'outlined'}
                  selected={playbackRate === rate}
                  onPress={() => handleSpeedChange(rate)}
                  style={[
                    styles.speedChip,
                    playbackRate === rate && styles.selectedChip
                  ]}
                  textStyle={styles.speedChipText}
                >
                  {rate}x
                </Chip>
              ))}
            </View>
          </View>
        )}

        {/* Main Controls */}
        <View style={styles.controlsContainer}>
          <View style={styles.volumeContainer}>
            <Ionicons name="volume-low-outline" size={16} color="#6B7280" />
            <Slider
              style={styles.volumeSlider}
              value={volume}
              minimumValue={0}
              maximumValue={1}
              onValueChange={handleVolumeChange}
              minimumTrackTintColor="#3B82F6"
              maximumTrackTintColor="#E5E7EB"
              thumbTintColor="#3B82F6"
            />
            <Ionicons name="volume-high-outline" size={16} color="#6B7280" />
          </View>

          <View style={styles.playbackControls}>
            <IconButton
              icon="skip-previous"
              size={24}
              onPress={() => seek(Math.max(0, currentTime - 30))}
              style={styles.controlButton}
            />
            
            <IconButton
              icon={isLoading ? "loading" : (isPlaying ? "pause" : "play")}
              size={32}
              onPress={togglePlayPause}
              style={[styles.playButton, isLoading && styles.loadingButton]}
              disabled={isLoading}
            />
            
            <IconButton
              icon="skip-next"
              size={24}
              onPress={() => seek(Math.min(duration, currentTime + 30))}
              style={styles.controlButton}
            />
          </View>
        </View>

        {/* Error Display */}
        {error && (
          <Text variant="bodySmall" style={styles.errorText}>
            {error}
          </Text>
        )}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    elevation: 4,
    borderRadius: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2,
  },
  subtitle: {
    color: '#6B7280',
  },
  headerRight: {
    flexDirection: 'row',
  },
  headerButton: {
    margin: 0,
  },
  activeButton: {
    backgroundColor: '#3B82F6',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  timeText: {
    color: '#6B7280',
    fontSize: 12,
    minWidth: 40,
    textAlign: 'center',
  },
  progressSlider: {
    flex: 1,
    marginHorizontal: 12,
  },
  sleepTimerContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  sectionTitle: {
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  timerOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  timerChip: {
    marginRight: 8,
    marginBottom: 4,
    height: 28,
  },
  timerChipText: {
    fontSize: 12,
  },
  selectedChip: {
    backgroundColor: '#3B82F6',
  },
  timerStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  timerText: {
    color: '#6B7280',
    fontWeight: '500',
  },
  timerControls: {
    flexDirection: 'row',
  },
  timerButton: {
    margin: 0,
    marginLeft: 4,
  },
  speedContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  speedOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  speedChip: {
    marginRight: 8,
    marginBottom: 4,
    height: 28,
  },
  speedChipText: {
    fontSize: 12,
  },
  controlsContainer: {
    marginTop: 8,
  },
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  volumeSlider: {
    flex: 1,
    marginHorizontal: 8,
  },
  playbackControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButton: {
    margin: 0,
    marginHorizontal: 8,
  },
  playButton: {
    backgroundColor: '#3B82F6',
    margin: 0,
    marginHorizontal: 16,
  },
  loadingButton: {
    opacity: 0.6,
  },
  errorText: {
    color: '#EF4444',
    textAlign: 'center',
    marginTop: 8,
  },
});
