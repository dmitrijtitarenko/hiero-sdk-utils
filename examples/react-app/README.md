# Hiero Explorer — React Demo App

A minimal Vite + React 18 application demonstrating `hiero-sdk-utils-react` hooks
against the live Hedera testnet.

## Prerequisites

Build the packages first (from the repo root):

```bash
npm run build
```

## Running the app

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## What it demonstrates

- **Account tab** — search any account by ID, see balance, key type, and recent
  transactions. Click a transaction to expand fee and transfer details.
- **Token tab** — search any token by ID, see metadata; for NFT tokens, shows
  the first 5 NFTs with serial numbers and owners.
- **Topic Messages tab** — load HCS messages for any topic ID.

All six `hiero-sdk-utils-react` hooks are used:

- `useAccount` — account lookup
- `useAccountTransactions` — recent transaction list
- `useTransaction` — transaction detail on click
- `useToken` — token info
- `useNFTs` — NFT gallery for NFT tokens
- `useTopicMessages` — HCS message viewer
