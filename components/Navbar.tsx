'use client';

import { X, Settings } from 'lucide-react';
import LanguageIcon from './LanguageIcon';

interface NavbarProps {
  // For home page
  currentLanguage?: string;
  languageColor?: string;
  languageName?: string;
  onSettingsClick?: () => void;

  // For settings/stats pages
  onClose?: () => void;
}

export default function Navbar({
  currentLanguage,
  languageColor,
  languageName,
  onSettingsClick,
  onClose,
}: NavbarProps) {
  return (
    <header className="py-4 px-4">
      <div className="max-w-4xl mx-auto">
        <nav className="bg-bg-light-secondary dark:bg-bg-secondary opacity-50 backdrop-blur-sm rounded-full pl-6 pr-4 py-3 flex items-center justify-between border border-text-light-secondary dark:border-text-secondary border-opacity-10">
          {/* Logo/Name */}
          <div className="flex items-center">
            <h1 className="text-xl font-display font-black tracking-tight">
              <span className="text-gradient">Code Typing Practice</span>
            </h1>
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-3">
            {/* Current Language - only on home page */}
            {currentLanguage && (
              <div className="flex items-center gap-2">
                <span
                  className="font-display font-bold text-text-light-primary dark:text-text-primary flex items-center gap-2"
                  style={{ color: languageColor }}
                >
                  <LanguageIcon language={currentLanguage} size={20} />
                  <span className="text-sm uppercase tracking-wide">{languageName}</span>
                </span>
              </div>
            )}

            {/* Settings button - only on home page */}
            {onSettingsClick && (
              <button
                onClick={onSettingsClick}
                className="p-2 rounded-full hover:bg-bg-light-primary dark:hover:bg-bg-primary hover:opacity-20 transition-colors duration-200"
                aria-label="Open settings"
              >
                <Settings className="w-5 h-5 text-text-light-primary dark:text-text-primary" />
              </button>
            )}

            {/* Close button - only on settings/stats pages */}
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-bg-light-primary dark:hover:bg-bg-primary hover:opacity-20 transition-colors duration-200"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-text-light-primary dark:text-text-primary" />
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
