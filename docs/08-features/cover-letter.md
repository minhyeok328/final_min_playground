# 자기소개서 (`#/cover-letter`)

## 화면 역할

JD별 **단건 입력** UI와 **Excel 업로드** 미리보기, **분석 요청** 플로우입니다.

## 관련 파일

| 파일 | 기능 |
|------|------|
| [`src/pages/CoverLetterPage.tsx`](../../src/pages/CoverLetterPage.tsx) | 분석 요청 버튼, JD 선택 상태 |
| [`src/components/cover-letter/CoverLetterInputPanel.tsx`](../../src/components/cover-letter/CoverLetterInputPanel.tsx) | JD Select, 지원자명, 본문 |
| [`src/components/cover-letter/CoverLetterUploadPanel.tsx`](../../src/components/cover-letter/CoverLetterUploadPanel.tsx) | Dragger 업로드, 테이블, 채팅 이동 |
| [`src/App.tsx`](../../src/App.tsx) | `coverUploaded`, `analysisDone` 플래그 |
| [`src/data/apiMockData.ts`](../../src/data/apiMockData.ts) | `coverLetterDraftApiResponse`, `coverLettersApiResponse` |

## Django API

### `GET /api/v1/cover-letters/draft/`

단건 입력 폼 초기값.

**응답 `data`**:

```json
{
  "applicant_name": "김서연",
  "body": "프로덕트의 복잡한 입력 흐름을...",
  "sample_file_name": "cover_letters_sample.xlsx",
  "upload_hint": "파일 선택 시..."
}
```

### `GET /api/v1/cover-letters/`

업로드 후 미리보기 행 (업로드 전에도 빈 `rows` 또는 404 정책은 백엔드 결정).

**응답 `data`**:

```json
{
  "rows": [
    {
      "id": "cover-001",
      "applicant_name": "김서연",
      "job_title": "Frontend Engineer",
      "status_code": "valid",
      "status_label": "정상",
      "analysis_score": 92
    }
  ]
}
```

`status_code` 예: `valid`, `missing_answer`

### `POST /api/v1/cover-letters/upload/`

**요청**: `multipart/form-data`, 필드명 예 `file` (**.xlsx**)

목업은 실제 파일을 보내지 않습니다.

**응답 `data`**:

```json
{ "uploaded_count": 3 }
```

성공 후 프론트: `coverUploaded = true`, 테이블에 `GET` 결과 `rows` 표시.

### `POST /api/v1/cover-letters/analyze/`

**요청** (권장):

```json
{
  "jd_id": "jd-fe"
}
```

단건 저장이 선행된다면 추가 필드 (**needs verification**):

```json
{
  "jd_id": "jd-fe",
  "applicant_name": "김서연",
  "body": "..."
}
```

**응답 `data`**:

```json
{ "jd_id": "jd-fe" }
```

성공 후: `analysisDone = true` → 「AI 문서 검색 화면에서 리포트 확인」→ `#/chat`.

## 목업 한계

- `CoverLetterInputPanel`은 `defaultValue`만 사용, 저장 API 없음
- 업로드는 어떤 파일이든 동일 샘플 `rows` 반환
