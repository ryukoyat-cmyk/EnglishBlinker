import { PlaybackPreset, WordItem } from '@/lib/types';

function shuffle<T>(arr: T[]): T[] {
  const clone = [...arr];
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
}

export function buildQueue(words: WordItem[], preset: PlaybackPreset): WordItem[] {
  const base = preset.mode === 'RANDOM' ? shuffle(words) : [...words].sort((a, b) => a.orderNo - b.orderNo);
  const queue: WordItem[] = [];

  for (let i = 0; i < preset.repeatCount; i += 1) {
    queue.push(...base);
  }

  return queue;
}

export function displayText(item: WordItem, mode: PlaybackPreset['mode']): { primary: string; secondary: string } {
  if (mode === 'KO_EN') {
    return { primary: item.korean, secondary: item.english };
  }

  return { primary: item.english, secondary: item.korean };
}
