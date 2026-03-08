# moltalyzer-mcp

MCP server for [Moltalyzer](https://moltalyzer.xyz) — crypto intelligence, GitHub trends, prediction market signals, and token analysis via x402 micropayments.

Works with Claude Desktop, Claude Code, ChatGPT, Cursor, and any MCP-compatible client.

## Setup

### 1. Get a wallet with USDC on Base

You need an EVM wallet private key with USDC on Base Mainnet. Each tool call costs $0.005–$0.05.

### 2. Add to your MCP client

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

**Claude Code** (`.claude/settings.json`):

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

## Tools

### Moltbook (Crypto Community Intelligence)

| Tool | Description | Price |
|------|-------------|-------|
| `get_moltbook_digest` | Latest hourly community sentiment digest — topics, narratives, hot discussions | $0.005 |
| `get_moltbook_history` | Historical hourly digests (1-24h lookback) | $0.02 |

### GitHub (Trending Repos)

| Tool | Description | Price |
|------|-------------|-------|
| `get_github_digest` | Latest daily digest of trending new repos | $0.02 |
| `get_github_history` | Historical daily digests (1-30 days) | $0.05 |
| `get_github_repos` | Top trending repos, filterable by language | $0.01 |

### Polymarket (Predetermined Outcome Detection)

| Tool | Description | Price |
|------|-------------|-------|
| `get_polymarket_signal` | Single signal — markets where outcome is already known by insiders | $0.01 |
| `get_polymarket_signals` | Batch of up to 20 signals, with polling support | $0.03 |

### Tokens (Real-Time Token Intelligence)

| Tool | Description | Price |
|------|-------------|-------|
| `get_token_signal` | Single token signal with hybrid AI scoring, risk flags, backtests | $0.01 |
| `get_token_signals` | Batch of up to 20 signals, filter by chain/tier/score | $0.05 |
| `get_token_history` | Historical signals by date range (max 7 days, paginated) | $0.03 |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `EVM_PRIVATE_KEY` | Yes | Wallet private key (0x-prefixed) with USDC on Base Mainnet |
| `MOLTALYZER_API_URL` | No | Override API base URL (default: `https://api.moltalyzer.xyz`) |

## How it works

This MCP server wraps the [Moltalyzer x402 API](https://api.moltalyzer.xyz/api). When an AI agent calls a tool, the server:

1. Makes an HTTP request to the API endpoint
2. Receives a 402 Payment Required response
3. Automatically signs a USDC payment on Base using your wallet
4. Retries the request with the payment signature
5. Returns the data to the agent

All payments use the [x402 protocol](https://www.x402.org/) — sub-cent micropayments with no API keys, accounts, or subscriptions.

## License

MIT
