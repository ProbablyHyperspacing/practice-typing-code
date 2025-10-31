'use client';

import { motion } from 'framer-motion';
import { CharacterScore } from '@/hooks/useKeystrokeTracking';

interface TrainingProgressBarProps {
  needsTraining: CharacterScore[];
  progress: number; // 0-100
}

export default function TrainingProgressBar({ needsTraining, progress }: TrainingProgressBarProps) {
  // Format character for display (compact version for pill)
  const formatChar = (char: string): string => {
    if (char === ' ') return '␣';
    if (char === '\n') return '↵';
    if (char === '\t') return '⇥';
    return char;
  };

  // Get skill level based on progress (real Reddit/dev culture terms)
  const getSkillLevel = (progress: number): string => {
    if (progress === 0) return 'Tutorial Hell';
    if (progress < 10) return 'HTML is Programming';
    if (progress < 20) return 'Copilot Dependent';
    if (progress < 30) return 'Stack Overflow Copy-Pasta';
    if (progress < 40) return 'JavaScript Fatigue';
    if (progress < 50) return 'Works on My Machine';
    if (progress < 60) return 'Soy Dev';
    if (progress < 70) return 'CSS Centered';
    if (progress < 75) return 'Rejected by Google';
    if (progress < 80) return 'Arch BTW';
    if (progress < 85) return 'NixOS User';
    if (progress < 90) return 'Rust Evangelist';
    if (progress < 95) return '10x Engineer';
    if (progress < 99) return 'ThePrimeagen';
    if (progress < 100) return 'Terry Davis';
    return 'Linus Torvalds';
  };

  // Get top 4 weakest characters
  const topWeak = needsTraining.slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="inline-flex items-center gap-3 px-4 py-2 bg-bg-light-secondary dark:bg-bg-secondary rounded-full border border-text-light-secondary dark:border-text-secondary border-opacity-10"
    >
      {/* Progress bar */}
      <div className="flex items-center gap-2">
        <div className="w-24 h-1.5 bg-bg-light-primary dark:bg-bg-primary rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        <span className="text-xs font-mono text-text-light-secondary dark:text-text-secondary opacity-50">
          {progress.toFixed(0)}%
        </span>
      </div>

      {/* Skill Level */}
      <span className="text-sm font-medium text-text-light-primary dark:text-text-primary">
        {getSkillLevel(progress)}
      </span>

      {/* Weak characters (always show top 4) */}
      {needsTraining.length > 0 && (
        <>
          <span className="text-text-light-secondary dark:text-text-secondary opacity-30">•</span>
          <span className="text-xs text-text-light-secondary dark:text-text-secondary opacity-70">
            Needs Work:
          </span>
          <div className="flex items-center gap-1.5">
            {topWeak.map((charData, index) => (
              <span
                key={`${charData.char}-${index}`}
                className="text-xs font-mono text-text-light-primary dark:text-text-primary font-semibold px-1.5 py-0.5 bg-bg-light-primary dark:bg-bg-primary rounded"
              >
                {formatChar(charData.char)}
              </span>
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
}
