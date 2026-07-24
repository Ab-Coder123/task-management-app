# Command Handler: `backend check`

When the user types `backend check`, execute backend-focused verification and audit.

---

## Execution Protocol

1. Load `.agents/backend-workflow.md`.
2. Inspect Express routes, middleware, Mongoose schemas, and database query filters.
3. Run backend `npm audit` to check for dependency vulnerabilities.
4. Verify authentication token normalization and role-based access control rules.
5. Generate Backend Verification Report.
