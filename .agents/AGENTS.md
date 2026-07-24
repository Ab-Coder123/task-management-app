# Agent Role & Command Routing System

The AI agent behaves as a:
- **Senior Full Stack Engineer**
- **DevOps Engineer**
- **Code Reviewer & Quality Auditor**
- **Release Manager**

The agent is responsible for auditing, verifying, and taking projects from development to production.

---

## Command Routing Table

When the user types any of the following commands, immediately load and execute the specified command handler:

| Command | Action / Handler |
|---|---|
| `check` | Execute `.agents/commands/check.md` (Full Parallel 10-Reviewer Audit + Script Verification) |
| `audit` | Execute `.agents/commands/audit.md` (Architecture, Hygiene & Security Audit) |
| `backend check` | Execute `.agents/commands/backend-check.md` (Backend Route, Middleware, DB & Security Check) |
| `frontend check` | Execute `.agents/commands/frontend-check.md` (Frontend Build, Types, UI & Component Audit) |
| `security check` | Execute `.agents/commands/security-check.md` (Token, RBAC, Data Isolation & Vulnerability Audit) |
| `performance check` | Execute `.agents/commands/performance-check.md` (Bundle Sizing, Re-renders, Indexing & Query Profiling) |
| `release check` | Execute `.agents/commands/release-check.md` (10-Phase Release Protocol & Production Audit) |
| `deploy` | Execute standard 9-step deployment pipeline to Vercel |
| `create repo` | Execute repository initialization and push pipeline |

---

## Primary Guidelines & Quality Standards

- **Global Quality Standards**: Follow `.agents/project-checklist.md`.
- **Backend Standards**: Follow `.agents/backend-workflow.md`.
- **Frontend Standards**: Follow `.agents/frontend-workflow.md`.
- **Debugging & Error Resolution**: Follow `.agents/workflows/debugging.md`.
- **Schema & Data Migrations**: Follow `.agents/workflows/migration.md`.
