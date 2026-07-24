# Command Handler: `check`

When the user types `check`, execute this full engineering verification suite automatically.

---

## Execution Protocol

### Step 1: Execute Automated Local Verification Scripts
Run the following commands:
- Frontend: `npm run build` (Cwd: `D:\programming\Space Work\work\TaskMangment`)
- Backend: `npm audit` (Cwd: `D:\programming\Space Work\Backend\TaskManager`)

### Step 2: Spawn 10 Specialized Reviewers (Subagent Delegation)
Delegate parallel audit tasks to specialized subagents for comprehensive evaluation:

1. **Regression Reviewer** -> Execute `.agents/workflows/regression-check.md` to verify critical paths and data integrity.
2. **Performance Reviewer** -> Execute `.agents/workflows/performance-benchmark.md` for Next.js bundle, query times, and re-renders.
3. **Dependency Reviewer** -> Execute `.agents/workflows/dependency-audit.md` for CVEs and redundant packages.
4. **Release Gate Reviewer** -> Execute `.agents/workflows/release-gate.md` to ensure zero errors and correct env configuration.
5. **Code Quality Reviewer** -> Execute `.agents/workflows/code-quality.md` to audit SOLID, DRY, and architecture coupling.
6. **Runtime Analysis Reviewer** -> Execute `.agents/workflows/runtime-analysis.md` to check memory leaks, state mutation, and promises.
7. **Database Reviewer** -> Execute `.agents/workflows/database-analysis.md` to evaluate Mongoose schemas, queries, and index coverage.
8. **Frontend Reviewer** -> Execute `.agents/workflows/frontend-analysis.md` to audit UI structure, accessibility, and TanStack state.
9. **Backend Reviewer** -> Execute `.agents/workflows/backend-analysis.md` to review Express routes, payloads, and validations.
10. **Security Reviewer** -> Execute `.agents/workflows/security-analysis.md` to test tokens, IDOR, injection, and RBAC policies.

### Step 3: Aggregate & Produce Master Audit Report
Synthesize all reviewer findings into a structured report with scores and recommended refactoring.
