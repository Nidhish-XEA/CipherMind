import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { hindsightClient } from '@/lib/hindsight';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || 'all past mistakes and vulnerabilities';

    // recall uses positional args: recall(bankId, query)
    const recallResponse = await hindsightClient.recall(session.user.id, query);

    // Normalize: return array of content strings
    const memories = recallResponse?.results?.map((m: any) => m.content as string) ?? [];

    return NextResponse.json({ memories });
  } catch (err: any) {
    console.error('Memory GET error:', err);
    // Return empty array on error so the UI doesn't break
    return NextResponse.json({ memories: [] });
  }
}
