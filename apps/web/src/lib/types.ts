export type Grade = '3학년' | '4학년' | '5학년' | '6학년';

export type WordItem = {
  id: string;
  english: string;
  korean: string;
  orderNo: number;
};

export type WordSet = {
  id: string;
  title: string;
  grade: Grade;
  unit: string;
  category: string;
  words: WordItem[];
  updatedAt: string;
};

export type PlaybackMode = 'EN_KO' | 'KO_EN' | 'RANDOM';

export type PlaybackPreset = {
  mode: PlaybackMode;
  intervalMs: number;
  repeatCount: number;
};
