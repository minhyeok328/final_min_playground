# Design System Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the current HumouR React mock frontend into a polished, responsive, animated hiring SaaS interface with the dashboard as the highest-impact screen.

**Architecture:** Keep the existing Vite, React, Ant Design, and CSS architecture. Add one focused dashboard hero component, refine shared layout components, and centralize the visual upgrade in `src/styles.css` so secondary pages inherit the system without bespoke rewrites.

**Tech Stack:** React 19, TypeScript, Ant Design 5, ECharts, CSS custom properties, Vite.

---

## File Map

- Create `src/components/dashboard/DashboardHero.tsx`: dashboard-only hero, operational summary rail, and CSS-built recruitment illustration.
- Modify `src/pages/DashboardPage.tsx`: replace generic page title with `DashboardHero`.
- Modify `src/components/common/MetricCard.tsx`: add stable icon chips and accessible metric presentation.
- Modify `src/components/layout/SidebarNav.tsx`: add semantic classes for polished nav styling.
- Modify `src/components/layout/TopHeader.tsx`: add desktop search affordance and compact action grouping.
- Modify `src/components/layout/CreditSummary.tsx`: expose percentage copy for the new sidebar credit module.
- Modify `src/components/dashboard/AnalysisSummaryPanel.tsx`: add class hooks for summary styling.
- Modify `src/components/dashboard/ApplicantReviewTable.tsx`: add class hook and progress styling support.
- Modify `src/components/dashboard/TaskListPanel.tsx`: add index-based visual hooks without changing task data.
- Modify `src/components/common/PageTitle.tsx`: add class hooks for shared page title polish.
- Modify `src/styles.css`: update tokens, shell, sidebar, header, cards, dashboard hero, secondary surfaces, animations, dark mode, and responsive rules.
- Verify with `npm run build`, `npm run lint`, local Vite server, and browser screenshots at desktop/tablet/mobile widths.

## Task 1: Baseline and Plan Verification

**Files:**
- Read: `docs/superpowers/specs/2026-06-04-design-system-upgrade-design.md`
- Read: `package.json`
- Read: `src/styles.css`

- [ ] **Step 1: Verify branch and baseline status**

Run: `git branch --show-current`
Expected: `codex-design-system-upgrade`

Run: `git status --short`
Expected: only design docs or local brainstorm artifacts related to this task.

- [ ] **Step 2: Run baseline build**

Run: `npm run build`
Expected: TypeScript and Vite build pass before implementation.

## Task 2: Shared Layout Polish

**Files:**
- Modify: `src/components/layout/TopHeader.tsx`
- Modify: `src/components/layout/SidebarNav.tsx`
- Modify: `src/components/layout/CreditSummary.tsx`
- Modify: `src/components/common/PageTitle.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Update layout component markup**

Add class hooks for top search, header actions, sidebar icon wrapping, credit percentage, and page-title copy while preserving props and behavior.

- [ ] **Step 2: Implement shell CSS**

Update `src/styles.css` tokens, app background layers, sidebar, header, content width, buttons, cards, and page-title styles.

- [ ] **Step 3: Verify TypeScript**

Run: `npm run build`
Expected: build passes with no TypeScript errors.

## Task 3: Dashboard Impact Layer

**Files:**
- Create: `src/components/dashboard/DashboardHero.tsx`
- Modify: `src/pages/DashboardPage.tsx`
- Modify: `src/components/common/MetricCard.tsx`
- Modify: `src/components/dashboard/AnalysisSummaryPanel.tsx`
- Modify: `src/components/dashboard/ApplicantReviewTable.tsx`
- Modify: `src/components/dashboard/TaskListPanel.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Add dashboard hero**

Create `DashboardHero` that receives `dashboard`, `navigate`, `showAlert`, and `reloadData`, derives summary values from existing data, and renders primary actions, stat chips, right summary rail, and CSS illustration.

- [ ] **Step 2: Wire dashboard page**

Replace the generic `PageTitle` usage in `DashboardPage` with `DashboardHero`.

- [ ] **Step 3: Add component class hooks**

Add stable classes to metric cards, applicant table, analysis panel, and task items for icons, hover, animation, chart framing, and row polish.

- [ ] **Step 4: Implement dashboard CSS**

Add responsive hero, metric, analysis, table, and task styles. Include subtle entrance and hover animation with reduced-motion fallback.

- [ ] **Step 5: Verify TypeScript**

Run: `npm run build`
Expected: build passes with no TypeScript errors.

## Task 4: Secondary Page System Pass

**Files:**
- Modify: `src/styles.css`

- [ ] **Step 1: Refine shared Ant Design surfaces**

Style cards, forms, lists, tables, chat transcript, document preview, upload areas, selection cards, JD cards, and inline panels so all non-dashboard pages inherit the upgraded product language.

- [ ] **Step 2: Add dark-theme overrides**

Ensure dark mode keeps contrast for sidebar, header, hero, cards, chat, and abstract backgrounds.

- [ ] **Step 3: Add responsive rules**

Tighten tablet and mobile behavior for header controls, page actions, dashboard hero, metrics, tables, chat input, auth pages, and cards.

## Task 5: Full Verification and Visual QA

**Files:**
- Read changed files through `git diff`

- [ ] **Step 1: Run lint**

Run: `npm run lint`
Expected: pass.

- [ ] **Step 2: Run production build**

Run: `npm run build`
Expected: pass.

- [ ] **Step 3: Start local app**

Run: `npm run dev -- --port 5173`
Expected: Vite serves the app at `http://127.0.0.1:5173/`.

- [ ] **Step 4: Browser desktop QA**

Open `http://127.0.0.1:5173/#/dashboard` at 1440px width. Expected: dashboard hero is visible, no overlap, sidebar/header/card system matches the reference-inspired direction.

- [ ] **Step 5: Browser tablet QA**

Open dashboard at about 900px width. Expected: sidebar is hidden or collapsed by Ant Design breakpoint, header route select is usable, dashboard content stacks cleanly.

- [ ] **Step 6: Browser mobile QA**

Open dashboard at about 390px width. Expected: single-column layout, no text overlap in buttons or cards, horizontal table scroll remains usable.

- [ ] **Step 7: Secondary route smoke QA**

Navigate to company, JD, cover-letter, chat, mypage, recruitment-post, and cover-letter-template routes. Expected: each page inherits the upgraded card/header/page-title language and remains usable.
