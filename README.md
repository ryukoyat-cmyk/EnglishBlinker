# English Blinker

초등 영어 수업용 단어 깜빡이 자료를 자동 생성하는 MVP 프로젝트입니다.

## 구성
- `apps/web`: Next.js 프론트엔드
- `supabase`: DB 마이그레이션 및 시드
- `.github/workflows`: CI
- `docs/word-blinker-architecture.md`: 제품/시스템 설계 문서

## 빠른 시작
```bash
npm install
npm run dev
```

### 환경변수 (`apps/web/.env.local`)
```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## MVP 구현 범위 (현재 코드)
- 대시보드/세트 생성/플레이어 페이지
- 단어 라인 파서(`english,korean`) 및 API
- 플레이어 큐 생성 로직(모드/반복)
- Supabase 테이블 + RLS 초기 SQL

## 배포 흐름
1. GitHub PR 생성
2. CI(타입체크/린트/빌드)
3. Vercel Preview
4. main 머지 후 Production 배포
