# Schema & Data Migration Workflow

This workflow specifies the zero-downtime database migration protocol.

---

## Migration Execution Protocol

### 1. Compatibility Check
- Verify whether the schema change is backward-compatible with existing API endpoints and frontend versions.
- If a deprecated field is replaced (e.g. `privateChecklist` -> `assigneeProgress[].checklist`), ensure the old field remains readable or is safely backfilled.

### 2. Batch Processing Strategy
- Process large document collections in batches (e.g. 100 documents per iteration) using Mongoose cursors or batch loops.
- Prevent memory exhaustion and database lockups during execution.

### 3. Verification & Rollback Plan
- Provide explicit count checks (migrated document count vs total collection count).
- Maintain an idempotent execution flag so re-running the migration script is safe.
