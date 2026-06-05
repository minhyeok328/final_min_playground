# final_min_playground

| | |
|---|---|
| **팀** | 육뚝이들 |
| **프로젝트** | **HumouR** |
| **과정** | SKN26 파이널 프로젝트 |

SKN26 파이널 **HumouR** 채용·지원자 분석 보조 서비스의 **UI 고도화·디자인 연습** 저장소입니다.  
실제 백엔드·인증·DB 연동 없이, 화면 구성·레이아웃·컴포넌트·라이트/다크 테마·차트·플로팅 위젯 등 **프론트엔드 UI를 빠르게 시도하고 다듬는 샌드박스** 역할을 합니다.

## 목적

- **HumouR** 화면 흐름을 미리 구현하고, 운영형 SaaS 수준의 **비주얼·인터랙션**을 검증합니다.
- Ant Design + ECharts + CSS 디자인 토큰으로 카드, 테이블, 폼, 대시보드, AI 문서 검색 위젯 등 **실사용에 가까운 목업**을 만듭니다.
- Django 연동을 가정한 **JSON API 계약**(snake_case)을 목 데이터로 고정해, 메인 프로젝트와 필드명·래퍼를 맞출 수 있게 합니다.
- 이 레포에서 검증한 레이아웃·토큰·패턴을 HumouR 메인 프로젝트에 옮깁니다.

## UI 고도화 범위 (현재)

| 영역 | 내용 |
|------|------|
| 디자인 시스템 | `styles.css` CSS 변수, Ant Design `ConfigProvider` 토큰, 라이트/다크 테마 |
| 공통 셸 | `AppShell`, 밝은 블루 사이드바, 스티키 헤더·검색, 크레딧·알림 |
| 대시보드 | `DashboardHero` 히어로 패널, 아이콘 지표 카드, 지원자 테이블·분석 요약·할 일 |
| AI 문서 검색 | 전역 `DocumentChatFab` 플로팅 위젯 + `#/chat` 전체 화면 워크스페이스 |
| 반응형·모션 | 카드 호버, 페이지 전환, 위젯 드래그·위치 저장(localStorage) |

상세 스펙: [`docs/superpowers/specs/2026-06-04-design-system-upgrade-design.md`](./docs/superpowers/specs/2026-06-04-design-system-upgrade-design.md)

## 포함된 화면 (목업)

| 구분 | 화면 | 해시 예시 |
|------|------|-----------|
| 메인 | 대시보드, 회사 정보, JD 관리, 자기소개서, AI 문서 검색, 마이페이지, 모집 공고, 자소서 포맷 | `#/dashboard`, `#/jd` … |
| 인증 | 로그인, 회원가입, 비밀번호 재설정 | `#/login`, `#/signup`, `#/password-reset` |

라우트·사이드 메뉴 정의: [`src/data/mockData.tsx`](./src/data/mockData.tsx).

## 데이터·API (목업)

**실제 HTTP 요청은 없습니다.** 앱이 Django JSON 형태를 흉내 냅니다.

| 파일 | 역할 |
|------|------|
| [`src/data/apiMockData.ts`](./src/data/apiMockData.ts) | Django가 맞춰야 할 **응답 JSON 샘플** (`ApiResponse`, snake_case `data`) |
| [`src/api/mockClient.ts`](./src/api/mockClient.ts) | 지연 후 샘플을 반환하는 **목 API** (연동 시 `fetch`/axios로 교체) |
| [`src/api/adapters.ts`](./src/api/adapters.ts) | API snake_case → UI용 camelCase |
| [`src/hooks/useMockAppData.ts`](./src/hooks/useMockAppData.ts) | 기동 시 GET 12건 병렬 로드 |
| [`src/data/mockData.tsx`](./src/data/mockData.tsx) | 라우트·메뉴·색상 팔레트·채팅 타입 |

폼 저장·로그인 등 mutation은 입력값을 서버로 보내지 않고, `mockClient`가 성공 메시지만 반환합니다.

## 기술 스택

- React 19 + TypeScript
- Vite 7
- Ant Design 5 (`@ant-design/icons`)
- ECharts 6 (대시보드 도넛 차트)
- Playwright Core (선택: UI 검증 스크립트)

## 저장소 구조 (요약)

```text
final_min_playground/
├── public/assets/              # HumouR 로고·앱 아이콘 (PNG)
├── src/
│   ├── App.tsx                 # 해시 라우팅, 테마, mock 액션, DocumentChatFab 연동
│   ├── api/                    # mockClient, adapters
│   ├── data/                   # apiMockData, mockData
│   ├── hooks/                  # useMockAppData
│   ├── pages/                  # 화면 단위
│   ├── components/             # layout, dashboard, charts, chat, …
│   ├── types/, utils/
│   └── styles.css              # 디자인 토큰·레이아웃·위젯 스타일
├── scripts/
│   └── verify-document-chat-widget.mjs   # Playwright UI 캡처 검증
├── docs/                       # 프론트·API 계약·UI 고도화 위키
├── index.html
├── package.json                # name: humour-ui-mockup
└── vite.config.ts
```

상세 트리: [`docs/02-architecture/directory-structure.md`](./docs/02-architecture/directory-structure.md).

## 로컬 실행

```bash
npm install
npm run dev
```

브라우저: `http://127.0.0.1:5173` — 화면 이동은 **해시 라우팅** (`#/dashboard`, `#/jd` 등).

```bash
npm run build   # tsc --noEmit + vite build → dist/
npm run lint    # ESLint
npm run preview # dist 미리보기
```

선택: AI 문서 검색 위젯 UI 검증 (Chrome/Edge 필요)

```bash
node scripts/verify-document-chat-widget.mjs
```

## 문서

| 문서 | 내용 |
|------|------|
| [`docs/README.md`](./docs/README.md) | 위키 목차, 페이지별 Django JSON + 파일 맵 |
| [`docs/00-overview/project-overview.md`](./docs/00-overview/project-overview.md) | 프로젝트 개요·UI 고도화·연동 상태 |
| [`docs/about_frontend.md`](./docs/about_frontend.md) | (참고) 프론트엔드·백엔드 협업 일반 가이드 |

## 참고

- 이 레포는 **육뚝이들** 팀의 **UI 고도화·디자인 실험용**이며, HumouR 메인 백엔드/배포 저장소와는 분리되어 있습니다.
- 로컬 에이전트·브레인스토밍 산출물(`.superpowers/`), 빌드 결과(`dist/`), QA 캡처(`qa-screenshots/`)는 [`.gitignore`](./.gitignore)에 정의되어 있습니다.
