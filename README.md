# final_min_playground

| 항목 | 내용 |
|---|---|
| 이름 | 김민혁 |
| 프로젝트 | HumouR |
| 과정 | SKN26 파이널 프로젝트 |

SKN26 파이널 프로젝트 **HumouR**의 채용·지원자 분석 보조 서비스 UI 목업 저장소입니다.  
현재는 로그인과 데이터 로딩을 기본적으로 mock 응답으로 처리해 페이지 라우팅과 화면 흐름을 빠르게 확인할 수 있습니다. 실제 backend 연동 구조는 `axios` 기반으로 미리 맞춰두었습니다.

## 목적

- HumouR 화면 흐름과 주요 페이지 라우팅을 먼저 검증합니다.
- Ant Design + ECharts + CSS 디자인 토큰으로 운영형 SaaS에 가까운 UI 목업을 구성합니다.
- backend JSON API 계약(snake_case, `{ error, data, message }`)과 맞는 client 계층을 준비합니다.
- 지금은 mock UI로 동작하지만, `VITE_USE_MOCK_API=false`로 실행하면 axios client가 실제 `/api/{endpoint}/` 호출을 사용합니다.

## 주요 화면

| 구분 | 화면 | 해시 라우트 |
|------|------|-----------|
| 메인 | 대시보드, 회사 정보, JD 관리, 자기소개서, AI 문서 검색, 마이페이지, 모집 공고, 자소서 템플릿 | `#/dashboard`, `#/company`, `#/jd`, `#/cover-letter`, `#/chat`, `#/mypage`, `#/recruitment-post`, `#/cover-letter-template` |
| 인증 | 로그인, 회원가입, 비밀번호 재설정 | `#/login`, `#/signup`, `#/password-reset` |

라우트와 사이드 메뉴 정의: [`src/data/mockData.tsx`](./src/data/mockData.tsx).

## 데이터와 API

| 파일 | 역할 |
|------|------|
| [`src/api/backendClient.ts`](./src/api/backendClient.ts) | axios 인스턴스, CSRF 처리, mock/real API 전환, 화면용 `apiClient` 메서드 |
| [`src/data/apiMockData.ts`](./src/data/apiMockData.ts) | backend 응답 타입과 mock 샘플 데이터 |
| [`src/api/adapters.ts`](./src/api/adapters.ts) | API snake_case 데이터를 UI용 모델로 변환 |
| [`src/hooks/useMockAppData.ts`](./src/hooks/useMockAppData.ts) | 초기 dashboard/auth 데이터를 로드하고 화면 상태로 조합 |
| [`src/data/mockData.tsx`](./src/data/mockData.tsx) | 라우트, 메뉴, 색상 팔레트, 채팅 타입 |

기본값은 mock 모드입니다. 실제 backend 호출을 확인하려면 다음처럼 실행합니다.

```powershell
$env:VITE_USE_MOCK_API='false'
npm.cmd run dev
```

실제 호출 모드에서는 `axios.create({ baseURL: '/api', withCredentials: true })`를 사용하고, POST 요청 전에 `/api/csrf/`로 받은 `csrftoken`을 `X-CSRFToken` 헤더에 붙입니다.

## 기술 스택

- React 19 + TypeScript
- Vite 7
- Ant Design 5 (`@ant-design/icons`)
- ECharts 6
- Axios 1.17.0
- Playwright Core (선택 UI 검증 스크립트)

## 저장소 구조

```text
final_min_playground/
├── public/assets/              # HumouR 로고·앱 아이콘 PNG
├── src/
│   ├── App.tsx                 # 해시 라우팅, 테마, API 액션, DocumentChatFab 연결
│   ├── api/                    # backendClient, adapters
│   ├── data/                   # apiMockData, mockData
│   ├── hooks/                  # useMockAppData
│   ├── pages/                  # 화면 단위
│   ├── components/             # layout, dashboard, charts, chat 등
│   ├── types/, utils/
│   ├── styles.css
│   └── vite-env.d.ts           # Vite env 타입
├── scripts/
│   └── verify-document-chat-widget.mjs
├── docs/
├── index.html
├── package.json
└── vite.config.ts
```

상세 트리: [`docs/02-architecture/directory-structure.md`](./docs/02-architecture/directory-structure.md).

## 로컬 실행

```bash
npm install
npm run dev
```

브라우저: `http://127.0.0.1:5173`  
화면 이동은 해시 라우팅을 사용합니다. 예: `#/login`, `#/dashboard`, `#/jd`

```bash
npm run build   # tsc --noEmit + vite build
npm run lint    # ESLint
npm run preview # dist 미리보기
```

선택 UI 검증:

```bash
node scripts/verify-document-chat-widget.mjs
```

## 문서

| 문서 | 내용 |
|------|------|
| [`docs/README.md`](./docs/README.md) | 문서 허브 |
| [`docs/00-overview/project-overview.md`](./docs/00-overview/project-overview.md) | 프로젝트 개요 |
| [`docs/01-getting-started/development-environment.md`](./docs/01-getting-started/development-environment.md) | 설치, 실행, API 모드 |
| [`docs/02-architecture/data-flow.md`](./docs/02-architecture/data-flow.md) | 데이터 흐름 |
| [`docs/06-api/api-reference.md`](./docs/06-api/api-reference.md) | API client와 endpoint 매핑 |
| [`docs/about_frontend.md`](./docs/about_frontend.md) | 프론트엔드·백엔드 협업 참고 자료 |
