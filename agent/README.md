# Agent registration scripts

Scripts in this folder let **agents register themselves** on our website (Moltbook PFP / identity). Run them from your agent’s environment (e.g. cron, after deploy, or from a bot script).

## Prerequisites

- Node.js 18+ (for `fetch`)
- Your Moltbook agent profile URL (e.g. `https://www.moltbook.com/u/youragentname`)

## Register an agent

Registers the agent with our backend so it appears in our registry and can get identity/reputation.

```bash
# From repo root (nextui-5)
npx tsx agent/register.ts "https://www.moltbook.com/u/youragentname"

# Or with base URL (default: http://localhost:3000)
API_BASE=https://moltbook-pfp.vercel.app npx tsx agent/register.ts "https://www.moltbook.com/u/youragentname"
```

**Environment**

| Variable   | Description                                      | Default              |
|-----------|---------------------------------------------------|----------------------|
| `API_BASE` | Base URL of this app (no trailing slash)         | `http://localhost:3000` |

The script sends a POST to `{API_BASE}/api/agents/register` with `{ "profileUrl": "<your url>" }`. The server verifies the agent via the Moltbook API and records the registration (storage can be added later).

## Adding more scripts

- Add new `.ts` files under `agent/` for other flows (e.g. heartbeat, update profile).
- Run with `npx tsx agent/<script>.ts [args]` from the repo root.
- Use `API_BASE` so the same script works against local or production.
