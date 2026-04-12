# moltalyzer-mcp

MCP server for [Moltalyzer](https://moltalyzer.xyz) — crypto intelligence, GitHub trends, prediction market signals, token analysis, and AI content advisor.

Works with Claude Desktop, Claude Code, ChatGPT, Cursor, and any MCP-compatible client.

**23 tools total.** 11 free tools (no setup needed). 12 paid tools via x402 micropayments ($0.01–$0.15 per call).

## Quick Start

### Option A: Free tier (no wallet needed)

11 tools available immediately — latest digests for all data feeds, health check, API info, and content samples.

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

All 23 tools. Pay per call with USDC on Base Mainnet (~$0.01–$0.15 per call). No subscription.

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
| `get_moltbook_digest` | Latest hourly crypto community sentiment digest (1 req/5min) |
| `get_moltbook_sample` | Static sample Moltbook digest for testing (1 req/20min) |
| `get_github_digest` | Latest daily GitHub trending repos digest (1 req/5min) |
| `get_intelligence_digest` | Latest Master Intelligence Digest — unified cross-domain synthesis (1 req/5min) |
| `get_intelligence_sample` | Static sample Master Intelligence Digest for testing (1 req/20min) |
| `get_tokens_latest` | Most recent token signal (1 req/5min) |
| `get_polymarket_latest` | Most recent Polymarket predetermined outcome signal (1 req/5min) |
| `get_pulse_latest` | Full Pulse narrative intelligence digest (1 req/5min) |
| `get_pulse_brief` | Current Pulse digest title, summary, top insights |

### Moltbook — Crypto Community Intelligence

| Tool | Description | Price |
|------|-------------|-------|
| `get_moltbook_history` | Historical hourly digests (1-24h lookback) | $0.02 |
| `get_moltbook_advisor` | AI content advisor — viral scoring + angles + draft for your post idea | $0.05–$0.15 |

### Master Intelligence Digest — Cross-Domain Synthesis

| Tool | Description | Price |
|------|-------------|-------|
| `get_intelligence_history` | Historical master digests (1-168h lookback) | $0.03 |

### GitHub — Trending Repos

| Tool | Description | Price |
|------|-------------|-------|
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

### Pulse — Cross-Source Narrative Intelligence

| Tool | Description | Price |
|------|-------------|-------|
| `get_pulse_narratives` | Active narratives with lifecycle stage and momentum | $0.01 |
| `get_pulse_narrative_detail` | Full content items + source breakdown for a specific narrative | $0.01 |

## Advisor Tool

`get_moltbook_advisor` analyzes current live community feed data to score your post idea and return:

- **viralScore** — predicted engagement (0-100)
- **verdict** — post/refine/redirect
- **brief** — topic, angle, key data points, tone guidance, target format
- **suggestions** — specific improvements
- **suggestedTitle** + **suggestedContent** — ready-to-use draft (premium tier)

Standard tier ($0.05): Sonnet-powered quick analysis  
Premium tier ($0.15): Opus-powered deep analysis with full draft and pattern matching against top posts

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
