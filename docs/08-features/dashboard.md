# 대시보드 (`#/dashboard`)

## 화면 역할

채용 공고·지원자·AI 분석·크레딧·할 일을 한 화면에 요약합니다. UI 고도화의 **쇼케이스 화면**으로, 히어로 패널과 지표·테이블·차트가 동일 디자인 언어를 공유합니다.

## 관련 파일

| 파일 | 기능 |
|------|------|
| [`src/pages/DashboardPage.tsx`](../../src/pages/DashboardPage.tsx) | 레이아웃 조합 |
| [`src/components/dashboard/DashboardHero.tsx`](../../src/components/dashboard/DashboardHero.tsx) | 히어로: 요약 통계, 주요 액션, 크레딧·파이프라인 레일 |
| [`src/components/dashboard/DashboardMetrics.tsx`](../../src/components/dashboard/DashboardMetrics.tsx) | 4개 지표 (`MetricCard`) |
| [`src/components/dashboard/ApplicantReviewTable.tsx`](../../src/components/dashboard/ApplicantReviewTable.tsx) | 지원자 테이블 |
| [`src/components/dashboard/AnalysisSummaryPanel.tsx`](../../src/components/dashboard/AnalysisSummaryPanel.tsx) | 적합도 차트·인사이트 |
| [`src/components/dashboard/TaskListPanel.tsx`](../../src/components/dashboard/TaskListPanel.tsx) | 할 일 리스트 |
| [`src/hooks/useMockAppData.ts`](../../src/hooks/useMockAppData.ts) | `getDashboard` 호출 |
| [`src/data/apiMockData.ts`](../../src/data/apiMockData.ts) | `dashboardApiResponse` |
| [`src/styles.css`](../../src/styles.css) | `.dashboard-hero`, `.metric-card`, `.task-item` 등 |

`AppShell`의 크레딧·알림도 동일 훅에서 로드한 `dashboard.creditPercent`, `notifications`를 사용합니다.

## Django API

### `GET /api/v1/dashboard/` (제안)

**응답 `data`** (`dashboardApiResponse.data`):

```json
{
  "metrics": [
    {
      "metric_key": "active_jobs",
      "label": "진행 중 공고",
      "value": 3,
      "suffix": "건",
      "delta_label": "+1 이번 주"
    }
  ],
  "applicants": [
    {
      "id": "app-001",
      "applicant_name": "김서연",
      "job_title": "Frontend Engineer",
      "fit_score": 92,
      "review_stage": "1차 검토",
      "status_code": "interview_recommended",
      "status_label": "면접 추천"
    }
  ],
  "insights": [
    {
      "insight_key": "frontend_jd",
      "title": "Frontend JD",
      "detail": "...",
      "tone": "primary"
    }
  ],
  "analysis_summary": {
    "chart_type": "donut",
    "center_value": 86,
    "center_label": "평균 적합도",
    "segments": [
      { "label": "적합", "value": 86, "color_key": "primary" }
    ]
  },
  "tasks": [
    { "id": "task-001", "title": "JD 분석 요청 2건 승인", "priority": "high" }
  ]
}
```

`tone`: `primary` | `accent` | `warning`  
`priority`: `high` | `medium` | `low`  
`metric_key` 예: `active_jobs`, `new_applicants`, `reports`, `credits` (크레딧 %는 헤더에도 사용)

### 새로고침

`DashboardHero`의 새로고침은 `useMockAppData.reload()` → 위 GET을 다시 호출합니다. Django에서는 동일 엔드포인트 재요청.

### 쓰기 API

이 페이지 전용 mutation 없음. 「새 채용 공고」는 `#/jd`로만 이동합니다.

## 어댑터

[`mapDashboard`](../../src/api/adapters.ts): `delta_label` → `change`, `applicant_name` → `name` 등.

## 관련 문서

- [design-system-upgrade-design.md](../superpowers/specs/2026-06-04-design-system-upgrade-design.md) — 대시보드·히어로 디자인 스펙
