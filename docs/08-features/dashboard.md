# 대시보드 (`#/dashboard`)

## 화면 역할

채용 공고·지원자·AI 분석·크레딧·할 일을 한 화면에 요약합니다.

## 관련 파일

| 파일 | 기능 |
|------|------|
| [`src/pages/DashboardPage.tsx`](../../src/pages/DashboardPage.tsx) | 레이아웃 조합 |
| [`src/components/dashboard/DashboardHero.tsx`](../../src/components/dashboard/DashboardHero.tsx) | 요약 통계, 주요 액션, 크레딧 |
| [`src/components/dashboard/DashboardMetrics.tsx`](../../src/components/dashboard/DashboardMetrics.tsx) | 4개 지표 |
| [`src/components/dashboard/ApplicantReviewTable.tsx`](../../src/components/dashboard/ApplicantReviewTable.tsx) | 지원자 테이블 |
| [`src/components/dashboard/AnalysisSummaryPanel.tsx`](../../src/components/dashboard/AnalysisSummaryPanel.tsx) | 적합도 차트·인사이트 |
| [`src/hooks/useMockAppData.ts`](../../src/hooks/useMockAppData.ts) | API 응답을 화면 데이터로 정규화 |
| [`src/api/adapters.ts`](../../src/api/adapters.ts) | DB/API 컬럼에서 화면 지표 계산 |

## 현재 backend 호출

대시보드 전용 endpoint가 없어 [`backendClient.getDashboard`](../../src/api/backendClient.ts)가 여러 endpoint를 조합합니다.

| 목적 | endpoint |
|------|----------|
| 계정·크레딧 | `POST /api/account/get/` |
| 회사 정보 | `POST /api/compinfo/get/` |
| JD 목록 | `POST /api/jd/get/` |
| JD별 지원서 | `POST /api/resume/get/` with `{ "job_description_id": 1 }` |
| 지원서별 리포트 | `POST /api/report/get/` with `{ "resume_id": 1 }` |
| 지원서별 질문 | `POST /api/question/get/` with `{ "resume_id": 1 }` |

## 화면 파생값

- `Account.credit` → 크레딧 percent
- `JobDescription.status` → 진행 중 JD 수
- `Resume.status`, `Resume.reviewed` → 지원서 상태 라벨
- `AnalysisReport.overall_grade` → 점수·도넛 차트·평균 적합도

## 추가 명세 필요

데이터가 늘면 호출 수가 많아지므로 `POST /api/dashboard/get/` 같은 집계 endpoint가 있으면 좋습니다. 제안 형식은 [api-spec-addendum.md](../06-api/api-spec-addendum.md)에 있습니다.
