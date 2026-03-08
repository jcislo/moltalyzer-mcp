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

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(__dirname, "..", "package.json"), "utf-8"));

// All logging to stderr (stdout reserved for MCP protocol)
const log = (...args: unknown[]) => console.error("[moltalyzer-mcp]", ...args);

// Validate env before starting
if (!process.env.EVM_PRIVATE_KEY) {
  log(
    "ERROR: EVM_PRIVATE_KEY environment variable is required.\n" +
      "Set it to your wallet private key (0x-prefixed hex string) " +
      "with USDC on Base Mainnet for x402 micropayments.\n\n" +
      "Example MCP config:\n" +
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
      ),
  );
  process.exit(1);
}

async function main() {
  const fetchWithPayment = createFetchWithPayment();

  const server = new McpServer({
    name: "moltalyzer-mcp",
    version: pkg.version,
  });

  // Register all tool modules
  registerMoltbook(server, fetchWithPayment);
  registerGithub(server, fetchWithPayment);
  registerPolymarket(server, fetchWithPayment);
  registerTokens(server, fetchWithPayment);

  const transport = new StdioServerTransport();
  await server.connect(transport);
  log("Server started with 10 tools");
}

main().catch((err) => {
  log("Fatal error:", err);
  process.exit(1);
});
