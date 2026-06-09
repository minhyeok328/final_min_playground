# 기능별 문서 (페이지 → Django JSON + 코드)

HumouR UI 고도화 목업의 화면별 API 사용 정리입니다. 실제 호출 기준은 [`backendClient.ts`](../../src/api/backendClient.ts)와 [API 레퍼런스](../06-api/api-reference.md)입니다.

각 페이지 문서는 다음을 포함합니다.

1. **화면 역할** · 해시 라우트  
2. **관련 소스 파일**과 기능  
3. **현재 backend 명세 endpoint와 요청/응답 구조**
4. **추가 명세가 필요한 화면 기능**

| 문서 | 라우트 |
|------|--------|
| [dashboard.md](./dashboard.md) | `#/dashboard` |
| [company.md](./company.md) | `#/company` |
| [jd.md](./jd.md) | `#/jd` |
| [cover-letter.md](./cover-letter.md) | `#/cover-letter` |
| [chat.md](./chat.md) | `#/chat` (AI 문서 검색) |
| [mypage.md](./mypage.md) | `#/mypage` |
| [recruitment-post.md](./recruitment-post.md) | `#/recruitment-post` |
| [cover-letter-template.md](./cover-letter-template.md) | `#/cover-letter-template` |
| [auth.md](./auth.md) | `#/login`, `#/signup`, `#/password-reset` |

공통 API 표: [../06-api/api-reference.md](../06-api/api-reference.md)  
부족한 API 명세 추가본: [../06-api/api-spec-addendum.md](../06-api/api-spec-addendum.md)
