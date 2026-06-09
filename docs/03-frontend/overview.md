# 프론트엔드 개요

## 레이아웃

| 파일 | 역할 |
|------|------|
| [`src/components/layout/AppShell.tsx`](../../src/components/layout/AppShell.tsx) | 인증 제외 화면: 사이드바 + 헤더 + 콘텐츠 + `assistantFab` 슬롯 |
| [`src/components/layout/SidebarNav.tsx`](../../src/components/layout/SidebarNav.tsx) | `mainMenu` 기반 네비게이션, 하단 크레딧 |
| [`src/components/layout/TopHeader.tsx`](../../src/components/layout/TopHeader.tsx) | 스티키 헤더, 데스크톱 검색, 모바일 라우트 셀렉트 |
| [`src/components/layout/CreditSummary.tsx`](../../src/components/layout/CreditSummary.tsx) | 분석 크레딧 % 표시 |
| [`src/components/layout/AuthScreen.tsx`](../../src/components/layout/AuthScreen.tsx) | 로그인·가입·비밀번호 레이아웃 |

`AppShell`은 `content-frame`에 `key={route}`를 두어 라우트 전환 시 페이지 진입 애니메이션을 유도합니다.

## AI 문서 검색 (플로팅 + 전체 화면)

| 파일 | 역할 |
|------|------|
| [`DocumentChatFab.tsx`](../../src/components/chat/DocumentChatFab.tsx) | 전역 FAB·우측 하단 고정 위젯 (`#/chat` 제외) |
| [`DocumentSearchContextPanel.tsx`](../../src/components/chat/DocumentSearchContextPanel.tsx) | `#/chat` 좌측 검색 컨텍스트·문서 컬렉션 |
| [`ChatWindowPanel.tsx`](../../src/components/chat/ChatWindowPanel.tsx) | 메시지·전송 UI (placeholder·로딩 라벨 커스터마이즈) |

채팅 상태(`chatMessages`, `chatInput`, `sendChatMessage`)는 `App.tsx`에서 관리하며 FAB와 `/chat` 페이지가 **동일 상태**를 공유합니다.

## 공통 UI

| 파일 | 역할 |
|------|------|
| [`PageTitle.tsx`](../../src/components/common/PageTitle.tsx) | 페이지 eyebrow·제목·액션 슬롯 |
| [`SectionCard.tsx`](../../src/components/common/SectionCard.tsx) | 카드 래퍼 |
| [`PageState.tsx`](../../src/components/common/PageState.tsx) | `PageLoading`, `PageError`, `EmptyState` |
| [`MetricCard.tsx`](../../src/components/common/MetricCard.tsx) | 대시보드 지표 카드 (아이콘 칩) |
| [`InlineLoading.tsx`](../../src/components/common/InlineLoading.tsx) | 버튼·버블 내 로딩 |

## 테마·브랜딩

- `App.tsx`: Ant Design `ConfigProvider` + 라이트/다크 `Switch` (`data-theme` on `.app-root`)
- Ant Design 토큰: `palette` 기반 primary/accent, `borderRadius: 12`, Card/Button/Input radius
- CSS 변수: [`src/styles.css`](../../src/styles.css) — `--primary`, `--shadow`, `--radius`, `--content-max` 등
- JS 팔레트: [`src/data/mockData.tsx`](../../src/data/mockData.tsx) `palette` (primary `#2563EB`, accent `#14B8A6` 등)
- 폰트: `Noto Sans KR Clean, Noto Sans KR, system-ui, sans-serif`
- 로고·아이콘: [`public/assets/`](../../public/assets/) — `/assets/humour-logo-*.png`, `humour-app-icon.png`
- 전역 스타일: 사이드바, 인증 카드, 대시보드 히어로, 문서 검색 위젯, 채팅 버블 등

## 차트 (`components/charts/`)

| 파일 | 역할 |
|------|------|
| `EChart.tsx` | ECharts React 래퍼 |
| `DonutChart.tsx` | 대시보드 적합도 도넛 |
| `chartAdapters.ts` | API 데이터 → 시리즈 변환 |
| `chartTheme.ts` | 라이트/다크 색상 |

[`AnalysisSummaryPanel.tsx`](../../src/components/dashboard/AnalysisSummaryPanel.tsx)에서 `mode`에 따라 테마를 넘깁니다.

## UI 고도화 참고

- 디자인 스펙: [design-system-upgrade-design.md](../superpowers/specs/2026-06-04-design-system-upgrade-design.md)
- FAB 구현 계획: [document-chat-fab.md](../superpowers/plans/2026-06-04-document-chat-fab.md)
