# JD 관리 (`#/jd`)

## 화면 역할

JD 목록 선택, 상세 보기, 분석 요청 후 지원서 화면으로 이동합니다.

## 관련 파일

| 파일 | 기능 |
|------|------|
| [`src/pages/JdPage.tsx`](../../src/pages/JdPage.tsx) | 분석 요청, 2열 레이아웃 |
| [`src/components/jd/JdListPanel.tsx`](../../src/components/jd/JdListPanel.tsx) | 목록·선택 |
| [`src/components/jd/JdEditorPanel.tsx`](../../src/components/jd/JdEditorPanel.tsx) | JD 필드 표시 |
| [`src/api/backendClient.ts`](../../src/api/backendClient.ts) | `jd/get`, `resume/analize` 임시 매핑 |

## 현재 backend 호출

### JD 목록 — `POST /api/jd/get/`

```json
{}
```

성공 응답:

```json
{
  "error": false,
  "data": [
    {
      "id": 1,
      "job_name": "프론트엔드 개발자 채용",
      "education_level": "대졸 이상",
      "major": "컴퓨터 공학",
      "career_level": "경력 3년 이상",
      "required_skill": ["HTML", "CSS", "JavaScript"],
      "preferred_skill": ["React", "Vite"],
      "main_task": "프론트엔드 개발",
      "hiring_reason": "인력 충원",
      "work_type": "정규직",
      "status": "on_going"
    }
  ]
}
```

### 분석 요청 — `POST /api/resume/analize/`

backend 명세에는 JD 단위 분석 endpoint가 없어, 프론트는 선택 JD의 첫 지원서를 찾아 지원서 분석 endpoint를 호출합니다.

```json
{
  "id": 1
}
```

성공 후 프론트는 `#/cover-letter`로 이동합니다.

## 추가 명세 필요

- JD 단위로 모든 지원서를 분석하는 `jd/analize` 계열 endpoint
- JD 생성/수정/삭제의 정확한 입력·응답 형식

상세 제안: [api-spec-addendum.md](../06-api/api-spec-addendum.md).
