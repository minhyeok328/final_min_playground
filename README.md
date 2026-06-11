# Final_project_web

SKN26 파이널 프로젝트 **HumouR**의 채용·지원자 분석 보조 서비스 프론트엔드 저장소입니다.
React Router로 전체 화면 흐름을 구성하고, TanStack React Query로 초기 데이터를 캐시합니다. 기본값은 mock API 모드이며, `VITE_USE_MOCK_API=false`로 전환하면 axios client가 실제 `/api/{endpoint}/`를 호출합니다.

## 목적

- HumouR 화면 흐름과 주요 페이지 라우팅을 React Router로 검증합니다.
- Ant Design + Ant Design X + ECharts + CSS 디자인 토큰으로 운영형 SaaS UI를 구성합니다.
- backend JSON API 계약(snake_case, `{ error, data, message }`)과 맞는 client·adapter 계층을 유지합니다.
- mock 모드로 backend 없이 UI를 확인하고, real API 모드로 로그인·회원가입·비밀번호 재설정·채팅 등 핵심 액션을 연동합니다.

## 주요 화면

| 구분 | 화면 | React Router 라우트 |
|------|------|---------------------|
| 메인 | 대시보드, 관리자, 회사 정보, JD 관리, 자기소개서, AI 문서 검색, 마이페이지, 모집 공고, 자소서 포맷 | `/dashboard`, `/admin`, `/company`, `/jd`, `/cover-letter`, `/chat`, `/mypage`, `/recruitment-post`, `/cover-letter-template` |
| 인증 | 로그인, 회원가입, 비밀번호 재설정 | `/login`, `/signup`, `/password-reset` |

- 라우트·사이드 메뉴 정의: [`src/data/mockData.tsx`](./src/data/mockData.tsx)
- pathname → 라우트 변환: [`src/utils/routes.ts`](./src/utils/routes.ts)
- 알 수 없는 경로는 `/dashboard`로 리다이렉트합니다.
- `/chat`은 사이드 메뉴에 없는 standalone 라우트이며, 다른 화면에서는 `DocumentChatFab` 플로팅 위젯으로 채팅에 접근합니다.

## 데이터 흐름

```text
AppQueryProvider
  └─ useMockAppData → useAppDataQuery → loadAppData (appDataService)
        ├─ apiClient.getDashboard()
        ├─ apiClient.getAuthDefaults()
        └─ adapters map* → AppData

사용자 액션 → App.runApiAction → apiClient.* → Alert (error / message)
```

| 파일 | 역할 |
|------|------|
| [`src/api/appDataService.ts`](./src/api/appDataService.ts) | dashboard·auth 기본값을 조합하고 adapter로 UI 모델(`AppData`) 생성 |
| [`src/api/queryClient.ts`](./src/api/queryClient.ts) | TanStack Query 기본 옵션(staleTime, retry 등) |
| [`src/api/queryKeys.ts`](./src/api/queryKeys.ts) | 쿼리 키 상수 |
| [`src/api/queryOptions.ts`](./src/api/queryOptions.ts) | `appData` query options |
| [`src/hooks/useAppDataQuery.ts`](./src/hooks/useAppDataQuery.ts) | `loadAppData` React Query hook |
| [`src/hooks/useMockAppData.ts`](./src/hooks/useMockAppData.ts) | `App.tsx`용 loading/error/reload 래퍼 |
| [`src/providers/AppQueryProvider.tsx`](./src/providers/AppQueryProvider.tsx) | 앱 전역 `QueryClientProvider` |
| [`src/api/backendClient.ts`](./src/api/backendClient.ts) | axios 인스턴스, CSRF·API Key 처리, mock/real 전환, `apiClient` export |
| [`src/data/apiMockData.ts`](./src/data/apiMockData.ts) | backend 응답 타입(`ApiResponse<T>`)과 mock fixture |
| [`src/api/adapters.ts`](./src/api/adapters.ts) | API snake_case 데이터 → UI 모델 변환 |
| [`src/data/mockData.tsx`](./src/data/mockData.tsx) | `AppRoute`, 메뉴, palette, `ChatMessage` 타입 |

