import { useState, useCallback, useEffect, useRef } from 'react';
import { CodeSnippet, TypingStats } from '@/types';
import { calculateWPM, calculateAccuracy } from '@/utils/typing';

export function useTyping(snippet: CodeSnippet | null) {
  const [typedText, setTypedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [errors, setErrors] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [stats, setStats] = useState<TypingStats | null>(null);

  const totalErrorsRef = useRef(0);

  const reset = useCallback(() => {
    setTypedText('');
    setCurrentIndex(0);
    setErrors(0);
    setStartTime(null);
    setEndTime(null);
    setIsComplete(false);
    setStats(null);
    totalErrorsRef.current = 0;
  }, []);

  // Reset for continuing in time mode - keeps the timer running
  const resetForTimeMode = useCallback(() => {
    setTypedText('');
    setCurrentIndex(0);
    setErrors(0);
    // Keep startTime intact!
    setEndTime(null);
    setIsComplete(false);
    setStats(null);
    totalErrorsRef.current = 0;
  }, []);

  // Note: We removed the auto-reset on snippet change
  // to allow time mode to keep the timer running

  const handleKeyPress = useCallback((key: string) => {
    if (!snippet || isComplete) return;

    // Start timer on first keypress
    if (!startTime) {
      setStartTime(Date.now());
    }

    const targetChar = snippet.code[currentIndex];

    if (key === 'Backspace') {
      if (currentIndex > 0) {
        // Check if the last typed input was a tab (2 spaces)
        const lastTwoTyped = typedText.slice(-2);
        const lastTwoCode = snippet.code.substring(currentIndex - 2, currentIndex);

        if (lastTwoTyped === '  ' && lastTwoCode === '  ' && currentIndex >= 2) {
          // Remove 2 spaces if tab was used
          setTypedText(prev => prev.slice(0, -2));
          setCurrentIndex(prev => prev - 2);
        } else {
          // Remove single character
          setTypedText(prev => prev.slice(0, -1));
          setCurrentIndex(prev => prev - 1);

          // If we're backspacing over an error, reduce the error count
          const lastTypedChar = typedText[typedText.length - 1];
          const expectedChar = snippet.code[currentIndex - 1];
          if (lastTypedChar && lastTypedChar !== expectedChar) {
            totalErrorsRef.current = Math.max(0, totalErrorsRef.current - 1);
          }
        }
      }
      return;
    }

    // Handle special keys
    if (key.length > 1 && key !== 'Enter' && key !== 'Tab') {
      return;
    }

    // Handle Enter key - only process if next character is a newline
    if (key === 'Enter') {
      if (targetChar === '\n') {
        // Process Enter as a newline
        setTypedText(prev => prev + '\n');
        setCurrentIndex(prev => prev + 1);
      } else {
        // Treat Enter at wrong position as an error but don't add to typed text
        setErrors(prev => prev + 1);
        totalErrorsRef.current++;
      }
      // Check if complete after handling Enter
      if (currentIndex + 1 >= snippet.code.length) {
        const now = Date.now();
        setEndTime(now);
        setIsComplete(true);

        // Calculate final stats
        const timeInSeconds = (now - startTime!) / 1000;
        const correctChars = currentIndex + 1 - totalErrorsRef.current;
        const totalTyped = typedText.length + (targetChar === '\n' ? 1 : 0);

        setStats({
          wpm: calculateWPM(correctChars, timeInSeconds),
          accuracy: calculateAccuracy(correctChars, totalTyped),
          time: timeInSeconds,
          correctChars,
          incorrectChars: totalErrorsRef.current,
          totalChars: snippet.code.length,
        });
      }
      return;
    }

    // Handle Tab key - check if we're expecting spaces
    if (key === 'Tab') {
      // Check if the next 2 characters are spaces (common tab width)
      const nextTwoChars = snippet.code.substring(currentIndex, currentIndex + 2);
      if (nextTwoChars === '  ') {
        // Tab matches 2 spaces, add them and advance by 2
        setTypedText(prev => prev + '  ');
        setCurrentIndex(prev => prev + 2);
      } else if (targetChar === '\t') {
        // Actual tab character in code
        setTypedText(prev => prev + '\t');
        setCurrentIndex(prev => prev + 1);
      } else {
        // Tab pressed at wrong position - count as error but don't add to typed text
        setErrors(prev => prev + 1);
        totalErrorsRef.current++;
      }
      // Check if complete after handling Tab
      if (currentIndex + (nextTwoChars === '  ' ? 2 : 1) >= snippet.code.length) {
        const now = Date.now();
        setEndTime(now);
        setIsComplete(true);

        // Calculate final stats
        const timeInSeconds = (now - startTime!) / 1000;
        const correctChars = currentIndex + (nextTwoChars === '  ' ? 2 : 1) - totalErrorsRef.current;
        const totalTyped = typedText.length + (nextTwoChars === '  ' ? 2 : targetChar === '\t' ? 1 : 0);

        setStats({
          wpm: calculateWPM(correctChars, timeInSeconds),
          accuracy: calculateAccuracy(correctChars, totalTyped),
          time: timeInSeconds,
          correctChars,
          incorrectChars: totalErrorsRef.current,
          totalChars: snippet.code.length,
        });
      }
      return;
    }

    // Handle regular characters
    setTypedText(prev => prev + key);

    if (key === targetChar) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setErrors(prev => prev + 1);
      totalErrorsRef.current++;
      // Still advance cursor even on error
      setCurrentIndex(prev => prev + 1);
    }

    // Check if complete (after updating index, regardless of correctness)
    if (currentIndex + 1 >= snippet.code.length) {
      const now = Date.now();
      setEndTime(now);
      setIsComplete(true);

      // Calculate final stats
      const timeInSeconds = (now - startTime!) / 1000;
      const correctChars = currentIndex + 1 - totalErrorsRef.current;
      const totalTyped = typedText.length + 1;

      setStats({
        wpm: calculateWPM(correctChars, timeInSeconds),
        accuracy: calculateAccuracy(correctChars, totalTyped),
        time: timeInSeconds,
        correctChars,
        incorrectChars: totalErrorsRef.current,
        totalChars: snippet.code.length,
      });
    }
  }, [snippet, currentIndex, startTime, isComplete, typedText]);

  const getCurrentStats = useCallback((): TypingStats | null => {
    if (!startTime || !snippet) return null;

    const now = Date.now();
    const timeInSeconds = (now - startTime) / 1000;
    const correctChars = currentIndex - totalErrorsRef.current;

    return {
      wpm: calculateWPM(correctChars, timeInSeconds),
      accuracy: calculateAccuracy(correctChars, currentIndex || 1),
      time: timeInSeconds,
      correctChars,
      incorrectChars: totalErrorsRef.current,
      totalChars: snippet.code.length,
    };
  }, [startTime, currentIndex, snippet]);

  return {
    typedText,
    currentIndex,
    errors,
    startTime,
    endTime,
    isComplete,
    stats,
    handleKeyPress,
    reset,
    resetForTimeMode,
    getCurrentStats,
  };
}