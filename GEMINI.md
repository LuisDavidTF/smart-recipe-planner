# Repository Guidelines

## How to Use This Guide

- Start here for cross-project norms.
- Each component has an `AGENTS.md` file with specific guidelines (e.g., `ui/AGENTS.md`).
- Component docs override this file when guidance conflicts.

## Available Skills

Use these skills for detailed patterns on-demand:

### Generic Skills
| Skill | Description | URL |
|-------|-------------|-----|
| `typescript` | Const types, flat interfaces, best practices | [SKILL.md](.agent/skills/typescript/SKILL.md) |
| `react-19` | React 19 patterns (no useMemo/useCallback) | [SKILL.md](.agent/skills/react-19/SKILL.md) |
| `nextjs-16` | Next.js 16 App Router, Server Actions | [SKILL.md](.agent/skills/nextjs-16/SKILL.md) |
| `tailwind-4` | Tailwind CSS 4 patterns | [SKILL.md](.agent/skills/tailwind-4/SKILL.md) |
| `playwright` | E2E testing patterns | [SKILL.md](.agent/skills/playwright/SKILL.md) |
| `zod-4` | Schema validation (v4 API) | [SKILL.md](.agent/skills/zod-4/SKILL.md) |
| `zustand-5` | State management patterns | [SKILL.md](.agent/skills/zustand-5/SKILL.md) |
| `ai-sdk-5` | Vercel AI SDK patterns | [SKILL.md](.agent/skills/ai-sdk-5/SKILL.md) |
| `smart-recipe-planner-ui` | UI components and styling conventions | [SKILL.md](.agent/skills/smart-recipe-planner-ui/SKILL.md) |
| `smart-recipe-planner-test-ui` | Frontend E2E testing patterns | [SKILL.md](.agent/skills/smart-recipe-planner-test-ui/SKILL.md) |
| `smart-recipe-planner-git` | Git, Commits, and PR workflow | [SKILL.md](.agent/skills/smart-recipe-planner-git/SKILL.md) |
| `smart-recipe-planner-ticket-workflow` | Ticket-based branching and merging workflow | [SKILL.md](.agent/skills/smart-recipe-planner-ticket-workflow/SKILL.md) |

### Auto-invoke Skills

When performing these actions, ALWAYS invoke the corresponding skill FIRST:

| Action | Skill |
|--------|-------|
| App Router / Server Actions | `nextjs-16` |
| Building AI chat features | `ai-sdk-5` |
| Creating Zod schemas | `zod-4` |
| Creating/modifying UI components | `smart-recipe-planner-ui` |
| Managing Commits / PRs | `smart-recipe-planner-git` |
| Using Zustand stores | `zustand-5` |
| Working with Tailwind classes | `tailwind-4` |
| Writing Playwright E2E tests | `playwright` |
| Writing React components | `react-19` |
| Writing TypeScript types/interfaces | `typescript` |

---

## Project Overview

Smart Recipe Planner is a modern web application for managing recipes and meal planning.

| Component | Location | Tech Stack |
|-----------|----------|------------|
| UI/App | `app/`, `ui/` | Next.js 16, React 19, Tailwind 4 |
| Skills | `.agent/skills/` | Agentic Skills Definitions |

---

## Commit & Pull Request Guidelines

Follow conventional-commit style: `<type>[scope]: <description>`

**Types:** `feat`, `fix`, `docs`, `chore`, `perf`, `refactor`, `style`, `test`

Before creating a PR:
1. Run all relevant tests and linters
2. Link screenshots for UI changes
