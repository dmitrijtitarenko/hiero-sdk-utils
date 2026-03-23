# Design: Monorepo Restructure, React Package, Examples, npm Publish

Date: 2026-03-24
Status: Approved

## Overview

Restructure `hiero-sdk-utils` from a single-package repository into an npm workspaces monorepo containing two publishable packages and a runnable examples directory. This mirrors the structure of the reference library (`hiero-enterprise-java`) which has a core module, framework-specific integration modules, and sample applications.

The goal is to make the library genuinely ecosystem-ready: installable from npm, demonstrable in a running React app, and structured in a way that production libraries are structured.

---

## 1. Repository Structure

The root of the repository becomes a workspace container. Nothing at the root is published to npm.

```
hiero-sdk-utils/                     repo root
├── packages/
│   ├── core/                        published as "hiero-sdk-utils"
│   │   ├── src/
│   │   ├── tests/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── tsconfig.cjs.json
│   │   ├── vitest.config.ts
│   │   └── .eslintrc.cjs
│   └── react/                       published as "hiero-sdk-utils-react"
│       ├── src/
│       │   ├── HieroProvider.tsx
│       │   ├── hooks/
│       │   │   ├── useAccount.ts
│       │   │   ├── useTransaction.ts
│       │   │   ├── useToken.ts
│       │   │   ├── useNFTs.ts
│       │   │   ├── useAccountTransactions.ts
│       │   │   └── useTopicMessages.ts
│       │   └── index.ts
│       ├── tests/
│       │   └── hooks/
│       ├── package.json
│       └── tsconfig.json
├── examples/
│   ├── README.md
│   ├── basic-queries.ts             runnable: npx tsx basic-queries.ts
│   ├── pagination.ts                runnable: npx tsx pagination.ts
│   ├── error-handling.ts            runnable: npx tsx error-handling.ts
│   └── react-app/                   runnable: npm install && npm run dev
│       ├── src/
│       │   ├── main.tsx
│       │   ├── App.tsx
│       │   └── components/
│       │       ├── AccountCard.tsx
│       │       ├── TransactionList.tsx
│       │       └── TokenCard.tsx
│       ├── index.html
│       ├── package.json
│       └── vite.config.ts
├── package.json                     workspace root
├── tsconfig.base.json               shared compiler options
├── .eslintrc.cjs                    shared lint config
├── .gitignore
├── CONTRIBUTING.md
├── LICENSE
└── .github/workflows/ci.yml
```

### Migration of existing code

All existing source files move from the root into `packages/core/`. The root `package.json` is replaced with a workspace root. Existing tests, configs, and scripts move with the source. Git history is preserved — this is a rename/move, not a rewrite.

---

## 2. Root package.json (workspace root)

```json
{
  "name": "hiero-sdk-utils-workspace",
  "private": true,
  "workspaces": ["packages/*"],
  "scripts": {
    "build": "npm run build --workspaces --if-present",
    "test": "npm run test --workspaces --if-present",
    "lint": "npm run lint --workspaces --if-present",
    "typecheck": "npm run typecheck --workspaces --if-present"
  }
}
```

The root is `private: true` — it is never published.

---

## 3. Core package (packages/core)

The existing `hiero-sdk-utils` code moves here unchanged. The `package.json` `name` stays `"hiero-sdk-utils"`. All existing scripts, exports, engines, and keywords remain the same.

The only additions:
- `repository.directory` field pointing to `packages/core`
- Version remains `0.1.0`

---

## 4. React package (packages/react)

### Package identity

```json
{
  "name": "hiero-sdk-utils-react",
  "version": "0.1.0",
  "description": "React hooks for Hedera/Hiero Mirror Node — built on hiero-sdk-utils",
  "peerDependencies": {
    "react": ">=18.0.0",
    "hiero-sdk-utils": ">=0.1.0"
  }
}
```

React and `hiero-sdk-utils` are peer dependencies — the consuming app provides them. The package itself has no runtime dependencies.

### HieroProvider

A React context provider that holds the `HieroClient` instance. Placed once at the root of the application.

```tsx
interface HieroProviderProps {
  client: HieroClient;
  children: React.ReactNode;
}

export function HieroProvider({ client, children }: HieroProviderProps): JSX.Element
```

Throws at render time if `client` is not provided — fails fast rather than producing silent bugs downstream.

### Hook return type

All hooks return the same shape:

```typescript
interface HieroQueryResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}
```

