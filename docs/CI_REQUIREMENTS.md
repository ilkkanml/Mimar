# Mimar — CI Requirements

Codex must create the real GitHub Actions workflow during M1 project setup, after `package.json` exists.

## Required Node version

Use Node 22.

## Required commands

The project must provide these package scripts:

```text
npm run lint
npm test
npm run build
```

## Required workflow behavior

The CI workflow must run on pull requests and pushes to `main`.

The quality gate must execute:

1. Checkout repository.
2. Setup Node 22.
3. Install dependencies.
4. Run lint.
5. Run tests.
6. Run build.

## Blocking rule

A milestone implementation is not complete until the CI workflow exists and passes for the implemented code.

## M1 responsibility

M1-001 must add:

- `package.json`
- TypeScript/Vite setup
- lint script
- test script
- build script
- `.github/workflows/ci.yml`
