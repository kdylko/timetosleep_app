import { useState, useEffect, useRef } from 'react';
import { AUDIO_CONFIG } from '@/utils/constants';

interface UseSleepTimerProps {
  onTimerEnd?: () => void;
  isPlaying?: boolean;
}

interface UseSleepTimerReturn {
  isActive: boolean;
  timeRemaining: number;
  selectedDuration: number;
  startTimer: (duration: number) => void;
  stopTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  isPaused: boolean;
}

export function useSleepTimer({ 
  onTimerEnd, 
  isPlaying = false 
}: UseSleepTimerProps): UseSleepTimerReturn {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Auto-pause timer when audio stops
  useEffect(() => {
    if (!isPlaying && isActive && !isPaused) {
      pauseTimer();
    }
  }, [isPlaying, isActive, isPaused]);

  const startTimer = (duration: number) => {
    setSelectedDuration(duration);
    setTimeRemaining(duration * 60); // Convert minutes to seconds
    setIsActive(true);
    setIsPaused(false);
    startTimeRef.current = Date.now();
    pausedTimeRef.current = 0;

    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Start countdown
    intervalRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Timer ended
          setIsActive(false);
          setIsPaused(false);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          onTimerEnd?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    setTimeRemaining(0);
    setSelectedDuration(0);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const pauseTimer = () => {
    if (isActive && !isPaused) {
      setIsPaused(true);
      pausedTimeRef.current = Date.now();
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };

  const resumeTimer = () => {
    if (isActive && isPaused) {
      setIsPaused(false);
      
      // Resume countdown
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Timer ended
            setIsActive(false);
            setIsPaused(false);
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            onTimerEnd?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  // Format time for display
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return {
    isActive,
    timeRemaining,
    selectedDuration,
    startTimer,
    stopTimer,
    pauseTimer,
    resumeTimer,
    isPaused
  };
}
