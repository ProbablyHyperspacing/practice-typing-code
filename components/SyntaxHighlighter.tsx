'use client';

import { useEffect, useState, useRef } from 'react';
import { codeToTokens, type BundledTheme, type BundledLanguage, type ThemedToken } from 'shiki';

// All available VS Code themes in Shiki
export const AVAILABLE_THEMES = {
  light: [
    { id: 'catppuccin-latte', name: 'Catppuccin Latte' },
    { id: 'github-light', name: 'GitHub Light' },
    { id: 'github-light-default', name: 'GitHub Light Default' },
    { id: 'light-plus', name: 'Light+' },
    { id: 'material-theme-lighter', name: 'Material Lighter' },
    { id: 'min-light', name: 'Min Light' },
    { id: 'one-light', name: 'One Light' },
    { id: 'rose-pine-dawn', name: 'Rosé Pine Dawn' },
    { id: 'slack-ochin', name: 'Slack Ochin' },
    { id: 'snazzy-light', name: 'Snazzy Light' },
    { id: 'solarized-light', name: 'Solarized Light' },
    { id: 'vitesse-light', name: 'Vitesse Light' },
  ],
  dark: [
    { id: 'aurora-x', name: 'Aurora X' },
    { id: 'ayu-dark', name: 'Ayu Dark' },
    { id: 'catppuccin-frappe', name: 'Catppuccin Frappé' },
    { id: 'catppuccin-macchiato', name: 'Catppuccin Macchiato' },
    { id: 'catppuccin-mocha', name: 'Catppuccin Mocha' },
    { id: 'dark-plus', name: 'Dark+' },
    { id: 'dracula', name: 'Dracula' },
    { id: 'dracula-soft', name: 'Dracula Soft' },
    { id: 'github-dark', name: 'GitHub Dark' },
    { id: 'github-dark-default', name: 'GitHub Dark Default' },
    { id: 'github-dark-dimmed', name: 'GitHub Dark Dimmed' },
    { id: 'houston', name: 'Houston' },
    { id: 'kanagawa-dragon', name: 'Kanagawa Dragon' },
    { id: 'kanagawa-lotus', name: 'Kanagawa Lotus' },
    { id: 'kanagawa-wave', name: 'Kanagawa Wave' },
    { id: 'material-theme', name: 'Material Theme' },
    { id: 'material-theme-darker', name: 'Material Darker' },
    { id: 'material-theme-ocean', name: 'Material Ocean' },
    { id: 'material-theme-palenight', name: 'Material Palenight' },
    { id: 'min-dark', name: 'Min Dark' },
    { id: 'monokai', name: 'Monokai' },
    { id: 'night-owl', name: 'Night Owl' },
    { id: 'nord', name: 'Nord' },
    { id: 'one-dark-pro', name: 'One Dark Pro' },
    { id: 'poimandres', name: 'Poimandres' },
    { id: 'rose-pine', name: 'Rosé Pine' },
    { id: 'rose-pine-moon', name: 'Rosé Pine Moon' },
    { id: 'slack-dark', name: 'Slack Dark' },
    { id: 'synthwave-84', name: 'Synthwave \'84' },
    { id: 'tokyo-night', name: 'Tokyo Night' },
    { id: 'tokyo-night-storm', name: 'Tokyo Night Storm' },
    { id: 'tokyo-night-light', name: 'Tokyo Night Light' },
    { id: 'vesper', name: 'Vesper' },
    { id: 'vitesse-black', name: 'Vitesse Black' },
    { id: 'vitesse-dark', name: 'Vitesse Dark' },
  ],
};

interface SyntaxHighlighterProps {
  code: string;
  language: string;
  theme?: string;
  currentIndex: number;
  typedText: string;
  isComplete: boolean;
  onKeyPress?: (key: string) => void;
  showKeyboardHints?: boolean;
}

interface TokenWithTheme extends ThemedToken {
  color?: string;
}

