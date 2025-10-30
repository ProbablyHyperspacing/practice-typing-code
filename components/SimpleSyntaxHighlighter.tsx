'use client';

import { useEffect, useRef } from 'react';

interface SimpleSyntaxHighlighterProps {
  code: string;
  currentIndex: number;
  typedText: string;
  isComplete: boolean;
  onKeyPress?: (key: string) => void;
}

export default function SimpleSyntaxHighlighter({
  code,
  currentIndex,
  typedText,
  isComplete,
  onKeyPress,
}: SimpleSyntaxHighlighterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentCharRef = useRef<HTMLSpanElement>(null);

  // Handle keyboard events
  useEffect(() => {
    if (!onKeyPress) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isComplete) return;

      // Prevent default for special keys
      if (e.key === 'Tab') {
        e.preventDefault();
      }

      onKeyPress(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onKeyPress, isComplete]);

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

  const getCharStatus = (index: number): 'correct' | 'incorrect' | 'current' | 'untyped' => {
    if (index === currentIndex && !isComplete) return 'current';
    if (index < typedText.length) {
      return typedText[index] === code[index] ? 'correct' : 'incorrect';
    }
    return 'untyped';
  };

  const renderCode = () => {
    return code.split('').map((char, index) => {
      const status = getCharStatus(index);
      const isCurrentChar = index === currentIndex && !isComplete;

      // Handle newlines
      if (char === '\n') {
        return (
          <span
            key={index}
            ref={isCurrentChar ? currentCharRef : null}
            className={status === 'current' ? 'typing-cursor' : ''}
          >
            {'\n'}
          </span>
        );
      }

      return (
        <span
          key={index}
          ref={isCurrentChar ? currentCharRef : null}
          className={`
            ${status === 'correct' ? 'text-text-light-primary dark:text-text-primary' : ''}
            ${status === 'incorrect' ? 'bg-red-500/30 text-red-400' : ''}
            ${status === 'current' ? 'typing-cursor' : ''}
            ${status === 'untyped' ? 'opacity-40' : ''}
          `}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      );
    });
  };

  return (
    <div
      ref={containerRef}
      className="typing-text bg-bg-light-secondary dark:bg-bg-secondary rounded-xl p-8 max-h-[500px] overflow-y-auto relative border border-accent-light-secondary/10 dark:border-accent-secondary/10"
    >
      <pre className="whitespace-pre font-mono text-lg leading-relaxed text-text-light-primary dark:text-text-primary">
        <code>{renderCode()}</code>
      </pre>
    </div>
  );
}