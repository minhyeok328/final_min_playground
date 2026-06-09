# 인증 (`#/login`, `#/signup`, `#/password-reset`)

## 화면 역할

로그인, 회원가입, 3단계 비밀번호 재설정 UI입니다. 인증 화면은 `AppShell` 없이 [`AuthScreen`](../../src/components/layout/AuthScreen.tsx)만 사용합니다.

## 관련 파일

| 파일 | 기능 |
|------|------|
| [`src/pages/AuthPages.tsx`](../../src/pages/AuthPages.tsx) | `LoginPage`, `SignupPage`, `PasswordResetPage` |
| [`src/api/backendClient.ts`](../../src/api/backendClient.ts) | `login`, `signin`, 로컬 fallback 응답 |
| [`src/components/layout/AuthScreen.tsx`](../../src/components/layout/AuthScreen.tsx) | 브랜딩·카드 레이아웃 |
| [`src/App.tsx`](../../src/App.tsx) | `renderAuthPage`, 로그인 성공 후 `reload()` + dashboard 이동 |

## 현재 backend 호출

### CSRF — `GET /api/csrf/`

`backendClient`는 POST 전 쿠키의 `csrftoken`을 확인하고, 없으면 이 endpoint를 먼저 호출합니다.

### 로그인 — `POST /api/login/`

```json
{
  "username": "admin",
  "password": "1234"
}
```

성공 응답:

```json
{
  "error": false,
  "login": true
}
```

성공 후 프론트는 데이터를 다시 불러온 뒤 `#/dashboard`로 이동합니다.

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

성공 응답:

```json
{
  "error": false,
  "signin": true
}
```

## 추가 명세 필요

- username 중복 확인 endpoint
- 로그인 전 비밀번호 재설정 endpoint
- 로그인 화면 기본값 API는 없으므로 현재는 로컬 샘플을 사용

상세 제안: [api-spec-addendum.md](../06-api/api-spec-addendum.md).
