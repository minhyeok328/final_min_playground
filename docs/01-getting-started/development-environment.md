# 개발 환경

HumouR UI 고도화 목업(`final_min_playground`)을 로컬에서 띄우고 해시 라우트로 화면을 돌려보는 방법입니다.

## 사전 요구

- Node.js (LTS 권장)
- npm

## 설치·실행

```bash
npm install
npm run dev
```

| 항목 | 값 |
|------|-----|
| 개발 서버 | `http://127.0.0.1:5173` (`vite --host 127.0.0.1`) |
| 저장소 폴더 | `final_min_playground` |
| npm 패키지명 | `humour-ui-mockup` ([`package.json`](../../package.json)) |
| 화면 이동 | 해시 라우팅 — 예: `#/dashboard`, `#/company`, `#/login` |

브라우저에서 주소 뒤에 해시만 바꿔도 [`routes.ts`](../../src/utils/routes.ts)가 라우트를 동기화합니다. 알 수 없는 해시는 `#/dashboard`로 폴백합니다.

## 기타 스크립트

```bash
npm run build   # tsc --noEmit + vite build → dist/
npm run lint    # ESLint
npm run preview # dist 미리보기 (127.0.0.1)
```

## UI 검증 (선택)

AI 문서 검색 플로팅 위젯을 Playwright로 캡처합니다. 로컬 Chrome 또는 Edge가 필요합니다.

```bash
node scripts/verify-document-chat-widget.mjs
```

- 기본 포트: `5176` (`VERIFY_PORT` 환경 변수로 변경 가능)
- 캡처 저장: `qa-screenshots/` (`.gitignore` 대상)

## 진입점

| 파일 | 역할 |
|------|------|
| [`index.html`](../../index.html) | `#root`, 파비콘 `/assets/humour-app-icon.png` |
| [`src/main.tsx`](../../src/main.tsx) | React 마운트, `antd/dist/reset.css`, `styles.css` |
| [`src/App.tsx`](../../src/App.tsx) | 라우팅, 라이트/다크 테마, `useMockAppData`, `DocumentChatFab`, API 액션 |

## API 데이터 확인

앱 기동 시 [`useMockAppData`](../../src/hooks/useMockAppData.ts)가 [`backendClient.ts`](../../src/api/backendClient.ts)의 `getDashboard`, `getAuthDefaults`를 호출합니다. `getDashboard`는 backend 명세에 맞춰 `account/get`, `compinfo/get`, `jd/get`, `resume/get`, `report/get`, `question/get`을 조합합니다. 로딩 중에는 `PageLoading`, 실패 시 `PageError`가 표시됩니다.

정적 이미지는 [`public/assets/`](../../public/assets/)에 두면 빌드 없이 `/assets/...`로 참조됩니다.

## UI 고도화 작업 시 참고

- 디자인 토큰·스타일: [`src/styles.css`](../../src/styles.css)
- Ant Design 테마: [`src/App.tsx`](../../src/App.tsx) `ConfigProvider`
- 설계 스펙: [design-system-upgrade-design.md](../superpowers/specs/2026-06-04-design-system-upgrade-design.md)
