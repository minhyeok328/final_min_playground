# AI 문서 검색 (`#/chat`)

## 화면 역할

사내 정책, JD, 채용 운영 가이드, 분석 리포트 등 **문서 컨텍스트**에서 AI에게 질문합니다.  
전체 화면 워크스페이스(`#/chat`)와 전역 플로팅 위젯(`DocumentChatFab`)이 **동일한 채팅 상태**를 공유합니다.

## 관련 파일

| 파일 | 기능 |
|------|------|
| [`src/pages/ChatPage.tsx`](../../src/pages/ChatPage.tsx) | 2열 레이아웃, 대화 초기화 |
| [`src/components/chat/DocumentSearchContextPanel.tsx`](../../src/components/chat/DocumentSearchContextPanel.tsx) | 문서 컬렉션·검색 범위·빠른 질문 |
| [`src/components/chat/ChatWindowPanel.tsx`](../../src/components/chat/ChatWindowPanel.tsx) | 메시지·전송 UI |
| [`src/components/chat/DocumentChatFab.tsx`](../../src/components/chat/DocumentChatFab.tsx) | 전역 FAB·플로팅 위젯 (`#/chat` 제외) |
| [`src/components/layout/AppShell.tsx`](../../src/components/layout/AppShell.tsx) | `assistantFab` 슬롯 |
| [`src/App.tsx`](../../src/App.tsx) | `chatMessages`, `chatInput`, `sendChatMessage` → `mockClient.sendChatMessage` |
| [`src/data/apiMockData.ts`](../../src/data/apiMockData.ts) | `analysisReportApiResponse` (초기 메시지·리포트 메타) |
| [`scripts/verify-document-chat-widget.mjs`](../../scripts/verify-document-chat-widget.mjs) | Playwright UI 캡처 검증 (선택) |

## UI 동작

### 전역 플로팅 위젯 (`DocumentChatFab`)

- 보호된 모든 화면에서 FAB 버튼 표시 (`#/chat`에서는 숨김)
- 위젯 열기: 검색 범위 칩, 추천 참조 문서, 빠른 질문, 채팅 입력
- 데스크톱·모바일: FAB와 위젯을 우측 하단에 고정
- 「전체 화면에서 열기」→ `#/chat` 이동

### 전체 화면 (`#/chat`)

- 좌측: `DocumentSearchContextPanel` — 문서 컬렉션·최근 검색·빠른 질문
- 우측: `ChatWindowPanel` — 대화 영역
- 「대화 초기화」: `report.chatMessages`로 되돌림

## Django API

채팅 API 계약은 기존 분석 리포트 채팅과 동일합니다. UI는 문서 검색으로 확장되었으나, 목업은 `analysisReport` 데이터를 재사용합니다.

### `GET /api/v1/analysis-reports/current/` (또는 `/{report_id}/`)

**응답 `data`**:

```json
{
  "report_id": "HR-2408",
  "applicant_name": "김서연",
  "job_title": "Frontend Engineer",
  "tabs": [
    {
      "key": "summary",
      "label": "요약",
      "title": "지원자 핵심 요약",
      "content": "..."
    }
  ],
  "example_questions": [
    "이 지원자의 강점 3가지를 알려줘"
  ],
  "chat_messages": [
    { "role": "assistant", "text": "..." },
    { "role": "user", "text": "..." }
  ]
}
```

`role`: `assistant` | `user`

초기 메시지: `chat_messages`가 비어 있지 않으면 `App`이 이를 채팅 상태로 사용합니다.

### `POST /api/v1/analysis-reports/{report_id}/chat/`

**요청**:

```json
{
  "question": "면접 평가 기준을 알려줘."
}
```

목업: [`mockClient.sendChatMessage(question)`](../../src/api/mockClient.ts) — 질문 문자열만 전달.

**응답 `data`** (어시스턴트 메시지 1건):

```json
{
  "role": "assistant",
  "text": "React·TypeScript 경험과..."
}
```

프론트 동작:

1. 전송 시 로컬에 `{ "role": "user", "text": question }` 즉시 추가
2. API 성공 후 `data`를 메시지 배열에 append

**응답 `message`**: 예) `AI 답변을 추가했습니다.`

## 목업 한계

- 검색 범위 칩·문서 컬렉션·추천 참조 문서는 **UI 전용** — API에 반영되지 않음
- `report_id` 고정 목 데이터, 지원자·JD 선택 UI 없음
- 스트리밍(SSE) 미구현 — 단일 JSON 응답 가정
- 문서 검색 전용 백엔드 엔드포인트는 아직 정의되지 않음 (**needs verification**)

## 관련 문서

- [document-chat-fab.md](../superpowers/plans/2026-06-04-document-chat-fab.md) — 구현 계획
