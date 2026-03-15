# 단어 깜빡이 수업 자료 자동 생성 웹 앱 설계안 (MVP + 확장형)

## 1. 앱 개요

### 1.1 핵심 목적
초등 영어 교사가 **영어 단어 + 한글 뜻 목록만 입력/업로드**하면 다음을 자동으로 처리하는 웹 앱을 설계한다.
- 단어 데이터 정리/저장/분류
- 수업용 단어 깜빡이 화면 즉시 생성
- 학년/단원/카테고리별 재사용 가능한 자료 아카이브 구축

### 1.2 해결하려는 문제
- 기존 PPT 수작업 제작 시간 과다
- 학년/단원별 자료 누적 및 재사용 어려움
- 수업 직전 수정(추가/삭제/오타 수정) 반영이 번거로움

### 1.3 설계 원칙
1. **데이터와 재생 로직 분리**: 단어 데이터 변경 없이 재생 방식만 바꿔 수업 유형 대응
2. **교사 중심 UX**: 복잡한 설정 없이 3단계(입력→저장→재생)
3. **MVP 우선 구현**: CSV/직접입력 + 기본 플레이어부터 빠르게 제공
4. **확장 가능 아키텍처**: 퀴즈/복습/출력물 기능을 별도 모듈로 확장

---

## 2. 핵심 사용자 시나리오

### 시나리오 A: 새 단어 세트 생성 후 즉시 수업
1. 로그인
2. `새 단어 세트` 클릭
3. 학년/단원/카테고리 선택
4. 단어 입력(직접 입력 또는 CSV 업로드)
5. 시스템 자동 정제(중복/형식 오류 경고)
6. 저장 후 `수업 재생` 클릭
7. 전체 화면으로 단어 깜빡이 실행

### 시나리오 B: 기존 세트 수정 및 재사용
1. 세트 목록에서 필터(학년/단원/카테고리) 후 세트 선택
2. 단어 추가/수정/삭제
3. 저장(수정 이력 남김)
4. 같은 세트 재생 또는 복제 후 새 수업용으로 활용

### 시나리오 C: 수업 중 빠른 제어
- Space: 재생/일시정지
- 방향키: 이전/다음 카드
- F: 전체화면 토글
- 재생 속도 즉시 조정

---

## 3. 주요 기능 모듈

## 3.1 인증/권한
- Supabase Auth 기반 로그인(이메일/소셜)
- 역할: `teacher`, `admin`
- RLS 기반 본인 데이터 접근 제한

## 3.2 단어 세트 관리
- 세트 생성/수정/삭제/복제
- 메타데이터: 학년, 단원, 카테고리, 설명, 공개 여부
- 즐겨찾기/최근 사용 세트

## 3.3 입력/업로드
- 직접 입력: `english,korean` 라인 단위
- 파일 업로드: CSV(MVP), XLSX(확장)
- 업로드 전 미리보기 + 오류 행 표시

## 3.4 데이터 정제/검증
- 필수값 검사(영어/뜻)
- 공백/대소문자 정리
- 중복 단어 처리(병합/경고 선택)
- 잘못된 포맷의 행 분리 표시

## 3.5 깜빡이 플레이어
- 표시 모드: EN→KO, KO→EN, 랜덤
- 카드 노출 시간 설정
- 반복 횟수 설정
- 전환 효과(즉시/페이드)
- 전체화면/단축키 지원

## 3.6 분류/탐색
- 학년 > 단원 > 카테고리 계층 필터
- 세트명/단어 검색
- 최근 사용/즐겨찾기

## 3.7 관리자 기능
- 학년/단원/카테고리 마스터 관리
- 공통 세트 템플릿 배포
- 조직(학교) 단위 확장 기반

---

## 4. 데이터 구조 초안 (Supabase)

아래는 PostgreSQL + Supabase 기준 테이블 초안이다.

## 4.1 핵심 엔터티
- 사용자: `profiles`
- 분류: `grades`, `units`, `categories`
- 단어 세트: `word_sets`
- 단어: `words`
- 재생 프리셋: `playback_presets`
- 수정 이력: `set_revisions`

## 4.2 테이블 정의(요약)

