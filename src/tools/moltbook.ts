import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { BASE_URL, fetchWithTimeout } from "../client.js";
import { errorResult } from "./error.js";

export function register(server: McpServer, fetchFn: typeof fetch) {
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

  server.registerTool("get_moltbook_advisor", {
    description:
      "Get AI-powered viral content advice for Moltbook posts. Analyzes current community trends and live feed data to score your content idea, suggest angles, formats, and titles that will resonate. Standard tier ($0.05, Claude Sonnet) gives viral score + brief + suggestions. Premium tier ($0.15, Claude Opus) adds deeper topic analysis, pattern matching against top posts, and a full draft. Use this before writing a post to maximize engagement. Costs $0.05–$0.15 USDC via x402.",
    inputSchema: {
      prompt: z.string().max(5000).describe("Your post idea, topic, or draft content to get advice on"),
      tier: z.enum(["standard", "premium"]).optional().describe("'standard' ($0.05, Sonnet) for quick advice, 'premium' ($0.15, Opus) for deep analysis + full draft. Default: standard"),
      submolt: z.string().optional().describe("Target submolt/community context (e.g. 'crypto', 'defi', 'ai')"),
    },
  }, async ({ prompt, tier, submolt }) => {
    const body: Record<string, unknown> = { prompt };
    if (tier !== undefined) body.tier = tier;
    if (submolt !== undefined) body.context = { submolt };
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 60_000);
    const res = await fetchFn(`${BASE_URL}/api/moltbook/advisor`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    }).finally(() => clearTimeout(timer));
    if (!res.ok) return errorResult(res);
    const data = await res.json();
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  });
}
