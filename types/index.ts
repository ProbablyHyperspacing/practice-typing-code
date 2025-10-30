export interface CodeSnippet {
  id: string;
  difficulty: 'easy' | 'medium' | 'hard';
  code: string;
  length?: string;
  name?: string;
  description?: string;
  situation?: string;
  encounter?: string;
  usage?: string;
  context?: string;
}

export interface Language {
  name: string;
  icon?: string;
  color: string;
  snippets: CodeSnippet[];
}

export interface Languages {
  [key: string]: Language;
}

export interface TypingStats {
  wpm: number;
  accuracy: number;
  time: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
}

export interface CharStatus {
  char: string;
  status: 'correct' | 'incorrect' | 'untyped' | 'current';
}

export interface TypingSession {
  language: string;
  snippet: CodeSnippet;
  startTime?: number;
  endTime?: number;
  currentIndex: number;
  typedText: string;
  errors: number;
  stats?: TypingStats;
}