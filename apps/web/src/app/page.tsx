import Link from 'next/link';

import { AppLayout } from '@/components/layout';

export default function HomePage() {
  return (
    <AppLayout>
      <section style={{ background: '#fff', padding: 16, borderRadius: 12 }}>
        <h2 style={{ marginTop: 0 }}>English Blinker MVP</h2>
        <p>수업용 단어 깜빡이 웹 앱입니다.</p>
        <Link href="/dashboard">대시보드로 이동</Link>
      </section>
    </AppLayout>
  );
}
