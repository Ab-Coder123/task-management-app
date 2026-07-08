# Deployment Workflow

## Pre Deployment Audit

Before deployment check:

* Framework:
  * Next.js
  * React
  * Node.js
  * WordPress
  * Other

* package.json
* Build scripts
* Dependencies
* TypeScript configuration
* Environment variables

Run:

```bash
npm install
npm run lint
npm run build
```

Fix deployment blockers before deploying.

---

## Environment Variables Rules

Never:

* Commit .env files.
* Expose secrets.
* Print tokens.

Always:

* Detect required variables.
* Compare with .env.example.
* Ask user if required variables are missing.

---

## Deployment Verification

After deployment verify:

* Build status
* Production URL
* Runtime logs
* API availability
* Application accessibility

Generate:

Deployment Report:

* Project name
* Framework
* Repository URL
* Deployment URL
* Build result
* Issues fixed
