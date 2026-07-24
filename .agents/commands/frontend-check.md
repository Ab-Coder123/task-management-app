# Command Handler: `frontend check`

When the user types `frontend check`, execute frontend-focused verification and audit.

---

## Execution Protocol

1. Load `.agents/frontend-workflow.md`.
2. Run `npm run build` to verify clean Next.js compilation and bundle sizing.
3. Inspect React state management (Zustand, TanStack Query), component accessibility, and RTL layout compliance.
4. Generate Frontend Verification Report.
