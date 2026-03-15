import Link from 'next/link';

import { AppLayout } from '@/components/layout';
import { DEMO_WORD_SET } from '@/lib/mock-data';

export default function DashboardPage() {
  return (
    <AppLayout>
      <section style={{ background: '#fff', padding: 16, borderRadius: 12, marginBottom: 16 }}>
        <h2 style={{ marginTop: 0 }}>최근 단어 세트</h2>
        <p>
          {DEMO_WORD_SET.title} · {DEMO_WORD_SET.grade} · {DEMO_WORD_SET.unit} · {DEMO_WORD_SET.category}
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/sets/new">새 세트 만들기</Link>
          <Link href={`/player/${DEMO_WORD_SET.id}`}>바로 재생</Link>
        </div>
      </section>

      <section style={{ background: '#fff', padding: 16, borderRadius: 12 }}>
        <h3 style={{ marginTop: 0 }}>MVP 상태</h3>
        <ul>
          <li>직접 입력/CSV 파싱 API 제공</li>
          <li>단어 깜빡이 플레이어(속도/모드/반복) 제공</li>
          <li>Supabase 스키마/마이그레이션 초안 제공</li>
        </ul>
      </section>
    </AppLayout>
  );
}