### API 응답 형식

프론트엔드 내부 `ApiResponse<T>`:

```ts
{
  error: boolean;
  message?: string;
  data: T;
  meta?: { requested_at: string; page?; page_size?; total_count? };
}
```

`App.runApiAction`은 `response.error`로 Alert 타입을 결정합니다. 상세 규칙은 [`docs/02-architecture/api-envelope.md`](./docs/02-architecture/api-envelope.md)를 참고하세요.

## API 모드와 환경 변수

[`.env.example`](./.env.example)를 복사해 `.env`를 만들거나, 실행 시 환경 변수를 지정합니다.

| 변수 | 기본값 | 설명 |
|------|--------|------|
| `VITE_USE_MOCK_API` | `true` (미설정 시 mock) | `false`이면 axios로 실제 backend 호출 |
| `VITE_API_KEY` | (비어 있음) | 설정 시 모든 요청에 `X-API-Key` 헤더 추가 |

mock 모드 (기본):

```bash
npm install
npm run dev
```

real API 모드 (PowerShell):

```powershell
Copy-Item .env.example .env
$env:VITE_USE_MOCK_API='false'
$env:VITE_API_KEY='your-api-key'   # 필요 시
npm.cmd run dev
```

real API 모드에서 axios 공통 설정:

- `baseURL: '/api'`
- `withCredentials: true`
- `Content-Type: application/json`
- POST 요청 전 `GET /api/csrf/` → 쿠키 `csrftoken`을 `X-CSRFToken` 헤더로 전송
- `VITE_API_KEY`가 있으면 `X-API-Key` 헤더 추가

### `apiClient` 주요 액션

| 영역 | 메서드 | real API backend action (예) |
|------|--------|------------------------------|
| 인증 | `login`, `logout` | `login`, `logout` |
| 회원가입 | `checkSignupId`, `completeSignup` | `checkuser`, `signin` |
| 비밀번호 | `getPasswordQuestion`, `resetPassword` | `passqestion`, `passreset` |
| 데이터 조회 | `getDashboard`, `getAuthDefaults`, … | `account/get`, `compinfo/get`, `jd/get`, … |
| 채팅 | `sendChatMessage(question, messages)` | `chat` (대화 히스토리 전달) |
| 저장·분석 | `saveCompanyProfile`, `requestJobAnalysis`, … | `compinfo/modify`, `resume/analize`, … |

endpoint 매핑 전체: [`docs/06-api/api-reference.md`](./docs/06-api/api-reference.md).

## 기술 스택

| 영역 | 기술 |
|------|------|
| UI | React 19, TypeScript, Ant Design 6, Ant Design X |
| 라우팅 | React Router 7 |
| 서버 상태 | TanStack React Query 5 |
| HTTP | Axios 1.17.0 |
| 차트 | ECharts 6 |
| 빌드 | Vite 7 |
| 검증 | ESLint 9, TypeScript 5.9, Playwright Core (선택 UI 캡처) |

## 저장소 구조

