# 인증 (`#/login`, `#/signup`, `#/password-reset`)

## 화면 역할

로그인, 회원가입, 비밀번호 재설정 UI입니다. 인증 화면은 `AppShell` 없이 [`AuthScreen`](../../src/components/layout/AuthScreen.tsx)을 사용합니다.

현재 기본 실행은 mock API 모드이므로 인증 action은 네트워크 요청 없이 성공 응답을 반환합니다. 로그인 성공 시 `reload()` 후 `#/dashboard`로 이동해 실제 페이지 라우팅을 확인할 수 있습니다.

## 관련 파일

| 파일 | 기능 |
|------|------|
| [`src/pages/AuthPages.tsx`](../../src/pages/AuthPages.tsx) | `LoginPage`, `SignupPage`, `PasswordResetPage` |
| [`src/components/layout/AuthScreen.tsx`](../../src/components/layout/AuthScreen.tsx) | 인증 화면 레이아웃 |
| [`src/api/backendClient.ts`](../../src/api/backendClient.ts) | mock 인증 응답, real API 모드의 axios `login`/`signin` |
| [`src/App.tsx`](../../src/App.tsx) | `renderAuthPage`, 로그인 성공 후 dashboard 이동 |

## mock 모드

기본값:

```text
VITE_USE_MOCK_API=true
```

또는 환경 변수를 설정하지 않은 상태입니다.

동작:

- `apiClient.login` → `{ authenticated: true }`
- `apiClient.completeSignup` → `{ created: true }`
- `apiClient.resetPassword` → `{ reset: true }`
- backend 서버가 없어도 `#/login` → `#/dashboard` 흐름 확인 가능

## real API 모드

PowerShell:

```powershell
$env:VITE_USE_MOCK_API='false'
npm.cmd run dev
```

real API 모드에서 [`backendClient.ts`](../../src/api/backendClient.ts)는 axios로 다음을 호출합니다.

### CSRF — `GET /api/csrf/`

POST 요청 전 쿠키의 `csrftoken`을 확인하고, 없으면 먼저 호출합니다.

### 로그인 — `POST /api/login/`

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

### 회원가입 — `POST /api/signin/`

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

## 추가 명세 필요

- username 중복 확인 endpoint
- 비밀번호 재설정 endpoint
- 인증 화면 기본값 API가 필요하다면 별도 endpoint

제안 형식: [api-spec-addendum.md](../06-api/api-spec-addendum.md)
