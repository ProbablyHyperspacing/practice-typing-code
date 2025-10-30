'use client';

import { Languages } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  languages: Languages;
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  languages,
  selectedLanguage,
  onLanguageChange,
}: SettingsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Settings Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1]
            }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl"
          >
            <div className="bg-bg-light-primary dark:bg-bg-primary rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="px-8 py-6 border-b border-accent-light-secondary/20 dark:border-accent-secondary/20">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-text-light-primary dark:text-text-primary">
                    Settings
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-accent-light-secondary/20 dark:hover:bg-accent-secondary/20 transition-colors"
                    aria-label="Close settings"
                  >
                    <svg
                      className="w-5 h-5 text-text-light-secondary dark:text-text-secondary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="px-8 py-6 space-y-8">
                {/* Theme Section */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h3 className="text-sm font-medium text-text-light-secondary dark:text-text-secondary uppercase tracking-wider mb-4">
                    Appearance
                  </h3>
                  <div className="flex items-center justify-between p-4 bg-bg-light-secondary dark:bg-bg-secondary rounded-lg">
                    <div>
                      <p className="text-text-light-primary dark:text-text-primary font-medium">
                        Theme
                      </p>
                      <p className="text-sm text-text-light-secondary dark:text-text-secondary">
                        Toggle between light and dark mode
                      </p>
                    </div>
                    <ThemeToggle />
                  </div>
                </motion.div>

                {/* Language Section */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-sm font-medium text-text-light-secondary dark:text-text-secondary uppercase tracking-wider mb-4">
                    Language
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(languages).map(([key, language]) => (
                      <motion.button
                        key={key}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          onLanguageChange(key);
                        }}
                        className={`
                          p-4 rounded-lg border-2 transition-all duration-200
                          ${selectedLanguage === key
                            ? 'border-accent-light-primary dark:border-accent-primary bg-accent-light-primary/10 dark:bg-accent-primary/10'
                            : 'border-accent-light-secondary/20 dark:border-accent-secondary/20 hover:border-accent-light-secondary/40 dark:hover:border-accent-secondary/40 bg-bg-light-secondary dark:bg-bg-secondary'
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="text-2xl"
                            style={{ color: language.color }}
                          >
                            {language.icon}
                          </span>
                          <div className="text-left">
                            <p className={`font-medium ${
                              selectedLanguage === key
                                ? 'text-accent-light-primary dark:text-accent-primary'
                                : 'text-text-light-primary dark:text-text-primary'
                            }`}>
                              {language.name}
                            </p>
                            <p className="text-xs text-text-light-secondary dark:text-text-secondary">
                              {language.snippets.length} snippets
                            </p>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Shortcuts Section */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-sm font-medium text-text-light-secondary dark:text-text-secondary uppercase tracking-wider mb-4">
                    Keyboard Shortcuts
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-bg-light-secondary dark:bg-bg-secondary rounded-lg">
                      <span className="text-text-light-primary dark:text-text-primary">Reset current snippet</span>
                      <kbd className="px-3 py-1 bg-accent-light-secondary/30 dark:bg-accent-secondary/30 rounded text-sm font-mono">
                        Esc
                      </kbd>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-bg-light-secondary dark:bg-bg-secondary rounded-lg">
                      <span className="text-text-light-primary dark:text-text-primary">New snippet</span>
                      <div className="flex items-center gap-1">
                        <kbd className="px-3 py-1 bg-accent-light-secondary/30 dark:bg-accent-secondary/30 rounded text-sm font-mono">
                          Shift
                        </kbd>
                        <span className="text-text-light-secondary dark:text-text-secondary">+</span>
                        <kbd className="px-3 py-1 bg-accent-light-secondary/30 dark:bg-accent-secondary/30 rounded text-sm font-mono">
                          Enter
                        </kbd>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-bg-light-secondary dark:bg-bg-secondary rounded-lg">
                      <span className="text-text-light-primary dark:text-text-primary">Open settings</span>
                      <kbd className="px-3 py-1 bg-accent-light-secondary/30 dark:bg-accent-secondary/30 rounded text-sm font-mono">
                        Ctrl/⌘ + ,
                      </kbd>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Footer */}
              <div className="px-8 py-4 border-t border-accent-light-secondary/20 dark:border-accent-secondary/20">
                <div className="flex justify-end">
                  <button
                    onClick={onClose}
                    className="button-primary"
                  >
                    Done
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