### `profiles`
- `id uuid pk` (auth.users 참조)
- `name text`
- `role text default 'teacher'`
- `created_at timestamptz`

### `grades`
- `id uuid pk`
- `label text` (예: 3학년)
- `sort_order int`

### `units`
- `id uuid pk`
- `grade_id uuid fk -> grades.id`
- `label text` (예: 2단원)
- `sort_order int`

### `categories`
- `id uuid pk`
- `name text`
- `parent_id uuid null fk -> categories.id`

### `word_sets`
- `id uuid pk`
- `owner_id uuid fk -> profiles.id`
- `title text`
- `grade_id uuid fk -> grades.id`
- `unit_id uuid null fk -> units.id`
- `category_id uuid null fk -> categories.id`
- `description text null`
- `is_archived bool default false`
- `created_at timestamptz`
- `updated_at timestamptz`

### `words`
- `id uuid pk`
- `word_set_id uuid fk -> word_sets.id on delete cascade`
- `english text`
- `korean text`
- `part_of_speech text null`
- `example_sentence text null`
- `order_no int`
- `created_at timestamptz`
- `updated_at timestamptz`

### `playback_presets`
- `id uuid pk`
- `owner_id uuid fk -> profiles.id`
- `name text`
- `show_mode text` (`EN_KO`, `KO_EN`, `RANDOM`)
- `interval_ms int`
- `transition text` (`NONE`, `FADE`)
- `repeat_count int`
- `created_at timestamptz`

### `set_revisions`
- `id uuid pk`
- `word_set_id uuid fk -> word_sets.id`
- `snapshot_json jsonb`
- `created_by uuid fk -> profiles.id`
- `created_at timestamptz`

## 4.3 인덱스/제약 권장
- `words(word_set_id, order_no)`
- `words(lower(english))`
- `word_sets(owner_id, grade_id, unit_id, category_id)`
- 중복 완화용 unique 후보: `(word_set_id, lower(english), korean)`

## 4.4 RLS 정책(초안)
- teacher: 본인 `owner_id` 행만 CRUD
- admin: 전체 조회/관리
- 공개 세트 도입 시 `is_public = true` 읽기 정책 분리

---

## 5. 화면 구성 초안

## 5.1 관리자 화면(준비 영역)

### A. 대시보드
- 최근 세트
- 빠른 생성 버튼
- 필터(학년/단원/카테고리)

### B. 세트 편집
- 상단: 세트 메타정보
- 중앙: 단어 테이블(인라인 편집)
- 우측: 업로드 패널(CSV drag & drop)
- 하단: 저장 / 미리보기 / 수업 재생

### C. 분류 관리(admin)
- 학년/단원/카테고리 생성/수정/정렬

## 5.2 수업 실행 화면(실행 영역)
- 카드형 단어 표시(큰 글씨)
- 자동 전환 + 수동 제어
- 전체화면 기본
- 단축키 오버레이 토글

> 역할 분리 원칙: **준비(관리자/교사 편집)**와 **실행(수업 재생)** 라우트를 분리해 오조작 방지

---

## 6. 재생 로직 설계

## 6.1 데이터-재생 분리 모델
- 데이터: `word_sets`, `words`
- 재생설정: `playback_presets`
- 런타임: `play_session_payload`(프론트 메모리)

## 6.2 세션 생성 절차
1. 세트 선택
2. 단어 조회
3. 프리셋 적용(방향/랜덤/시간/반복)
4. 재생 큐 생성
5. 상태머신 기반 렌더링 시작

## 6.3 상태머신
`idle -> ready -> playing <-> paused -> finished`
- 이벤트: `start`, `pause`, `resume`, `next`, `prev`, `restart`

## 6.4 의사코드
```ts
session = buildSession(words, preset)
state = 'ready'

onStart => state = 'playing'
while (state === 'playing') {
  render(currentCard)
  wait(intervalMs)
  moveNext()
  if (endOfQueue) repeatOrFinish()
}
```

