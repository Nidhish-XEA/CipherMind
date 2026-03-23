import { HindsightClient } from '@vectorize-io/hindsight-client';

let _client: HindsightClient | null = null;

export function getHindsightClient(): HindsightClient {
  if (!_client) {
    const baseUrl = process.env.HINDSIGHT_INSTANCE_URL;
    const apiKey = process.env.HINDSIGHT_API_KEY;

    if (!baseUrl || !apiKey) {
      // During build time, return a mock client
      if (process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV) {
        return new HindsightClient({ 
          baseUrl: 'https://mock.vercel.com', 
          apiKey: 'mock-key' 
        }) as any;
      }
      throw new Error('Hindsight env vars not configured: HINDSIGHT_INSTANCE_URL and HINDSIGHT_API_KEY are required.');
    }

    _client = new HindsightClient({ baseUrl, apiKey });
  }
  return _client;
}

// Convenience export — same interface as before
export const hindsightClient = {
  retain: async (bankId: string, content: string) => {
    const client = getHindsightClient();
    try {
      return await client.retain(bankId, content);
    } catch (e) {
      // Mock during build
      if (process.env.VERCEL_ENV) return { success: true };
      throw e;
    }
  },
  recall: async (bankId: string, query: string) => {
    const client = getHindsightClient();
    try {
      return await client.recall(bankId, query);
    } catch (e) {
      // Mock during build
      if (process.env.VERCEL_ENV) return { results: [] };
      throw e;
    }
  },
};
