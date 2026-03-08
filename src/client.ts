import { wrapFetchWithPaymentFromConfig } from "@x402/fetch";
import { ExactEvmScheme, toClientEvmSigner } from "@x402/evm";
import { privateKeyToAccount } from "viem/accounts";
import { createPublicClient, http } from "viem";
import { base } from "viem/chains";

export const BASE_URL =
  process.env.MOLTALYZER_API_URL || "https://api.moltalyzer.xyz";

const REQUEST_TIMEOUT_MS = 30_000;

export function fetchWithTimeout(
  fetchFn: typeof fetch,
  url: string,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  return fetchFn(url, { signal: controller.signal }).finally(() =>
    clearTimeout(timer),
  );
}

export function createFetchWithPayment(): typeof fetch {
  const privateKey = process.env.EVM_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error(
      "EVM_PRIVATE_KEY environment variable is required. " +
        "Set it to your wallet private key (0x-prefixed hex string) " +
        "with USDC on Base Mainnet for x402 micropayments.",
    );
  }

  let account;
  try {
    account = privateKeyToAccount(privateKey as `0x${string}`);
  } catch {
    throw new Error(
      "EVM_PRIVATE_KEY is invalid. Expected a 0x-prefixed 64-character hex string (32 bytes).",
    );
  }

  const publicClient = createPublicClient({
    chain: base,
    transport: http(),
  });

  const signer = toClientEvmSigner(account, publicClient);

  return wrapFetchWithPaymentFromConfig(fetch, {
    schemes: [
      {
        network: "eip155:8453",
        client: new ExactEvmScheme(signer),
      },
    ],
  });
}
