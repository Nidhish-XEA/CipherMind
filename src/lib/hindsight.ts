import { HindsightClient } from '@vectorize-io/hindsight-client';

let _client: HindsightClient | null = null;

export function getHindsightClient(): HindsightClient {
  if (!_client) {
    const baseUrl = process.env.HINDSIGHT_INSTANCE_URL;
    const apiKey = process.env.HINDSIGHT_API_KEY;

    if (!baseUrl || !apiKey) {
      throw new Error('Hindsight env vars not configured: HINDSIGHT_INSTANCE_URL and HINDSIGHT_API_KEY are required.');
    }

    _client = new HindsightClient({ baseUrl, apiKey });
  }
  return _client;
}

// Convenience export — same interface as before
export const hindsightClient = {
  retain: (bankId: string, content: string) =>
    getHindsightClient().retain(bankId, content),
  recall: (bankId: string, query: string) =>
    getHindsightClient().recall(bankId, query),
};
