import { useState, useEffect, useRef, useCallback } from 'react';
import { Audio } from 'expo-av';
import { useFocusEffect } from '@react-navigation/native';
import type { StoryAudio, UseAudioReturn, AudioPlayerState } from '@/types';

interface UseAudioProps {
  audio?: StoryAudio;
  autoPlay?: boolean;
  onPlaybackStatusUpdate?: (status: any) => void;
}

export function useAudio({ 
  audio, 
  autoPlay = false, 
  onPlaybackStatusUpdate 
}: UseAudioProps): UseAudioReturn {
  const [state, setState] = useState<AudioPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1.0,
    playbackRate: 1.0,
    isLoading: false,
    error: undefined
  });

  const soundRef = useRef<Audio.Sound | null>(null);
  const statusUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load audio when audio prop changes
  useEffect(() => {
    if (audio?.audioUrl) {
      loadAudio();
    } else {
      unloadAudio();
    }

    return () => {
      unloadAudio();
    };
  }, [audio?.audioUrl]);

  // Auto-play when audio is loaded
  useEffect(() => {
    if (autoPlay && audio?.audioUrl && soundRef.current && !state.isPlaying) {
      play();
    }
  }, [autoPlay, audio?.audioUrl, state.isPlaying]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      unloadAudio();
    };
  }, []);

  // Pause audio when screen loses focus
  useFocusEffect(
    useCallback(() => {
      return () => {
        if (state.isPlaying) {
          pause();
        }
      };
    }, [state.isPlaying])
  );

  const loadAudio = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: undefined }));
      
      // Unload previous audio
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }

      // Configure audio mode for background playback
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      // Load new audio
      const { sound } = await Audio.Sound.createAsync(
        { uri: audio!.audioUrl },
        { 
          shouldPlay: false,
          isLooping: false,
          volume: state.volume,
          rate: state.playbackRate,
        },
        onPlaybackStatusUpdate || onStatusUpdate
      );

      soundRef.current = sound;
      
      // Get duration
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        setState(prev => ({
          ...prev,
          duration: status.durationMillis ? status.durationMillis / 1000 : 0,
          isLoading: false
        }));
      }
    } catch (error) {
      console.error('Error loading audio:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load audio'
      }));
    }
  };

  const unloadAudio = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      clearStatusUpdateInterval();
      setState(prev => ({
        ...prev,
        isPlaying: false,
        currentTime: 0,
        duration: 0
      }));
    } catch (error) {
      console.error('Error unloading audio:', error);
    }
  };

  const onStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setState(prev => ({
        ...prev,
        isPlaying: status.isPlaying,
        currentTime: status.positionMillis ? status.positionMillis / 1000 : 0,
        duration: status.durationMillis ? status.durationMillis / 1000 : prev.duration,
        isLoading: false
      }));

      // Handle playback end
      if (status.didJustFinish) {
        setState(prev => ({
          ...prev,
          isPlaying: false,
          currentTime: 0
        }));
      }
    } else if (status.error) {
      setState(prev => ({
        ...prev,
        error: 'Playback error',
        isLoading: false,
        isPlaying: false
      }));
    }
  };

  const startStatusUpdateInterval = () => {
    if (statusUpdateIntervalRef.current) {
      clearInterval(statusUpdateIntervalRef.current);
    }
    
    statusUpdateIntervalRef.current = setInterval(async () => {
      if (soundRef.current) {
        try {
          const status = await soundRef.current.getStatusAsync();
          onStatusUpdate(status);
        } catch (error) {
          console.error('Error getting status:', error);
        }
      }
    }, 1000);
  };

  const clearStatusUpdateInterval = () => {
    if (statusUpdateIntervalRef.current) {
      clearInterval(statusUpdateIntervalRef.current);
      statusUpdateIntervalRef.current = null;
    }
  };

  const play = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.playAsync();
        startStatusUpdateInterval();
        setState(prev => ({ ...prev, isPlaying: true, error: undefined }));
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to play audio',
        isPlaying: false
      }));
    }
  };

  const pause = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.pauseAsync();
        clearStatusUpdateInterval();
        setState(prev => ({ ...prev, isPlaying: false }));
      }
    } catch (error) {
      console.error('Error pausing audio:', error);
    }
  };

  const seek = async (time: number) => {
    try {
      if (soundRef.current) {
        await soundRef.current.setPositionAsync(time * 1000);
        setState(prev => ({ ...prev, currentTime: time }));
      }
    } catch (error) {
      console.error('Error seeking audio:', error);
    }
  };

  const setVolume = async (volume: number) => {
    try {
      if (soundRef.current) {
        await soundRef.current.setVolumeAsync(volume);
        setState(prev => ({ ...prev, volume }));
      }
    } catch (error) {
      console.error('Error setting volume:', error);
    }
  };

  const setPlaybackRate = async (rate: number) => {
    try {
      if (soundRef.current) {
        await soundRef.current.setRateAsync(rate, true);
        setState(prev => ({ ...prev, playbackRate: rate }));
      }
    } catch (error) {
      console.error('Error setting playback rate:', error);
    }
  };

  const stop = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        clearStatusUpdateInterval();
        setState(prev => ({
          ...prev,
          isPlaying: false,
          currentTime: 0
        }));
      }
    } catch (error) {
      console.error('Error stopping audio:', error);
    }
  };

  const togglePlayPause = async () => {
    if (state.isPlaying) {
      await pause();
    } else {
      await play();
    }
  };

  return {
    isPlaying: state.isPlaying,
    currentTime: state.currentTime,
    duration: state.duration,
    volume: state.volume,
    playbackRate: state.playbackRate,
    isLoading: state.isLoading,
    error: state.error,
    play,
    pause,
    seek,
    setVolume,
    setPlaybackRate,
    stop,
    togglePlayPause
  };
}
