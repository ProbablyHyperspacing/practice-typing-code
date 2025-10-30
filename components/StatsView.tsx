'use client';

import { motion } from 'framer-motion';
import { TypingStats } from '@/types';
import { formatTime } from '@/utils/typing';
import Navbar from './Navbar';

interface StatsViewProps {
  stats: TypingStats;
  onRetry: () => void;
  onNext: () => void;
  completedSnippets?: number;
  mode?: 'snippet' | 'time' | 'training';
}

export default function StatsView({ stats, onRetry, onNext, completedSnippets, mode }: StatsViewProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar onClose={onNext} />

      {/* Main Content */}
      <main className="flex-1 px-4 pb-8">
        <div className="max-w-3xl mx-auto mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Main Stats Table */}
            <div className="space-y-3">
              {/* WPM */}
              <div className="flex items-baseline justify-between border-b border-text-light-secondary/20 dark:border-text-secondary/20 pb-3">
                <span className="text-sm uppercase tracking-wider text-text-light-secondary dark:text-text-secondary font-medium">
                  Words Per Minute
                </span>
                <span className="text-6xl font-display font-black text-accent-light-primary dark:text-accent-primary tabular-nums">
                  {stats.wpm}
                </span>
              </div>

              {/* Snippets Completed (time mode only) */}
              {mode === 'time' && completedSnippets !== undefined && (
                <div className="flex items-baseline justify-between border-b border-text-light-secondary/20 dark:border-text-secondary/20 pb-3">
                  <span className="text-sm uppercase tracking-wider text-text-light-secondary dark:text-text-secondary font-medium">
                    Snippets Completed
                  </span>
                  <span className="text-5xl font-display font-black text-accent-light-primary dark:text-accent-primary tabular-nums">
                    {completedSnippets}
                  </span>
                </div>
              )}

              {/* Accuracy */}
              <div className="flex items-baseline justify-between border-b border-text-light-secondary/20 dark:border-text-secondary/20 pb-3">
                <span className="text-sm uppercase tracking-wider text-text-light-secondary dark:text-text-secondary font-medium">
                  Accuracy
                </span>
                <span className={`text-5xl font-display font-black tabular-nums ${
                  stats.accuracy >= 95 ? 'text-correct-light dark:text-correct' :
                  stats.accuracy >= 80 ? 'text-accent-light-primary dark:text-accent-primary' :
                  'text-incorrect-light dark:text-incorrect'
                }`}>
                  {stats.accuracy}%
                </span>
              </div>

              {/* Time */}
              <div className="flex items-baseline justify-between border-b border-text-light-secondary/20 dark:border-text-secondary/20 pb-3">
                <span className="text-sm uppercase tracking-wider text-text-light-secondary dark:text-text-secondary font-medium">
                  Time
                </span>
                <span className="text-5xl font-display font-black text-text-light-primary dark:text-text-primary tabular-nums">
                  {formatTime(Math.floor(stats.time))}
                </span>
              </div>

              {/* Characters */}
              <div className="flex items-baseline justify-between border-b border-text-light-secondary/20 dark:border-text-secondary/20 pb-3">
                <span className="text-sm uppercase tracking-wider text-text-light-secondary dark:text-text-secondary font-medium">
                  Total Characters
                </span>
                <span className="text-5xl font-display font-black text-text-light-primary dark:text-text-primary tabular-nums">
                  {stats.totalChars}
                </span>
              </div>

              {/* Correct Characters */}
              <div className="flex items-baseline justify-between border-b border-text-light-secondary/20 dark:border-text-secondary/20 pb-3">
                <span className="text-sm uppercase tracking-wider text-text-light-secondary dark:text-text-secondary font-medium">
                  Correct Characters
                </span>
                <span className="text-5xl font-display font-black text-correct-light dark:text-correct tabular-nums">
                  {stats.correctChars}
                </span>
              </div>

              {/* Incorrect Characters */}
              <div className="flex items-baseline justify-between border-b border-text-light-secondary/20 dark:border-text-secondary/20 pb-3">
                <span className="text-sm uppercase tracking-wider text-text-light-secondary dark:text-text-secondary font-medium">
                  Incorrect Characters
                </span>
                <span className="text-5xl font-display font-black text-incorrect-light dark:text-incorrect tabular-nums">
                  {stats.incorrectChars}
                </span>
              </div>

              {/* Average Speed */}
              <div className="flex items-baseline justify-between pb-3">
                <span className="text-sm uppercase tracking-wider text-text-light-secondary dark:text-text-secondary font-medium">
                  Average Speed
                </span>
                <div className="text-5xl font-display font-black text-text-light-primary dark:text-text-primary tabular-nums">
                  {Math.round(stats.correctChars / stats.time)}
                  <span className="text-2xl text-text-light-secondary dark:text-text-secondary ml-2">char/s</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