## 6.5 안정성/성능 포인트
- 대량 단어(300~500+) 대응: 현재/다음 카드만 렌더
- 수업 중 끊김 방지: 세션 시작 시 메모리 캐시
- 입력 변경 시: 재생 중인 세션에는 즉시 영향 없음(다음 세션부터 반영)

---

## 7. MVP 범위

## 7.1 MVP 포함
1. 로그인/로그아웃
2. 단어 세트 CRUD
3. 단어 직접입력 + CSV 업로드
4. 학년/단원/카테고리 분류 저장
5. 기본 플레이어(속도, 방향, 랜덤, 반복)
6. 필터/검색

## 7.2 MVP 제외(후속)
- XLSX 고급 매핑
- 퀴즈 자동 생성
- PDF/인쇄물
- TTS/이미지 첨부
- 협업 동시편집

---

## 8. 확장 방향

1. 퀴즈 모드(객관식/주관식, 오답노트)
2. 복습 엔진(간격 반복)
3. 출력물 생성(PDF 워크시트/카드)
4. 미디어 확장(이미지/TTS/발음)
5. 조직 기능(학교/학급/공유 라이브러리)
6. 분석 대시보드(자주 틀리는 단어, 학년별 커버리지)

---

## 9. GitHub · Supabase · Vercel 기반 권장 아키텍처

## 9.1 역할 구분

### GitHub
- 코드 저장소/이슈/PR/코드리뷰
- 브랜치 전략: `main`, `develop`, `feature/*`
- Actions: lint/test/build/preview check

### Supabase
- DB(PostgreSQL): 단어/세트/분류/프리셋
- Auth: 사용자 인증
- Storage: 업로드 파일/이미지/음성(확장)
- Edge Functions: 대량 업로드 후처리(선택)

### Vercel
- Next.js 프론트 배포
- PR 단위 Preview URL 제공
- main 머지 시 Production 배포

## 9.2 권장 저장소 구조
```txt
EnglishBlinker/
  apps/
    web/
      src/
        app/
          (auth)/
          dashboard/
          sets/
          player/
          admin/
        features/
          sets/
          upload/
          playback/
        components/
        lib/
          supabase/
          validation/
  supabase/
    migrations/
    seed.sql
    policies.sql
  docs/
    product/
    architecture/
  .github/
    workflows/
      ci.yml
      preview.yml
```

## 9.3 배포/운영 흐름
1. `feature/*` 브랜치에서 개발
2. GitHub PR 생성
3. GitHub Actions CI 실행
4. Vercel Preview 자동 생성
5. 리뷰 승인 후 main 머지
6. Vercel Production 자동 배포
7. Supabase migration 적용(배포 파이프라인 단계에 포함)

## 9.4 환경변수 예시
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (서버 전용, Vercel encrypted env)

---

## 10. 권장 개발 순서

1. 요구사항 고정 + 와이어프레임
2. Supabase 스키마/마이그레이션/RLS 구축
3. 인증 + 라우팅 기본 골격 구현
4. 세트 CRUD + 단어 편집 화면 구현
5. CSV 업로드/파싱/오류 처리 구현
6. 플레이어 MVP 구현(상태머신 + 단축키)
7. 필터/검색/재사용 UX 개선
8. CI/CD 연결(GitHub Actions + Vercel)
9. 교사 파일럿 수업 피드백 반영
10. 퀴즈/출력물 중 우선기능 1개 확장

---

## 부록 A. 구현 우선순위 체크리스트
- [ ] 로그인 성공 후 30초 내 `새 세트 생성` 진입 가능
- [ ] CSV 업로드 후 5초 내 미리보기 표시
- [ ] 오류 행이 사용자에게 즉시 보임
- [ ] 저장 후 1클릭으로 수업 재생 가능
- [ ] 학년/단원/카테고리 필터로 2클릭 내 세트 탐색
- [ ] 수업 화면에서 키보드만으로 제어 가능

## 부록 B. MVP 완료 기준(Definition of Done)
- 기능: 사용자 요구사항 1~6 충족
- 품질: 주요 흐름 E2E 시나리오 통과(생성/수정/재생)
- 운영: GitHub PR → Vercel Preview → Production 배포 파이프라인 정상
- 보안: Supabase RLS 정책 적용 및 검증 완료
