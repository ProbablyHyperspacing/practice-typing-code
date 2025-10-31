'use client';

import { Languages } from '@/types';
import { motion } from 'framer-motion';
import ThemeSelector from './ThemeSelector';
import LanguageIcon from './LanguageIcon';
import Navbar from './Navbar';
import { useTheme } from '@/contexts/ThemeContext';
import { useState } from 'react';

interface SettingsViewProps {
  languages: Languages;
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  syntaxTheme?: string;
  onThemeChange?: (theme: string) => void;
  showKeyboardHints?: boolean;
  onKeyboardHintsChange?: (show: boolean) => void;
  onClose: () => void;
  onClearData?: () => void;
}

export default function SettingsView({
  languages,
  selectedLanguage,
  onLanguageChange,
  syntaxTheme = 'github-dark',
  onThemeChange,
  showKeyboardHints = true,
  onKeyboardHintsChange,
  onClose,
  onClearData,
}: SettingsViewProps) {
  const { theme: appTheme } = useTheme();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleClearData = () => {
    setShowConfirmDialog(true);
  };

  const confirmClearData = () => {
    onClearData?.();
    setShowConfirmDialog(false);
  };

  const cancelClearData = () => {
    setShowConfirmDialog(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar onClose={onClose} />

      {/* Main Content */}
      <main className="flex-1 px-4 pb-8">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Syntax Theme Section */}
          <section>
            <h2 className="text-2xl font-bold text-text-light-primary dark:text-text-primary mb-6">
              Code Theme
            </h2>
            <div className="bg-bg-light-secondary dark:bg-bg-secondary rounded-2xl p-6 border border-text-light-secondary dark:border-text-secondary border-opacity-10">
              <ThemeSelector
                currentTheme={syntaxTheme}
                onThemeChange={(theme) => onThemeChange?.(theme)}
                isDarkMode={appTheme === 'dark'}
              />
            </div>
          </section>

          {/* Keyboard Hints Section */}
          <section>
            <h2 className="text-2xl font-bold text-text-light-primary dark:text-text-primary mb-6">
              Display
            </h2>
            <div className="bg-bg-light-secondary dark:bg-bg-secondary rounded-2xl p-6 border border-text-light-secondary dark:border-text-secondary border-opacity-10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-text-light-primary dark:text-text-primary">
                    Keyboard Hints
                  </h3>
                  <p className="text-sm text-text-light-secondary dark:text-text-secondary mt-1">
                    Show tab and return icons in code
                  </p>
                </div>
                <button
                  onClick={() => onKeyboardHintsChange?.(!showKeyboardHints)}
                  className={`relative w-14 h-7 rounded-full transition-colors duration-200 focus:outline-none ${
                    showKeyboardHints
                      ? 'bg-accent-light-primary dark:bg-accent-primary'
                      : 'bg-text-light-secondary dark:bg-text-secondary'
                  }`}
                >
                  <motion.div
                    className="absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white dark:bg-bg-primary shadow-md"
                    animate={{
                      x: showKeyboardHints ? 28 : 0,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 20,
                    }}
                  />
                </button>
              </div>
            </div>
          </section>

          {/* Language Selection */}
          <section>
            <h2 className="text-2xl font-bold text-text-light-primary dark:text-text-primary mb-6">
              Language
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {Object.entries(languages).map(([key, language]) => (
                <motion.button
                  key={key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    onLanguageChange(key);
                    onClose();
                  }}
                  className={`
                    p-5 rounded-2xl transition-all duration-200 border-2
                    ${selectedLanguage === key
                      ? 'border-text-secondary'
                      : 'bg-bg-light-secondary dark:bg-bg-secondary border-text-light-secondary dark:border-text-secondary border-opacity-10 hover:border-accent-light-secondary dark:hover:border-accent-secondary hover:border-opacity-40'
                    }
                  `}
                  style={selectedLanguage === key ? {
                    background: `color-mix(in srgb, var(--color-text-secondary) 20%, transparent)`
                  } : undefined}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div style={{ color: language.color }}>
                      <LanguageIcon language={key} size={40} />
                    </div>
                    <p className={`font-semibold text-sm ${
                      selectedLanguage === key
                        ? 'text-text-primary'
                        : 'text-text-light-primary dark:text-text-primary'
                    }`}>
                      {language.name}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </section>

          {/* Keyboard Shortcuts */}
          <section>
            <h2 className="text-2xl font-bold text-text-light-primary dark:text-text-primary mb-6">
              Shortcuts
            </h2>
            <div className="bg-bg-light-secondary dark:bg-bg-secondary rounded-2xl p-6 border border-text-light-secondary dark:border-text-secondary border-opacity-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-bg-light-primary dark:bg-bg-primary">
                  <span className="text-text-light-primary dark:text-text-primary font-medium">
                    Reset snippet
                  </span>
                  <kbd className="px-3 py-1.5 bg-bg-light-primary dark:bg-bg-primary rounded-lg text-sm font-mono text-text-light-primary dark:text-text-primary border border-text-light-secondary dark:border-text-secondary border-opacity-20">
                    Esc
                  </kbd>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-bg-light-primary dark:bg-bg-primary">
                  <span className="text-text-light-primary dark:text-text-primary font-medium">
                    New snippet
                  </span>
                  <div className="flex items-center gap-1">
                    <kbd className="px-3 py-1.5 bg-bg-light-primary dark:bg-bg-primary rounded-lg text-sm font-mono text-text-light-primary dark:text-text-primary border border-text-light-secondary dark:border-text-secondary border-opacity-20">
                      Shift
                    </kbd>
                    <span className="text-text-light-secondary dark:text-text-secondary">+</span>
                    <kbd className="px-3 py-1.5 bg-bg-light-primary dark:bg-bg-primary rounded-lg text-sm font-mono text-text-light-primary dark:text-text-primary border border-text-light-secondary dark:border-text-secondary border-opacity-20">
                      Enter
                    </kbd>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-bg-light-primary dark:bg-bg-primary">
                  <span className="text-text-light-primary dark:text-text-primary font-medium">
                    Settings
                  </span>
                  <div className="flex items-center gap-1">
                    <kbd className="px-3 py-1.5 bg-bg-light-primary dark:bg-bg-primary rounded-lg text-sm font-mono text-text-light-primary dark:text-text-primary border border-text-light-secondary dark:border-text-secondary border-opacity-20">
                      {typeof window !== 'undefined' && window.navigator?.userAgent?.includes('Mac') ? '⌘' : 'Ctrl'}
                    </kbd>
                    <span className="text-text-light-secondary dark:text-text-secondary">+</span>
                    <kbd className="px-3 py-1.5 bg-bg-light-primary dark:bg-bg-primary rounded-lg text-sm font-mono text-text-light-primary dark:text-text-primary border border-text-light-secondary dark:border-text-secondary border-opacity-20">
                      ,
                    </kbd>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Data Management */}
          <section>
            <h2 className="text-2xl font-bold text-text-light-primary dark:text-text-primary mb-6">
              Data
            </h2>
            <div className="bg-bg-light-secondary dark:bg-bg-secondary rounded-2xl p-6 border border-text-light-secondary dark:border-text-secondary border-opacity-10">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-text-light-primary dark:text-text-primary">
                    Clear All Data
                  </h3>
                  <p className="text-sm text-text-light-secondary dark:text-text-secondary mt-1">
                    Reset all settings, preferences, and training progress
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClearData}
                  className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-colors duration-200"
                >
                  Clear Data
                </motion.button>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-bg-light-secondary dark:bg-bg-secondary rounded-2xl p-6 max-w-md w-full border border-text-light-secondary dark:border-text-secondary border-opacity-20"
          >
            <h3 className="text-xl font-bold text-text-light-primary dark:text-text-primary mb-4">
              Clear All Data?
            </h3>
            <p className="text-text-light-secondary dark:text-text-secondary mb-6">
              This will permanently delete all your settings, preferences, and training progress. This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={cancelClearData}
                className="px-4 py-2 rounded-lg bg-bg-light-primary dark:bg-bg-primary text-text-light-primary dark:text-text-primary font-medium border border-text-light-secondary dark:border-text-secondary border-opacity-20 hover:border-opacity-40 transition-colors duration-200"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={confirmClearData}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-colors duration-200"
              >
                Clear All Data
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}