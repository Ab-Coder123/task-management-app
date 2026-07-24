# Dependency Audit Workflow

This workflow evaluates the health, security, and necessity of all third-party packages in both frontend and backend environments.

---

## Audit Execution Steps

### 1. Security Vulnerabilities
- **NPM Audit**: Run `npm audit` on both frontend and backend to detect known vulnerabilities.
- **CVE Mitigation**: Identify actionable upgrades for critical and high-severity CVEs without breaking semantic versioning.

### 2. Package Bloat & Redundancy
- **Unused Dependencies**: Scan for packages listed in `package.json` that are no longer imported in the codebase.
- **Overlapping Libraries**: Identify overlapping functionality (e.g., having both `axios` and `fetch`, or multiple date formatting libraries).

### 3. License Compliance & Maintenance
- **Abandoned Packages**: Check for packages that haven't been updated in years and pose long-term maintenance risks.
- **License Checks**: Ensure all third-party libraries comply with the project's licensing requirements.

---

## Evaluation Output Format

- **Dependency Health Score (0-100)**
- **Vulnerability Matrix** (CVEs, severity, affected packages)
- **Upgrade & Cleanup Recommendations**
