import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { BASE_URL, fetchWithTimeout } from "../client.js";
import { errorResult } from "./error.js";

export function register(server: McpServer, fetchFn: typeof fetch) {
  server.registerTool("get_github_digest", {
    description:
      "Get the latest daily GitHub trending repos digest — AI analysis of newly created repositories gaining traction, organized by category with emerging tools, language trends, and notable projects. Runs daily at 06:00 UTC scanning repos created in the last 24 hours. Costs $0.02 USDC via x402.",
  }, async () => {
    const res = await fetchWithTimeout(fetchFn, `${BASE_URL}/api/github/digests/latest`);
    if (!res.ok) return errorResult(res);
    const data = await res.json();
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  });

  server.registerTool("get_github_history", {
    description:
      "Get historical daily GitHub digests — trending repo analysis over a configurable lookback window (1-30 days). Track how developer interest and project categories evolve over time. Returns an array of daily digest objects. Costs $0.05 USDC via x402.",
    inputSchema: {
      days: z.number().int().min(1).max(30).optional().describe("How many days back to look (1-30, default 7)"),
      limit: z.number().int().min(1).max(30).optional().describe("Maximum number of digests to return (1-30, default 7)"),
    },
  }, async ({ days, limit }) => {
    const params = new URLSearchParams();
    if (days !== undefined) params.set("days", String(days));
    if (limit !== undefined) params.set("limit", String(limit));
    const url = `${BASE_URL}/api/github/digests${params.size ? "?" + params : ""}`;
    const res = await fetchWithTimeout(fetchFn, url);
    if (!res.ok) return errorResult(res);
    const data = await res.json();
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  });

  server.registerTool("get_github_repos", {
    description:
      "Get top trending GitHub repos from the latest daily scan, sorted by stars. Filter by programming language. Returns repo name, description, stars, forks, language, topics, license, author info, and README excerpt. Costs $0.01 USDC via x402.",
    inputSchema: {
      limit: z.number().int().min(1).max(100).optional().describe("Maximum repos to return (1-100, default 30)"),
      language: z.string().optional().describe("Filter by programming language (e.g. 'TypeScript', 'Python', 'Rust'). Case-insensitive."),
    },
  }, async ({ limit, language }) => {
    const params = new URLSearchParams();
    if (limit !== undefined) params.set("limit", String(limit));
    if (language !== undefined) params.set("language", language);
    const url = `${BASE_URL}/api/github/repos${params.size ? "?" + params : ""}`;
    const res = await fetchWithTimeout(fetchFn, url);
    if (!res.ok) return errorResult(res);
    const data = await res.json();
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  });
}
