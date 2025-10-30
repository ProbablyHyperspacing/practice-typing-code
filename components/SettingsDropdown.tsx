'use client';

import { useState, useRef, useEffect } from 'react';
import { Languages } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

interface SettingsDropdownProps {
  languages: Languages;
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

export default function SettingsDropdown({
  languages,
  selectedLanguage,
  onLanguageChange,
}: SettingsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg bg-bg-light-secondary dark:bg-bg-secondary hover:bg-accent-light-secondary dark:hover:bg-accent-secondary/30 transition-colors duration-200"
        aria-label="Settings"
      >
        <svg
          className="w-6 h-6 text-text-light-primary dark:text-text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-64 rounded-lg bg-bg-light-secondary dark:bg-bg-secondary border border-accent-light-secondary/20 dark:border-accent-secondary/20 shadow-lg z-50"
          >
            <div className="p-4 space-y-4">
              {/* Theme Section */}
              <div>
                <h3 className="text-xs font-medium text-text-light-secondary dark:text-text-secondary uppercase tracking-wider mb-2">
                  Theme
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-light-primary dark:text-text-primary">
                    Dark Mode
                  </span>
                  <ThemeToggle />
                </div>
              </div>

              <div className="h-px bg-accent-light-secondary/20 dark:bg-accent-secondary/20" />

              {/* Language Section */}
              <div>
                <h3 className="text-xs font-medium text-text-light-secondary dark:text-text-secondary uppercase tracking-wider mb-2">
                  Language
                </h3>
                <div className="space-y-1">
                  {Object.entries(languages).map(([key, language]) => (
                    <button
                      key={key}
                      onClick={() => {
                        onLanguageChange(key);
                        setIsOpen(false);
                      }}
                      className={`
                        w-full px-3 py-2 rounded text-left text-sm transition-all duration-200
                        ${selectedLanguage === key
                          ? 'bg-accent-light-primary dark:bg-accent-primary text-white dark:text-bg-primary'
                          : 'text-text-light-primary dark:text-text-primary hover:bg-accent-light-secondary/50 dark:hover:bg-accent-secondary/20'
                        }
                      `}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          style={{ color: selectedLanguage === key ? 'white' : language.color }}
                        >
                          {language.icon}
                        </span>
                        {language.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-accent-light-secondary/20 dark:bg-accent-secondary/20" />

              {/* Info Section */}
              <div className="text-xs text-text-light-secondary dark:text-text-secondary">
                <div className="flex items-center gap-1 mb-1">
                  <kbd className="px-1.5 py-0.5 bg-accent-light-secondary/30 dark:bg-accent-secondary/30 rounded text-xs">Esc</kbd>
                  <span>Reset</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-accent-light-secondary/30 dark:bg-accent-secondary/30 rounded text-xs">Shift</kbd>
                  +
                  <kbd className="px-1.5 py-0.5 bg-accent-light-secondary/30 dark:bg-accent-secondary/30 rounded text-xs">Enter</kbd>
                  <span>New snippet</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}