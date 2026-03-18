# Public API and Migration Guarantees

This document defines the stable public surface for the published packages in this repo:

- `@mr.dj2u/mercury`
- `@mr.dj2u/mercury-ui`

## Stability Policy

The supported public API is the set of exports available from each package root entrypoint.

- We will not remove or rename a documented root export in a `0.x` release without calling it out clearly in release notes.
- Once these packages move to `1.0.0`, removing or renaming a documented root export will require a semver-major release.
- Deep imports into internal files are not supported compatibility targets.
- Temporary incubated package names from the Time2Pay branch, including `@mrdj/mercury` and `@mrdj/mercury-ui`, are not part of the supported public API.

## `@mr.dj2u/mercury`

Supported root exports:

- `createMercuryClient` and related client helpers from `client`
- typed Mercury errors from `errors`
- pagination helpers from `pagination`
- request and resource types from `types`
- utility helpers from `utils`
- webhook helpers from `webhooks`

Current root entrypoint:

```ts
export * from './client';
export * from './errors';
export * from './pagination';
export * from './types';
export * from './utils';
export * from './webhooks';
```

## `@mr.dj2u/mercury-ui`

Supported root exports:

- adapter contracts from `adapter`
- shared theme tokens from `theme`
- `AccountsSelect`
- `MercuryBankOverview`
- `InvoicesTable`
- `InvoiceWizard`
- `QuickInvoiceWizard`
- `MercuryBadge`
- `MercuryCard`
- `MercuryCustomerContactPanel`
- `MercuryInvoiceWorkflow`
- `MercuryLogo`
- `MercuryRecipientManager`
- `MercurySendMoneyWorkflow`
- `MercurySessionInvoiceWorkspace`
- `MercuryStatusNotice`
- `RecipientPicker`
- `SendMoneyForm`
- `Time2PayMercuryInvoiceBuilder`

Current root entrypoint:

```ts
export * from './adapter';
export * from './theme';
export * from './components/accounts-select';
export * from './components/invoices-table';
export * from './components/invoice-wizard';
export * from './components/quick-invoice-wizard';
export * from './components/mercury-badge';
export * from './components/mercury-bank-overview';
export * from './components/mercury-card';
export * from './components/mercury-customer-contact-panel';
export * from './components/mercury-invoice-workflow';
export * from './components/mercury-logo';
export * from './components/mercury-recipient-manager';
export * from './components/mercury-send-money-workflow';
export * from './components/mercury-session-invoice-workspace';
export * from './components/mercury-status-notice';
export * from './components/recipient-picker';
export * from './components/send-money-form';
export * from './components/time2pay-mercury-invoice-builder';
```

## Consumer Migration Guarantees

Consumers moving from the incubated Time2Pay branch to the extracted repo should expect:

- package name changes only:
  - `@mrdj/mercury` -> `@mr.dj2u/mercury`
  - `@mrdj/mercury-ui` -> `@mr.dj2u/mercury-ui`
- the same root-level concepts:
  - Mercury client factory
  - typed resources and errors
  - reusable Mercury UI primitives
  - invoice and send-money workflows
- future migration notes to be documented in release notes when package behavior changes materially

## Not Covered by This Guarantee

These are intentionally not promised as stable compatibility targets:

- internal file paths
- unpublished helper modules
- branch-local app components inside `time2pay-mercury`
- unfinished or Mercury-entitlement-dependent flows that are blocked outside the SDK itself
