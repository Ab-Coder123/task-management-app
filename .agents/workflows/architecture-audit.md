# Architecture Audit Workflow

This workflow defines the structural audit process for evaluating coupling, cohesion, SOLID adherence, layer boundaries, and API contracts.

---

## Audit Execution Steps

### 1. System Layering Boundaries
- Verify clear separation of concerns:
  - Frontend: `app/` (routing) -> `components/` (view) -> `hooks/` (server state) -> `api/` (http & serialization).
  - Backend: `routes/` (http & validation) -> `middleware/` (cross-cutting) -> `modules/` (data models).
- Confirm no direct database queries or raw HTTP fetch logic exist inside presentational components.

### 2. SOLID Adherence & Cohesion
- Evaluate component and module cohesion: Ensure files contain tightly related logic rather than acting as monolithic catch-all files.
- Inspect coupling: Check if changing a backend schema field breaks frontend components, and verify if API adapter layers properly insulate the UI.

### 3. API Contract Consistency
- Confirm REST endpoint naming conventions (`/api/tasks/gettasks`, `/api/tasks/addtask`).
- Verify standard response JSON wrappers across all routes.

---

## Evaluation Output Format

- **Architecture Score (0-100)**
- **Coupling & Cohesion Matrix**
- **Refactoring Roadmap for Architectural Debt**
