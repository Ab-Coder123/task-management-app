# Performance Benchmark Workflow

This workflow defines the systematic performance profiling protocol covering Next.js rendering, bundle size, Mongoose query efficiency, indexing, and memory management.

---

## Audit Execution Steps

### 1. Frontend & Next.js Bundle Audit
- **Bundle Optimization**: Inspect `Next.js` route bundle sizes from `npm run build` output. Identify bloated dependencies.
- **Image & Asset Optimization**: Check for unoptimized `<img>` elements and missing `<Image />` tags.
- **Re-render Optimization**: Inspect React hook dependency arrays (`useEffect`, `useCallback`, `useMemo`) to prevent unnecessary re-rendering loops.

### 2. Database & Mongoose Query Audit
- **Query Pushdown**: Confirm filter conditions are pushed directly to MongoDB queries instead of loading documents into Node.js memory.
- **Index Coverage**: Verify indexed fields for frequently queried columns (`assignedTo`, `createdBy`, `isPrivate`, `status`).
- **Population Overhead**: Ensure `.populate()` explicitly restricts returned fields (e.g. `.populate('assignedTo', 'username email avatar role')`).

### 3. Network Payload & Caching
- Verify API response sizes: Ensure unnecessary nested objects or raw database fields are stripped.
- Confirm TanStack Query caching keys are invalidated efficiently without triggering duplicate network cascades.

---

## Evaluation Output Format

- **Performance Score (0-100)**
- **Bottleneck Matrix** (Bundle Size, Query Times, Re-renders)
- **Optimization Strategy & Code Improvements**
