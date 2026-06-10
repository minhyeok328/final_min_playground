# API 공통 응답 형식

backend 연동은 Django 명세의 `{ error, data, message }` 구조를 기준으로 합니다. 프론트엔드 내부에서는 화면 상태와 알림 처리를 일정하게 유지하기 위해 [`src/data/apiMockData.ts`](../../src/data/apiMockData.ts)의 `ApiResponse<T>` 형태로 한 번 감쌉니다.

## backend 응답

조회 성공:

```json
{
  "error": false,
  "data": {}
}
```

오류:

```json
{
  "error": true,
  "message": "오류 메시지"
}
```

## 프론트엔드 내부 응답

```json
{
  "status_code": 200,
  "message": "사용자가 읽는 결과 메시지",
  "data": {},
  "meta": {
    "page": 1,
    "page_size": 20,
    "total_count": 3,
    "requested_at": "2026-06-03T09:00:00+09:00"
  }
}
```

| 필드 | 설명 |
|------|------|
| `status_code` | UI 내부 상태 코드. mock 응답은 대부분 200 |
| `message` | Ant Design Alert에 표시되는 문구 |
| `data` | 실제 payload |
| `meta` | 선택값. 요청 시각, 페이지 정보 등 |

## axios 처리 규칙

[`src/api/backendClient.ts`](../../src/api/backendClient.ts)는 다음을 공통 처리합니다.

1. `axios.create({ baseURL: '/api', withCredentials: true })`로 client 생성
2. POST 요청 전 쿠키의 `csrftoken` 확인
3. 토큰이 없으면 `GET /api/csrf/` 호출
4. `X-CSRFToken` 헤더 추가
5. axios 응답과 backend envelope를 `ApiResponse<T>`로 변환
6. axios error 또는 `error: true` 응답은 `Error.message`로 정규화

## 상태 코드 enum

지원자, JD, 자소서 행 상태에 쓰는 `StatusCode`는 [`src/data/apiMockData.ts`](../../src/data/apiMockData.ts)에 정의되어 있습니다.

`prepare`, `on_going`, `closed`, `onqueue`, `processing`, `done`, `reviewed`, `needs_review`, `grade_a`, `grade_b`, `grade_c`, `grade_d`, `grade_f`, `normal`

UI 표시 변환은 [`src/utils/statusTag.tsx`](../../src/utils/statusTag.tsx)가 담당합니다.

## 데이터 변환

[`src/api/adapters.ts`](../../src/api/adapters.ts)는 backend snake_case 필드를 UI 모델에 맞게 변환합니다.

예:

- `job_name` → `title`
- `overall_grade` → 화면용 점수
- `company_info` → 회사 프로필 카드 데이터
