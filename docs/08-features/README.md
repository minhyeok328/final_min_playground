# 기능별 문서

HumouR UI 목업의 화면별 API 사용 정리입니다. 실제 호출 기준은 [`src/api/backendClient.ts`](../../src/api/backendClient.ts)와 [API 레퍼런스](../06-api/api-reference.md)입니다.

기본 실행은 mock API 모드입니다. 각 화면의 버튼과 라우팅 흐름은 backend 없이 확인할 수 있고, `VITE_USE_MOCK_API=false`에서 axios 기반 실제 호출로 전환됩니다.

각 화면 문서는 다음을 포함합니다.

1. 화면 역할과 해시 라우트
2. 관련 소스 파일
3. 현재 backend endpoint와 요청/응답 구조
4. 추가 명세가 필요한 기능

| 문서 | 라우트 |
|------|--------|
| [dashboard.md](./dashboard.md) | `#/dashboard` |
| [company.md](./company.md) | `#/company` |
| [jd.md](./jd.md) | `#/jd` |
| [cover-letter.md](./cover-letter.md) | `#/cover-letter` |
| [chat.md](./chat.md) | `#/chat` |
| [mypage.md](./mypage.md) | `#/mypage` |
| [recruitment-post.md](./recruitment-post.md) | `#/recruitment-post` |
| [cover-letter-template.md](./cover-letter-template.md) | `#/cover-letter-template` |
| [auth.md](./auth.md) | `#/login`, `#/signup`, `#/password-reset` |

공통 API: [../06-api/api-reference.md](../06-api/api-reference.md)  
추가 명세 제안: [../06-api/api-spec-addendum.md](../06-api/api-spec-addendum.md)
