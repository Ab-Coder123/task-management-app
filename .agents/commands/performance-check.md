# Command Handler: `performance check`

When the user types `performance check`, execute performance profiling and query optimization audit.

---

## Execution Protocol

1. Load `.agents/workflows/performance-audit.md`.
2. Inspect Next.js bundle sizing and React component re-rendering triggers.
3. Audit Mongoose queries for index utilization, select suppression, and population bounds.
4. Generate Performance Audit Report.
