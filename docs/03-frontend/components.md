# 컴포넌트 맵

도메인 폴더별 **역할**만 정리합니다. 페이지별 API는 [08-features](../08-features/README.md)를 참고하세요.

## layout/

| 파일 | 기능 |
|------|------|
| `AppShell.tsx` | 사이드바·헤더·콘텐츠·`assistantFab` 조합 |
| `SidebarNav.tsx` | 메인 메뉴, 브랜드 로고, 크레딧 |
| `TopHeader.tsx` | 현재 화면 제목, 검색, 테마, 로그아웃 |
| `CreditSummary.tsx` | 사이드바 하단 크레딧 진행률 |
| `AuthScreen.tsx` | 인증 화면 공통 레이아웃 |

## dashboard/

| 파일 | 기능 |
|------|------|
| `DashboardHero.tsx` | 히어로 패널: 요약 통계, 주요 액션, 크레딧·파이프라인 레일 |
| `DashboardMetrics.tsx` | 상단 4개 지표 카드 (`MetricCard`) |
| `ApplicantReviewTable.tsx` | 지원자 검토 테이블 |
| `AnalysisSummaryPanel.tsx` | 도넛 차트 + 인사이트 카드 |
| `TaskListPanel.tsx` | 할 일 목록 |

## company/

| 파일 | 기능 |
|------|------|
| `CompanyProfileForm.tsx` | 회사명·직원 수·팀 구성·소개·인재상 폼 |
| `CompanyCompletionPanel.tsx` | 프로필 완성도 % |

## jd/

| 파일 | 기능 |
|------|------|
| `JdListPanel.tsx` | JD 목록 선택 |
| `JdEditorPanel.tsx` | 선택 JD 상세(현재 readOnly) |

## cover-letter/

| 파일 | 기능 |
|------|------|
| `CoverLetterInputPanel.tsx` | JD 선택 + 지원자명 + 본문 |
| `CoverLetterUploadPanel.tsx` | Excel 드래그 업로드 + 미리보기 테이블 |

## chat/

| 파일 | 기능 |
|------|------|
| `DocumentChatFab.tsx` | 전역 AI 문서 검색 FAB·우측 하단 고정 위젯 |
| `DocumentSearchContextPanel.tsx` | `#/chat` 검색 범위·문서 컬렉션·빠른 질문 |
| `ChatWindowPanel.tsx` | 메시지 목록 + 입력 (문서 검색·리포트 공용) |
| `ReportContextPanel.tsx` | (레거시) 리포트 탭·예시 질문 — 현재 `ChatPage`에서 미사용 |

## mypage/

| 파일 | 기능 |
|------|------|
| `ProfileSummaryCard.tsx` | 담당자·구독·크레딧 |
| `AccountSettingsForm.tsx` | 담당자명·본인확인 질문 |
| `SecuritySettingsForm.tsx` | 비밀번호 변경 UI |
| `CompanySummaryPanel.tsx` | 회사 요약 + 회사 페이지 이동 |

## recruitment/

| 파일 | 기능 |
|------|------|
| `JdSelectionPanel.tsx` | 체크박스 JD 다중 선택 |
| `SelectedJdSummary.tsx` | 선택 JD 요약 |
| `RecruitmentPreviewPanel.tsx` | 생성 공고 미리보기 |

## common/

| 파일 | 기능 |
|------|------|
| `PageTitle.tsx` | eyebrow·제목·설명·액션 |
| `SectionCard.tsx` | 섹션 카드 래퍼 |
| `PageState.tsx` | 로딩·에러·빈 상태 |
| `MetricCard.tsx` | 아이콘·변화율이 있는 지표 카드 |
| `InlineLoading.tsx` | 인라인 스피너 |

## charts/

| 파일 | 기능 |
|------|------|
| `EChart.tsx` | ECharts 공통 래퍼 |
| `DonutChart.tsx` | 적합도 도넛 (대시보드) |
| `chartAdapters.ts` | 차트 시리즈 데이터 변환 |
| `chartTheme.ts` | 라이트/다크 팔레트 |

[`AnalysisSummaryPanel.tsx`](../../src/components/dashboard/AnalysisSummaryPanel.tsx)에서 사용합니다.
