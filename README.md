# English Blinker

초등 영어 수업용 단어 깜빡이 자료를 자동 생성하는 MVP 프로젝트입니다.

## 구성
- `apps/web`: Next.js 프론트엔드(정적 export)
- `supabase`: DB 마이그레이션 및 시드
- `.github/workflows`: CI 및 GitHub Pages 배포
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
- 단어 라인 파서(`english,korean`)
- 플레이어 큐 생성 로직(모드/반복)
- Supabase 테이블 + RLS 초기 SQL

## GitHub Pages 배포
### 1) 저장소 설정
- GitHub 저장소 `Settings > Pages > Build and deployment`
- Source를 `GitHub Actions`로 선택

### 2) 배포 트리거
- `main` 브랜치에 push하면 `.github/workflows/deploy-pages.yml` 실행
- `apps/web/out` 정적 산출물이 GitHub Pages로 배포

### 3) 결과 URL
- 배포 완료 후 Actions 로그의 `page_url` 또는 Pages 메뉴에서 확인

## 배포 흐름
1. GitHub PR 생성
2. CI(타입체크/린트/빌드)
3. main 머지
4. GitHub Pages 자동 배포
