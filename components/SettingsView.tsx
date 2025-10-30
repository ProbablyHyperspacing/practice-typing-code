'use client';

import { Languages } from '@/types';
import { motion } from 'framer-motion';
import ThemeSelector from './ThemeSelector';
import LanguageIcon from './LanguageIcon';
import Navbar from './Navbar';
import { useTheme } from '@/contexts/ThemeContext';

interface SettingsViewProps {
  languages: Languages;
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  syntaxTheme?: string;
  onThemeChange?: (theme: string) => void;
  showKeyboardHints?: boolean;
  onKeyboardHintsChange?: (show: boolean) => void;
  onClose: () => void;
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
}: SettingsViewProps) {
  const { theme: appTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar onClose={onClose} />

      {/* Main Content */}
      <main className="flex-1 px-4 pb-8">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Syntax Theme Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
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
          </motion.section>

          {/* Keyboard Hints Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
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
          </motion.section>

          {/* Language Selection */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-text-light-primary dark:text-text-primary mb-6">
              Language
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {Object.entries(languages).map(([key, language], index) => (
                <motion.button
                  key={key}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
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
          </motion.section>

          {/* Keyboard Shortcuts */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
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
                      {typeof window !== 'undefined' && window.navigator?.platform?.includes('Mac') ? '⌘' : 'Ctrl'}
                    </kbd>
                    <span className="text-text-light-secondary dark:text-text-secondary">+</span>
                    <kbd className="px-3 py-1.5 bg-bg-light-primary dark:bg-bg-primary rounded-lg text-sm font-mono text-text-light-primary dark:text-text-primary border border-text-light-secondary dark:border-text-secondary border-opacity-20">
                      ,
                    </kbd>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  );
}