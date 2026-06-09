# 디렉터리 구조

실제 저장소(`final_min_playground`) 기준 트리입니다. UI 고도화·목업 연습용이므로 `src/pages` + `src/components` 중심으로 구성되어 있습니다.

## 루트

```text
final_min_playground/
├── public/
│   └── assets/                 # HumouR PNG (Vite → /assets/...)
│       ├── humour-app-icon.png
│       ├── humour-logo-dark.png
│       └── humour-logo-light.png
├── src/                        # 애플리케이션 소스 (아래 상세)
├── scripts/
│   └── verify-document-chat-widget.mjs   # Playwright UI 캡처 검증
├── docs/                       # 이 위키
├── index.html                  # 파비콘, Vite 진입
├── package.json                # name: humour-ui-mockup
├── package-lock.json
├── vite.config.ts
├── tsconfig.json
├── eslint.config.js
├── README.md
└── LICENSE
```

`.gitignore`로 제외되는 대표 경로: `node_modules/`, `dist/`, `.superpowers/`, `qa-screenshots/`, `.env*`.

## `src/`

```text
src/
├── main.tsx                    # React 루트, antd reset.css, styles.css
├── App.tsx                     # 해시 라우트, 테마, API 액션, DocumentChatFab 연동
├── styles.css                  # CSS 변수·셸·대시보드·위젯·다크모드 전역 스타일
├── api/
│   ├── adapters.ts             # API snake_case → UI 모델
│   └── backendClient.ts        # backend 명세 기반 fetch/CSRF 클라이언트
├── data/
│   ├── apiMockData.ts          # Django 응답 JSON 계약 샘플
│   └── mockData.tsx            # AppRoute, mainMenu, authMenu, palette
├── hooks/
│   └── useMockAppData.ts       # 초기 API 데이터 로드·정규화
├── pages/                      # 화면 단위 컨테이너
│   ├── DashboardPage.tsx
│   ├── CompanyPage.tsx
│   ├── JdPage.tsx
│   ├── CoverLetterPage.tsx
│   ├── ChatPage.tsx            # AI 문서 검색 워크스페이스
│   ├── MyPage.tsx
│   ├── RecruitmentPostPage.tsx
│   ├── CoverLetterTemplatePage.tsx
│   └── AuthPages.tsx           # Login, Signup, PasswordReset
├── components/
│   ├── common/                 # PageTitle, SectionCard, PageState, MetricCard, …
│   ├── layout/                 # AppShell, SidebarNav, TopHeader, AuthScreen, …
│   ├── dashboard/              # DashboardHero, DashboardMetrics, …
│   ├── company/
│   ├── jd/
│   ├── cover-letter/
│   ├── chat/                   # DocumentChatFab, DocumentSearchContextPanel, …
│   ├── mypage/
│   ├── recruitment/
│   └── charts/                 # EChart, DonutChart, chartAdapters, chartTheme
├── types/
│   └── app.ts                  # ThemeMode, AlertState, RunApiAction, …
└── utils/
    ├── routes.ts               # 해시 → AppRoute, authRoutes
    └── statusTag.tsx           # status_code → Ant Design Tag
```

## 페이지 ↔ 컴포넌트 폴더

| `pages/` | `components/` |
|----------|----------------|
| `DashboardPage.tsx` | `dashboard/` (`DashboardHero` 포함) |
| `CompanyPage.tsx` | `company/` |
| `JdPage.tsx` | `jd/` |
| `CoverLetterPage.tsx` | `cover-letter/` |
| `ChatPage.tsx` | `chat/` (`DocumentSearchContextPanel`, `ChatWindowPanel`) |
| `MyPage.tsx` | `mypage/` |
| `RecruitmentPostPage.tsx` | `recruitment/` |
| `CoverLetterTemplatePage.tsx` | (페이지 내 List 위주) |
| `AuthPages.tsx` | `layout/AuthScreen.tsx` |

전역 플로팅 위젯 `DocumentChatFab`는 `App.tsx` → `AppShell.assistantFab`로 주입됩니다 (`#/chat`에서는 숨김).

## `docs/`

```text
docs/
├── README.md                   # 위키 목차
├── about_frontend.md           # 협업 일반 참고 (레포 구현과 별개)
├── 00-overview/
├── 01-getting-started/
├── 02-architecture/
├── 03-frontend/
├── 06-api/
├── 08-features/                # 페이지별 Django JSON + 파일 맵
└── superpowers/                # UI 고도화 설계·구현 계획 (에이전트 산출물)
    ├── specs/
    └── plans/
```
