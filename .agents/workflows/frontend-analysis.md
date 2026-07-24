# Frontend Architecture & UI Analysis Workflow

This workflow evaluates React component structure, accessibility (a11y), state management, and styling consistency.

---

## Audit Execution Steps

### 1. Component Structure
- **Modularity**: Verify UI is broken down into small, reusable components rather than monolithic files.
- **Props & TypeScript**: Ensure strict typing for all component props. No `any` types allowed.

### 2. Accessibility & UX
- **ARIA & Semantics**: Check for semantic HTML (`<nav>`, `<main>`, `<article>`) and appropriate `aria-` labels.
- **RTL Support**: Verify that `dir="rtl"` is respected in CSS and layout flex directions.
- **Responsiveness**: Ensure layout adapts gracefully across mobile, tablet, and desktop breakpoints.

### 3. State & Data Fetching
- **Zustand / Context**: Audit global state to ensure it is only used when necessary (avoiding prop drilling).
- **TanStack Query**: Check that data fetching, loading states, and error handling are robust and provide good user feedback.

---

## Evaluation Output Format

- **Frontend Health Score (0-100)**
- **UI/UX Defect Matrix** (Accessibility issues, responsive breaks, state bugs)
- **Component Refactoring Recommendations**
