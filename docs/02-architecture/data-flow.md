# 데이터 흐름

```mermaid
flowchart LR
  subgraph boot [앱 기동]
    A[useMockAppData] --> B[backendClient.getDashboard]
    B --> C[/api account, company, JD, resume, report, question]
    C --> D[adapters map*]
    D --> E[App state data]
  end
  subgraph action [사용자 액션]
    F[Page / Component] --> G[runApiAction]
    G --> H[backendClient action endpoint]
    H --> I[Alert message]
  end
  E --> F
```

## 1. 초기 로드 (`useMockAppData`)

[`src/hooks/useMockAppData.ts`](../../src/hooks/useMockAppData.ts)가 마운트 시 다음을 호출합니다.

- `apiClient.getDashboard()`: `account/get`, `compinfo/get`, `jd/get`, `resume/get`, `report/get`, `question/get` 조합
- `apiClient.getAuthDefaults()`: 로그인/가입 폼 기본값용 로컬 샘플

각 응답의 `data`는 [`adapters.ts`](../../src/api/adapters.ts)로 UI 모델로 변환 후 `App`에 전달됩니다.

## 2. 사용자 액션 (`runApiAction`)

[`src/App.tsx`](../../src/App.tsx)의 `runApiAction`이 로딩 키를 잡고 `backendClient`의 액션 메서드를 호출합니다. 성공 시 내부 `ApiResponse.message`를 Alert로 표시합니다.

`backendClient`는 backend 응답 `{ error, data, message }`를 UI 내부 응답 `{ status_code, message, data }`로 감싸서 기존 화면 상태 흐름과 맞춥니다.

## 3. 페이지 로컬 상태

`App.tsx`에서만 관리하는 예:

| 상태 | 용도 |
|------|------|
| `selectedJdIdOverride` | JD·자소서·템플릿에서 선택 JD |
| `selectedRowKeys` | 모집 공고 다중 JD 선택 |
| `chatMessages`, `chatInput` | AI 문서 검색 — `DocumentChatFab`와 `ChatPage` 공유 |
| `coverUploaded`, `analysisDone` | 자소서 업로드·분석 UI 플래그 |
| `postGenerated`, `templateGenerated` | 생성 결과 표시 여부 |

이 값들은 일부 화면 로컬 상태입니다. 서버 저장이 필요한 기능은 추가 endpoint 명세가 필요합니다.

## 관련 문서

- [API 공통 래퍼](./api-envelope.md)
- [API 레퍼런스](../06-api/api-reference.md)
