# Regression Check Workflow

This workflow ensures that recent code changes have not broken existing functionality, maintaining the integrity of the application across all features.

---

## Audit Execution Steps

### 1. Functional Regression
- **Core Workflows**: Verify critical paths (e.g., user authentication, task creation, assignment, checklist updates).
- **Edge Cases**: Ensure previously fixed bugs remain resolved and edge cases are handled correctly.

### 2. State & Data Integrity
- **Database Consistency**: Verify that schema updates or data migrations do not corrupt existing documents.
- **State Management**: Ensure frontend state (Zustand/React Context) remains synchronized with backend responses.

### 3. API Contract Verification
- **Backward Compatibility**: Ensure that new API endpoints or payload changes do not break older client versions.
- **Response Schemas**: Validate that the expected JSON structure is strictly maintained.

---

## Evaluation Output Format

- **Regression Risk Score (0-100)**
- **Broken Feature Matrix** (Impacted endpoints, UI components)
- **Mitigation & Fix Plan**
