'use client';

import { TypingStats } from '@/types';
import { formatTime } from '@/utils/typing';
import { motion, AnimatePresence } from 'framer-motion';

interface ResultsModalProps {
  isOpen: boolean;
  stats: TypingStats | null;
  onClose: () => void;
  onRetry: () => void;
  onNext: () => void;
}

export default function ResultsModal({
  isOpen,
  stats,
  onClose,
  onRetry,
  onNext,
}: ResultsModalProps) {
  if (!stats) return null;

  const getPerformanceMessage = () => {
    if (stats.wpm >= 80 && stats.accuracy >= 95) return 'Outstanding!';
    if (stats.wpm >= 60 && stats.accuracy >= 90) return 'Excellent!';
    if (stats.wpm >= 40 && stats.accuracy >= 85) return 'Great job!';
    if (stats.wpm >= 30 && stats.accuracy >= 80) return 'Good work!';
    return 'Keep practicing!';
  };

  const getPerformanceColor = () => {
    if (stats.accuracy >= 95) return 'text-correct';
    if (stats.accuracy >= 85) return 'text-accent-primary';
    return 'text-incorrect';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
          >
            <div className="bg-bg-primary border border-accent-secondary/20 rounded-2xl p-8 min-w-[400px] shadow-2xl">
              <div className="text-center">
                <h2 className={`text-4xl font-bold mb-2 ${getPerformanceColor()}`}>
                  {getPerformanceMessage()}
                </h2>

                <div className="mt-8 space-y-4">
                  <div className="bg-bg-secondary rounded-lg p-6">
                    <div className="text-6xl font-bold text-accent-primary mb-2">
                      {stats.wpm}
                    </div>
                    <div className="text-text-secondary text-sm">words per minute</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-bg-secondary rounded-lg p-4">
                      <div className={`text-3xl font-bold mb-1 ${
                        stats.accuracy >= 95 ? 'text-correct' :
                        stats.accuracy >= 80 ? 'text-accent-primary' :
                        'text-incorrect'
                      }`}>
                        {stats.accuracy}%
                      </div>
                      <div className="text-text-secondary text-sm">accuracy</div>
                    </div>

                    <div className="bg-bg-secondary rounded-lg p-4">
                      <div className="text-3xl font-bold text-text-primary mb-1">
                        {formatTime(Math.floor(stats.time))}
                      </div>
                      <div className="text-text-secondary text-sm">time</div>
                    </div>
                  </div>

                  <div className="bg-bg-secondary rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-text-secondary">Characters</span>
                      <span className="font-mono">
                        <span className="text-correct">{stats.correctChars}</span>
                        {stats.incorrectChars > 0 && (
                          <>
                            {' / '}
                            <span className="text-incorrect">{stats.incorrectChars}</span>
                          </>
                        )}
                        <span className="text-text-secondary"> / {stats.totalChars}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    onClick={onRetry}
                    className="button-secondary flex-1"
                  >
                    Retry
                  </button>
                  <button
                    onClick={onNext}
                    className="button-primary flex-1"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}