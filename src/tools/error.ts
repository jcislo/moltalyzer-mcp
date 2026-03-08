export async function errorResult(res: Response) {
  const body = await res.text().catch(() => "");
  if (res.status === 402) {
    return {
      content: [{ type: "text" as const, text: `Payment failed (HTTP 402). Ensure your wallet has USDC on Base Mainnet. Details: ${body}` }],
      isError: true as const,
    };
  }
  return {
    content: [{ type: "text" as const, text: `API error ${res.status}: ${body}` }],
    isError: true as const,
  };
}
