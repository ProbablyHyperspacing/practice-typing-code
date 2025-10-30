'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Settings } from 'lucide-react';
import { Languages, CodeSnippet } from '@/types';
import { useTyping } from '@/hooks/useTyping';
import { calculateWPM, calculateAccuracy } from '@/utils/typing';
import SyntaxHighlighter from '@/components/SyntaxHighlighter';
import StatsView from '@/components/StatsView';
import SettingsView from '@/components/SettingsView';
import ModePill, { TypingMode, TimeOption, SnippetLength, SnippetSource } from '@/components/ModePill';
import SuperSnippetInfo from '@/components/SuperSnippetInfo';
import NormalSnippetInfo from '@/components/NormalSnippetInfo';
import LanguageIcon from '@/components/LanguageIcon';
import ThemeToggle from '@/components/ThemeToggle';
import Navbar from '@/components/Navbar';
import codeSnippetsData from '@/data/codeSnippets.json';
import superSnippetsData from '@/data/superSnippets.json';

export default function Home() {
  const languages = codeSnippetsData.languages as Languages;
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [currentSnippet, setCurrentSnippet] = useState<CodeSnippet | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [syntaxTheme, setSyntaxTheme] = useState('github-dark');
  const [showKeyboardHints, setShowKeyboardHints] = useState(true);

  // Mode state
  const [typingMode, setTypingMode] = useState<TypingMode>('training');
  const [timeLimit, setTimeLimit] = useState(30); // in seconds
  const [snippetLength, setSnippetLength] = useState<SnippetLength>('short');
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [snippetSource, setSnippetSource] = useState<SnippetSource>('normal');
  const [currentSuperSnippet, setCurrentSuperSnippet] = useState<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [completedSnippets, setCompletedSnippets] = useState(0); // Track completed snippets in time mode
  const isAutoAdvancing = useRef(false); // Track if we're auto-advancing in time mode
  const [timeModeStats, setTimeModeStats] = useState<any>(null); // Store stats when time runs out
  const [isTimerActive, setIsTimerActive] = useState(false); // Track if timer is running
  const hasProcessedCompletion = useRef(false); // Track if we've processed the current completion

  // Accumulate stats across snippets in time mode
  const cumulativeStatsRef = useRef({ correctChars: 0, incorrectChars: 0 });

  // Adaptive training state
  const [errorPatterns, setErrorPatterns] = useState<Map<string, number>>(new Map()); // Track error frequency by pattern
  const [recentErrors, setRecentErrors] = useState<string[]>([]); // Track recent error types

  const {
    typedText,
    currentIndex,
    errors,
    startTime,
    isComplete,
    stats,
    handleKeyPress,
    reset,
    resetForTimeMode,
    getCurrentStats,
  } = useTyping(currentSnippet);

  // Detect patterns in code to categorize snippets
  const detectCodePattern = (code: string): string => {
    // Detect various code patterns
    if (code.includes('=>')) return 'arrow-function';
    if (code.includes('function')) return 'function';
    if (code.includes('class')) return 'class';
    if (code.includes('interface') || code.includes('type ')) return 'type';
    if (code.includes('.map') || code.includes('.filter') || code.includes('.reduce')) return 'array-method';
    if (code.includes('async') || code.includes('await')) return 'async';
    if (code.includes('import') || code.includes('export')) return 'module';
    if (code.includes('{') && code.includes('}')) return 'object';
    if (code.includes('[') && code.includes(']')) return 'array';
    if (code.includes('if') || code.includes('else')) return 'conditional';
    if (code.includes('for') || code.includes('while')) return 'loop';
    return 'general';
  };

  // Select a snippet based on mode and adaptive training
  const selectRandomSnippet = useCallback(() => {
    // If using super snippets, select from that data
    if (snippetSource === 'super') {
      const superSnippets = (superSnippetsData as any).superSnippets;
      const randomIndex = Math.floor(Math.random() * superSnippets.length);
      const superSnippet = superSnippets[randomIndex];

      // Batch state updates to prevent flashing
      setCurrentSuperSnippet(superSnippet);
      setSelectedLanguage(superSnippet.language);
      setCurrentSnippet({
        id: superSnippet.id,
        code: superSnippet.code,
        length: superSnippet.length,
        difficulty: superSnippet.difficulty
      });
      return;
    }

    // Normal snippet selection
    // If current language doesn't exist in normal languages (e.g., coming from super snippets), reset to javascript
    const currentLang = languages[selectedLanguage] ? selectedLanguage : 'javascript';

    const snippets = languages[currentLang].snippets;

    // Filter snippets based on mode
    let filteredSnippets = snippets;
    if (typingMode === 'training') {
      // For training mode, use all snippets with adaptive selection
      if (errorPatterns.size > 0 && Math.random() < 0.7) { // 70% chance to focus on problem areas
        // Get the pattern with most errors
        const sortedPatterns = Array.from(errorPatterns.entries()).sort((a, b) => b[1] - a[1]);
        const topPattern = sortedPatterns[0][0];

        // Filter snippets that match the problematic pattern
        const patternSnippets = snippets.filter((s: any) => {
          const pattern = detectCodePattern(s.code);
          return pattern === topPattern;
        });

        if (patternSnippets.length > 0) {
          filteredSnippets = patternSnippets;
        }
      }
      // Otherwise use all snippets (no length filtering)
    } else {
      // For time mode, use short snippets for rapid-fire practice
      filteredSnippets = snippets.filter((s: any) => s.length === 'short');
    }

    if (filteredSnippets.length === 0) filteredSnippets = snippets;
    const randomIndex = Math.floor(Math.random() * filteredSnippets.length);

    // Batch state updates for normal snippets
    setCurrentSuperSnippet(null);
    if (currentLang !== selectedLanguage) {
      setSelectedLanguage(currentLang);
    }
    setCurrentSnippet(filteredSnippets[randomIndex]);
  }, [selectedLanguage, languages, typingMode, errorPatterns, snippetSource]);

  // Select a random snippet on mount and when settings change
  useEffect(() => {
    selectRandomSnippet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snippetSource, selectedLanguage]); // Trigger on source or language change

  // Reset typing state when snippet changes (except during time mode auto-advance)
  useEffect(() => {
    // Only reset if we have a snippet and we're not auto-advancing
    if (currentSnippet && !isAutoAdvancing.current) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSnippet?.id]); // Only trigger when snippet ID changes

  // Handle mode changes
  const handleModeChange = useCallback((mode: TypingMode, value: TimeOption | SnippetLength) => {
    // Update mode state first
    if (mode === 'time') {
      const seconds = parseInt(value as string);
      setTimeLimit(seconds);
      setTimeRemaining(seconds);
      setTypingMode(mode);
      setCompletedSnippets(0); // Reset completed snippets counter
      setErrorPatterns(new Map()); // Reset error tracking
      setIsTimerActive(false); // Reset timer active state
      cumulativeStatsRef.current = { correctChars: 0, incorrectChars: 0 }; // Reset cumulative stats
    } else {
      setSnippetLength(value as SnippetLength);
      setTimeRemaining(null);
      setTypingMode(mode);
      setCompletedSnippets(0); // Reset completed snippets counter
      setErrorPatterns(new Map()); // Reset error tracking
      setIsTimerActive(false); // Reset timer active state
      cumulativeStatsRef.current = { correctChars: 0, incorrectChars: 0 }; // Reset cumulative stats
    }

    // Reset stats and timer
    setShowStats(false);
    reset();
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    // The useEffect will handle selecting a new snippet when mode/length changes
  }, [reset]);

  // Timer for time-based mode
  useEffect(() => {
    if (typingMode === 'time' && startTime && !isTimerActive) {
      // Start the timer only once when typing begins
      setIsTimerActive(true);
      setTimeRemaining(timeLimit);
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev !== null && prev > 0) {
            const newTime = prev - 1;
            if (newTime === 0) {
              // Time's up, calculate final stats and show them
              const finalStats = getCurrentStats();
              if (finalStats) {
                setTimeModeStats(finalStats);
              }
              setShowStats(true);
              setIsTimerActive(false);
              if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
              }
            }
            return newTime;
          }
          return prev;
        });
      }, 1000);
    }

    return () => {
      // Only clear timer if we're not in time mode or if typing hasn't started
      if (!typingMode.includes('time') || !startTime) {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      }
    };
  }, [typingMode, startTime, timeLimit, getCurrentStats, isTimerActive]);

  // Show stats page when complete (training mode) or time's up (time mode)
  useEffect(() => {
    if (typingMode === 'training' && isComplete && !hasProcessedCompletion.current) {
      hasProcessedCompletion.current = true;

      // Track errors for adaptive training
      if (currentSnippet && stats) {
        const pattern = detectCodePattern(currentSnippet.code);
        if (stats.incorrectChars > 0) {
          // Update error patterns
          setErrorPatterns(prev => {
            const newPatterns = new Map(prev);
            const currentCount = newPatterns.get(pattern) || 0;
            newPatterns.set(pattern, currentCount + stats.incorrectChars);
            return newPatterns;
          });
        }
      }

      // In training mode, auto-advance to next snippet when one is completed (infinite)
      setCompletedSnippets(prev => prev + 1);
      // Small delay before loading next snippet for smooth transition
      setTimeout(() => {
        isAutoAdvancing.current = true; // Set flag to prevent reset
        selectRandomSnippet();
        resetForTimeMode(); // Use resetForTimeMode to keep timer running
        hasProcessedCompletion.current = false; // Reset for next snippet
        // Clear the flag after a short delay
        setTimeout(() => {
          isAutoAdvancing.current = false;
        }, 100);
      }, 200);
    } else if (typingMode === 'time' && isComplete && timeRemaining !== null && timeRemaining > 0 && !hasProcessedCompletion.current) {
      hasProcessedCompletion.current = true;

      // Get stats for completed snippet and add to cumulative total
      const snippetStats = getCurrentStats();
      if (snippetStats) {
        cumulativeStatsRef.current.correctChars += snippetStats.correctChars;
        cumulativeStatsRef.current.incorrectChars += snippetStats.incorrectChars;
      }

      // In time mode, auto-advance to next snippet when one is completed
      setCompletedSnippets(prev => prev + 1);
      // Small delay before loading next snippet for smooth transition
      setTimeout(() => {
        isAutoAdvancing.current = true; // Set flag to prevent reset
        selectRandomSnippet();
        resetForTimeMode(); // Use resetForTimeMode to keep timer running
        hasProcessedCompletion.current = false; // Reset for next snippet
        // Clear the flag after a short delay
        setTimeout(() => {
          isAutoAdvancing.current = false;
        }, 100);
      }, 200);
    } else if (typingMode === 'time' && timeRemaining === 0) {
      // Time's up - calculate final cumulative stats
      const currentStats = getCurrentStats();
      if (currentStats && startTime) {
        // Add current (incomplete) snippet stats to cumulative total
        const finalCorrectChars = cumulativeStatsRef.current.correctChars + currentStats.correctChars;
        const finalIncorrectChars = cumulativeStatsRef.current.incorrectChars + currentStats.incorrectChars;
        const totalTyped = finalCorrectChars + finalIncorrectChars;

        const timeInSeconds = (Date.now() - startTime) / 1000;

        const finalStats = {
          wpm: calculateWPM(finalCorrectChars, timeInSeconds),
          accuracy: calculateAccuracy(finalCorrectChars, totalTyped),
          time: timeInSeconds,
          correctChars: finalCorrectChars,
          incorrectChars: finalIncorrectChars,
          totalChars: totalTyped, // Use totalTyped instead of accumulated snippet lengths
        };

        setTimeModeStats(finalStats);
        setShowStats(true);
      }
    }

    // Reset the flag when isComplete becomes false
    if (!isComplete) {
      hasProcessedCompletion.current = false;
    }
  }, [isComplete, stats, typingMode, timeRemaining, getCurrentStats, resetForTimeMode, selectRandomSnippet, currentSnippet, detectCodePattern]);

  const handleRetry = () => {
    setShowStats(false);
    reset();
    setCompletedSnippets(0); // Reset completed snippets counter
    setTimeModeStats(null); // Clear time mode stats
    setIsTimerActive(false); // Reset timer active state
    setErrorPatterns(new Map()); // Reset error tracking for training mode
    cumulativeStatsRef.current = { correctChars: 0, incorrectChars: 0 }; // Reset cumulative stats
    if (typingMode === 'time') {
      setTimeRemaining(timeLimit);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const handleNext = () => {
    setShowStats(false);
    selectRandomSnippet();
  };

  const handleNewSnippet = () => {
    // Don't reset typing stats, just get a new snippet
    selectRandomSnippet();
    reset();
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    setShowStats(false);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle shortcuts when not typing (stats/settings shown, or specifically modifier+key combos)
      // Don't interfere with normal typing

      // Escape to reset (only if settings/stats not open)
      if (e.key === 'Escape') {
        if (showSettings) {
          setShowSettings(false);
        } else if (showStats) {
          setShowStats(false);
          reset();
        } else {
          reset();
        }
        return;
      }

      // Only handle other shortcuts if they include modifier keys
      // This prevents interference with normal typing
      if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !showSettings && !showStats) {
        // Let normal typing through without interference
        return;
      }

      // Shift + Enter to change snippet
      if (e.key === 'Enter' && e.shiftKey) {
        e.preventDefault();
        selectRandomSnippet();
      }
      // Cmd/Ctrl + Comma to open settings
      if (e.key === ',' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setShowSettings(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [reset, selectRandomSnippet, showSettings, showStats]);

  return (
    <div className="min-h-screen flex flex-col">
      <AnimatePresence mode="wait">
        {showSettings ? (
          // Settings View
          <motion.div
            key="settings"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1"
          >
            <SettingsView
              languages={languages}
              selectedLanguage={selectedLanguage}
              onLanguageChange={handleLanguageChange}
              syntaxTheme={syntaxTheme}
              onThemeChange={setSyntaxTheme}
              showKeyboardHints={showKeyboardHints}
              onKeyboardHintsChange={setShowKeyboardHints}
              onClose={() => setShowSettings(false)}
            />
          </motion.div>
        ) : showStats ? (
          // Stats View - Full page stats after completion
          <motion.div
            key="stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1"
          >
            <StatsView
              stats={typingMode === 'time' ? (timeModeStats || getCurrentStats() || { wpm: 0, accuracy: 0, time: 0, correctChars: 0, incorrectChars: 0, totalChars: 0 }) : stats}
              onRetry={handleRetry}
              onNext={handleNext}
              completedSnippets={typingMode === 'time' ? completedSnippets : undefined}
              mode={typingMode}
            />
          </motion.div>
        ) : (
          // Typing View
          <motion.div
            key="typing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col"
          >
            {/* Navbar */}
            <Navbar
              currentLanguage={snippetSource === 'super' && currentSuperSnippet ? currentSuperSnippet.language : selectedLanguage}
              languageColor={snippetSource === 'super' || !languages[selectedLanguage] ? undefined : languages[selectedLanguage].color}
              languageName={snippetSource === 'super' && currentSuperSnippet ? currentSuperSnippet.language : languages[selectedLanguage]?.name}
              onSettingsClick={() => setShowSettings(true)}
            />

            {/* Main Content */}
            <main className="flex-1 px-4 pb-8">
              {/* Super Snippet Info Panel */}
              {snippetSource === 'super' && currentSuperSnippet && (
                <SuperSnippetInfo
                  story={currentSuperSnippet.story}
                  description={currentSuperSnippet.description}
                  impact={currentSuperSnippet.impact}
                />
              )}

              {/* Normal Snippet Info Panel */}
              {snippetSource === 'normal' && currentSnippet && (
                <NormalSnippetInfo
                  name={(currentSnippet as any).name || 'Code Pattern'}
                  description={(currentSnippet as any).description || 'A common coding pattern'}
                  situation={(currentSnippet as any).situation || 'Used in everyday development'}
                />
              )}

              <div className="max-w-6xl mx-auto space-y-6">
                {/* Mode Pill */}
                <ModePill
                  onModeChange={handleModeChange}
                  timeRemaining={timeRemaining}
                  isTyping={isTimerActive}
                  onRetry={handleRetry}
                  onNewSnippet={handleNewSnippet}
                  onSnippetSourceChange={setSnippetSource}
                />

                {/* Typing Area with Syntax Highlighting */}
                {currentSnippet && (
                  <div className="ml-48">
                    <SyntaxHighlighter
                      key={currentSnippet.id}
                      code={currentSnippet.code}
                      language={selectedLanguage}
                      theme={syntaxTheme}
                      currentIndex={currentIndex}
                      typedText={typedText}
                      isComplete={isComplete && typingMode === 'snippet'}
                      onKeyPress={handleKeyPress}
                      showKeyboardHints={showKeyboardHints}
                    />
                  </div>
                )}

              </div>
            </main>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}