# 기능별 문서 (페이지 → Django JSON + 코드)

HumouR UI 고도화 목업의 화면별 계약입니다. **실제 Django 호출 없음** — `mockClient` + `apiMockData.ts` 기준.

각 페이지 문서는 다음을 포함합니다.

1. **화면 역할** · 해시 라우트  
2. **관련 소스 파일**과 기능  
3. **Django가 제공/수신해야 할 JSON** (목업 `apiMockData.ts` 기준)  
4. **현재 목업 한계** (폼 값 미전송 등)

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
