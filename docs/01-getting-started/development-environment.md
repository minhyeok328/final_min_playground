# 개발 환경

HumouR UI 목업을 로컬에서 실행하고, mock API 모드와 실제 backend API 모드를 전환하는 방법입니다.

## 사전 요구사항

- Node.js LTS 권장
- npm

현재 주요 runtime dependency:

- React 19
- Ant Design 5
- ECharts 6
- Axios 1.17.0

## 설치와 실행

```bash
npm install
npm run dev
```

| 항목 | 값 |
|------|-----|
| 개발 서버 | `http://127.0.0.1:5173` (`vite --host 127.0.0.1`) |
| 저장소 폴더 | `final_min_playground` |
| npm 패키지명 | `humour-ui-mockup` ([`package.json`](../../package.json)) |
| 화면 이동 | 해시 라우팅. 예: `#/dashboard`, `#/company`, `#/login` |

브라우저 주소의 해시를 바꾸면 [`src/utils/routes.ts`](../../src/utils/routes.ts)가 라우트를 동기화합니다. 알 수 없는 해시는 `#/dashboard`로 처리합니다.

## API 모드

기본값은 mock API 모드입니다. 백엔드 서버 없이도 로그인 버튼 클릭 후 `#/dashboard`로 이동하고, 사이드 메뉴로 실제 페이지 라우팅을 확인할 수 있습니다.

| 모드 | 설정 | 동작 |
|------|------|------|
| mock API | 기본값 또는 `VITE_USE_MOCK_API=true` | [`apiMockData.ts`](../../src/data/apiMockData.ts) 기반 로컬 응답 사용 |
| real API | `VITE_USE_MOCK_API=false` | [`backendClient.ts`](../../src/api/backendClient.ts)의 axios client가 `/api/{endpoint}/` 호출 |

PowerShell에서 실제 API 모드로 실행:

```powershell
$env:VITE_USE_MOCK_API='false'
npm.cmd run dev
```

real API 모드에서는 axios가 다음 공통 설정을 사용합니다.

- `baseURL: '/api'`
- `withCredentials: true`
- `Content-Type: application/json`
- POST 요청 전 `GET /api/csrf/` 호출
- 쿠키의 `csrftoken`을 `X-CSRFToken` 헤더로 전송

## 기본 스크립트

```bash
npm run build   # tsc --noEmit + vite build
npm run lint    # ESLint
npm run preview # dist 미리보기
```

## UI 검증 스크립트

AI 문서 검색 플로팅 위젯은 Playwright로 캡처할 수 있습니다. 로컬 Chrome 또는 Edge가 필요합니다.

```bash
node scripts/verify-document-chat-widget.mjs
```

- 기본 포트: `5176` (`VERIFY_PORT` 환경 변수로 변경 가능)
- 캡처 저장: `qa-screenshots/` (`.gitignore` 대상)

## 진입점

| 파일 | 역할 |
|------|------|
| [`index.html`](../../index.html) | Vite HTML entry, favicon |
| [`src/main.tsx`](../../src/main.tsx) | React mount, Ant Design reset, global CSS |
| [`src/App.tsx`](../../src/App.tsx) | 라우팅, 테마, `useMockAppData`, API 액션 실행 |
| [`src/api/backendClient.ts`](../../src/api/backendClient.ts) | mock/real API 전환과 axios client |
