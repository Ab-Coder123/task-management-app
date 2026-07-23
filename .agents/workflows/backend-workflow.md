# Backend Engineering Workflow

Whenever I ask you to modify the backend, you MUST follow this workflow.

## Step 1 — Architecture Audit

Inspect the backend.

Understand:

- Folder structure
- Existing middleware
- Existing routes
- Controllers
- Models
- Authentication
- Authorization
- Response format

Never start coding first.

---

## Step 2 — Impact Analysis

Identify:

- Files to modify
- Database impact
- API impact
- Frontend impact
- Migration requirements

Explain risks before implementation.

---

## Step 3 — Design

Before coding:

Design the solution.

Explain:

- Schema changes
- Route changes
- Validation
- Security
- Performance

---

## Step 4 — Implementation

Follow project-checklist.md.

Requirements:

- No duplicated code.
- Reuse middleware.
- Reuse validation.
- Reuse utilities.
- Keep API responses consistent.
- Maintain backward compatibility whenever possible.

---

## Step 5 — Security Review

Verify:

✓ Authentication

✓ Authorization

✓ Ownership validation

✓ Role validation

✓ Input validation

✓ ObjectId validation

✓ Prevent privilege escalation

✓ Prevent unauthorized data access

---

## Step 6 — Performance Review

Review:

- MongoDB queries
- populate()
- indexes
- projections
- pagination
- query efficiency

Avoid unnecessary database calls.

---

## Step 7 — API Review

Ensure:

- Correct status codes
- Consistent response format
- Proper error messages
- Validation
- Edge case handling

---

## Step 8 — Self Testing

Verify:

- Existing features still work.
- No broken routes.
- No regression.
- No authorization leaks.
- No duplicated logic.

---

## Step 9 — Final Report

Provide:

- Modified files
- New files
- Removed files
- Database changes
- Migration needed
- Security review
- Performance review
- Production readiness score

Do NOT continue to another feature until this workflow has been completed.