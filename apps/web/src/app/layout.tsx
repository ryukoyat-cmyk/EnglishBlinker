import { PropsWithChildren } from 'react';

export const metadata = {
  title: 'English Blinker',
  description: '단어 깜빡이 수업 자료 자동 생성 MVP'
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="ko">
      <body style={{ margin: 0, background: '#f7f7fb' }}>{children}</body>
    </html>
  );
}
