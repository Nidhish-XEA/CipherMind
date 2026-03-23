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
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    // Skip auth for demo
    const { userId } = await params;
    
    // Return demo memories for the hackathon
    const demoMemories = [
      {
        id: 'memory-1',
        text: 'Found SQL Injection vulnerability in JavaScript code - Line 11: Direct string concatenation in SQL query allows injection attacks',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        type: 'vulnerability'
      },
      {
        id: 'memory-2', 
        text: 'Found Hardcoded Credentials vulnerability - Line 6: Admin key "ADMIN_SECRET_123" hardcoded in source code',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        type: 'vulnerability'
      },
      {
        id: 'memory-3',
        text: 'Found Command Injection vulnerability - Line 67: Direct execution of user input allows system command injection',
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        type: 'vulnerability'
      },
      {
        id: 'memory-4',
        text: 'Found XSS vulnerability - Line 44: HTML template injection allows cross-site scripting attacks',
        timestamp: new Date(Date.now() - 14400000).toISOString(),
        type: 'vulnerability'
      }
    ];

    return NextResponse.json(demoMemories);

  } catch (err: any) {
    console.error('Memory route error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
