# Code Quality & Architecture Analysis Workflow

This workflow evaluates adherence to SOLID principles, DRY, KISS, and overall structural maintainability of the codebase.

---

## Audit Execution Steps

### 1. Architectural Integrity
- **Separation of Concerns**: Verify that business logic, data access, and UI rendering are decoupled.
- **Layer Boundaries**: Ensure components don't directly mutate global state or database objects without appropriate service layers or actions.

### 2. Maintainability & Readability
- **DRY violations**: Identify duplicated logic across multiple files that should be abstracted into a hook, utility function, or shared component.
- **Complexity**: Flag functions that are too long, have high cyclomatic complexity, or take too many arguments.

### 3. Error Handling
- **Resilience**: Ensure `try/catch` blocks are used appropriately with meaningful error messages.
- **Graceful Degradation**: Verify UI components don't crash the entire app if a single sub-component fails (use Error Boundaries).

---

## Evaluation Output Format

- **Code Quality Score (0-100)**
- **Technical Debt Matrix** (Coupling, complexity, duplication)
- **Refactoring Roadmap**
