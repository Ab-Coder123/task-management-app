# Runtime Analysis & Debugging Workflow

This workflow focuses on operational stability, debugging efficiency, and runtime error prevention in Node.js and React environments.

---

## Audit Execution Steps

### 1. Server-Side Runtime (Node.js)
- **Memory Leaks**: Identify unclosed database cursors, infinite loops, or accumulating arrays.
- **Unhandled Rejections**: Ensure all asynchronous operations catch and log promise rejections.
- **Event Loop Blocking**: Check for heavy synchronous computations that should be offloaded or optimized.

### 2. Client-Side Runtime (React/Next.js)
- **Hydration Errors**: Verify that server-rendered HTML matches the initial client render.
- **State Mutations**: Ensure React state is treated as immutable to prevent unpredictable UI behavior.
- **Console Errors**: Check for persistent warnings or errors in the browser console during normal usage.

### 3. Observability
- **Logging Standards**: Confirm structured logging is used for critical paths (auth, payments, data mutation).
- **Stack Traces**: Ensure stack traces are preserved in development but sanitized in production responses.

---

## Evaluation Output Format

- **Runtime Stability Score (0-100)**
- **Critical Warning Matrix** (Memory leaks, unhandled promises, hydration issues)
- **Fix Implementation Guide**
