# Global Project Quality Control Checklist

This document defines the overarching engineering standards, quality criteria, and red flag prohibitions for the entire codebase (Frontend + Backend).

---

## 1. Clean Code & Architectural Principles

### SOLID Principles
- **Single Responsibility (SRP)**: Each component, module, route, and function must have one clear responsibility.
- **Open/Closed (OCP)**: Code modules should be open for extension but closed for modification.
- **Liskov Substitution (LSP)**: Derived types or interfaces must be substitutable for base types.
- **Interface Segregation (ISP)**: Keep TypeScript interfaces lean and targeted.
- **Dependency Inversion (DIP)**: Depend on abstractions (API layer/interfaces) rather than concrete implementations.

### DRY & KISS
- **DRY (Don't Repeat Yourself)**: Eliminate duplicate utility functions, validation logic, and data transformation routines.
- **KISS (Keep It Simple, Stupid)**: Avoid over-engineering complex abstractions for straightforward features.

### Memory & Event Management
- Clean up event listeners, timers (`setTimeout`/`setInterval`), and WebSocket subscriptions in React `useEffect` cleanup routines.
- Avoid memory leaks: Never maintain un-garbage-collected global references to large arrays or DOM nodes.

---

## 2. Red Flags & Strict Prohibitions

1. **NO Symptom Patching**: Never mask runtime errors with empty `catch` blocks, default fallbacks that hide failures, or commenting out failing tests.
2. **NO Hardcoded Credentials**: Never commit JWT secrets, MongoDB URIs, or Cloudinary API keys into source code. Always use `process.env`.
3. **NO Direct State Mutation**: Never mutate React props or state arrays directly (`arr.push()`); always use immutable updates (`[...arr, newItem]`).
4. **NO Unfiltered Mongoose Queries**: Never query all DB documents into Node.js memory and filter using JavaScript `.filter()`. Always push `$or`, `$and`, and `$in` criteria into the Mongoose query.
5. **NO Silent Failures**: Always log or display descriptive error messages to the user and server logs when an operation fails.

---

## 3. Production Readiness Verification Matrix

| Area | Quality Criterion | Verification Method |
|---|---|---|
| **Compilation** | Clean build without TypeScript or Next.js errors | `npm run build` |
| **Security** | Dependency vulnerability scan | `npm audit` |
| **Performance** | No infinite re-render loops or memory leaks | React DevTools & log audit |
| **Authentication** | JWT normalization & RBAC enforcement | Route middleware check |
| **Database** | Query indexing & select suppression | Mongoose query trace |
| **UX / UI** | Responsive, accessible, RTL Arabic support | Visual & browser audit |
