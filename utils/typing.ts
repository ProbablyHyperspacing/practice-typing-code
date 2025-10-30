export function calculateWPM(
  correctChars: number,
  timeInSeconds: number
): number {
  if (timeInSeconds === 0) return 0;
  // Average word is 5 characters
  const words = correctChars / 5;
  const minutes = timeInSeconds / 60;
  return Math.round(words / minutes);
}

export function calculateAccuracy(
  correctChars: number,
  totalTyped: number
): number {
  if (totalTyped === 0) return 100;
  return Math.round((correctChars / totalTyped) * 100);
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function normalizeCode(code: string): string {
  // Normalize line endings and remove trailing whitespace
  return code
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\t/g, '  ') // Convert tabs to 2 spaces
    .trim();
}