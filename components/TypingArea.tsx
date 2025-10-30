'use client';

import { useEffect, useRef } from 'react';
import { CharStatus } from '@/types';

interface TypingAreaProps {
  code: string;
  currentIndex: number;
  typedText: string;
  onKeyPress: (key: string) => void;
  isComplete: boolean;
}

export default function TypingArea({
  code,
  currentIndex,
  typedText,
  onKeyPress,
  isComplete,
}: TypingAreaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentCharRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
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

  const getCharStatus = (index: number): CharStatus['status'] => {
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

      return (
        <span
          key={index}
          ref={isCurrentChar ? currentCharRef : null}
          className={`
            ${status === 'correct' ? 'char-correct' : ''}
            ${status === 'incorrect' ? 'char-incorrect' : ''}
            ${status === 'current' ? 'char-current' : ''}
            ${status === 'untyped' ? 'char-untyped' : ''}
            ${char === '\n' ? 'block w-full h-0' : ''}
          `}
        >
          {char === '\n' ? '' : char === ' ' ? '\u00A0' : char}
        </span>
      );
    });
  };

  return (
    <div
      ref={containerRef}
      className="typing-text max-h-[600px] overflow-y-auto relative px-4 mt-12"
    >
      <pre className="whitespace-pre-wrap break-words font-mono text-xl">
        <code>{renderCode()}</code>
      </pre>
    </div>
  );
}