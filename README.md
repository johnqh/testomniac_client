# @sudobility/testomniac_client

API client SDK for Testomniac with TanStack Query hooks for AI-powered automated UI testing.

## Installation

```bash
bun add @sudobility/testomniac_client
```

## Usage

```typescript
import { TestomniacClient, useHistories, useHistoriesTotal } from "@sudobility/testomniac_client";

const client = new TestomniacClient({ baseUrl, networkClient });

// React hook usage
const { histories, createHistory, deleteHistory } = useHistories({
  client,
  userId: "firebase-uid",
  token,
});

const { data: total } = useHistoriesTotal({ client });
```

## API

### TestomniacClient

Constructed with `{ baseUrl, networkClient }`. Uses dependency-injected `NetworkClient` for all HTTP calls.

### Hooks

- `useHistories(config)` -- Query + mutations for user history CRUD with auto-invalidation
- `useHistoriesTotal(config)` -- Query for global total (public endpoint)

### Cache Settings

- `staleTime`: 5 minutes, `gcTime`: 30 minutes

## Development

```bash
bun run build        # Build ESM
bun test             # Run tests
bun run verify       # All checks + build
```

## Related Packages

- `testomniac_types` -- Shared type definitions
- `testomniac_lib` -- Business logic with Zustand stores
- `testomniac_api` -- Backend API server
- `testomniac_app` -- Web app
- `testomniac_app_rn` -- React Native app

## License

BUSL-1.1
