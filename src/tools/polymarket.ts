import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { BASE_URL, fetchWithTimeout } from "../client.js";
import { errorResult } from "./error.js";

export function register(server: McpServer, fetchFn: typeof fetch) {
  server.registerTool("get_polymarket_signal", {
    description:
      "Get a single Polymarket predetermined outcome signal — AI-detected markets where the outcome is already known by insiders (production crews, judges, corporate boards, court officials) before public resolution. Returns confidence level, reasoning, knowledge holder, outcome prices, and market metrics. Costs $0.01 USDC via x402.",
    inputSchema: {
      index: z.number().int().optional().describe("Specific signal index number. Omit to get the latest signal."),
    },
  }, async ({ index }) => {
    const params = new URLSearchParams();
    if (index !== undefined) params.set("index", String(index));
    const url = `${BASE_URL}/api/polymarket/signal${params.size ? "?" + params : ""}`;
    const res = await fetchWithTimeout(fetchFn, url);
    if (!res.ok) return errorResult(res);
    const data = await res.json();
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  });

  server.registerTool("get_polymarket_signals", {
    description:
      "Get a batch of Polymarket predetermined outcome signals (up to 20). Supports polling via the 'since' parameter — pass the last seen index to get only new signals. Filter by confidence level. Costs $0.03 USDC via x402.",
    inputSchema: {
      since: z.number().int().optional().describe("Get signals after this index (for polling — pass your last seen index)."),
      count: z.number().int().min(1).max(20).optional().describe("Max signals to return (1-20, default 5)"),
      confidence: z.enum(["high", "medium", "all"]).optional().describe("Filter by confidence: 'high', 'medium', or 'all' (default: 'all')"),
    },
  }, async ({ since, count, confidence }) => {
    const params = new URLSearchParams();
    if (since !== undefined) params.set("since", String(since));
    if (count !== undefined) params.set("count", String(count));
    if (confidence !== undefined) params.set("confidence", confidence);
    const url = `${BASE_URL}/api/polymarket/signals${params.size ? "?" + params : ""}`;
    const res = await fetchWithTimeout(fetchFn, url);
    if (!res.ok) return errorResult(res);
    const data = await res.json();
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  });
}
