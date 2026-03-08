import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { BASE_URL, fetchWithTimeout } from "../client.js";
import { errorResult } from "./error.js";

export function register(server: McpServer, fetchFn: typeof fetch) {
  server.registerTool("get_token_signal", {
    description:
      "Get a single token intelligence signal — real-time AI analysis of newly launched tokens with hybrid scoring (70% rule-based + 30% LLM), risk assessment, red/green flags, liquidity and volume metrics, social presence, and backtest results. Covers Ethereum, Base, and BSC chains. Costs $0.01 USDC via x402.",
    inputSchema: {
      index: z.number().int().optional().describe("Specific signal index number. Omit to get the latest signal."),
    },
  }, async ({ index }) => {
    const params = new URLSearchParams();
    if (index !== undefined) params.set("index", String(index));
    const url = `${BASE_URL}/api/tokens/signal${params.size ? "?" + params : ""}`;
    const res = await fetchWithTimeout(fetchFn, url);
    if (!res.ok) return errorResult(res);
    const data = await res.json();
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  });

  server.registerTool("get_token_signals", {
    description:
      "Get a batch of token intelligence signals (up to 20). Supports polling via 'since' parameter, chain filtering (ethereum/base/bsc), tier filtering (meme for short-term momentum, longterm for sustainable projects), and minimum score threshold. Costs $0.05 USDC via x402.",
    inputSchema: {
      since: z.number().int().optional().describe("Get signals after this index (for polling — pass your last seen index)."),
      count: z.number().int().min(1).max(20).optional().describe("Max signals to return (1-20, default 5)"),
      chain: z.enum(["ethereum", "base", "bsc"]).optional().describe("Filter by chain: 'ethereum', 'base', or 'bsc'"),
      tier: z.enum(["meme", "longterm"]).optional().describe("Filter by tier: 'meme' (short-term momentum) or 'longterm' (sustainable project)"),
      minScore: z.number().int().min(0).max(100).optional().describe("Minimum hybrid score (0-100, default 0)"),
    },
  }, async ({ since, count, chain, tier, minScore }) => {
    const params = new URLSearchParams();
    if (since !== undefined) params.set("since", String(since));
    if (count !== undefined) params.set("count", String(count));
    if (chain !== undefined) params.set("chain", chain);
    if (tier !== undefined) params.set("tier", tier);
    if (minScore !== undefined) params.set("minScore", String(minScore));
    const url = `${BASE_URL}/api/tokens/signals${params.size ? "?" + params : ""}`;
    const res = await fetchWithTimeout(fetchFn, url);
    if (!res.ok) return errorResult(res);
    const data = await res.json();
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  });

  server.registerTool("get_token_history", {
    description:
      "Get historical token signals by date range (max 7-day window, paginated). Filter by chain, tier, and minimum score. Returns signals with full analysis including backtest results. Costs $0.03 USDC via x402.",
    inputSchema: {
      from: z.string().describe("Start date (ISO 8601 or YYYY-MM-DD), inclusive. Required."),
      to: z.string().optional().describe("End date (ISO 8601 or YYYY-MM-DD), exclusive. Defaults to now."),
      chain: z.enum(["ethereum", "base", "bsc"]).optional().describe("Filter by chain: 'ethereum', 'base', or 'bsc'"),
      tier: z.enum(["meme", "longterm"]).optional().describe("Filter by tier: 'meme' (short-term momentum) or 'longterm' (sustainable project)"),
      minScore: z.number().int().min(0).max(100).optional().describe("Minimum hybrid score (0-100, default 0)"),
      page: z.number().int().min(1).optional().describe("Page number (default 1)"),
      limit: z.number().int().min(1).max(100).optional().describe("Results per page (1-100, default 20)"),
    },
  }, async ({ from, to, chain, tier, minScore, page, limit }) => {
    const params = new URLSearchParams();
    params.set("from", from);
    if (to !== undefined) params.set("to", to);
    if (chain !== undefined) params.set("chain", chain);
    if (tier !== undefined) params.set("tier", tier);
    if (minScore !== undefined) params.set("minScore", String(minScore));
    if (page !== undefined) params.set("page", String(page));
    if (limit !== undefined) params.set("limit", String(limit));
    const url = `${BASE_URL}/api/tokens/history${params.size ? "?" + params : ""}`;
    const res = await fetchWithTimeout(fetchFn, url);
    if (!res.ok) return errorResult(res);
    const data = await res.json();
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  });
}
