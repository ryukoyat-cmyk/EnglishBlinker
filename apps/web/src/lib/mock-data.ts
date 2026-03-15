import { WordSet } from '@/lib/types';

export const DEMO_WORD_SET: WordSet = {
  id: 'demo-set-001',
  title: '3학년 2단원 기본 단어',
  grade: '3학년',
  unit: '2단원',
  category: '기초 회화',
  updatedAt: new Date().toISOString(),
  words: [
    { id: 'w1', english: 'apple', korean: '사과', orderNo: 1 },
    { id: 'w2', english: 'book', korean: '책', orderNo: 2 },
    { id: 'w3', english: 'chair', korean: '의자', orderNo: 3 }
  ]
};
