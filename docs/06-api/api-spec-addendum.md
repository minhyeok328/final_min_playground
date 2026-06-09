# API 명세 추가본

현재 프론트가 필요로 하지만 붙여준 백엔드 명세에 없거나 모호한 항목입니다.

## 1. 성공 응답 body가 없는 modify 계열

명세의 `account/modify`, `compinfo/modify`는 “출력 없음”으로 되어 있습니다.

프론트는 현재 `204 No Content` 또는 비어 있는 `200 OK`를 성공으로 처리합니다. 다만 UI 토스트와 후속 갱신을 안정적으로 하려면 아래 중 하나로 통일하는 편이 좋습니다.

```json
{
  "error": false,
  "data": {
    "updated_at": "2026-06-09T12:00:00+09:00"
  }
}
```

또는 정말 body가 없다면 HTTP status는 `204 No Content` 권장입니다.

## 2. 대시보드 집계 API

현재 대시보드는 프론트가 다음 API를 여러 번 호출해 조합합니다.

- `account/get`
- `compinfo/get`
- `jd/get`
- `resume/get`
- `report/get`
- `question/get`

데이터가 늘어나면 호출 수가 많아지므로, 대시보드 전용 집계 API가 있으면 좋습니다.

제안:

```text
POST /api/dashboard/get/
```

```json
{
  "error": false,
  "data": {
    "account": {},
    "company_info": {},
    "job_descriptions": [],
    "resumes": [],
    "analysis_reports": [],
    "interview_questions": []
  }
}
```

## 3. 전체 지원서 조회

`resume/get`은 `job_description_id` 또는 `id`가 필요합니다. 현재 프론트는 전체 지원서 목록을 만들기 위해 모든 JD를 조회한 뒤 JD별로 `resume/get`을 반복 호출합니다.

제안:

```json
{}
```

빈 body일 때 로그인 계정의 전체 지원서를 반환하거나, 별도 엔드포인트를 추가합니다.

```text
POST /api/resume/list/
```

## 4. `resume/add` 입력의 `job_description_id`

`resume/add` 출력에는 `job_description_id`가 있지만 입력 형식에는 빠져 있습니다. 지원서를 특정 JD에 연결하려면 입력에도 필요합니다.

제안:

```json
{
  "job_description_id": 1,
  "name": "홍길동",
  "skill": ["HTML", "CSS", "JS"]
}
```

## 5. JD 단위 분석 요청

현재 명세에는 `resume/analize`만 있고 JD 단위 분석 요청 API는 없습니다.

프론트의 JD 관리 화면은 선택한 JD의 첫 지원서를 찾아 `resume/analize`를 호출하도록 임시 매핑했습니다. JD 단위로 해당 JD의 모든 지원서를 분석하려면 별도 API가 필요합니다.

제안:

```text
POST /api/jd/analize/
```

```json
{
  "id": 1
}
```

응답:

```json
{
  "error": false,
  "data": {
    "job_description_id": 1,
    "requested_resume": [1, 2, 3]
  }
}
```

## 6. 리포트/질문 조회 응답 예시

명세의 `report/get`, `question/get`은 입력만 있고 출력 예시가 생략되어 있습니다.

프론트 기대값:

```json
{
  "error": false,
  "data": {
    "id": 1,
    "resume_id": 1,
    "overall_grade": "B",
    "overall_summary": "...",
    "candidate_summary": "...",
    "checklist": [],
    "competency_analysis": [],
    "fit_analysis": [],
    "strength": [],
    "concern": [],
    "check_point": [],
    "final_comment": "..."
  }
}
```

```json
{
  "error": false,
  "data": [
    {
      "id": 1,
      "resume_id": 1,
      "question": "...",
      "answer": "...",
      "purpose": "..."
    }
  ]
}
```

## 7. 회원가입 전 username 중복 확인

프론트에는 “중복 확인” 버튼이 있지만 명세에는 별도 API가 없습니다. 현재는 안내성 성공 응답만 표시합니다.

제안:

```text
POST /api/account/check-username/
```

```json
{
  "username": "admin"
}
```

```json
{
  "error": false,
  "data": {
    "available": true
  }
}
```

## 8. 비밀번호 재설정

로그인 전 비밀번호 재설정 화면이 있지만, 명세에는 해당 API가 없습니다. `account/modify`는 로그인 후 기존 비밀번호 변경에 가깝습니다.

제안:

```text
POST /api/password-reset/
```

```json
{
  "username": "admin",
  "verification_question": "좋아하는 색깔은?",
  "verification_answer": "파랑",
  "password": "5678"
}
```

## 9. 채팅/문서 검색

현재 AI 문서 검색 UI는 프론트 로컬 응답입니다. 백엔드 연동을 위해 아래 API가 필요합니다.

```text
POST /api/chat/
```

```json
{
  "question": "이 지원자의 리스크 알려줘",
  "resume_id": 1
}
```

```json
{
  "error": false,
  "data": {
    "role": "assistant",
    "text": "..."
  }
}
```

## 10. 모집 공고/질문 문서 생성 및 다운로드

다음 UI 기능은 백엔드 명세가 없어 프론트에서 로컬 성공 응답만 반환합니다.

- 모집 공고 생성
- 모집 공고 PDF 다운로드
- 면접 질문/자소서 포맷 생성
- 문서 다운로드

필요하면 파일 생성 API와 다운로드 URL 응답 형식을 추가해야 합니다.
