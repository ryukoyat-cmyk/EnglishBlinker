import Link from 'next/link';
import { PropsWithChildren } from 'react';

export function AppLayout({ children }: PropsWithChildren) {
  return (
    <div style={{ maxWidth: 980, margin: '0 auto', padding: 24, fontFamily: 'Pretendard, sans-serif' }}>
      <header style={{ display: 'flex', gap: 16, marginBottom: 24, alignItems: 'center' }}>
        <h1 style={{ fontSize: 22, margin: 0 }}>English Blinker</h1>
        <nav style={{ display: 'flex', gap: 12 }}>
          <Link href="/dashboard">대시보드</Link>
          <Link href="/sets/new">세트 생성</Link>
          <Link href="/player/demo-set-001">수업 실행</Link>
        </nav>
      </header>
      {children}
    </div>
  );
}