```text
Final_project_web/
├── public/assets/                  # HumouR 로고·앱 아이콘 PNG
├── src/
│   ├── main.tsx                    # React root, AppQueryProvider, BrowserRouter
│   ├── App.tsx                     # 라우팅, 테마, runApiAction, DocumentChatFab
│   ├── api/
│   │   ├── adapters.ts             # snake_case → UI 모델
│   │   ├── appDataService.ts       # AppData 로더
│   │   ├── backendClient.ts        # axios client, mock/real 전환
│   │   ├── queryClient.ts
│   │   ├── queryKeys.ts
│   │   └── queryOptions.ts
│   ├── providers/
│   │   └── AppQueryProvider.tsx
│   ├── hooks/
│   │   ├── useAppDataQuery.ts
│   │   └── useMockAppData.ts
│   ├── data/
│   │   ├── apiMockData.ts          # ApiResponse 타입, mock fixture
│   │   └── mockData.tsx            # 라우트, 메뉴, palette
│   ├── pages/                      # 화면 단위 (Dashboard, Admin, Auth, …)
│   ├── components/
│   │   ├── layout/                 # AppShell, SidebarNav, AuthScreen, …
│   │   ├── dashboard/              # 지표, 테이블, 분석 요약
│   │   ├── charts/                 # EChart, DonutChart
│   │   ├── chat/                   # ChatPage 패널, DocumentChatFab
│   │   ├── company/, jd/, cover-letter/, recruitment/, mypage/
│   │   └── common/                 # PageState, SectionCard, MetricCard, …
│   ├── types/app.ts                # Navigate, RunApiAction, ThemeMode 등
│   ├── utils/routes.ts, statusTag.tsx
│   ├── styles.css                  # 디자인 토큰, 레이아웃, 사이드바 pin 스타일
│   └── vite-env.d.ts               # VITE_USE_MOCK_API, VITE_API_KEY 타입
├── scripts/
│   └── verify-document-chat-widget.mjs
├── docs/                           # 상세 설계·API·기능 문서
├── .env.example
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── eslint.config.js
```

상세 트리와 페이지-컴포넌트 매핑: [`docs/02-architecture/directory-structure.md`](./docs/02-architecture/directory-structure.md).

## 로컬 실행

```bash
npm install
npm run dev
```

| 항목 | 값 |
|------|-----|
| 개발 서버 | `http://127.0.0.1:5173` (`vite --host 127.0.0.1`) |
| 진입 예시 | `/login`, `/dashboard`, `/jd`, `/chat` |

```bash
npm run build   # tsc --noEmit && vite build
npm run lint    # ESLint
npm run preview # dist 미리보기
```

선택 UI 검증 (로컬 Chrome 또는 Edge 필요):

```bash
node scripts/verify-document-chat-widget.mjs
```

- 기본 포트: `5176` (`VERIFY_PORT` 환경 변수로 변경 가능)
- 캡처 저장: `qa-screenshots/` (`.gitignore` 대상)

## UI 특징 (현재 구현)

- **테마**: 라이트/다크 전환, Ant Design token + `styles.css` CSS 변수
- **데스크톱 사이드바**: hover/focus로 확장, 핀 버튼으로 고정(`data-sidebar-pinned`) 가능
- **관리자 페이지**: 면접방, API 키, LLM 사용량, 포인트 가드레일 목업
- **인증**: 회원가입 ID 중복 확인, 단계형 비밀번호 재설정(질문 조회 → 답변 검증 → 임시 비밀번호 표시)
- **AI 문서 검색**: `/chat` 전체 화면 + 다른 페이지 `DocumentChatFab`

## 문서

| 문서 | 내용 |
|------|------|
| [`docs/README.md`](./docs/README.md) | 문서 허브 |
| [`docs/00-overview/project-overview.md`](./docs/00-overview/project-overview.md) | 프로젝트 개요 |
| [`docs/01-getting-started/development-environment.md`](./docs/01-getting-started/development-environment.md) | 설치, 실행, API 모드 |
| [`docs/02-architecture/data-flow.md`](./docs/02-architecture/data-flow.md) | 데이터 흐름 |
| [`docs/02-architecture/api-envelope.md`](./docs/02-architecture/api-envelope.md) | API 응답 형식 |
| [`docs/06-api/api-reference.md`](./docs/06-api/api-reference.md) | API client와 endpoint 매핑 |
| [`docs/03-frontend/pages-and-routes.md`](./docs/03-frontend/pages-and-routes.md) | 페이지·라우트 상세 |
| [`docs/about_frontend.md`](./docs/about_frontend.md) | 프론트엔드·백엔드 협업 참고 |