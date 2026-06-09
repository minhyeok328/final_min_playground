# 모집 공고 (`#/recruitment-post`)

## 화면 역할

복수 JD를 선택해 모집 공고 문구 생성·미리보기·PDF 다운로드 흐름을 확인합니다.

## 관련 파일

| 파일 | 기능 |
|------|------|
| [`src/pages/RecruitmentPostPage.tsx`](../../src/pages/RecruitmentPostPage.tsx) | 생성·PDF 액션 |
| [`src/components/recruitment/JdSelectionPanel.tsx`](../../src/components/recruitment/JdSelectionPanel.tsx) | JD 다중 선택 |
| [`src/components/recruitment/SelectedJdSummary.tsx`](../../src/components/recruitment/SelectedJdSummary.tsx) | 선택 JD 태그 요약 |
| [`src/components/recruitment/RecruitmentPreviewPanel.tsx`](../../src/components/recruitment/RecruitmentPreviewPanel.tsx) | 제목·본문 섹션 렌더 |
| [`src/api/backendClient.ts`](../../src/api/backendClient.ts) | 현재 생성/다운로드는 로컬 성공 응답 |

## 현재 backend 호출

모집 공고 생성·PDF 다운로드 endpoint는 붙여준 backend 명세에 없습니다.

프론트는 초기 데이터의 `compinfo/get`, `jd/get` 결과로 미리보기 문구를 조합하고, 생성·다운로드 버튼은 로컬 성공 응답만 표시합니다.

## 추가 명세 필요

```text
POST /api/recruitment-post/generate/
```

```json
{
  "job_description_ids": [1, 2]
}
```

제안 응답:

```json
{
  "error": false,
  "data": {
    "title": "프론트엔드 개발자 채용 공고",
    "sections": ["회사 소개", "주요 업무", "필수 역량"]
  }
}
```

PDF는 바이너리 응답 또는 다운로드 URL 응답 중 하나로 명세가 필요합니다.

상세 제안: [api-spec-addendum.md](../06-api/api-spec-addendum.md).
