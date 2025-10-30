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
        <div className="max-w-4xl mx-auto mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Primary Stats Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* WPM */}
              <div className="bg-bg-light-secondary/50 dark:bg-bg-secondary/50 backdrop-blur-sm rounded-2xl p-6 border border-text-light-secondary/10 dark:border-text-secondary/10">
                <div className="text-sm font-body font-bold text-text-light-secondary dark:text-text-secondary uppercase tracking-widest mb-2">
                  Words Per Minute
                </div>
                <div className="text-5xl font-display font-black text-accent-light-primary dark:text-accent-primary">
                  {stats.wpm}
                </div>
              </div>

              {/* Snippets Completed - Only for Time Mode */}
              {mode === 'time' && completedSnippets !== undefined ? (
                <div className="bg-bg-light-secondary/50 dark:bg-bg-secondary/50 backdrop-blur-sm rounded-2xl p-6 border border-text-light-secondary/10 dark:border-text-secondary/10">
                  <div className="text-sm font-body font-bold text-text-light-secondary dark:text-text-secondary uppercase tracking-widest mb-2">
                    Snippets Completed
                  </div>
                  <div className="text-5xl font-display font-black text-accent-light-primary dark:text-accent-primary">
                    {completedSnippets}
                  </div>
                </div>
              ) : (
                <div className="bg-bg-light-secondary/50 dark:bg-bg-secondary/50 backdrop-blur-sm rounded-2xl p-6 border border-text-light-secondary/10 dark:border-text-secondary/10">
                  <div className="text-sm font-body font-bold text-text-light-secondary dark:text-text-secondary uppercase tracking-widest mb-2">
                    Time
                  </div>
                  <div className="text-5xl font-display font-black text-text-light-primary dark:text-text-primary">
                    {formatTime(Math.floor(stats.time))}
                  </div>
                </div>
              )}
            </div>

            {/* Secondary Stats Row */}
            <div className="grid grid-cols-3 gap-4">
              {/* Accuracy */}
              <div className="bg-bg-light-secondary/50 dark:bg-bg-secondary/50 backdrop-blur-sm rounded-2xl p-6 border border-text-light-secondary/10 dark:border-text-secondary/10">
                <div className="text-sm font-body font-bold text-text-light-secondary dark:text-text-secondary uppercase tracking-widest mb-2">
                  Accuracy
                </div>
                <div className={`text-4xl font-display font-black ${
                  stats.accuracy >= 95 ? 'text-correct-light dark:text-correct' :
                  stats.accuracy >= 80 ? 'text-accent-light-primary dark:text-accent-primary' :
                  'text-incorrect-light dark:text-incorrect'
                }`}>
                  {stats.accuracy}%
                </div>
              </div>

              {/* Time (only show if not in time mode) */}
              {mode === 'time' ? (
                <div className="bg-bg-light-secondary/50 dark:bg-bg-secondary/50 backdrop-blur-sm rounded-2xl p-6 border border-text-light-secondary/10 dark:border-text-secondary/10">
                  <div className="text-sm font-body font-bold text-text-light-secondary dark:text-text-secondary uppercase tracking-widest mb-2">
                    Time
                  </div>
                  <div className="text-4xl font-display font-black text-text-light-primary dark:text-text-primary">
                    {formatTime(Math.floor(stats.time))}
                  </div>
                </div>
              ) : null}

              {/* Characters */}
              <div className="bg-bg-light-secondary/50 dark:bg-bg-secondary/50 backdrop-blur-sm rounded-2xl p-6 border border-text-light-secondary/10 dark:border-text-secondary/10">
                <div className="text-sm font-body font-bold text-text-light-secondary dark:text-text-secondary uppercase tracking-widest mb-2">
                  Characters
                </div>
                <div className="text-4xl font-display font-black text-text-light-primary dark:text-text-primary">
                  {stats.totalChars}
                </div>
              </div>

              {/* Average Speed */}
              <div className="bg-bg-light-secondary/50 dark:bg-bg-secondary/50 backdrop-blur-sm rounded-2xl p-6 border border-text-light-secondary/10 dark:border-text-secondary/10">
                <div className="text-sm font-body font-bold text-text-light-secondary dark:text-text-secondary uppercase tracking-widest mb-2">
                  Avg Speed
                </div>
                <div className="text-4xl font-display font-black text-text-light-primary dark:text-text-primary">
                  {Math.round(stats.correctChars / stats.time)}
                  <span className="text-xl text-text-light-secondary dark:text-text-secondary ml-1">c/s</span>
                </div>
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="bg-bg-light-secondary/50 dark:bg-bg-secondary/50 backdrop-blur-sm rounded-2xl p-6 border border-text-light-secondary/10 dark:border-text-secondary/10">
              <h2 className="text-lg font-display font-black uppercase tracking-wide text-text-light-primary dark:text-text-primary mb-4">
                Breakdown
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-light-secondary dark:text-text-secondary">Correct Characters</span>
                  <span className="font-mono text-lg text-correct-light dark:text-correct font-bold">
                    {stats.correctChars}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-light-secondary dark:text-text-secondary">Incorrect Characters</span>
                  <span className="font-mono text-lg text-incorrect-light dark:text-incorrect font-bold">
                    {stats.incorrectChars}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
