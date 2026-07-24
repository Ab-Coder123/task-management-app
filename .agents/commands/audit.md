# Command Handler: `audit`

When the user types `audit`, execute the comprehensive code quality, architecture, and security audit.

---

## Execution Protocol

1. Load guidelines from `.agents/project-checklist.md` and workflows from `.agents/workflows/code-audit.md`, `architecture-audit.md`, and `security-audit.md`.
2. Inspect codebase for dead code, unused imports, circular dependencies, code smells, and SOLID violations.
3. Verify TypeScript type safety and API contract adapters.
4. Output comprehensive Code Quality & Architecture Audit report.
