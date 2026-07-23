---
description: 10 phases to verify and complet the logic code of user 
---

# Release Workflow

Whenever I say:

> Start Phase X

You MUST follow this workflow exactly.

---

## Step 1 — Project Audit

Before changing anything:

- Inspect the current implementation.
- Understand the existing architecture.
- Identify every related file.
- Detect possible side effects.
- Do NOT modify code yet.

Produce a short implementation plan.

---

## Step 2 — Engineering Review

Review the current implementation.

Answer:

- What already exists?
- What is missing?
- What should be preserved?
- What should be refactored?
- Any security concerns?
- Any performance concerns?

Do not start coding yet.

---

## Step 3 — Implementation

Implement the phase.

Requirements:

- Reuse existing architecture.
- Avoid duplicate code.
- Keep TypeScript types consistent.
- Keep naming conventions.
- Maintain backward compatibility whenever possible.

---

## Step 4 — Self Verification

After implementation:

Verify:

✔ Feature works

✔ No duplicated code

✔ No broken imports

✔ No broken types

✔ No authorization leaks

✔ No UI regressions

✔ No API regressions

✔ No console errors

✔ No TypeScript errors

---

## Step 5 — Build Verification

Run all possible verification.

Frontend

- npm run build

Backend

- Verify routes
- Verify middleware
- Verify authentication
- Verify authorization

Fix every issue before continuing.

---

## Step 6 — Code Quality Review

Review all modified files.

Check:

- Readability
- Maintainability
- SOLID principles
- DRY
- Reusability
- Error handling
- Validation
- Edge cases

Refactor if necessary.

---

## Step 7 — Final Audit

Before considering the phase complete:

Verify:

- Security
- Performance
- Architecture
- UX
- Responsiveness

---

## Step 8 — Release Report

Produce a release report.

Include:

### Modified Files

### New Files

### Deleted Files

### Backend Changes

### Frontend Changes

### Database Changes

### API Changes

### Security Improvements

### Breaking Changes

### Migration Needed

### Performance Impact

### Verification Results

### Remaining Issues

### Production Readiness Score

---

## Step 9 — Wait

Never continue to the next phase automatically.

Wait until I explicitly say:

> Start Phase X+1