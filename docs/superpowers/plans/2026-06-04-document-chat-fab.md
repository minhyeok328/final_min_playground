# Document Chat FAB Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a global AI document search FAB and expand the existing chat page into a full document-search workspace.

**Architecture:** Reuse the current app-level chat state so the FAB drawer and `/chat` page share messages, input, loading, and send behavior. Add focused chat context components and keep visual styling in the existing CSS system.

**Tech Stack:** React 19, TypeScript, Ant Design 5, CSS custom properties.

---

## Tasks

- [ ] Create `DocumentChatFab` as a protected-shell floating entry point with a right-side Drawer, search scope chips, shared messages, source cards, and input.
- [ ] Create `DocumentSearchContextPanel` for the full `/chat` workspace, replacing the report-only context card.
- [ ] Extend `ChatWindowPanel` with optional labels and placeholder copy so it can serve document search as well as report chat.
- [ ] Wire the FAB into `AppShell` through app-level props from `App.tsx`.
- [ ] Rename the chat menu label and update `/chat` page copy to "AI 문서 검색".
- [ ] Add responsive and dark-mode CSS for the FAB, Drawer, chips, source cards, and document workspace.
- [ ] Verify with lint, build, and browser screenshots.
