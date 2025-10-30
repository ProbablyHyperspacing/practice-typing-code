'use client';

import { useState, Fragment } from 'react';
import { RotateCcw, Shuffle } from 'lucide-react';

export type TypingMode = 'time' | 'training';
export type TimeOption = '30s' | '45s' | '60s';
export type SnippetLength = 'short' | 'medium' | 'long';
export type SnippetSource = 'normal' | 'super';

// Reusable curved arrow SVG
const CurvedArrow = () => (
  <svg width="20" height="15" viewBox="0 0 20 15">
    <path
      d="M 2 2 Q 2 8, 8 11 Q 14 14, 18 14"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
      className="text-text-light-secondary/30 dark:text-text-secondary/30"
      strokeLinecap="round"
    />
  </svg>
);

interface ModePillProps {
  onModeChange: (mode: TypingMode, value: TimeOption | SnippetLength) => void;
  timeRemaining?: number | null;
  isTyping?: boolean;
  onRetry?: () => void;
  onNewSnippet?: () => void;
  onSnippetSourceChange?: (source: SnippetSource) => void;
}

export default function ModePill({ onModeChange, timeRemaining, isTyping, onRetry, onNewSnippet, onSnippetSourceChange }: ModePillProps) {
  const [mode, setMode] = useState<TypingMode>('training');
  const [timeOption, setTimeOption] = useState<TimeOption>('30s');
  const [snippetLength, setSnippetLength] = useState<SnippetLength>('short');
  const [snippetSource, setSnippetSource] = useState<SnippetSource>('normal');

  const handleModeChange = (newMode: TypingMode) => {
    setMode(newMode);
    const value = newMode === 'time' ? timeOption : snippetLength;
    onModeChange(newMode, value);
  };

  const handleTimeChange = (option: TimeOption) => {
    setTimeOption(option);
    if (mode === 'time') {
      onModeChange('time', option);
    }
  };

  const handleSnippetChange = (length: SnippetLength) => {
    setSnippetLength(length);
    if (mode === 'training') {
      onModeChange('training', length);
    }
  };

  const handleSnippetSourceChange = (source: SnippetSource) => {
    setSnippetSource(source);
    onSnippetSourceChange?.(source);
  };

  return (
    <div className="relative mt-20 mb-10">
      <div className="max-w-6xl mx-auto">
        {/* Mode controls and descriptions row */}
        <div className="flex items-start justify-between">
          {/* Left side - Mode controls with descriptions */}
          <div className="ml-56 flex items-start gap-6">
            {/* Training/Time group with descriptions */}
            <div className="flex flex-col gap-1">
              {/* Buttons row */}
              <div className="flex items-center gap-6">
                {/* Training Mode */}
                <button
                  onClick={(e) => {
                    handleModeChange('training');
                    e.currentTarget.blur();
                  }}
                  className={`text-sm font-medium transition-all duration-300 ${
                    mode === 'training'
                      ? 'text-text-light-primary dark:text-text-primary'
                      : 'text-text-light-secondary/40 dark:text-text-secondary/40 hover:text-text-light-secondary/60 dark:hover:text-text-secondary/60'
                  }`}
                >
                  Training
                </button>

                {/* Time Mode with options */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      handleModeChange('time');
                      e.currentTarget.blur();
                    }}
                    className={`text-sm font-medium transition-all duration-300 ${
                      mode === 'time'
                        ? 'text-text-light-primary dark:text-text-primary'
                        : 'text-text-light-secondary/40 dark:text-text-secondary/40 hover:text-text-light-secondary/60 dark:hover:text-text-secondary/60'
                    }`}
                  >
                    Time
                  </button>

                  {/* Time Options or Timer */}
                  <div className={`flex items-center gap-2 transition-all duration-300 ${
                    mode === 'time' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 pointer-events-none'
                  }`}>
                    <span className="text-text-light-secondary/20 dark:text-text-secondary/20">→</span>
                    {isTyping && timeRemaining !== null && timeRemaining !== undefined ? (
                      <span className={`font-mono text-sm tabular-nums ${
                        timeRemaining <= 10
                          ? 'text-incorrect-light dark:text-incorrect animate-pulse'
                          : 'text-accent-light-primary dark:text-accent-primary'
                      }`}>
                        {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                      </span>
                    ) : (
                      <>
                        {(['30s', '45s', '60s'] as TimeOption[]).map((option, index) => (
                          <Fragment key={option}>
                            <button
                              onClick={(e) => {
                                handleTimeChange(option);
                                e.currentTarget.blur();
                              }}
                              className={`text-sm transition-all duration-200 ${
                                timeOption === option
                                  ? 'text-accent-light-primary dark:text-accent-primary font-medium'
                                  : 'text-text-light-secondary/60 dark:text-text-secondary/60 hover:text-text-light-secondary dark:hover:text-text-secondary'
                              }`}
                            >
                              {option.replace('s', '')}
                            </button>
                            {index < 2 && <span className="text-text-light-secondary/20 dark:text-text-secondary/20">·</span>}
                          </Fragment>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Descriptions row */}
              <div className="relative h-12 min-w-[220px]">
                {/* Training description */}
                <div className={`absolute top-0 left-0 transition-all duration-300 ${
                  mode === 'training'
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 -translate-y-2 pointer-events-none'
                }`}>
                  <p className="text-xs text-text-light-secondary/60 dark:text-text-secondary/60 max-w-[220px]">
                    Unlimited practice with adaptive learning. Snippets auto-advance.
                  </p>
                </div>

                {/* Time description */}
                <div className={`absolute top-0 left-0 transition-all duration-300 ${
                  mode === 'time'
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 -translate-y-2 pointer-events-none'
                }`}>
                  <p className="text-xs text-text-light-secondary/60 dark:text-text-secondary/60 max-w-[220px]">
                    Timed speed runs. Snippets auto-advance.
                  </p>
                </div>
              </div>
            </div>

            {/* Normal/Super Snippets group with descriptions */}
            <div className="flex flex-col gap-1 ml-6">
              {/* Buttons row */}
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => {
                    handleSnippetSourceChange('normal');
                    e.currentTarget.blur();
                  }}
                  className={`text-sm font-medium transition-all duration-300 ${
                    snippetSource === 'normal'
                      ? 'text-text-light-primary dark:text-text-primary'
                      : 'text-text-light-secondary/40 dark:text-text-secondary/40 hover:text-text-light-secondary/60 dark:hover:text-text-secondary/60'
                  }`}
                >
                  Normal
                </button>
                <button
                  onClick={(e) => {
                    handleSnippetSourceChange('super');
                    e.currentTarget.blur();
                  }}
                  className={`text-sm font-medium transition-all duration-300 ${
                    snippetSource === 'super'
                      ? 'text-accent-light-primary dark:text-accent-primary'
                      : 'text-text-light-secondary/40 dark:text-text-secondary/40 hover:text-text-light-secondary/60 dark:hover:text-text-secondary/60'
                  }`}
                >
                  Super Snippets
                </button>
              </div>

              {/* Descriptions row */}
              <div className="relative h-12 min-w-[220px]">
                {/* Normal snippets description */}
                <div className={`absolute top-0 left-0 transition-all duration-300 ${
                  snippetSource === 'normal'
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 -translate-y-2 pointer-events-none'
                }`}>
                  <p className="text-xs text-text-light-secondary/60 dark:text-text-secondary/60 max-w-[220px]">
                    Boring old code. The kind you write every day. Yawn.
                  </p>
                </div>

                {/* Super snippets description */}
                <div className={`absolute top-0 left-0 transition-all duration-300 ${
                  snippetSource === 'super'
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 -translate-y-2 pointer-events-none'
                }`}>
                  <p className="text-xs text-text-light-secondary/60 dark:text-text-secondary/60 max-w-[220px]">
                    Famous code that changed history. Or ruined someone's day.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Action buttons aligned with right edge */}
          <div className="mr-56 flex items-center gap-1 relative">
            {/* Reset button with hand-drawn annotation */}
            <div className="relative">
              <button
                onClick={(e) => {
                  onRetry?.();
                  e.currentTarget.blur(); // Remove focus to prevent Space key from triggering button
                }}
                className="p-1.5 text-text-light-secondary/40 dark:text-text-secondary/40 hover:text-text-light-secondary dark:hover:text-text-secondary transition-colors duration-200"
                title="Retry"
              >
                <RotateCcw size={14} strokeWidth={2.5} />
              </button>

              {/* Hand-drawn label - above and to the left */}
              <div
                className="absolute -top-5 -left-7 text-base font-handwriting text-text-light-secondary/60 dark:text-text-secondary/60 whitespace-nowrap pointer-events-none"
                style={{ transform: 'rotate(-12deg) skew(-3deg, -2deg)' }}
              >
                reset
              </div>

              {/* Curved arrow connecting label to button */}
              <div className="absolute top-0 -left-4 pointer-events-none">
                <CurvedArrow />
              </div>
            </div>

            {/* Shuffle button with hand-drawn annotation */}
            <div className="relative">
              <button
                onClick={(e) => {
                  onNewSnippet?.();
                  e.currentTarget.blur(); // Remove focus to prevent Space key from triggering button
                }}
                className="p-1.5 text-text-light-secondary/40 dark:text-text-secondary/40 hover:text-text-light-secondary dark:hover:text-text-secondary transition-colors duration-200"
                title="New"
              >
                <Shuffle size={14} strokeWidth={2.5} />
              </button>

              {/* Hand-drawn label - below and to the right */}
              <div
                className="absolute top-5 -right-10 text-base font-handwriting text-text-light-secondary/60 dark:text-text-secondary/60 whitespace-nowrap pointer-events-none"
                style={{ transform: 'rotate(-15deg) skew(-2deg, 3deg) translateX(9px)' }}
              >
                new snippet
              </div>

              {/* Curved arrow connecting button to label */}
              <div className="absolute top-3 -right-5 pointer-events-none" style={{ transform: 'rotate(180deg)' }}>
                <CurvedArrow />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}