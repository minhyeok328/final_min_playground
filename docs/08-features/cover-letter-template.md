# 면접 질문/자소서 포맷 (`#/cover-letter-template`)

## 화면 역할

선택 JD를 요약으로 보여 주고, 지원서 분석 결과에서 생성된 면접 질문/목적을 문서화하는 화면입니다.

## 관련 파일

| 파일 | 기능 |
|------|------|
| [`src/pages/CoverLetterTemplatePage.tsx`](../../src/pages/CoverLetterTemplatePage.tsx) | JD 요약·질문 List·생성/다운로드 |
| [`src/App.tsx`](../../src/App.tsx) | `selectedJd`, `templateGenerated` |
| [`src/api/backendClient.ts`](../../src/api/backendClient.ts) | `question/get` 조회, 생성/다운로드는 로컬 성공 응답 |
| [`src/api/adapters.ts`](../../src/api/adapters.ts) | `InterviewQuestion` → 화면 질문 변환 |

## 현재 backend 호출

질문 목록은 지원서별로 조회합니다.

```text
POST /api/question/get/
```

```json
{
  "resume_id": 1
}
```

성공 응답:

```json
{
  "error": false,
  "data": [
    {
      "id": 1,
      "resume_id": 1,
      "question": "기술 선택의 근거를 설명해 주세요.",
      "answer": "기대 답변",
      "purpose": "문제 해결 방식 확인"
    }
  ]
}
```

## 추가 명세 필요

질문 문서 생성 및 다운로드 endpoint는 backend 명세에 없습니다. 현재 생성/다운로드 버튼은 로컬 성공 응답만 표시합니다.

필요하면 다음 형식의 API가 필요합니다.

```text
POST /api/question-document/generate/
```

```json
{
  "job_description_id": 1,
  "resume_ids": [1, 2]
}
```

다운로드는 파일 URL 또는 바이너리 응답 형식으로 별도 명세가 필요합니다.
