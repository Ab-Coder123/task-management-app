# Systematic Debugging Workflow

This workflow governs debugging procedures to prevent symptom masking and enforce evidence-based root cause diagnosis.

---

## Mandatory Debugging Steps

### Step 1: Log Extraction & Empirical Traceback Analysis
- **NEVER** guess code logic or form diagnostic hypotheses without inspecting un-truncated error logs.
- Inspect application console logs, Next.js build logs, or terminal outputs immediately when an error occurs.
- Locate exact stack traces, line numbers, error codes, and HTTP status codes.

### Step 2: Root Cause Isolation
- Trace upstream data flow to determine where invalid state or contract violation originated.
- Verify object initialization, non-null assertions, and type compatibility before dereferencing properties.

### Step 3: No Symptom Masking Policy
- **STRICT PROHIBITION**: Never resolve errors by wrapping failing calls in empty `try/catch` blocks, returning fake fallback objects, or ignoring failing assertions.
- Fix the root contract violation in the upstream provider or schema.

### Step 4: Empirical Verification
- Re-run verification commands (`npm run build`, API request tests) to prove the fix resolves the root cause.
