# API 레퍼런스

프론트엔드는 [`src/api/backendClient.ts`](../../src/api/backendClient.ts)의 `apiClient`를 통해 데이터를 가져오고 액션을 실행합니다. 페이지 컴포넌트는 axios를 직접 호출하지 않고 `apiClient.*` 메서드만 사용합니다.

## 실행 모드

| 모드 | 조건 | 동작 |
|------|------|------|
| mock API | 기본값 또는 `VITE_USE_MOCK_API=true` | 로컬 mock 데이터와 성공 응답 사용 |
| real API | `VITE_USE_MOCK_API=false` | axios client로 `/api/{endpoint}/` 호출 |

## axios 공통 설정

```ts
const httpClient = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

CSRF 처리:

1. POST 요청 전 request interceptor 실행
2. 쿠키에서 `csrftoken` 확인
3. 토큰이 없으면 `GET /api/csrf/` 호출
4. `X-CSRFToken` 헤더 추가

backend 관점에서 요청 모양은 기존 fetch 방식과 동일합니다. 달라지는 것은 frontend 내부 구현뿐입니다.

## 응답 계약

- 성공: `{ "error": false, "data": ... }`
- 실패: `{ "error": true, "message": "..." }`

`backendClient.ts`는 이 응답을 UI 내부 `ApiResponse<T>`로 감쌉니다.

```ts
type ApiResponse<T> = {
  status_code: number;
  message: string;
  data: T;
  meta?: {
    requested_at: string;
  };
};
```

자세한 envelope 설명: [api-envelope.md](../02-architecture/api-envelope.md)

## client method 매핑

| `apiClient` 메서드 | real API endpoint | mock 모드 |
|--------------------|-------------------|-----------|
| `getDashboard` | `account/get`, `compinfo/get`, `jd/get`, `resume/get`, `report/get`, `question/get` 조합 | `apiMockData.ts`의 dashboard source |
| `getCompanyProfile` | `compinfo/get` | `companyApiResponse.data` |
| `getJobDescriptions` | `jd/get` | `jobDescriptionsApiResponse.data` |
| `getCoverLetterDraft` | dashboard source의 첫 resume | mock resume |
| `getCoverLetters` | dashboard source의 resumes | mock resumes |
| `getAnalysisReport` | dashboard source의 첫 report | mock report |
| `getRecruitmentPreview` | dashboard source에서 프론트 조합 | mock company/JD 조합 |
| `getCoverLetterTemplate` | dashboard source의 questions | mock questions |
| `getUserProfile` | `account/get` | `authDefaultsApiResponse.data` |
| `getAuthDefaults` | 로컬 기본값 | 로컬 기본값 |
| `login` | `login` | 성공 응답 |
| `logout` | `logout` | 성공 응답 |
| `completeSignup` | `signin` | 성공 응답 |
| `resetPassword` | 추가 명세 필요 | 성공 응답 |
| `saveCompanyProfile` | `compinfo/modify` | 성공 응답 |
| `saveUserProfile` | `account/modify` | 성공 응답 |
| `requestJobAnalysis` | `resume/analize` | 성공 응답 |
| `requestCoverLetterAnalysis` | `resume/analize` | 성공 응답 |
| `uploadCoverLetters` | 추가 명세 필요 | mock resume count |
| `sendChatMessage` | 추가 명세 필요 | 로컬 안내 응답 |
| `generateRecruitmentPost` | 추가 명세 필요 | 성공 응답 |
| `downloadRecruitmentPdf` | 추가 명세 필요 | 성공 응답 |
| `generateCoverLetterTemplate` | 추가 명세 필요 | 성공 응답 |
| `downloadTemplateDocument` | 추가 명세 필요 | 성공 응답 |

## 인증 endpoint

### `GET /api/csrf/`

쿠키 기반 세션 인증에서 POST 요청 전 CSRF 쿠키를 발급받습니다.

### `POST /api/login/`

요청:

```json
{
  "username": "admin",
  "password": "1234"
}
```

성공 응답 예:

```json
{
  "error": false,
  "login": true
}
```

### `POST /api/signin/`

요청:

```json
{
  "username": "admin",
  "password": "1234",
  "name": "administrator",
  "verification_question": "좋아하는 색깔은?",
  "verification_answer": "파랑"
}
```

성공 응답 예:

```json
{
  "error": false,
  "signin": true
}
```

## 화면용 파생 데이터

프론트엔드는 DB/API에 없는 표시용 필드를 [`src/api/adapters.ts`](../../src/api/adapters.ts)에서만 계산합니다.

- dashboard 지표: `Account.credit`, `JobDescription.status`, `Resume.status/reviewed`, `AnalysisReport.overall_grade`
- JD 평균 점수: 해당 JD와 연결된 resume/report 기준
- 지원서 상태 라벨: `Resume.status`, `Resume.reviewed`
- 리포트 탭: `AnalysisReport` 컬럼을 화면 탭으로 묶음
- 면접 질문 템플릿: `InterviewQuestion.question`, `InterviewQuestion.purpose`

추가 API 제안: [api-spec-addendum.md](./api-spec-addendum.md)  
DB/API 컬럼 차이: [db-column-gap-notes.md](./db-column-gap-notes.md)
