# API 공통 응답 형식

백엔드 연동은 Django 명세의 `{ error, data, message }` 구조를 사용합니다. 프론트 내부에서는 액션 토스트와 어댑터 호환을 위해 [`src/data/apiMockData.ts`](../../src/data/apiMockData.ts)의 `ApiResponse<T>` 형태로 한 번 감쌉니다.

## 백엔드 응답 래퍼

데이터 조회 성공:

```json
{
  "error": false,
  "data": {}
}
```

에러:

```json
{
  "error": true,
  "message": "에러 메시지"
}
```

## 프론트 내부 래퍼

```json
{
  "status_code": 200,
  "message": "사람이 읽는 결과 메시지",
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
| `status_code` | HTTP와 별도 비즈니스 코드(목업은 200 위주). 4xx/5xx 시 프론트는 Alert `error` |
| `message` | 토스트/Alert 문구 |
| `data` | 실제 payload (snake_case) |
| `meta` | 선택. 페이지네이션·요청 시각 |

## 상태 코드 enum (`status_code` in data rows)

지원자·JD·자소서 행 등에 쓰이는 `StatusCode` ([`apiMockData.ts`](../../src/data/apiMockData.ts)):

`prepare`, `on_going`, `closed`, `onqueue`, `processing`, `done`, `reviewed`, `needs_review`, `grade_a`, `grade_b`, `grade_c`, `grade_d`, `grade_f`, `normal`

UI는 [`src/utils/statusTag.tsx`](../../src/utils/statusTag.tsx)에서 `status_code` → Ant Design Tag 색으로 매핑합니다.

## Django 권장 사항

1. **JSON 필드는 snake_case** — `adapters.ts`가 camelCase로 변환합니다.
2. **CSRF 쿠키 기반 인증** — `backendClient.ts`가 `/api/csrf/` 호출 후 `X-CSRFToken`을 붙입니다.
3. **빈 성공 응답** — `modify` 계열이 body 없이 성공할 수 있어 프론트는 빈 2xx 응답도 성공으로 처리합니다.

## 어댑터

[`src/api/adapters.ts`](../../src/api/adapters.ts): 예) `job_name` → `title`, `overall_grade` → 화면용 점수.

Django가 snake_case를 유지하면 프론트 매핑 레이어를 그대로 사용할 수 있습니다.
