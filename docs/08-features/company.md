# 회사 정보 (`#/company`)

## 화면 역할

회사 프로필·팀 구성·채용 인재상·입력 완성도를 편집·저장합니다.

## 관련 파일

| 파일 | 기능 |
|------|------|
| [`src/pages/CompanyPage.tsx`](../../src/pages/CompanyPage.tsx) | 저장·초기화 액션, 2열 레이아웃 |
| [`src/components/company/CompanyProfileForm.tsx`](../../src/components/company/CompanyProfileForm.tsx) | 회사명, 직원 수, 팀 구성, 소개, 인재상 표시 |
| [`src/components/company/CompanyCompletionPanel.tsx`](../../src/components/company/CompanyCompletionPanel.tsx) | 입력 완성도 표시 |
| [`src/api/backendClient.ts`](../../src/api/backendClient.ts) | `compinfo/get`, `compinfo/modify` 호출 |

## 현재 backend 호출

### 조회 — `POST /api/compinfo/get/`

요청 body는 없습니다.

```json
{}
```

성공 응답:

```json
{
  "error": false,
  "data": {
    "company_name": "테크브릿지",
    "employee_count": 100,
    "team_composition": ["개발팀", "기획/PM팀"],
    "company_description": "회사 소개",
    "employ_style": ["협업이 가능한 인재"]
  }
}
```

`id`, `account_id`가 없으면 프론트는 로컬 기본값으로 보완합니다.

### 수정 — `POST /api/compinfo/modify/`

```json
{
  "company_name": "테크브릿지",
  "employee_count": 100,
  "team_composition": ["개발팀", "기획/PM팀"],
  "company_description": "회사 소개",
  "employ_style": ["협업이 가능한 인재"]
}
```

명세상 출력은 없으므로 프론트는 빈 `200 OK` 또는 `204 No Content`도 성공으로 처리합니다.

## 추가 명세 필요

- 현재 저장 버튼은 Form 상태를 아직 body로 묶지 않고 빈 수정 요청을 보냅니다.
- 수정 성공 응답 body 형식은 [api-spec-addendum.md](../06-api/api-spec-addendum.md)에 제안했습니다.
