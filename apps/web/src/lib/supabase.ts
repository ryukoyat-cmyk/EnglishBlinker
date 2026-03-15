import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  // MVP 단계에서는 환경변수 미설정 시에도 화면 개발이 가능하도록 런타임에서만 오류를 던진다.
  // 실제 배포 환경에서는 필수 설정이다.
  // eslint-disable-next-line no-console
  console.warn('Supabase env vars are not configured yet.');
}

export const supabase = createClient(url ?? 'http://localhost:54321', anonKey ?? 'dev-anon-key');
