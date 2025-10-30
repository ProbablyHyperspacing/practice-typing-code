'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-7 rounded-full bg-text-light-secondary/30 dark:bg-text-secondary/30 transition-colors duration-200 focus:outline-none"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <motion.div
        className="absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white dark:bg-bg-primary shadow-md flex items-center justify-center"
        animate={{
          x: theme === 'dark' ? 28 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 20,
        }}
      >
        {theme === 'light' ? (
          <Sun className="w-4 h-4 text-accent-light-primary" />
        ) : (
          <Moon className="w-4 h-4 text-accent-primary" />
        )}
      </motion.div>
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}