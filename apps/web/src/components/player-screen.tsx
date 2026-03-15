'use client';

import { useEffect, useMemo, useState } from 'react';

import { AppLayout } from '@/components/layout';
import { DEMO_WORD_SET } from '@/lib/mock-data';
import { buildQueue, displayText } from '@/lib/playback';
import { PlaybackPreset } from '@/lib/types';

const defaultPreset: PlaybackPreset = {
  mode: 'EN_KO',
  intervalMs: 1500,
  repeatCount: 2
};

export function PlayerScreen() {
  const [preset, setPreset] = useState<PlaybackPreset>(defaultPreset);
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const queue = useMemo(() => buildQueue(DEMO_WORD_SET.words, preset), [preset]);
  const item = queue[index];

  useEffect(() => {
    if (!isPlaying || queue.length === 0) return;

    const timer = setTimeout(() => {
      setIndex((prev) => {
        if (prev + 1 >= queue.length) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, preset.intervalMs);

    return () => clearTimeout(timer);
  }, [index, isPlaying, preset.intervalMs, queue.length]);

  useEffect(() => {
    setIndex(0);
    setIsPlaying(false);
  }, [preset]);

  const text = item ? displayText(item, preset.mode) : { primary: '단어 없음', secondary: '' };

  return (
    <AppLayout>
      <section style={{ display: 'grid', gap: 12, background: '#fff', padding: 16, borderRadius: 12 }}>
        <h2 style={{ margin: 0 }}>수업 실행: {DEMO_WORD_SET.title}</h2>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <select
            value={preset.mode}
            onChange={(e) => setPreset((prev) => ({ ...prev, mode: e.target.value as PlaybackPreset['mode'] }))}
          >
            <option value="EN_KO">영어 → 한국어</option>
            <option value="KO_EN">한국어 → 영어</option>
            <option value="RANDOM">랜덤</option>
          </select>
          <select
            value={preset.intervalMs}
            onChange={(e) => setPreset((prev) => ({ ...prev, intervalMs: Number(e.target.value) }))}
          >
            <option value={1000}>1초</option>
            <option value={1500}>1.5초</option>
            <option value={2000}>2초</option>
          </select>
          <select
            value={preset.repeatCount}
            onChange={(e) => setPreset((prev) => ({ ...prev, repeatCount: Number(e.target.value) }))}
          >
            <option value={1}>1회</option>
            <option value={2}>2회</option>
            <option value={3}>3회</option>
          </select>
          <button type="button" onClick={() => setIsPlaying((prev) => !prev)}>
            {isPlaying ? '일시정지' : '재생'}
          </button>
          <button type="button" onClick={() => setIndex((prev) => Math.max(0, prev - 1))}>
            이전
          </button>
          <button type="button" onClick={() => setIndex((prev) => Math.min(queue.length - 1, prev + 1))}>
            다음
          </button>
        </div>

        <article
          style={{
            borderRadius: 12,
            background: '#0f172a',
            color: '#fff',
            minHeight: 240,
            display: 'grid',
            placeItems: 'center'
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 52, margin: 0, fontWeight: 700 }}>{text.primary}</p>
            <p style={{ fontSize: 28, marginTop: 8, opacity: 0.8 }}>{text.secondary}</p>
            <p style={{ fontSize: 14, opacity: 0.7 }}>
              {index + 1}/{queue.length}
            </p>
          </div>
        </article>
      </section>
    </AppLayout>
  );
}
