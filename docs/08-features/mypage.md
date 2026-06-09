# 마이페이지 (`#/mypage`)

## 화면 역할

담당자 프로필, 계정 설정, 보안 UI, 회사 요약·크레딧을 표시합니다.

## 관련 파일

| 파일 | 기능 |
|------|------|
| [`src/pages/MyPage.tsx`](../../src/pages/MyPage.tsx) | 프로필 저장 |
| [`src/components/mypage/ProfileSummaryCard.tsx`](../../src/components/mypage/ProfileSummaryCard.tsx) | 담당자·크레딧 |
| [`src/components/mypage/AccountSettingsForm.tsx`](../../src/components/mypage/AccountSettingsForm.tsx) | 이름·본인확인 질문 표시 |
| [`src/components/mypage/SecuritySettingsForm.tsx`](../../src/components/mypage/SecuritySettingsForm.tsx) | 비밀번호 UI |
| [`src/components/mypage/CompanySummaryPanel.tsx`](../../src/components/mypage/CompanySummaryPanel.tsx) | 회사 요약 |
| [`src/api/backendClient.ts`](../../src/api/backendClient.ts) | `account/get`, `account/modify` 호출 |

## 현재 backend 호출

### 계정 조회 — `POST /api/account/get/`

```json
{}
```

성공 응답:

```json
{
  "error": false,
  "data": {
    "name": "administrator",
    "verification_question": "좋아하는 색깔은?",
    "verification_answer": "파랑",
    "credit": 150,
    "subscribe": true,
    "subscribe_expiration": "2026-12-31T23:59:59+09:00"
  }
}
```

backend 명세상 `username`, `id`는 내려오지 않으므로 프론트는 로컬 기본값으로 보완합니다.

### 계정 수정 — `POST /api/account/modify/`

일반 수정:

```json
{
  "name": "administrator",
  "verification_question": "좋아하는 색깔은?",
  "verification_answer": "파랑"
}
```

비밀번호 변경:

```json
{
  "formal_password": "1234",
  "password": "5678"
}
```

명세상 출력은 없으므로 프론트는 빈 `200 OK` 또는 `204 No Content`도 성공으로 처리합니다.

## 추가 명세 필요

- 로그인 전 비밀번호 재설정은 `account/modify`와 별도 endpoint가 필요합니다.
- 현재 저장 버튼은 Form 상태를 아직 body로 묶지 않고 빈 수정 요청을 보냅니다.
