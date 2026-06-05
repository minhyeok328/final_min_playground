# HumouR 프론트엔드 문서 (wiki)

**HumouR** UI 고도화·목업 저장소(`final_min_playground`)의 프론트엔드 전용 문서입니다.  
실제 Django 서버 없이도, 각 화면이 기대하는 **JSON API 형태**와 **관련 소스 파일 역할**을 코드 기준으로 정리했습니다.

> **저장소 목적:** 백엔드 없이 UI·레이아웃·컴포넌트·테마·인터랙션을 연습·고도화하는 샌드박스입니다.  
> **실제 HTTP 호출 없음** — `mockClient`가 [`apiMockData.ts`](../src/data/apiMockData.ts) 샘플을 지연 반환합니다.  
> Django 연동 시 URL·인증은 메인 프로젝트와 맞추고, 응답 **`data` 필드의 snake_case** 는 이 목업을 기준으로 하면 [`adapters.ts`](../src/api/adapters.ts)를 재사용할 수 있습니다.

## 읽는 순서

| Part | 내용 |
|------|------|
| [00-overview](./00-overview/project-overview.md) | 프로젝트 목적, UI 고도화 범위, 스택, 목업 연동 상태 |
| [01-getting-started](./01-getting-started/development-environment.md) | 설치·실행·검증 스크립트 |
| [02-architecture](./02-architecture/) | 디렉터리, 데이터 흐름, 공통 API 래퍼 |
| [03-frontend](./03-frontend/) | 라우팅, 컴포넌트 계층, 테마·차트·플로팅 위젯 |
| [06-api](./06-api/api-reference.md) | 전역 API 목록·공통 응답 형식 |
| [08-features](./08-features/) | **페이지별** Django JSON + 파일 맵 |

## UI 고도화 설계·계획 (에이전트 산출물)

| 문서 | 내용 |
|------|------|
| [design-system-upgrade-design.md](./superpowers/specs/2026-06-04-design-system-upgrade-design.md) | 디자인 시스템·대시보드·셸 고도화 스펙 |
| [design-system-upgrade.md](./superpowers/plans/2026-06-04-design-system-upgrade.md) | 구현 계획 |
| [document-chat-fab.md](./superpowers/plans/2026-06-04-document-chat-fab.md) | AI 문서 검색 FAB·워크스페이스 계획 |

## 페이지별 기능 문서 (Django JSON + 파일)

| 화면 | 해시 라우트 | 문서 |
|------|-------------|------|
| 대시보드 | `#/dashboard` | [dashboard.md](./08-features/dashboard.md) |
| 회사 정보 | `#/company` | [company.md](./08-features/company.md) |
| JD 관리 | `#/jd` | [jd.md](./08-features/jd.md) |
| 자기소개서 | `#/cover-letter` | [cover-letter.md](./08-features/cover-letter.md) |
| AI 문서 검색 | `#/chat` | [chat.md](./08-features/chat.md) |
| 마이페이지 | `#/mypage` | [mypage.md](./08-features/mypage.md) |
| 모집 공고 | `#/recruitment-post` | [recruitment-post.md](./08-features/recruitment-post.md) |
| 자소서 포맷 | `#/cover-letter-template` | [cover-letter-template.md](./08-features/cover-letter-template.md) |
| 로그인·가입·비밀번호 | `#/login` 등 | [auth.md](./08-features/auth.md) |

## 핵심 소스 (API 계약의 단일 진실)

| 파일 | 역할 |
|------|------|
| [`src/data/apiMockData.ts`](../src/data/apiMockData.ts) | Django가 맞춰야 할 **응답 JSON 스키마** 샘플 |
| [`src/api/mockClient.ts`](../src/api/mockClient.ts) | 화면에서 호출하는 **메서드 = 예상 API 동작** (목) |
| [`src/api/adapters.ts`](../src/api/adapters.ts) | snake_case API → UI용 camelCase 변환 |
| [`src/data/mockData.tsx`](../src/data/mockData.tsx) | `AppRoute`, 메뉴, `palette`, 채팅 타입 |
| [`src/hooks/useMockAppData.ts`](../src/hooks/useMockAppData.ts) | 앱 기동 시 GET 12건 일괄 로드 |
| [`src/App.tsx`](../src/App.tsx) | 해시 라우팅, 라이트/다크, `runMockAction`, `DocumentChatFab` |
| [`src/styles.css`](../src/styles.css) | CSS 디자인 토큰, 셸·대시보드·위젯 스타일 |
| [`public/assets/`](../public/assets/) | 로고·파비콘 (`humour-logo-*.png`, `humour-app-icon.png`) |

## 참고 학습 자료

| 문서 | 내용 |
|------|------|
| [about_frontend.md](./about_frontend.md) | 프론트엔드·백엔드 협업 일반 (Axios, CORS, JWT 등). **이 레포 구현과 1:1 대응하지 않음** — HumouR 목업은 `mockClient` 패턴을 사용합니다. |

루트 [README.md](../README.md)에 실행 방법·저장소 요약이 있습니다.
