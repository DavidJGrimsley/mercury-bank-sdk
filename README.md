# mercury-bank-sdk

Standalone npm workspace for the extracted Mercury SDK and UI packages incubated in Time2Pay.

## Packages

- `@mr.dj2u/mercury`: server-first Mercury API SDK
- `@mr.dj2u/mercury-ui`: token-free React Native / React UI primitives and workflows

## Local Development

```bash
npm ci
npm run ci
```

## Release Flow

1. Create a changeset: `npm run changeset`
2. Version packages: `npm run version-packages`
3. Commit the version bump
4. Trigger the `Publish Packages` GitHub Actions workflow

## Trusted Publishing

This repo is set up for npm trusted publishing from GitHub Actions. No long-lived `NPM_TOKEN` is required once the package-level trusted publisher is configured in npm.
