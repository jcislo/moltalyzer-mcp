import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { BASE_URL, fetchWithTimeout } from "../client.js";
import { errorResult } from "./error.js";

export function register(server: McpServer) {
  server.registerTool("get_health", {
    description:
      "Check Moltalyzer API health and service status — returns overall status (ok/degraded), active job statuses, and x402 facilitator connectivity. Free, no payment or API key required.",
  }, async () => {
    const res = await fetchWithTimeout(fetch, `${BASE_URL}/health`);
    if (!res.ok) return errorResult(res);
    const data = await res.json();
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  });

  server.registerTool("get_api_info", {
    description:
      "Get Moltalyzer API overview — all available endpoints, pricing per call, recent changelog, and rate limits. Use this to discover what tools and data feeds are available. Free, no payment or API key required.",
  }, async () => {
    const res = await fetchWithTimeout(fetch, `${BASE_URL}/api`);
    if (!res.ok) return errorResult(res);
    const data = await res.json();
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  });

  server.registerTool("get_intelligence_sample", {
    description:
      "Get a free sample of the Master Intelligence Digest — a cross-domain synthesis combining crypto community sentiment, GitHub trending repos, Polymarket prediction signals, token intelligence, BTC derivatives, Fear & Greed index, and macro data. Generated every 4 hours. Rate limited to 1 request per 20 minutes. No payment or API key required. To get live data, use get_intelligence_digest ($0.01 via x402) or sign up for a free API key at https://moltalyzer.xyz.",
  }, async () => {
    const res = await fetchWithTimeout(fetch, `${BASE_URL}/api/intelligence/sample`);
    if (!res.ok) return errorResult(res);
    const data = await res.json();
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  });

  server.registerTool("get_moltbook_sample", {
    description:
      "Get a free sample of the Moltbook community digest — AI-generated analysis of crypto community sentiment, trending topics, emerging narratives, and hot discussions. Updated hourly. Rate limited to 1 request per 20 minutes. No payment or API key required. To get live data, use get_moltbook_digest (free, 1 req/5min) or sign up for a free API key at https://moltalyzer.xyz.",
  }, async () => {
    const res = await fetchWithTimeout(fetch, `${BASE_URL}/api/moltbook/sample`);
    if (!res.ok) return errorResult(res);
    const data = await res.json();
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  });

  server.registerTool("get_tokens_latest", {
    description:
      "Get the most recent token intelligence signal — hybrid rule+LLM scoring across Ethereum, Base, and BSC. Returns symbol, score (0-100), tier (meme/longterm), liquidity, volume, and risk assessment. Free, rate limited to 1 request per 5 minutes. No payment or API key required.",
  }, async () => {
    const res = await fetchWithTimeout(fetch, `${BASE_URL}/api/tokens/latest`);
    if (!res.ok) return errorResult(res);
    const data = await res.json();
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  });

  server.registerTool("get_polymarket_latest", {
    description:
      "Get the most recent Polymarket predetermined outcome signal — detects markets where the outcome is already known by insiders. Returns question, confidence level, reasoning, and insider type. Free, rate limited to 1 request per 5 minutes. No payment or API key required.",
  }, async () => {
    const res = await fetchWithTimeout(fetch, `${BASE_URL}/api/polymarket/latest`);
    if (!res.ok) return errorResult(res);
    const data = await res.json();
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  });

  server.registerTool("get_pulse_brief", {
    description:
      "Get the latest Pulse narrative intelligence brief — cross-source AI/business narrative tracking from Reddit, HN, GitHub, and HuggingFace. Returns title, summary, top insights, and narrative count. Free, no payment or API key required.",
  }, async () => {
    const res = await fetchWithTimeout(fetch, `${BASE_URL}/api/pulse/ai-business/digest/brief`);
    if (!res.ok) return errorResult(res);
    const data = await res.json();
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  });

  server.registerTool("get_pulse_latest", {
    description:
      "Get the full Pulse narrative intelligence digest — narrativeArcs, actionableSignals, sourceMix, and all insights. Tracks how stories form across multiple sources. Free, rate limited to 1 request per 5 minutes. No payment or API key required.",
  }, async () => {
    const res = await fetchWithTimeout(fetch, `${BASE_URL}/api/pulse/ai-business/digest/latest`);
    if (!res.ok) return errorResult(res);
    const data = await res.json();
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  });

  server.registerTool("get_moltbook_digest", {
    description:
      "Get the latest hourly Moltbook community digest — AI-generated analysis of crypto community sentiment, trending topics, emerging narratives, and hot discussions from the past hour. Returns title, summary, full markdown analysis, sentiment scores, and narrative tracking. Free, rate limited to 1 request per 5 minutes. No payment or API key required.",
  }, async () => {
    const res = await fetchWithTimeout(fetch, `${BASE_URL}/api/moltbook/digests/latest`);
    if (!res.ok) return errorResult(res);
    const data = await res.json();
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  });

  server.registerTool("get_github_digest", {
    description:
      "Get the latest daily GitHub trending repos digest — AI analysis of newly created repositories gaining traction, organized by category with emerging tools, language trends, and notable projects. Runs daily at 06:00 UTC scanning repos created in the last 24 hours. Free, rate limited to 1 request per 5 minutes. No payment or API key required.",
  }, async () => {
    const res = await fetchWithTimeout(fetch, `${BASE_URL}/api/github/digests/latest`);
    if (!res.ok) return errorResult(res);
    const data = await res.json();
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  });

  server.registerTool("get_intelligence_digest", {
    description:
      "Get the latest Master Intelligence Digest — a cross-domain synthesis combining crypto community sentiment, GitHub trends, Polymarket signals, and token intelligence into a unified analysis with executive summary, cross-domain insights, narratives, and sentiment. Updated every hour. Free, rate limited to 1 request per 5 minutes. No payment or API key required.",
  }, async () => {
    const res = await fetchWithTimeout(fetch, `${BASE_URL}/api/intelligence/latest`);
    if (!res.ok) return errorResult(res);
    const data = await res.json();
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  });
}
