# HumouR 프론트엔드 문서

이 문서는 `final_min_playground` UI 목업의 화면 구조, 라우팅, API client, mock/real backend 전환 방식을 정리합니다.

> 현재 기본 실행은 mock API 모드입니다. 로그인, 회원가입, 비밀번호 재설정, 초기 데이터 로딩이 로컬 mock 응답으로 처리됩니다.  
> 실제 backend 호출을 확인할 때는 `VITE_USE_MOCK_API=false`로 실행하면 [`src/api/backendClient.ts`](../src/api/backendClient.ts)의 axios client가 `/api/{endpoint}/`를 호출합니다.

## 읽는 순서

| Part | 내용 |
|------|------|
| [00-overview](./00-overview/project-overview.md) | 프로젝트 목적, 범위, 기술 스택 |
| [01-getting-started](./01-getting-started/development-environment.md) | 설치, 실행, mock/real API 모드 |
| [02-architecture](./02-architecture/) | 디렉터리 구조, 데이터 흐름, 공통 응답 형식 |
| [03-frontend](./03-frontend/) | 라우팅, 레이아웃, 컴포넌트 구조 |
| [06-api](./06-api/api-reference.md) | axios client, CSRF, endpoint 매핑 |
| [08-features](./08-features/) | 화면별 API 사용 정리 |

## 핵심 소스

| 파일 | 역할 |
|------|------|
| [`src/api/backendClient.ts`](../src/api/backendClient.ts) | axios 인스턴스, CSRF request interceptor, mock/real API 전환 |
| [`src/data/apiMockData.ts`](../src/data/apiMockData.ts) | backend 타입과 로컬 mock 데이터 |
| [`src/api/adapters.ts`](../src/api/adapters.ts) | snake_case API 데이터를 UI 모델로 변환 |
| [`src/hooks/useMockAppData.ts`](../src/hooks/useMockAppData.ts) | 초기 화면 데이터 로딩 |
| [`src/App.tsx`](../src/App.tsx) | 해시 라우팅, 테마, API 액션 실행 |
| [`src/data/mockData.tsx`](../src/data/mockData.tsx) | `AppRoute`, 메뉴, palette, 채팅 타입 |
| [`src/styles.css`](../src/styles.css) | UI 스타일과 반응형 레이아웃 |

## 화면별 문서

| 화면 | 라우트 | 문서 |
|------|--------|------|
| 대시보드 | `#/dashboard` | [dashboard.md](./08-features/dashboard.md) |
| 회사 정보 | `#/company` | [company.md](./08-features/company.md) |
| JD 관리 | `#/jd` | [jd.md](./08-features/jd.md) |
| 자기소개서 | `#/cover-letter` | [cover-letter.md](./08-features/cover-letter.md) |
| AI 문서 검색 | `#/chat` | [chat.md](./08-features/chat.md) |
| 마이페이지 | `#/mypage` | [mypage.md](./08-features/mypage.md) |
| 모집 공고 | `#/recruitment-post` | [recruitment-post.md](./08-features/recruitment-post.md) |
| 자소서 템플릿 | `#/cover-letter-template` | [cover-letter-template.md](./08-features/cover-letter-template.md) |
| 인증 | `#/login`, `#/signup`, `#/password-reset` | [auth.md](./08-features/auth.md) |

## 참고 자료

| 문서 | 내용 |
|------|------|
| [about_frontend.md](./about_frontend.md) | 프론트엔드·백엔드 협업 일반 참고. 이 레포 구현은 현재 axios + 쿠키/CSRF 방식입니다. |
| [api-spec-addendum.md](./06-api/api-spec-addendum.md) | backend에 추가되면 좋은 endpoint 제안 |
| [db-column-gap-notes.md](./06-api/db-column-gap-notes.md) | 화면 요구 데이터와 DB/API 컬럼 차이 |
