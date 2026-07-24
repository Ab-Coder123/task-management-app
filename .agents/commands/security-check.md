# Command Handler: `security check`

When the user types `security check`, execute security and authentication audit.

---

## Execution Protocol

1. Load `.agents/workflows/security-audit.md`.
2. Run `npm audit` on both frontend and backend.
3. Audit JWT validation, secret management, input sanitization, and data isolation filters.
4. Generate Security Audit Report.
