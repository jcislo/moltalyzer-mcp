# moltalyzer-mcp

MCP server for [Moltalyzer](https://moltalyzer.xyz) — crypto intelligence, GitHub trends, prediction market signals, and token analysis.

Works with Claude Desktop, Claude Code, ChatGPT, Cursor, and any MCP-compatible client.

**16 tools total.** 4 free tools (no setup needed). 12 paid tools via x402 micropayments ($0.005–$0.05 per call).

## Quick Start

### Option A: Free tier (no wallet needed)

4 tools available immediately: health check, API info, intelligence sample, Moltbook sample.

**Claude Code:**
```bash
claude mcp add moltalyzer -- npx -y moltalyzer-mcp
```

Or add to `.claude/settings.json`:
```json
{
  "mcpServers": {
    "moltalyzer": {
      "command": "npx",
      "args": ["-y", "moltalyzer-mcp"]
    }
  }
}
```

### Option B: Full access via x402 micropayments

All 16 tools. Pay per call with USDC on Base Mainnet (~$0.005–$0.05 per call). No subscription.

**Claude Code:**
```bash
claude mcp add moltalyzer -e EVM_PRIVATE_KEY=0xYOUR_KEY -- npx -y moltalyzer-mcp
```

**Claude Desktop** (`claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "moltalyzer": {
      "command": "npx",
      "args": ["-y", "moltalyzer-mcp"],
      "env": {
        "EVM_PRIVATE_KEY": "0xYOUR_PRIVATE_KEY_HERE"
      }
    }
  }
}
```

**Cursor** (`.cursor/mcp.json`):
```json
{
  "mcpServers": {
    "moltalyzer": {
      "command": "npx",
      "args": ["-y", "moltalyzer-mcp"],
      "env": {
        "EVM_PRIVATE_KEY": "0xYOUR_PRIVATE_KEY_HERE"
      }
    }
  }
}
```

To get USDC on Base: [Coinbase](https://coinbase.com), [Bridge from other chains](https://bridge.base.org/).

## Tools

### Free Tools (no wallet needed)

| Tool | Description |
|------|-------------|
| `get_health` | API health check — status, job statuses, x402 connectivity |
| `get_api_info` | All endpoints, pricing, changelog, and rate limits |
| `get_intelligence_sample` | Free sample of the Master Intelligence Digest (rate limited: 1/20min) |
| `get_moltbook_sample` | Free sample of the Moltbook community digest (rate limited: 1/20min) |

### Moltbook — Crypto Community Intelligence

| Tool | Description | Price |
|------|-------------|-------|
| `get_moltbook_digest` | Latest hourly community sentiment digest — topics, narratives, hot discussions | $0.005 |
| `get_moltbook_history` | Historical hourly digests (1-24h lookback) | $0.02 |

### Master Intelligence Digest — Cross-Domain Synthesis

| Tool | Description | Price |
|------|-------------|-------|
| `get_intelligence_digest` | Latest 4-hourly synthesis of all feeds — crypto, GitHub, Polymarket, tokens, macro | $0.01 |
| `get_intelligence_history` | Historical master digests (1-168h lookback) | $0.03 |

### GitHub — Trending Repos

| Tool | Description | Price |
|------|-------------|-------|
| `get_github_digest` | Latest daily digest of trending new repos | $0.02 |
| `get_github_history` | Historical daily digests (1-30 days) | $0.05 |
| `get_github_repos` | Top trending repos, filterable by language | $0.01 |

### Polymarket — Predetermined Outcome Detection

| Tool | Description | Price |
|------|-------------|-------|
| `get_polymarket_signal` | Single signal — markets where outcome is already known by insiders | $0.01 |
| `get_polymarket_signals` | Batch of up to 20 signals, with polling support | $0.03 |

### Tokens — Real-Time Token Intelligence

| Tool | Description | Price |
|------|-------------|-------|
| `get_token_signal` | Single token signal with hybrid AI scoring, risk flags, backtests | $0.01 |
| `get_token_signals` | Batch of up to 20 signals, filter by chain/tier/score | $0.05 |
| `get_token_history` | Historical signals by date range (max 7 days, paginated) | $0.03 |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `EVM_PRIVATE_KEY` | No | Wallet private key (0x-prefixed) with USDC on Base Mainnet. Required for paid tools. |
| `MOLTALYZER_API_URL` | No | Override API base URL (default: `https://api.moltalyzer.xyz`) |

## How Payments Work

When an AI agent calls a paid tool, the server:

1. Makes an HTTP request to the API endpoint
2. Receives a `402 Payment Required` response
3. Automatically signs a USDC payment on Base using your wallet
4. Retries the request with the payment signature
5. Returns the data to the agent

All payments use the [x402 protocol](https://www.x402.org/) — sub-cent micropayments with no API keys, accounts, or subscriptions required.

## License

MIT
