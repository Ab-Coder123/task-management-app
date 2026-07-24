# Backend Architecture & API Analysis Workflow

This workflow evaluates Express route structure, controller logic, API standards, and overall backend maintainability.

---

## Audit Execution Steps

### 1. API Design & REST Standards
- **Endpoint Structure**: Ensure routes follow standard RESTful conventions (`GET /api/tasks`, `POST /api/tasks`).
- **Response Payloads**: Verify responses are structured consistently (e.g., `{ success: true, data: [...] }`).
- **HTTP Status Codes**: Check that appropriate status codes (200, 201, 400, 401, 403, 404, 500) are returned correctly.

### 2. Controller & Route Logic
- **Fat Controllers**: Ensure business logic is extracted from route handlers into dedicated service functions where appropriate.
- **Input Validation**: Verify that `req.body`, `req.query`, and `req.params` are validated thoroughly before processing (e.g., preventing NoSQL injection).

### 3. Middleware Pipeline
- **Execution Order**: Audit the order of Express middleware to ensure authentication and error handling are placed correctly.
- **Error Handling**: Verify the presence of a global error handling middleware to catch synchronous and asynchronous route errors.

---

## Evaluation Output Format

- **Backend Health Score (0-100)**
- **API Defect Matrix** (Inconsistent payloads, missing validation, fat controllers)
- **Architecture Refactoring Recommendations**