export default function SyntaxHighlighter({
  code,
  language,
  theme = 'github-dark',
  currentIndex,
  typedText,
  isComplete,
  onKeyPress,
  showKeyboardHints = true,
}: SyntaxHighlighterProps) {
  const [tokens, setTokens] = useState<TokenWithTheme[][]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentCharRef = useRef<HTMLSpanElement>(null);

  // Load and tokenize code with theme
  useEffect(() => {
    let mounted = true;

    const loadTokens = async () => {
      try {
        setLoading(true);
        const langId = getLanguageId(language);

        const result = await codeToTokens(code, {
          lang: langId as BundledLanguage,
          theme: theme as BundledTheme,
        });

        if (mounted) {
          setTokens(result.tokens);
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to tokenize code:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadTokens();

    return () => {
      mounted = false;
    };
  }, [code, language, theme]);

  // Handle keyboard events
  useEffect(() => {
    if (!onKeyPress) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isComplete) return;

      // Let Shift+Enter and Cmd/Ctrl+key combinations through to global handler
      // But allow Shift+letter for typing capital letters
      if (e.shiftKey && e.key === 'Enter') {
        return; // Let Shift+Enter through for shuffle shortcut
      }
      if ((e.metaKey || e.ctrlKey) && e.key !== 'Tab') {
        return; // Let Cmd/Ctrl combinations through (like Cmd+Comma for settings)
      }

      // Prevent default for special keys
      if (e.key === 'Tab') {
        e.preventDefault();
      }

      onKeyPress(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onKeyPress, isComplete, code]); // Add code to deps to re-register when snippet changes

  // Auto-scroll to keep current character visible
  useEffect(() => {
    if (currentCharRef.current && containerRef.current) {
      const charRect = currentCharRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();

      if (charRect.bottom > containerRect.bottom - 100) {
        currentCharRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  }, [currentIndex]);

  // Reset scroll position when code changes (new snippet)
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [code]);

  const getLanguageId = (lang: string): string => {
    const langMap: Record<string, string> = {
      javascript: 'javascript',
      typescript: 'typescript',
      python: 'python',
      react: 'tsx',
      rust: 'rust',
    };
    return langMap[lang.toLowerCase()] || 'javascript';
  };

  const getCharStatus = (index: number): 'correct' | 'incorrect' | 'current' | 'untyped' => {
    if (index === currentIndex && !isComplete) return 'current';
    if (index < typedText.length) {
      return typedText[index] === code[index] ? 'correct' : 'incorrect';
    }
    return 'untyped';
  };

  // Focus management to capture keyboard input
  useEffect(() => {
    // Focus the container when code changes to ensure keyboard events work
    if (containerRef.current && !loading) {
      containerRef.current.focus();
    }
  }, [code, loading]);

  const renderTokenizedCode = () => {
    if (loading || !tokens.length) {
      // Fallback to simple rendering while loading
      return (
        <div className="animate-pulse">
          <span className="text-text-light-secondary dark:text-text-secondary">
            Loading syntax highlighting...
          </span>
        </div>
      );
    }

    // Reset charIndex for each render to prevent issues when switching snippets
    let charIndex = 0;

    // Helper function to detect if we should show tab for double spaces
    const shouldShowTabIndicator = (lineTokens: TokenWithTheme[], tokenIndex: number, charIndex: number, char: string, nextChar: string | undefined) => {
      // Check if this is a space at the beginning of a line
      if (char !== ' ') return false;

      // Calculate position in the line
      let posInLine = charIndex;
      for (let i = 0; i < tokenIndex; i++) {
        posInLine -= lineTokens[i].content.length;
      }

      // Check if this is at the start of the line or preceded by spaces
      const token = lineTokens[tokenIndex];
      const isLeadingSpace = tokenIndex === 0 || (tokenIndex > 0 && lineTokens.slice(0, tokenIndex).every(t => t.content.match(/^\s*$/)));

      if (isLeadingSpace) {
        // Check if this is the first space of a double-space pair
        return nextChar === ' ' && posInLine % 2 === 0;
      }

      return false;
    };

    return tokens.map((line, lineIndex) => {
      const isLastLine = lineIndex === tokens.length - 1;

      return (
        <div key={lineIndex} className="min-h-[1.5rem]">
          {line.length === 0 ? (
            // Empty line - this represents a newline character
            (() => {
              const globalIndex = charIndex;
              charIndex++;
              const status = getCharStatus(globalIndex);
              const isCurrentChar = globalIndex === currentIndex && !isComplete;
              // Display the actual typed character if it's incorrect, otherwise show newline
              const displayChar = status === 'incorrect' && globalIndex < typedText.length
                ? typedText[globalIndex]
                : '\n';

              // Render return symbol for newline
              const renderChar = () => {
                if (displayChar === '\n' && status !== 'incorrect' && showKeyboardHints) {
                  return (
                    <span className="inline-flex items-center justify-center px-1 mx-0.5 h-5 border border-current rounded opacity-50" style={{ minWidth: '1.5rem' }}>
                      ↵
                    </span>
                  );
                }
                return displayChar;
              };

              return (
                <span
                  key={`${lineIndex}-newline-${globalIndex}`}
                  ref={isCurrentChar ? currentCharRef : null}
                  className={`
                    ${status === 'current' ? 'typing-cursor opacity-40' : ''}
                    ${status === 'untyped' ? 'opacity-40' : ''}
                    ${status === 'incorrect' ? 'bg-red-500/30 !text-red-400' : ''}
                  `}
                >
                  {renderChar()}
                </span>
              );
            })()
          ) : (
            <>
              {line.map((token: TokenWithTheme, tokenIndex: number) => {
                const tokenChars = token.content.split('');

                // Check if this token is leading spaces
                const isLeadingSpaces = tokenIndex === 0 && token.content.match(/^ +$/);

                return (
                  <span
                    key={tokenIndex}
                    style={{ color: token.color }}
                  >
                    {tokenChars.map((char: string, i: number) => {
                      const globalIndex = charIndex;
                      const nextChar = i + 1 < tokenChars.length ? tokenChars[i + 1] : undefined;

                      // Check if we're in a space-only token (any sequence of spaces in the code)
                      const isSpaceToken = token.content.match(/^ +$/);

                      // Check if we should treat this as the start of a tab (double space)
                      const isTabStart = showKeyboardHints && isSpaceToken && char === ' ' && nextChar === ' ' && i % 2 === 0;
                      const isTabEnd = showKeyboardHints && isSpaceToken && char === ' ' && i > 0 && tokenChars[i - 1] === ' ' && i % 2 === 1;

                      if (isTabStart) {
                        // This is the first space of a tab, we'll skip it but still count it
                        charIndex++;
                        const status = getCharStatus(globalIndex);

                        // Only render if there's an error (not if it's current, let tab indicator handle that)
                        if (status === 'incorrect') {
                          const displayChar = globalIndex < typedText.length
                            ? typedText[globalIndex]
                            : char;

                          return (
                            <span
                              key={`${lineIndex}-${tokenIndex}-${i}-${globalIndex}`}
                              className="relative inline-block bg-red-500/30 !text-red-400"
                            >
                              {displayChar === ' ' ? '\u00A0' : displayChar}
                            </span>
                          );
                        }

                        // Otherwise, skip rendering (will be handled by the tab indicator)
                        return null;
                      }

                      if (isTabEnd) {
                        // This is the second space of a tab, render the tab indicator for both
                        charIndex++;
                        const prevGlobalIndex = globalIndex - 1;
                        const status = getCharStatus(globalIndex);
                        const prevStatus = getCharStatus(prevGlobalIndex);
                        const isCurrentChar = globalIndex === currentIndex && !isComplete;
                        const wasPrevCurrent = prevGlobalIndex === currentIndex && !isComplete;

                        // Check if either space has an error
                        const hasError = status === 'incorrect' || prevStatus === 'incorrect';

                        if (hasError) {
                          // Show the actual typed characters for errors
                          const displayChar = status === 'incorrect' && globalIndex < typedText.length
                            ? typedText[globalIndex]
                            : char;

                          return (
                            <span
                              key={`${lineIndex}-${tokenIndex}-${i}-${globalIndex}`}
                              ref={isCurrentChar ? currentCharRef : null}
                              className={`
                                relative inline-block
                                ${status === 'incorrect' ? 'bg-red-500/30 !text-red-400' : ''}
                                ${status === 'current' ? 'typing-cursor opacity-40' : ''}
                                ${status === 'untyped' ? 'opacity-40' : ''}
                              `}
                            >
                              {displayChar === ' ' ? '\u00A0' : displayChar}
                            </span>
                          );
                        }

                        // Render the tab indicator
                        // Only show cursor on the first space of the tab pair
                        return (
                          <span
                            key={`${lineIndex}-${tokenIndex}-${i}-tab`}
                            ref={wasPrevCurrent ? currentCharRef : null}
                            className={`
                              relative inline-block
                              ${wasPrevCurrent ? 'typing-cursor' : ''}
                              ${(status === 'untyped' || prevStatus === 'untyped') ? 'opacity-40' : ''}
                            `}
                          >
                            <span className="inline-flex items-center justify-center px-1 mx-0.5 h-5 border border-current rounded text-xs font-sans opacity-50" style={{ minWidth: '2.5rem' }}>
                              tab
                            </span>
                          </span>
                        );
                      }

                      // Normal character rendering
                      charIndex++;
                      const status = getCharStatus(globalIndex);
                      const isCurrentChar = globalIndex === currentIndex && !isComplete;

                      // Display the actual typed character if it's incorrect, otherwise show the original
                      const displayChar = status === 'incorrect' && globalIndex < typedText.length
                        ? typedText[globalIndex]
                        : char;

                      // Special rendering for tab characters
                      const renderChar = () => {
                        if (displayChar === '\t' && status !== 'incorrect') {
                          return (
                            <span className="inline-flex items-center justify-center px-1 mx-0.5 h-5 border border-current rounded opacity-50 text-xs font-sans" style={{ minWidth: '2.5rem' }}>
                              tab
                            </span>
                          );
                        }
                        return displayChar === ' ' ? '\u00A0' : displayChar;
                      };

                    return (
                      <span
                        key={`${lineIndex}-${tokenIndex}-${i}-${globalIndex}`}
                        ref={isCurrentChar ? currentCharRef : null}
                        className={`
                          relative inline-block
                          ${status === 'correct' ? '' : ''}
                          ${status === 'incorrect' ? 'bg-red-500/30 !text-red-400' : ''}
                          ${status === 'current' ? 'typing-cursor opacity-40' : ''}
                          ${status === 'untyped' ? 'opacity-40' : ''}
                        `}
                        style={status !== 'incorrect' && status !== 'current' ? { color: token.color } : status === 'current' ? { color: token.color, opacity: 0.4 } : undefined}
                      >
                        {renderChar()}
                      </span>
                    );
                    })}
                  </span>
                );
              })}
              {/* Add newline character at end of line (except last line) */}
              {!isLastLine && (() => {
                const globalIndex = charIndex;
                charIndex++;
                const status = getCharStatus(globalIndex);
                const isCurrentChar = globalIndex === currentIndex && !isComplete;
                // Display the actual typed character if it's incorrect
                const displayChar = status === 'incorrect' && globalIndex < typedText.length
                  ? typedText[globalIndex]
                  : '\n';

                // Render return symbol for end-of-line
                const renderChar = () => {
                  if (status !== 'incorrect' && displayChar === '\n' && showKeyboardHints) {
                    return (
                      <span className="inline-flex items-center justify-center px-1 mx-0.5 h-5 border border-current rounded opacity-50" style={{ minWidth: '1.5rem' }}>
                        ↵
                      </span>
                    );
                  }
                  return displayChar === '\n' ? '' : displayChar;
                };

                return (
                  <span
                    key={`${lineIndex}-eol-newline-${globalIndex}`}
                    ref={isCurrentChar ? currentCharRef : null}
                    className={`
                      ${status === 'current' ? 'typing-cursor opacity-40' : ''}
                      ${status === 'untyped' ? 'opacity-40' : ''}
                      ${status === 'incorrect' ? 'bg-red-500/30 text-red-400' : ''}
                    `}
                  >
                    {renderChar()}
                  </span>
                );
              })()}
            </>
          )}
        </div>
      );
    });
  };

  return (
    <div
      ref={containerRef}
      className="typing-text py-8 max-h-[500px] overflow-y-auto relative outline-none"
      tabIndex={0}
    >
      <pre className="whitespace-pre font-mono text-base leading-relaxed">
        <code>{renderTokenizedCode()}</code>
      </pre>
    </div>
  );
}