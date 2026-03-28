#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createFetchWithPayment } from "./client.js";
import { register as registerMoltbook } from "./tools/moltbook.js";
import { register as registerGithub } from "./tools/github.js";
import { register as registerPolymarket } from "./tools/polymarket.js";
import { register as registerTokens } from "./tools/tokens.js";
import { register as registerIntelligence } from "./tools/intelligence.js";
import { register as registerFree } from "./tools/free.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(__dirname, "..", "package.json"), "utf-8"));

// All logging to stderr (stdout reserved for MCP protocol)
const log = (...args: unknown[]) => console.error("[moltalyzer-mcp]", ...args);

async function main() {
  const server = new McpServer({
    name: "moltalyzer-mcp",
    version: pkg.version,
  });

  // Free tools always available — no wallet or API key needed
  registerFree(server);

  const hasWallet = !!process.env.EVM_PRIVATE_KEY;

  if (hasWallet) {
    const fetchWithPayment = createFetchWithPayment();
    registerMoltbook(server, fetchWithPayment);
    registerGithub(server, fetchWithPayment);
    registerPolymarket(server, fetchWithPayment);
    registerTokens(server, fetchWithPayment);
    registerIntelligence(server, fetchWithPayment);
    log(`Server started with 16 tools (4 free + 12 paid via x402)`);
  } else {
    log(
      "WARNING: EVM_PRIVATE_KEY not set — running in free-tier mode (4 tools).\n" +
        "To unlock all 16 tools with x402 micropayments, add your wallet private key:\n\n" +
        JSON.stringify(
          {
            mcpServers: {
              moltalyzer: {
                command: "npx",
                args: ["-y", "moltalyzer-mcp"],
                env: { EVM_PRIVATE_KEY: "0x..." },
              },
            },
          },
          null,
          2,
        ) +
        "\n\nAlternatively, get a free API key at https://moltalyzer.xyz for 5 digests/day.",
    );
    log("Server started with 4 free tools");
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  log("Fatal error:", err);
  process.exit(1);
});
