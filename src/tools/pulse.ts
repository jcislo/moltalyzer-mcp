import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { BASE_URL, fetchWithTimeout } from "../client.js";
import { errorResult } from "./error.js";

export function register(server: McpServer, fetchFn: typeof fetch) {
  server.registerTool("get_pulse_digest", {
    description:
      "Get the latest Pulse narrative intelligence digest — cross-source synthesis of AI/business narratives forming across Reddit, HN, GitHub, and HuggingFace. Tracks narrative lifecycle (emerging → developing → peak → fading). Includes narrativeArcs, actionableSignals, sourceMix, and topInsights. Updated every 4 hours. Costs $0.01 USDC via x402.",
  }, async () => {
    const res = await fetchWithTimeout(fetchFn, `${BASE_URL}/api/pulse/ai-business/digest/latest`);
    if (!res.ok) return errorResult(res);
    const data = await res.json();
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  });

  server.registerTool("get_pulse_narratives", {
    description:
      "Get all active Pulse narratives with lifecycle stage, source count, and momentum. Narratives track specific stories gaining traction across 2+ sources. Costs $0.01 USDC via x402.",
  }, async () => {
    const res = await fetchWithTimeout(fetchFn, `${BASE_URL}/api/pulse/ai-business/narratives`);
    if (!res.ok) return errorResult(res);
    const data = await res.json();
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  });

  server.registerTool("get_pulse_narrative_detail", {
    description:
      "Get detailed view of a specific Pulse narrative — full content items, source breakdown, and stage history. Costs $0.01 USDC via x402.",
    inputSchema: {
      id: z.number().int().describe("Narrative ID (from get_pulse_narratives)"),
    },
  }, async ({ id }) => {
    const res = await fetchWithTimeout(fetchFn, `${BASE_URL}/api/pulse/ai-business/narratives/${id}`);
    if (!res.ok) return errorResult(res);
    const data = await res.json();
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  });
}
