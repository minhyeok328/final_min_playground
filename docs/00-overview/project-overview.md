# 프로젝트 개요

`final_min_playground`는 SKN26 파이널 프로젝트 **HumouR**의 프론트엔드 UI 목업 저장소입니다. 채용 담당자가 회사 정보, JD, 지원서, 분석 리포트, 면접 질문 흐름을 한 화면 제품처럼 탐색할 수 있도록 구성합니다.

## 목적

- 해시 라우팅으로 전체 화면 흐름을 빠르게 확인합니다.
- 로그인, 회원가입, 비밀번호 재설정은 현재 mock 응답으로 통과시킵니다.
- 실제 backend 연동을 위해 API 호출 계층은 axios 기반으로 준비합니다.
- backend 명세가 부족한 영역은 로컬 mock 데이터로 보완합니다.

## 현재 구현 범위

| 영역 | 구현 위치 | 요약 |
|------|-----------|------|
| 라우팅 | `src/App.tsx`, `src/utils/routes.ts` | `#/dashboard`, `#/login` 등 해시 라우팅 |
| 레이아웃 | `src/components/layout/` | 사이드바, 모바일 헤더, 인증 화면 |
| 대시보드 | `src/components/dashboard/` | 지표, 지원자 테이블, 분석 요약 |
| 차트 | `src/components/charts/` | ECharts wrapper와 donut chart |
| AI 문서 검색 | `src/components/chat/`, `src/pages/ChatPage.tsx` | 플로팅 위젯과 전체 채팅 화면 |
| API client | `src/api/backendClient.ts` | axios, CSRF, mock/real API 전환 |
| 데이터 변환 | `src/api/adapters.ts` | backend snake_case 데이터를 UI 모델로 변환 |

## API 연동 상태

| 항목 | 상태 |
|------|------|
| 기본 모드 | mock API. backend 없이 페이지 라우팅과 화면 확인 가능 |
| 실제 호출 모드 | `VITE_USE_MOCK_API=false`일 때 axios로 `/api/{endpoint}/` 호출 |
| 인증·세션 | 쿠키 기반 세션, `GET /api/csrf/` 후 `X-CSRFToken` 헤더 |
| 요청 공통 설정 | `axios.create({ baseURL: '/api', withCredentials: true })` |
| 응답 계약 | backend `{ error, data, message }` → UI 내부 `{ status_code, message, data }` |

아직 명세가 없는 채팅, 문서 다운로드, username 중복 확인 등은 로컬 성공 응답 또는 안내 메시지로 처리합니다. 추가 API 제안은 [api-spec-addendum.md](../06-api/api-spec-addendum.md)에 정리되어 있습니다.

## 기술 스택

| 영역 | 기술 |
|------|------|
| UI | React 19, TypeScript, Ant Design 5 |
| 빌드 | Vite 7 |
| HTTP client | Axios 1.17.0 |
| 차트 | ECharts 6 |
| 라우팅 | 해시 라우팅 |
| 검증 | `npm run build`, `npm run lint`, Playwright 캡처 스크립트 |

## 정적 자산

[`public/assets/`](../../public/assets/)는 Vite public 경로 `/assets/...`로 참조합니다.

- `humour-app-icon.png`
- `humour-logo-light.png`
- `humour-logo-dark.png`

## 관련 문서

- [개발 환경](../01-getting-started/development-environment.md)
- [디렉터리 구조](../02-architecture/directory-structure.md)
- [데이터 흐름](../02-architecture/data-flow.md)
- [API 레퍼런스](../06-api/api-reference.md)
- [프론트엔드 개요](../03-frontend/overview.md)
