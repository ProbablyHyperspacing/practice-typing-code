import { CharacterScore } from '@/hooks/useKeystrokeTracking';
import { CodeSnippet } from '@/types';

/**
 * Count occurrences of a character in a string
 */
function countCharOccurrences(str: string, char: string): number {
  let count = 0;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === char) count++;
  }
  return count;
}

/**
 * Calculate a score for how well a snippet matches weak characters
 * Higher score = better match for training
 */
function calculateSnippetScore(snippet: CodeSnippet, weakChars: CharacterScore[]): number {
  let score = 0;

  // For each weak character, count how many times it appears in the snippet
  // Weight by the character's weakness score
  for (const weakChar of weakChars) {
    const occurrences = countCharOccurrences(snippet.code, weakChar.char);
    score += occurrences * weakChar.score;
  }

  return score;
}

/**
 * Select the best snippet for adaptive training based on weak characters
 * Returns a snippet with high concentration of characters the user struggles with
 */
export function selectAdaptiveSnippet(
  snippets: CodeSnippet[],
  weakChars: CharacterScore[],
  recentSnippetIds: string[] = []
): CodeSnippet | null {
  if (snippets.length === 0) return null;
  if (weakChars.length === 0) {
    // No weak characters yet, return random
    return snippets[Math.floor(Math.random() * snippets.length)];
  }

  // Take top 5 weakest characters
  const topWeakChars = weakChars.slice(0, 5);

  // Score all snippets
  const scoredSnippets = snippets.map(snippet => ({
    snippet,
    score: calculateSnippetScore(snippet, topWeakChars),
    isRecent: recentSnippetIds.includes(snippet.id),
  }));

  // Filter out snippets with 0 score (don't contain any weak characters)
  const validSnippets = scoredSnippets.filter(s => s.score > 0);

  if (validSnippets.length === 0) {
    // Fallback to random if no snippets match
    return snippets[Math.floor(Math.random() * snippets.length)];
  }

  // Sort by score (highest first)
  validSnippets.sort((a, b) => b.score - a.score);

  // Take top 20% of snippets (or at least 3)
  const topCount = Math.max(3, Math.ceil(validSnippets.length * 0.2));
  const topSnippets = validSnippets.slice(0, topCount);

  // Among top snippets, deprioritize recently used ones
  const notRecent = topSnippets.filter(s => !s.isRecent);
  const candidates = notRecent.length > 0 ? notRecent : topSnippets;

  // Randomly select from top candidates to add variety
  const selected = candidates[Math.floor(Math.random() * candidates.length)];
  return selected.snippet;
}

/**
 * Get a list of weak characters formatted for display
 */
export function formatWeakCharacters(weakChars: CharacterScore[], limit: number = 10): string[] {
  return weakChars.slice(0, limit).map(char => {
    // Format special characters for display
    const displayChar = char.char === ' ' ? '␣' :
                       char.char === '\n' ? '↵' :
                       char.char === '\t' ? '⇥' :
                       char.char;

    return `${displayChar} (${(char.errorRate * 100).toFixed(0)}% error, ${char.averageTime.toFixed(0)}ms)`;
  });
}
