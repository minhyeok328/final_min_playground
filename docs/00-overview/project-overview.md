# 프로젝트 개요

## 목적

SKN26 파이널 **HumouR** 채용 보조 서비스의 **UI 고도화·레이아웃 목업** 저장소(`final_min_playground`)입니다.

- Ant Design으로 폼·테이블·카드·알림·사이드 레이아웃을 구성합니다.
- ECharts로 대시보드 적합도 도넛 차트를 표시합니다.
- `styles.css` CSS 변수와 Ant Design `ConfigProvider`로 **운영형 SaaS** 느낌의 비주얼·모션을 적용합니다.
- 해시 라우팅(`#/dashboard`, `#/jd` …)으로 전체 화면 흐름을 탐색합니다.
- Django JSON API **계약**을 목 데이터로 고정해, 메인 백엔드 연동 시 필드명·래퍼를 맞출 수 있게 합니다.

**이 레포는 UI 고도화·디자인 실험용**이며, HumouR 메인 백엔드/배포 저장소와 분리되어 있습니다.

## UI 고도화 작업 (현재)

| 영역 | 구현 위치 | 요약 |
|------|-----------|------|
| 디자인 토큰 | `src/styles.css`, `App.tsx` `ConfigProvider` | 블루 계열 primary, 소프트 배경, 카드·그림자·radius |
| 앱 셸 | `AppShell`, `SidebarNav`, `TopHeader` | 밝은 사이드바, 스티키 헤더, 데스크톱 검색, 모바일 라우트 셀렉트 |
| 대시보드 | `DashboardHero`, `DashboardMetrics`, … | 히어로 패널, 아이콘 지표 카드, 지원자·분석·할 일 섹션 |
| AI 문서 검색 | `DocumentChatFab`, `ChatPage` | 전역 플로팅 위젯 + `#/chat` 전체 화면, 앱 레벨 채팅 상태 공유 |
| 검증 | `scripts/verify-document-chat-widget.mjs` | Playwright로 위젯 UI 캡처 (선택) |

설계 스펙: [design-system-upgrade-design.md](../superpowers/specs/2026-06-04-design-system-upgrade-design.md)

## 현재 백엔드 연동 상태

| 항목 | 상태 |
|------|------|
| HTTP / Django | **없음** — `mockClient`가 `apiMockData.ts`를 ~260ms 지연 후 반환 |
| 인증·세션 | **없음** — 로그인·가입은 UI + 성공 Alert만 |
| 폼 mutation | 입력값 **미전송** — `mockClient.*`가 고정 성공 메시지 반환 |
| 어댑터 | `adapters.ts`가 snake_case → camelCase (Django 연동 시 재사용 가능) |

연동 시: `mockClient`를 HTTP 클라이언트로 교체하고, 응답 `data`의 snake_case 키를 유지하면 됩니다. 문서의 **요청 JSON**은 Django 구현 시 프론트가 보낼 **권장 계약**입니다.

## 기술 스택

| 영역 | 기술 |
|------|------|
| UI | React 19, TypeScript, Ant Design 5 |
| 빌드 | Vite 7 (`package.json` name: `humour-ui-mockup`) |
| 차트 | ECharts 6 (`src/components/charts/`) |
| 라우팅 | 해시 (`src/utils/routes.ts`, `src/data/mockData.tsx`) |
| 스타일 | `src/styles.css` (CSS 변수·컴포넌트 클래스), Ant Design 토큰 (`App.tsx`) |
| 폰트 | Noto Sans KR Clean, Noto Sans KR (테마 `fontFamily`) |
| UI 검증 | Playwright Core (`scripts/verify-document-chat-widget.mjs`) |

## 정적 자산

[`public/assets/`](../../public/assets/) — 브라우저 경로 `/assets/...`

- `humour-app-icon.png` — 파비콘, 헤더 아이콘, 아바타, 채팅
- `humour-logo-light.png` / `humour-logo-dark.png` — 인증·사이드바 로고

## 관련 문서

- [개발 환경](../01-getting-started/development-environment.md)
- [디렉터리 구조](../02-architecture/directory-structure.md)
- [데이터 흐름](../02-architecture/data-flow.md)
- [API 레퍼런스](../06-api/api-reference.md)
- [프론트엔드 개요](../03-frontend/overview.md)
