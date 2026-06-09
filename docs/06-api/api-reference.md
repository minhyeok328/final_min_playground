# API 레퍼런스

프론트는 백엔드 명세의 Django 엔드포인트를 [`src/api/backendClient.ts`](../../src/api/backendClient.ts)에서 호출합니다.

기본 규칙:

- API prefix: `/api/`
- CSRF 발급: `GET /api/csrf/`
- 인증: 브라우저 쿠키 기반, 모든 API 호출에 `credentials: "include"` 사용
- JSON POST 호출: `Content-Type: application/json`, `X-CSRFToken` 헤더 포함
- 데이터 응답: `{ "error": false, "data": ... }`
- 에러 응답: `{ "error": true, "message": "..." }`

공통 응답 처리: [api-envelope.md](../02-architecture/api-envelope.md).

## 클라이언트 메서드 매핑

| 프론트 메서드 | 실제 호출 엔드포인트 | 비고 |
|---------------|----------------------|------|
| `getDashboard` | `account/get`, `compinfo/get`, `jd/get`, `resume/get`, `report/get`, `question/get` 조합 | 대시보드 전용 API가 없어 프론트에서 집계 |
| `getCompanyProfile` | `compinfo/get` | 로그인 계정의 회사 정보 |
| `getJobDescriptions` | `jd/get` | 로그인 계정의 JD 목록 |
| `getCoverLetterDraft` | `jd/get` → `resume/get` | 첫 지원서를 입력 초안으로 사용 |
| `getCoverLetters` | `jd/get` → `resume/get` | 전체 JD의 지원서 목록을 합침 |
| `getAnalysisReport` | `report/get` | 첫 지원서 리포트를 현재 리포트로 사용 |
| `getCoverLetterTemplate` | `question/get` | 면접 질문 목록 |
| `getUserProfile` | `account/get` | 백엔드 응답에 없는 `username` 등은 로컬 기본값으로 보완 |
| `getAuthDefaults` | 로컬 기본값 | 백엔드 명세에 기본값 API 없음 |
| `login` | `login` | `username`, `password` 전송 |
| `completeSignup` | `signin` | 회원가입 필드 전송 |
| `logout` | `logout` | 현재 UI에는 직접 연결 전 |
| `saveCompanyProfile` | `compinfo/modify` | 현재 저장 버튼은 빈 수정 body 전송 |
| `saveUserProfile` | `account/modify` | 현재 저장 버튼은 빈 수정 body 전송 |
| `requestJobAnalysis` | `resume/analize` | JD에 연결된 첫 지원서를 분석 요청 |
| `requestCoverLetterAnalysis` | `resume/analize` | 선택 JD의 첫 지원서를 분석 요청 |
| `uploadCoverLetters` | `jd/get` → `resume/get` | 업로드 전용 명세가 없어 목록 재조회로 대체 |

## 인증/CSRF

[`backendClient.ts`](../../src/api/backendClient.ts)는 다음 흐름을 공통 처리합니다.

1. 쿠키에서 `csrftoken` 확인
2. 없으면 `GET /api/csrf/` 호출
3. POST 요청에 `X-CSRFToken` 헤더 추가
4. 모든 요청에 `credentials: "include"` 추가

## 화면용 파생 데이터

프론트는 DB/API에 없는 표시용 필드를 [`src/api/adapters.ts`](../../src/api/adapters.ts)에서만 계산합니다.

- 대시보드 지표: `Account.credit`, `JobDescription.status`, `Resume.status/reviewed`, `AnalysisReport.overall_grade`
- JD 평균 점수: 해당 JD에 연결된 `Resume`의 `AnalysisReport.overall_grade` 평균
- 지원서 상태 라벨: `Resume.status`, `Resume.reviewed`
- 리포트 탭: `AnalysisReport` 컬럼들을 화면 탭으로 묶음
- 면접 질문/템플릿: `InterviewQuestion.question`, `InterviewQuestion.purpose`

컬럼 부족/파생값 상세: [db-column-gap-notes.md](./db-column-gap-notes.md).
추가 API 명세 필요 항목: [api-spec-addendum.md](./api-spec-addendum.md).