`refetch()` triggers a fresh network request without changing any parameters. `data` is `null` while loading or on error. `loading` is `true` only during an in-flight request.

### Nullable IDs — conditional fetching

All ID parameters accept `null`. Passing `null` skips the fetch entirely and returns `{ data: null, loading: false, error: null }`. This handles the standard React pattern where an ID is not yet known:

```tsx
const { data } = useAccount(user?.accountId ?? null);
```

### The six hooks

| Hook | Fetches | Return type |
|---|---|---|
| `useAccount(id)` | single account | `AccountInfo` |
| `useTransaction(id)` | single transaction | `TransactionInfo` |
| `useToken(id)` | single token | `TokenInfo` |
| `useNFTs(tokenId, params?)` | NFT list (first page) | `NftInfo[]` |
| `useAccountTransactions(accountId, params?)` | transaction list | `TransactionInfo[]` |
| `useTopicMessages(topicId, params?)` | HCS message list | `TopicMessage[]` |

List hooks (`useNFTs`, `useAccountTransactions`, `useTopicMessages`) collect the first page of results. The `limit` param in the query params controls how many items are returned. Pagination beyond the first page is out of scope for hooks — consumers who need full pagination use the core paginator directly.

### Testing

Hooks are tested with `@testing-library/react`. Tests mock the `HieroClient` methods (not global fetch) and verify:
- Correct loading state transitions
- Data populates on success
- Error populates on failure
- Hook does not fetch when ID is null
- refetch triggers a second call

---

## 5. Examples

### Node.js scripts (examples/*.ts)

Three self-contained scripts, each runnable with `npx tsx <file>.ts` from the `examples/` directory. No setup required — they point at the public testnet.

| File | Demonstrates |
|---|---|
| `basic-queries.ts` | `getById` for accounts, tokens, transactions |
| `pagination.ts` | `for await...of` through paginated results, early break |
| `error-handling.ts` | `ValidationError` on bad input, `MirrorNodeError` on 404 |

### React app (examples/react-app/)

A minimal Vite + React 18 application. Runnable with:

```
cd examples/react-app
npm install
npm run dev
```

The app has three components:
- **AccountCard** — search by account ID, displays balance, key type, creation timestamp
- **TransactionList** — shows recent transactions for a searched account
- **TokenCard** — search by token ID, displays name, symbol, supply, type

The app uses `HieroProvider` and all six hooks. It is connected to testnet by default. It has no styling framework — plain CSS — so the focus stays on the library, not the UI.

The react-app is **not** a workspace package. It is not tested in CI and not published. It is a demonstration artifact.

---

## 6. npm Publish

### Authentication

```bash
npm login   # username: dmitrijtitarenko
```

### Publish both packages

```bash
npm run build                              # build all workspaces
npm publish --workspace packages/core
npm publish --workspace packages/react
```

Each `package.json` has `"publishConfig": { "access": "public" }` to ensure public visibility.

Each has a `prepublishOnly` script: `typecheck && lint && test && build`. Nothing publishes unless all checks pass.

### CI

CI does not auto-publish. Publishing is a manual step controlled by the developer. The CI pipeline builds and verifies both packages (`npm pack --dry-run`) on every push to confirm publishability, but does not push to the registry.

---

## 7. GitHub Release (v0.1.0)

A release is created from the `v0.1.0` tag already present on `main`.

Release title: `v0.1.0`

Release body: factual, no emojis, covers:
- What the release includes (core + React packages)
- Installation for both packages
- Compatibility (Node 18+, React 18+)
- Link to full README and examples

---

## 8. CI Pipeline Changes

The CI matrix runs on Node 18, 20, and 22. Steps:

1. Install — `npm ci` (installs all workspaces)
2. Typecheck — `npm run typecheck --workspaces`
3. Lint — `npm run lint --workspaces`
4. Unit tests — core unit tests
5. Integration tests — core integration tests (real testnet)
6. React tests — `npm test --workspace packages/react`
7. Build — `npm run build --workspaces`
8. Verify — `npm pack --dry-run` for both packages

---

## 9. Implementation Order

1. Restructure repo into monorepo (move core, create workspace root)
2. Validate core still builds and tests pass
3. Implement `packages/react` (HieroProvider + 6 hooks + tests)
4. Write Node.js example scripts
5. Build Vite React example app
6. npm login and publish both packages
7. Create GitHub Release for v0.1.0
