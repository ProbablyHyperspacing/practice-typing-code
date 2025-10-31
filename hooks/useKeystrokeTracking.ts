import { useState, useRef, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

export interface KeystrokeData {
  expectedKey: string;
  actualKey: string;
  timeTaken: number; // milliseconds
  wasCorrect: boolean;
  timestamp: number;
}

export interface CharacterScore {
  char: string;
  totalAttempts: number;
  errors: number;
  totalTime: number;
  averageTime: number;
  errorRate: number;
  score: number; // Combined score (higher = worse, needs more practice)
  commonMistakes: { [key: string]: number }; // What keys were typed instead
}

export interface TrackingStats {
  [char: string]: CharacterScore;
}

export function useKeystrokeTracking() {
  const [trackingData, setTrackingData] = useLocalStorage<TrackingStats>('keystrokeTracking', {});
  const lastKeystrokeTime = useRef<number>(0);
  const keystrokeHistory = useRef<KeystrokeData[]>([]);

  // Record a keystroke
  const recordKeystroke = useCallback((expectedKey: string, actualKey: string) => {
    const now = Date.now();
    const timeTaken = lastKeystrokeTime.current > 0 ? now - lastKeystrokeTime.current : 0;
    lastKeystrokeTime.current = now;

    const wasCorrect = expectedKey === actualKey;

    // Add to history
    const keystroke: KeystrokeData = {
      expectedKey,
      actualKey,
      timeTaken,
      wasCorrect,
      timestamp: now,
    };
    keystrokeHistory.current.push(keystroke);

    // Update tracking data
    setTrackingData((prev: TrackingStats) => {
      const newData: TrackingStats = { ...prev };

      // Initialize character data if it doesn't exist
      if (!newData[expectedKey]) {
        newData[expectedKey] = {
          char: expectedKey,
          totalAttempts: 0,
          errors: 0,
          totalTime: 0,
          averageTime: 0,
          errorRate: 0,
          score: 0,
          commonMistakes: {},
        };
      }

      const charData = { ...newData[expectedKey] };

      // Update stats
      charData.totalAttempts += 1;
      if (!wasCorrect) {
        charData.errors += 1;
        // Track what key was typed instead
        charData.commonMistakes[actualKey] = (charData.commonMistakes[actualKey] || 0) + 1;
      }

      // Only count timing if it's reasonable (< 2 seconds, > 0)
      // This prevents pauses from skewing the data
      if (timeTaken > 0 && timeTaken < 2000) {
        charData.totalTime += timeTaken;
      }

      // Calculate average time only from valid timing data
      // Count how many valid timings we have
      const validTimingCount = charData.totalTime > 0 ? charData.totalAttempts : 1;
      charData.averageTime = charData.totalTime / validTimingCount;

      // Calculate error rate
      charData.errorRate = charData.errors / charData.totalAttempts;

      // Calculate combined score
      // Score = (error_rate * 200) + (average_time_in_ms / 10)
      // This weighs errors 2x more heavily than speed (2:1 ratio)
      charData.score = (charData.errorRate * 200) + (charData.averageTime / 10);

      newData[expectedKey] = charData;
      return newData;
    });
  }, [setTrackingData]);

  // Reset the timer (call at start of typing)
  const resetTimer = useCallback(() => {
    lastKeystrokeTime.current = Date.now();
    keystrokeHistory.current = [];
  }, []);

  // Get the weakest characters (highest scores)
  const getWeakestCharacters = useCallback((limit: number = 10): CharacterScore[] => {
    return Object.values(trackingData)
      .filter(char => char.totalAttempts >= 3) // Only consider chars with enough data
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }, [trackingData]);

  // Get overall training progress (0-100, where 100 is perfect)
  const getTrainingProgress = useCallback((): number => {
    const chars = Object.values(trackingData);
    if (chars.length === 0) return 0; // Start at 0% when no data

    // Calculate total attempts across all characters
    const totalAttempts = chars.reduce((sum, char) => sum + char.totalAttempts, 0);

    // Very gradual progression - need lots of practice to reach high levels
    // Use a logarithmic scale to make progress feel earned
    const minAttemptsForMax = 2000; // Need 2000 total keystrokes to reach 100%

    // Logarithmic progression - early gains are slower, later gains require even more practice
    const practiceMultiplier = Math.min(1, Math.log10(totalAttempts + 1) / Math.log10(minAttemptsForMax + 1));

    // Calculate average error rate across all practiced characters
    const totalErrorRate = chars.reduce((sum, char) => sum + char.errorRate, 0);
    const avgErrorRate = totalErrorRate / chars.length;

    // Accuracy score (0% error = 100%, 100% error = 0%)
    const accuracyScore = (1 - avgErrorRate) * 100;

    // Final progress combines accuracy and practice amount
    // You need both good accuracy AND lots of practice to reach high levels
    const rawProgress = accuracyScore * practiceMultiplier;

    // Apply additional dampening for very low attempt counts to prevent jumps
    if (totalAttempts < 50) {
      return rawProgress * 0.5; // Cut in half for first 50 keystrokes
    }

    return Math.max(0, Math.min(100, rawProgress));
  }, [trackingData]);

  // Get characters that need training (score above threshold)
  const getNeedsTraining = useCallback((): CharacterScore[] => {
    return Object.values(trackingData)
      .filter(char => char.totalAttempts >= 3 && char.score > 20) // Threshold for "needs practice"
      .sort((a, b) => b.score - a.score);
  }, [trackingData]);

  // Clear all tracking data
  const clearTracking = useCallback(() => {
    setTrackingData({});
    keystrokeHistory.current = [];
    lastKeystrokeTime.current = 0;
  }, [setTrackingData]);

  return {
    trackingData,
    recordKeystroke,
    resetTimer,
    getWeakestCharacters,
    getTrainingProgress,
    getNeedsTraining,
    clearTracking,
    keystrokeHistory: keystrokeHistory.current,
  };
}
