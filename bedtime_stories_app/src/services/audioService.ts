import { Audio } from 'expo-av';
import { AUDIO_CONFIG } from '@/utils/constants';
import type { StoryAudio } from '@/types';

class AudioService {
  private static instance: AudioService;
  private currentSound: Audio.Sound | null = null;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): AudioService {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService();
    }
    return AudioService.instance;
  }

  // Initialize audio service
  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: AUDIO_CONFIG.backgroundMode.staysActiveInBackground,
        playsInSilentModeIOS: AUDIO_CONFIG.backgroundMode.playsInSilentModeIOS,
        shouldDuckAndroid: AUDIO_CONFIG.backgroundMode.shouldDuckAndroid,
        playThroughEarpieceAndroid: AUDIO_CONFIG.backgroundMode.playThroughEarpieceAndroid,
      });
      
      this.isInitialized = true;
      console.log('Audio service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize audio service:', error);
      throw error;
    }
  }

  // Load and prepare audio
  public async loadAudio(audio: StoryAudio): Promise<Audio.Sound> {
    try {
      // Unload current audio if exists
      if (this.currentSound) {
        await this.unloadAudio();
      }

      // Create new sound instance
      const { sound } = await Audio.Sound.createAsync(
        { uri: audio.audioUrl },
        {
          shouldPlay: false,
          isLooping: false,
          volume: AUDIO_CONFIG.defaultVolume,
          rate: AUDIO_CONFIG.defaultPlaybackRate,
        }
      );

      this.currentSound = sound;
      return sound;
    } catch (error) {
      console.error('Failed to load audio:', error);
      throw error;
    }
  }

  // Play audio
  public async play(): Promise<void> {
    if (!this.currentSound) {
      throw new Error('No audio loaded');
    }

    try {
      await this.currentSound.playAsync();
    } catch (error) {
      console.error('Failed to play audio:', error);
      throw error;
    }
  }

  // Pause audio
  public async pause(): Promise<void> {
    if (!this.currentSound) return;

    try {
      await this.currentSound.pauseAsync();
    } catch (error) {
      console.error('Failed to pause audio:', error);
      throw error;
    }
  }

  // Stop audio
  public async stop(): Promise<void> {
    if (!this.currentSound) return;

    try {
      await this.currentSound.stopAsync();
    } catch (error) {
      console.error('Failed to stop audio:', error);
      throw error;
    }
  }

  // Seek to specific time
  public async seekTo(timeInSeconds: number): Promise<void> {
    if (!this.currentSound) return;

    try {
      await this.currentSound.setPositionAsync(timeInSeconds * 1000);
    } catch (error) {
      console.error('Failed to seek audio:', error);
      throw error;
    }
  }

  // Set volume
  public async setVolume(volume: number): Promise<void> {
    if (!this.currentSound) return;

    try {
      await this.currentSound.setVolumeAsync(volume);
    } catch (error) {
      console.error('Failed to set volume:', error);
      throw error;
    }
  }

  // Set playback rate
  public async setPlaybackRate(rate: number): Promise<void> {
    if (!this.currentSound) return;

    try {
      await this.currentSound.setRateAsync(rate, true);
    } catch (error) {
      console.error('Failed to set playback rate:', error);
      throw error;
    }
  }

  // Get current status
  public async getStatus(): Promise<any> {
    if (!this.currentSound) return null;

    try {
      return await this.currentSound.getStatusAsync();
    } catch (error) {
      console.error('Failed to get audio status:', error);
      return null;
    }
  }

  // Check if audio is loaded
  public isAudioLoaded(): boolean {
    return this.currentSound !== null;
  }

  // Check if audio is playing
  public async isPlaying(): Promise<boolean> {
    if (!this.currentSound) return false;

    try {
      const status = await this.currentSound.getStatusAsync();
      return status.isLoaded ? status.isPlaying : false;
    } catch (error) {
      console.error('Failed to check playing status:', error);
      return false;
    }
  }

  // Get current position
  public async getCurrentPosition(): Promise<number> {
    if (!this.currentSound) return 0;

    try {
      const status = await this.currentSound.getStatusAsync();
      return status.isLoaded ? status.positionMillis / 1000 : 0;
    } catch (error) {
      console.error('Failed to get current position:', error);
      return 0;
    }
  }

  // Get duration
  public async getDuration(): Promise<number> {
    if (!this.currentSound) return 0;

    try {
      const status = await this.currentSound.getStatusAsync();
      return status.isLoaded && status.durationMillis ? status.durationMillis / 1000 : 0;
    } catch (error) {
      console.error('Failed to get duration:', error);
      return 0;
    }
  }

  // Fade in audio
  public async fadeIn(duration: number = AUDIO_CONFIG.fadeSettings.fadeInDuration): Promise<void> {
    if (!this.currentSound) return;

    try {
      // Start with volume 0
      await this.setVolume(0);
      
      // Gradually increase volume
      const steps = 20;
      const stepDuration = duration / steps;
      const volumeStep = AUDIO_CONFIG.defaultVolume / steps;

      for (let i = 0; i <= steps; i++) {
        setTimeout(async () => {
          await this.setVolume(volumeStep * i);
        }, i * stepDuration);
      }
    } catch (error) {
      console.error('Failed to fade in audio:', error);
    }
  }

  // Fade out audio
  public async fadeOut(duration: number = AUDIO_CONFIG.fadeSettings.fadeOutDuration): Promise<void> {
    if (!this.currentSound) return;

    try {
      const steps = 20;
      const stepDuration = duration / steps;
      const volumeStep = AUDIO_CONFIG.defaultVolume / steps;

      for (let i = steps; i >= 0; i--) {
        setTimeout(async () => {
          await this.setVolume(volumeStep * i);
        }, (steps - i) * stepDuration);
      }

      // Stop after fade out
      setTimeout(async () => {
        await this.pause();
      }, duration);
    } catch (error) {
      console.error('Failed to fade out audio:', error);
    }
  }

  // Unload current audio
  public async unloadAudio(): Promise<void> {
    if (!this.currentSound) return;

    try {
      await this.currentSound.unloadAsync();
      this.currentSound = null;
    } catch (error) {
      console.error('Failed to unload audio:', error);
      throw error;
    }
  }

  // Cleanup service
  public async cleanup(): Promise<void> {
    try {
      await this.unloadAudio();
      this.isInitialized = false;
    } catch (error) {
      console.error('Failed to cleanup audio service:', error);
    }
  }
}

// Export singleton instance
export const audioService = AudioService.getInstance();
export default audioService;
