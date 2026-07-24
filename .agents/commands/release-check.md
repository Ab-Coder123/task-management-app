# Command Handler: `release check`

When the user types `release check`, execute 10-phase release protocol and deployment audit.

---

## Execution Protocol

1. Load `.agents/workflows/release.md`.
2. Run `npm run build` on Frontend.
3. Run `npm audit` on Backend.
4. Verify environment variable declarations, RBAC constraints, and git tree hygiene.
5. Generate Release & Production Readiness Report.
