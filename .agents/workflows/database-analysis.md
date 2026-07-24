# Database & Data Layer Analysis Workflow

This workflow audits Mongoose schemas, MongoDB indexing, query efficiency, and data isolation strategies.

---

## Audit Execution Steps

### 1. Schema Design
- **Data Types**: Verify correct usage of Mongoose Schema types (e.g., `ObjectId` vs `String`).
- **References & Embedding**: Evaluate whether one-to-many relationships should be embedded arrays or referenced documents based on scale.

### 2. Query Efficiency & Indexing
- **Index Coverage**: Ensure compound indexes are created for queries filtering or sorting by multiple fields.
- **Select Suppression**: Verify `.select()` is used to omit large text fields or sensitive data (e.g., passwords) when not needed.

### 3. Data Integrity & Validation
- **Validation Rules**: Check that Mongoose models enforce `required`, `minlength`, `maxlength`, and `enum` constraints correctly.
- **Pre/Post Hooks**: Audit Mongoose middleware hooks to ensure they don't trigger unexpected side effects or infinite loops.

---

## Evaluation Output Format

- **Database Health Score (0-100)**
- **Optimization Matrix** (Missing indexes, inefficient schemas, validation gaps)
- **Schema Refactoring Recommendations**
