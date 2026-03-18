# Mercury Bank SDK - TODO

## Current Status
- Repo: `mercury-bank-sdk`
- Published packages: `@mr.dj2u/mercury@0.1.0` and `@mr.dj2u/mercury-ui@0.1.1`
- Source of truth for package release/versioning work now lives here, not in the Time2Pay app repos
- Current consumer app: `f:\ReactNativeApps\time2pay-mercury`

## Completed Foundation
- [x] Extract Mercury SDK/UI package work out of the Time2Pay incubation branch
- [x] Publish initial `0.1.0` releases for both packages
- [x] Publish `0.1.1` patch release for `@mr.dj2u/mercury-ui` to fix web logo asset rendering
- [x] Configure GitHub Actions workflows for CI and manual package publishing
- [x] Configure npm trusted publishing for the GitHub repo
- [x] Verify the published packages install in a clean consumer environment

## SDK (`@mr.dj2u/mercury`) - Completed
- [x] Implement `createMercuryClient(config)` with environment/baseUrl/fetch/retry/logger options
- [x] Implement resource groups: `accounts`, `transactions`, `recipients`, `sendMoney`, `transfers`, `ar.customers`, `ar.invoices`, `webhooks`
- [x] Add typed errors and request safety wrappers
- [x] Add idempotency key helpers and enforce keys for money movement methods
- [x] Add utilities from app logic: date validation, line-item building, best checking account selection
- [x] Add unit tests for client, pagination, utils, and webhook parsing/signature
- [x] Add sandbox contract-test suite scaffold with opt-in env flags
- [x] Add invoice service-period support and richer line-item helpers for Time2Pay-style session invoices

## UI (`@mr.dj2u/mercury-ui`) - Completed
- [x] Add primitives/components: logo, badge, card, status notice, account select, recipient picker
- [x] Add workflow components: `InvoiceWizard` and `SendMoneyForm`
- [x] Add idempotency help tooltip (`i` hover/tap) in Send Money form
- [x] Add empty-state messaging when no recipients are available
- [x] Add Time2Pay-specific builder export: `Time2PayMercuryInvoiceBuilder`
- [x] Expand invoice wizard to maximal controls:
- [x] customer + routing fields
- [x] amount/currency
- [x] invoice and due dates
- [x] service period start/end
- [x] send-email option
- [x] ACH/card/real-account toggles
- [x] CC emails
- [x] structured line items with add/remove and validation
- [x] Fix responsive overflow issues in wizard layouts for smaller widths
- [x] Fix Mercury logo asset rendering on web for published consumers
- [ ] Create Uniwind version of UI package 

## Time2Pay Consumer Integration - Completed
- [x] Wire Mercury proxy actions in `time2pay-mercury/src/app/api/mercury+api.ts`
- [x] Switch `time2pay-mercury` from local workspace/file deps to published npm deps
- [x] Replace app-side Mercury calls with the published npm packages
- [x] Add `Payments` route plus Mercury-styled Bank, Payments, and Customer Contact surfaces
- [x] Keep the standard PDF invoice builder as the fallback when Mercury AR is unavailable
- [x] Add the Time2Pay Mercury invoice builder with session-derived service period and editable Mercury line items
- [x] Best-effort sync Time2Pay customer creation to Mercury AR customer creation when email + invoicing access are available
- [x] Add recipient creation/edit flow inside the app
- [x] Add explicit AR beta warnings and guardrails in Mercury-facing UI
- [x] Add mobile-first polish for the app-side Mercury forms and actions
- [x] Add integration tests for `/api/mercury` action handlers
- [x] Add smoke tests for Payments and Invoices routes on web
- [x] Verify app-side imports compile against the published package APIs
- [x] Verify app lint/typecheck/tests/doctor still pass with published packages

## Next Release Work
- [x] Freeze public APIs and document migration guarantees in `docs/public-api.md`
- [ ] Add a release checklist for `changeset -> version-packages -> publish`
- [ ] Add changelog/release notes guidance for both packages
- [ ] Add consumer examples beyond Time2Pay usage
- [ ] Add stronger docs around recipient editing payloads and send-money payment-method expectations
- [ ] Add explicit AR beta warnings and guardrails in the reusable UI package where appropriate
- [ ] Add mobile-first polish pass for reusable Mercury forms (spacing, keyboard, overflow, focus states)

## Testing and Reliability - Next
- [x] Run live Mercury sandbox contract tests with real sandbox credentials and fixtures
- [ ] Run live AR/invoicing contract tests once Mercury invoice access is available
- [ ] Add install/import smoke tests that exercise the published packages from a minimal example app
- [ ] Add release verification steps for trusted publishing failures and rollback handling

## Docs and Packaging - Next
- [ ] Tighten README usage examples for both packages
- [ ] Add a consumer migration note from the old incubated `@mrdj/*` package names to `@mr.dj2u/*`
- [ ] Document required peer/runtime expectations (`react`, `react-native`, Node version, Expo compatibility notes)
- [ ] Decide whether example assets and branding files should stay inside `@mr.dj2u/mercury-ui` or move to examples/docs

## Future Exploration
- [x] Submit the Sign in with Mercury application form and begin partnership feasibility review (2026-03-17)
- [ ] Track Mercury's response and decide whether OAuth integration is viable
- [ ] Evaluate whether invoice templates/helpers should support more opinionated session-based adapters beyond Time2Pay
