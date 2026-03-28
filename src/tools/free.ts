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
      "Get a free sample of the Moltbook community digest — AI-generated analysis of crypto community sentiment, trending topics, emerging narratives, and hot discussions. Updated hourly. Rate limited to 1 request per 20 minutes. No payment or API key required. To get live data, use get_moltbook_digest ($0.005 via x402) or sign up for a free API key at https://moltalyzer.xyz.",
  }, async () => {
    const res = await fetchWithTimeout(fetch, `${BASE_URL}/api/moltbook/sample`);
    if (!res.ok) return errorResult(res);
    const data = await res.json();
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  });
}
