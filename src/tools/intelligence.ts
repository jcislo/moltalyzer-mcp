import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { BASE_URL, fetchWithTimeout } from "../client.js";
import { errorResult } from "./error.js";

export function register(server: McpServer, fetchFn: typeof fetch) {
  server.registerTool("get_intelligence_history", {
    description:
      "Get historical Master Intelligence Digests — cross-domain synthesis over a configurable lookback window (1-168 hours). Track how the unified intelligence picture evolves over time. Costs $0.03 USDC via x402.",
    inputSchema: {
      hours: z.number().int().min(1).max(168).optional().describe("How many hours back to look (1-168, default 48)"),
      limit: z.number().int().min(1).max(50).optional().describe("Maximum number of digests to return (1-50, default 10)"),
    },
  }, async ({ hours, limit }) => {
    const params = new URLSearchParams();
    if (hours !== undefined) params.set("hours", String(hours));
    if (limit !== undefined) params.set("limit", String(limit));
    const url = `${BASE_URL}/api/intelligence/history${params.size ? "?" + params : ""}`;
    const res = await fetchWithTimeout(fetchFn, url);
    if (!res.ok) return errorResult(res);
    const data = await res.json();
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  });
}
