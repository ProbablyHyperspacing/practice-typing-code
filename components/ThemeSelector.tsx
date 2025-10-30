'use client';

import { useState, useEffect } from 'react';
import { bundledThemes, codeToHtml } from 'shiki';
import { Search, Check } from 'lucide-react';

interface ThemeSelectorProps {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
  isDarkMode: boolean;
}

interface ThemePreview {
  theme: string;
  html: string;
  backgroundColor: string;
}

export default function ThemeSelector({ currentTheme, onThemeChange, isDarkMode }: ThemeSelectorProps) {
  const [search, setSearch] = useState('');
  const [allThemes, setAllThemes] = useState<string[]>([]);
  const [themePreviews, setThemePreviews] = useState<Map<string, string>>(new Map());
  const [themeBackgrounds, setThemeBackgrounds] = useState<Map<string, string>>(new Map());

  const sampleCode = `const x = 42;\nfunction() { }`;

  useEffect(() => {
    // Get all available theme names from Shiki
    const themes = Object.keys(bundledThemes);
    setAllThemes(themes.sort());
  }, []);

  // Filter themes based on search and light/dark preference
  const filteredThemes = allThemes.filter(theme => {
    const themeLower = theme.toLowerCase();
    const searchLower = search.toLowerCase();

    // Filter by search terms
    if (searchLower) {
      const searchTerms = searchLower.split(' ').filter(t => t);
      if (!searchTerms.every(term => themeLower.includes(term))) {
        return false;
      }
    }

    // Optionally filter by light/dark (based on common theme naming patterns)
    // This is a soft filter - some themes work well in both modes
    if (isDarkMode) {
      // Show dark themes and neutral themes when in dark mode
      return !themeLower.includes('light') || themeLower.includes('dark');
    } else {
      // Show light themes and neutral themes when in light mode
      return !themeLower.includes('dark') || themeLower.includes('light');
    }
  });

  // Generate preview HTML for themes
  useEffect(() => {
    const generatePreviews = async () => {
      const previews = new Map<string, string>();
      const backgrounds = new Map<string, string>();

      // Generate previews for filtered themes only (performance optimization)
      const themesToPreview = filteredThemes.slice(0, 50); // Limit to first 50 for performance

      for (const theme of themesToPreview) {
        try {
          const html = await codeToHtml(sampleCode, {
            lang: 'javascript',
            theme: theme as any,
          });

          // Extract background color from the generated HTML
          const bgColorMatch = html.match(/background-color:\s*(#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}|rgb\([^)]+\))/);
          const bgColor = bgColorMatch ? bgColorMatch[1] : 'transparent';

          previews.set(theme, html);
          backgrounds.set(theme, bgColor);
        } catch (error) {
          // Fallback if theme preview fails
          previews.set(theme, '');
          backgrounds.set(theme, 'transparent');
        }
      }

      setThemePreviews(previews);
      setThemeBackgrounds(backgrounds);
    };

    if (filteredThemes.length > 0) {
      generatePreviews();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, isDarkMode, allThemes.length, sampleCode]);

  // Format theme name for display
  const formatThemeName = (theme: string) => {
    return theme
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div>
      <h3 className="text-lg font-medium text-text-light-primary dark:text-text-primary mb-1">
        Syntax Highlighting
      </h3>
      <p className="text-sm text-text-light-secondary dark:text-text-secondary mb-4">
        Choose from {allThemes.length} VS Code themes
      </p>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search themes..."
            className="w-full px-4 py-2 pl-10 bg-bg-light-primary dark:bg-bg-primary text-text-light-primary dark:text-text-primary rounded-lg border border-accent-light-secondary/20 dark:border-accent-secondary/20 focus:outline-none focus:border-accent-light-primary dark:focus:border-accent-primary transition-colors"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-text-light-secondary dark:text-text-secondary" />
        </div>
        {search && (
          <p className="text-xs text-text-light-secondary dark:text-text-secondary mt-1">
            {filteredThemes.length} theme{filteredThemes.length !== 1 ? 's' : ''} found
          </p>
        )}
      </div>

      {/* Theme Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-2">
        {filteredThemes.length > 0 ?
          filteredThemes.map((theme) => {
            const bgColor = themeBackgrounds.get(theme) || 'transparent';
            return (
              <button
                key={theme}
                onClick={() => onThemeChange(theme)}
                className={`
                  group relative rounded-xl text-left transition-all duration-200 border-2 overflow-hidden bg-bg-light-secondary/50 dark:bg-bg-secondary/50
                  ${currentTheme === theme
                    ? 'border-accent-light-primary dark:border-accent-primary ring-2 ring-accent-light-primary/20 dark:ring-accent-primary/20'
                    : 'border-text-light-secondary/20 dark:border-text-secondary/20 hover:border-accent-light-secondary/60 dark:hover:border-accent-secondary/60'
                  }
                `}
              >
                {/* Header with theme name - website color */}
                <div className="flex items-center justify-between px-3 py-2 bg-bg-light-secondary/50 dark:bg-bg-secondary/50">
                  <span className={`text-xs font-semibold ${
                    currentTheme === theme
                      ? 'text-accent-light-primary dark:text-accent-primary'
                      : 'text-text-light-primary dark:text-text-primary'
                  }`}>
                    {formatThemeName(theme)}
                  </span>
                  {currentTheme === theme && (
                    <Check className="w-3 h-3 text-accent-light-primary dark:text-accent-primary" />
                  )}
                </div>

                {/* Code preview with theme background */}
                <div
                  className="text-[9px] leading-tight overflow-hidden p-3"
                  dangerouslySetInnerHTML={{
                    __html: themePreviews.get(theme) || '<div class="text-text-light-secondary dark:text-text-secondary">Loading...</div>'
                  }}
                  style={{
                    maxHeight: '50px',
                    backgroundColor: bgColor,
                  }}
                />
              </button>
            );
          })
         : (
          <div className="col-span-3 text-center py-8">
            <p className="text-text-light-secondary dark:text-text-secondary">
              No themes found matching "{search}"
            </p>
          </div>
        )}
      </div>

      {/* Popular themes suggestion */}
      {!search && (
        <div className="mt-4 text-center">
          <p className="text-xs text-text-light-secondary dark:text-text-secondary">
            Popular: Tokyo Night, Dracula, One Dark Pro, GitHub Dark, Monokai
          </p>
        </div>
      )}
    </div>
  );
}