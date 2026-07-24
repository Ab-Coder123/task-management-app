# Backend Workflow Standard & Engineering Guide

This workflow defines the mandatory backend engineering standards, architecture rules, validation strategies, authentication/authorization rules, and database guidelines.

---

## 1. Architecture Audit & Impact Analysis Workflow
Before writing or modifying any backend logic:
1. Trace the complete request lifecycle from route handler -> middleware -> service/schema logic -> database -> response.
2. Determine if database schemas, field definitions, or indexes are affected.
3. Check backward compatibility with existing API clients and frontend state models.
4. Verify if data migration is required for existing documents.

---

## 2. Core Backend Engineering Standards

### Express Router & File Structure
- Keep routes modular in `routes/`.
- Never place business logic directly in route wrappers; use clean modular handlers.
- Enforce strict HTTP status code usage:
  - `200 OK`: Successful retrieval or update.
  - `201 Created`: Successful creation.
  - `400 Bad Request`: Validation failure or malformed payload.
  - `401 Unauthorized`: Missing or invalid authentication token.
  - `403 Forbidden`: Authenticated user lacks permission for the resource.
  - `404 Not Found`: Resource does not exist.
  - `500 Internal Server Error`: Unhandled server exception.

### Authentication & Authorization Pipeline
- All protected endpoints MUST use `authenticateToken` middleware (`middleware/auth.js`).
- Normalize `req.user`: Ensure `req.user.userId` is always present regardless of JWT field naming (`userId` vs `id`).
- Enforce strict Role-Based Access Control (RBAC):
  - `admin`: Global access (except strictly private user content when isolated).
  - `user`: Isolated access limited to assigned or owned resources.

### Input Validation & Data Hygiene
- Validate all incoming `req.body`, `req.params`, and `req.query` inputs BEFORE processing.
- Verify MongoDB `ObjectId` strings using `mongoose.Types.ObjectId.isValid()`.
- Return clean error responses with descriptive messages (`{ message: "..." }`).

### Mongoose & Database Hygiene
- **No Unfiltered In-Memory Querying**: Push filter criteria (`$or`, `$and`, `$in`) directly into MongoDB queries.
- **Select Suppression**: Sensitive fields (e.g. passwords, deprecated fields, private items) MUST use `select: false` in Mongoose schema unless explicitly requested with `.select('+fieldName')`.
- **Population**: Explicitly populate only required fields (e.g. `.populate('assignedTo', 'username email avatar role')`).
- **Indexes**: Ensure queried fields (`assignedTo`, `createdBy`, `isPrivate`, `status`) have index coverage.

---

## 3. Mandatory Backend Verification Checklist
Before completing any backend task, verify:
- [ ] Routes pass all validation checks.
- [ ] Auth & authorization middleware applied correctly.
- [ ] Responses adhere to standard JSON format.
- [ ] No unhandled Promise rejections or missing try/catch blocks.
- [ ] `npm audit` reports no critical security vulnerabilities.
