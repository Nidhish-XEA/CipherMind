import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { HindsightClient } from '@vectorize-io/hindsight-client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const hindsight = new HindsightClient({
  baseUrl: process.env.HINDSIGHT_INSTANCE_URL || 'https://mock.vercel.com',
  apiKey: process.env.HINDSIGHT_API_KEY || 'mock-key'
});

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Ensure the requested userId matches the session user
    if (session.user.id !== params.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const memories = await hindsight.recall(params.userId, 'all past coding mistakes');
    return NextResponse.json(memories?.results || []);

  } catch (err: any) {
    console.error('Memory route error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
