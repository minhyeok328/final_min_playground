# 페이지와 라우팅

## 해시 라우트

[`src/utils/routes.ts`](../../src/utils/routes.ts)가 `window.location.hash`를 `AppRoute`로 변환합니다. 알 수 없는 해시는 `/dashboard`로 폴백합니다.

| `AppRoute` | 페이지 컴포넌트 | 인증 |
|------------|-----------------|------|
| `/dashboard` | `DashboardPage` | 보호 |
| `/company` | `CompanyPage` | 보호 |
| `/jd` | `JdPage` | 보호 |
| `/cover-letter` | `CoverLetterPage` | 보호 |
| `/chat` | `ChatPage` (AI 문서 검색) | 보호 |
| `/mypage` | `MyPage` | 보호 |
| `/recruitment-post` | `RecruitmentPostPage` | 보호 |
| `/cover-letter-template` | `CoverLetterTemplatePage` | 보호 |
| `/login` | `LoginPage` | 공개 |
| `/signup` | `SignupPage` | 공개 |
| `/password-reset` | `PasswordResetPage` | 공개 |

메뉴 정의: [`src/data/mockData.tsx`](../../src/data/mockData.tsx) — `mainMenu`(8), `authMenu`(3).  
사이드바 라벨 예: 대시보드, 회사 정보, JD 관리, 자기소개서, **AI 문서 검색**, 마이페이지, 모집 공고, 자소서 포맷.

## `App.tsx` 렌더 분기

- `authRoutes` 포함 시 → `renderAuthPage()` (쉘 없음)
- 그 외 → `AppShell` + `renderProtectedPage()`
  - `route !== '/chat'`일 때 `DocumentChatFab`를 `assistantFab`로 주입
- `useMockAppData` 로딩/에러 시 `PageLoading` / `PageError`

## 전역에서 페이지로 내려주는 데이터

보호된 페이지는 `useMockAppData` 결과 `data`와 `App` 로컬 상태를 props로 받습니다.

채팅 관련 상태는 앱 레벨에서 관리합니다.

| 상태 | 공유 대상 |
|------|-----------|
| `chatMessages`, `chatInput`, `sendChatMessage` | `DocumentChatFab`, `ChatPage` |
| `selectedJdIdOverride` | JD·자소서·템플릿 |
| `selectedRowKeys` | 모집 공고 다중 JD 선택 |

상세 props는 [08-features](../08-features/README.md) 각 페이지 문서를 참고하세요.
