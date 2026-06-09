# AI 문서 검색 (`#/chat`)

## 화면 역할

JD, 지원서, 분석 리포트, 면접 질문 데이터를 바탕으로 질문하는 UI입니다. 전체 화면 워크스페이스와 전역 플로팅 위젯이 동일한 채팅 상태를 공유합니다.

## 관련 파일

| 파일 | 기능 |
|------|------|
| [`src/pages/ChatPage.tsx`](../../src/pages/ChatPage.tsx) | 2열 레이아웃, 대화 초기화 |
| [`src/components/chat/DocumentSearchContextPanel.tsx`](../../src/components/chat/DocumentSearchContextPanel.tsx) | 문서 컬렉션·검색 범위·빠른 질문 |
| [`src/components/chat/ChatWindowPanel.tsx`](../../src/components/chat/ChatWindowPanel.tsx) | 메시지·전송 UI |
| [`src/components/chat/DocumentChatFab.tsx`](../../src/components/chat/DocumentChatFab.tsx) | 전역 FAB·플로팅 위젯 |
| [`src/api/backendClient.ts`](../../src/api/backendClient.ts) | 현재 채팅은 로컬 안내 응답 |

## 현재 backend 호출

채팅 전용 endpoint는 붙여준 backend 명세에 없습니다. 현재 `apiClient.sendChatMessage`는 네트워크 요청 없이 로컬 안내 응답을 반환합니다.

리포트/질문 컨텍스트는 초기 데이터 로드에서 다음 endpoint로 가져옵니다.

| 목적 | endpoint |
|------|----------|
| 분석 리포트 | `POST /api/report/get/` with `{ "resume_id": 1 }` |
| 면접 질문 | `POST /api/question/get/` with `{ "resume_id": 1 }` |

## 추가 명세 필요

문서 검색/채팅용 endpoint가 필요합니다.

```text
POST /api/chat/
```

```json
{
  "question": "이 지원자의 리스크 알려줘",
  "resume_id": 1
}
```

제안 응답:

```json
{
  "error": false,
  "data": {
    "role": "assistant",
    "text": "답변"
  }
}
```

상세 제안: [api-spec-addendum.md](../06-api/api-spec-addendum.md).
