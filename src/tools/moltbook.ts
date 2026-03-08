import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { BASE_URL, fetchWithTimeout } from "../client.js";
import { errorResult } from "./error.js";

export function register(server: McpServer, fetchFn: typeof fetch) {
  server.registerTool("get_moltbook_digest", {
    description:
      "Get the latest hourly Moltbook community digest — AI-generated analysis of crypto community sentiment, trending topics, emerging narratives, and hot discussions from the past hour. Returns title, summary, full markdown analysis, sentiment scores, and narrative tracking. Costs $0.005 USDC via x402.",
  }, async () => {
    const res = await fetchWithTimeout(fetchFn, `${BASE_URL}/api/moltbook/digests/latest`);
    if (!res.ok) return errorResult(res);
    const data = await res.json();
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  });

  server.registerTool("get_moltbook_history", {
    description:
      "Get historical Moltbook community digests — hourly sentiment analysis over a configurable lookback window (1-24 hours). Use this to track how community sentiment, topics, and narratives have evolved over time. Returns an array of hourly digest objects. Costs $0.02 USDC via x402.",
    inputSchema: {
      hours: z.number().int().min(1).max(24).optional().describe("How many hours back to look (1-24, default 24)"),
      limit: z.number().int().min(1).max(24).optional().describe("Maximum number of digests to return (1-24, default 24)"),
    },
  }, async ({ hours, limit }) => {
    const params = new URLSearchParams();
    if (hours !== undefined) params.set("hours", String(hours));
    if (limit !== undefined) params.set("limit", String(limit));
    const url = `${BASE_URL}/api/moltbook/digests${params.size ? "?" + params : ""}`;
    const res = await fetchWithTimeout(fetchFn, url);
    if (!res.ok) return errorResult(res);
    const data = await res.json();
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  });
}
