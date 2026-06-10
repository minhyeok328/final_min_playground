# 디렉터리 구조

`final_min_playground`의 실제 파일 구조 기준 문서입니다.

## 루트

```text
final_min_playground/
├── public/
│   └── assets/                 # HumouR PNG assets
├── src/                        # 애플리케이션 소스
├── scripts/
│   └── verify-document-chat-widget.mjs
├── docs/                       # 프로젝트 문서
├── index.html
├── package.json
├── package-lock.json
├── vite.config.ts
├── tsconfig.json
├── eslint.config.js
├── README.md
└── LICENSE
```

`.gitignore` 제외 대상: `node_modules/`, `dist/`, `.superpowers/`, `qa-screenshots/`, `.env*`.

## `src/`

```text
src/
├── main.tsx                    # React root, antd reset.css, styles.css
├── App.tsx                     # 해시 라우팅, 테마, API 액션, DocumentChatFab 연결
├── styles.css                  # 디자인 토큰과 레이아웃 스타일
├── vite-env.d.ts               # Vite import.meta.env 타입
├── api/
│   ├── adapters.ts             # API snake_case → UI 모델
│   └── backendClient.ts        # axios client, CSRF, mock/real API 전환
├── data/
│   ├── apiMockData.ts          # Django 응답 타입과 mock 샘플
│   └── mockData.tsx            # AppRoute, mainMenu, authMenu, palette
├── hooks/
│   └── useMockAppData.ts       # 초기 API 데이터 로드와 정규화
├── pages/                      # 화면 단위 컨테이너
├── components/                 # layout, dashboard, charts, chat 등
├── types/
│   └── app.ts
└── utils/
    ├── routes.ts
    └── statusTag.tsx
```

## 페이지와 컴포넌트

| `pages/` | 관련 `components/` |
|----------|--------------------|
| `DashboardPage.tsx` | `dashboard/`, `charts/` |
| `CompanyPage.tsx` | `company/` |
| `JdPage.tsx` | `jd/` |
| `CoverLetterPage.tsx` | `cover-letter/` |
| `ChatPage.tsx` | `chat/` |
| `MyPage.tsx` | `mypage/` |
| `RecruitmentPostPage.tsx` | `recruitment/` |
| `CoverLetterTemplatePage.tsx` | 페이지 내부 리스트 중심 |
| `AuthPages.tsx` | `layout/AuthScreen.tsx` |

전역 플로팅 채팅 위젯 `DocumentChatFab`는 `App.tsx`에서 `AppShell.assistantFab`로 주입됩니다. `#/chat` 화면에서는 중복 표시를 피하기 위해 숨깁니다.

## `api/`

| 파일 | 역할 |
|------|------|
| `backendClient.ts` | axios 인스턴스 생성, CSRF request interceptor, mock/real API 전환, `apiClient` export |
| `adapters.ts` | backend payload를 대시보드, 회사, JD, 리포트 등 UI 모델로 변환 |

## `docs/`

```text
docs/
├── README.md
├── about_frontend.md
├── 00-overview/
├── 01-getting-started/
├── 02-architecture/
├── 03-frontend/
├── 06-api/
├── 08-features/
└── superpowers/
```
