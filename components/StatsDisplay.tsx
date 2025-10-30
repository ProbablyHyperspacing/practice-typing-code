'use client';

import { TypingStats } from '@/types';
import { formatTime } from '@/utils/typing';
import { useEffect, useState } from 'react';

interface StatsDisplayProps {
  stats: TypingStats | null;
  isLive?: boolean;
}

export default function StatsDisplay({ stats, isLive = false }: StatsDisplayProps) {
  const [animatedStats, setAnimatedStats] = useState(stats);

  useEffect(() => {
    if (stats) {
      setAnimatedStats(stats);
    }
  }, [stats]);

  if (!animatedStats) {
    return (
      <div className="bg-bg-light-secondary dark:bg-bg-secondary rounded-lg px-6 py-3 border border-accent-light-secondary/10 dark:border-accent-secondary/10">
        <div className="flex items-center justify-around gap-4">
          {['WPM', 'Accuracy', 'Time', 'Characters'].map((label, index) => (
            <div key={label} className="flex items-center gap-6">
              <div className="flex items-baseline gap-2">
                <span className="text-text-light-secondary dark:text-text-secondary text-xs font-light uppercase tracking-wider">
                  {label}
                </span>
                <span className="text-xl font-light text-text-light-primary dark:text-text-primary">--</span>
              </div>
              {index < 3 && (
                <div className="h-8 w-px bg-accent-light-secondary/20 dark:bg-accent-secondary/20" />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-bg-light-secondary dark:bg-bg-secondary rounded-lg px-6 py-3 border border-accent-light-secondary/10 dark:border-accent-secondary/10 ${isLive ? 'animate-pulse' : ''}`}>
      <div className="flex items-center justify-around gap-4 flex-wrap sm:flex-nowrap">
        {/* WPM */}
        <div className="flex items-center gap-6">
          <div className="flex items-baseline gap-2">
            <span className="text-text-light-secondary dark:text-text-secondary text-xs font-light uppercase tracking-wider">
              WPM
            </span>
            <span className="text-xl font-light text-accent-light-primary dark:text-accent-primary">
              {animatedStats.wpm}
            </span>
          </div>
          <div className="hidden sm:block h-8 w-px bg-accent-light-secondary/20 dark:bg-accent-secondary/20" />
        </div>

        {/* Accuracy */}
        <div className="flex items-center gap-6">
          <div className="flex items-baseline gap-2">
            <span className="text-text-light-secondary dark:text-text-secondary text-xs font-light uppercase tracking-wider">
              Accuracy
            </span>
            <span className={`text-xl font-light ${
              animatedStats.accuracy >= 95 ? 'text-correct-light dark:text-correct' :
              animatedStats.accuracy >= 80 ? 'text-accent-light-primary dark:text-accent-primary' :
              'text-incorrect-light dark:text-incorrect'
            }`}>
              {animatedStats.accuracy}%
            </span>
          </div>
          <div className="hidden sm:block h-8 w-px bg-accent-light-secondary/20 dark:bg-accent-secondary/20" />
        </div>

        {/* Time */}
        <div className="flex items-center gap-6">
          <div className="flex items-baseline gap-2">
            <span className="text-text-light-secondary dark:text-text-secondary text-xs font-light uppercase tracking-wider">
              Time
            </span>
            <span className="text-xl font-light text-text-light-primary dark:text-text-primary">
              {formatTime(Math.floor(animatedStats.time))}
            </span>
          </div>
          <div className="hidden sm:block h-8 w-px bg-accent-light-secondary/20 dark:bg-accent-secondary/20" />
        </div>

        {/* Characters */}
        <div className="flex items-baseline gap-2">
          <span className="text-text-light-secondary dark:text-text-secondary text-xs font-light uppercase tracking-wider">
            Characters
          </span>
          <span className="text-lg font-light text-text-light-primary dark:text-text-primary">
            <span className="text-correct-light dark:text-correct">{animatedStats.correctChars}</span>
            {animatedStats.incorrectChars > 0 && (
              <>
                <span className="text-text-light-secondary dark:text-text-secondary mx-1">/</span>
                <span className="text-incorrect-light dark:text-incorrect">{animatedStats.incorrectChars}</span>
              </>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}