# 지원서 (`#/cover-letter`)

## 화면 역할

JD별 지원자 정보와 자기소개 문항/답변을 확인하고, 선택 JD의 지원서 분석을 요청합니다.

## 관련 파일

| 파일 | 기능 |
|------|------|
| [`src/pages/CoverLetterPage.tsx`](../../src/pages/CoverLetterPage.tsx) | 분석 요청 버튼, JD 선택 상태 |
| [`src/components/cover-letter/CoverLetterInputPanel.tsx`](../../src/components/cover-letter/CoverLetterInputPanel.tsx) | JD Select, 지원자명, 자기소개 |
| [`src/components/cover-letter/CoverLetterUploadPanel.tsx`](../../src/components/cover-letter/CoverLetterUploadPanel.tsx) | 지원서 목록 미리보기 |
| [`src/api/backendClient.ts`](../../src/api/backendClient.ts) | `resume/get`, `resume/analize` 호출 |

## 현재 backend 호출

### JD별 지원서 조회 — `POST /api/resume/get/`

```json
{
  "job_description_id": 1
}
```

또는 단건 조회:

```json
{
  "id": 1
}
```

성공 응답:

```json
{
  "error": false,
  "data": [
    {
      "id": 1,
      "job_description_id": 1,
      "name": "홍길동",
      "skill": ["HTML", "CSS", "JS"],
      "self_intoduction": [
        {
          "question": "지원 동기",
          "answer": "답변"
        }
      ],
      "status": "done",
      "reviewed": false
    }
  ]
}
```

`self_intoduction`은 현재 DB/명세 오탈자 그대로 사용합니다.

### 분석 요청 — `POST /api/resume/analize/`

```json
{
  "id": 1
}
```

명세상 아직 미구현으로 표시되어 있어, backend 구현 전에는 실패할 수 있습니다.

## 추가 명세 필요

- 전체 지원서 목록 조회 API
- 파일 업로드 API
- `resume/add` 입력의 `job_description_id`
- `resume/analize` 성공 응답 형식

상세 제안: [api-spec-addendum.md](../06-api/api-spec-addendum.md).
