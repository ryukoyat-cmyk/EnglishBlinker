'use client';

import { useMemo, useState } from 'react';

import { AppLayout } from '@/components/layout';
import { parseWordLines } from '@/lib/parse';

const EXAMPLE_TEXT = `apple,사과\nbook,책\nchair,의자`;

export default function NewSetPage() {
  const [title, setTitle] = useState('');
  const [grade, setGrade] = useState('3학년');
  const [unit, setUnit] = useState('1단원');
  const [category, setCategory] = useState('기초');
  const [raw, setRaw] = useState(EXAMPLE_TEXT);
  const [savedMessage, setSavedMessage] = useState('');

  const parsed = useMemo(() => parseWordLines(raw), [raw]);

  const onSave = () => {
    if (!title.trim()) {
      setSavedMessage('세트명을 입력하세요.');
      return;
    }

    if (parsed.rows.length === 0) {
      setSavedMessage('최소 1개 단어가 필요합니다.');
      return;
    }

    setSavedMessage(`저장 완료: ${title} (${parsed.rows.length}개 단어)`);
  };

  return (
    <AppLayout>
      <section style={{ background: '#fff', padding: 16, borderRadius: 12, display: 'grid', gap: 12 }}>
        <h2 style={{ margin: 0 }}>새 단어 세트 생성</h2>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="세트명" />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          <input value={grade} onChange={(e) => setGrade(e.target.value)} aria-label="grade" />
          <input value={unit} onChange={(e) => setUnit(e.target.value)} aria-label="unit" />
          <input value={category} onChange={(e) => setCategory(e.target.value)} aria-label="category" />
        </div>

        <textarea
          rows={10}
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder="한 줄에 english,korean 형식으로 입력"
        />

        <button onClick={onSave} type="button" style={{ width: 140 }}>
          저장
        </button>

        {savedMessage ? <p style={{ margin: 0 }}>{savedMessage}</p> : null}
      </section>

      <section style={{ marginTop: 16, background: '#fff', padding: 16, borderRadius: 12 }}>
        <h3 style={{ marginTop: 0 }}>파싱 결과 미리보기</h3>
        <p>정상 {parsed.rows.length}건 / 오류 {parsed.errors.length}건</p>
        {parsed.errors.length > 0 ? (
          <ul>
            {parsed.errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        ) : null}
      </section>
    </AppLayout>
  );
}
