import { NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Simple in-memory storage for demo
let memoryStorage: any[] = [];

export async function GET(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    
    // Return stored memories or default demo data
    const memories = memoryStorage.length > 0 ? memoryStorage : [
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

    return NextResponse.json(memories);

  } catch (err: any) {
    console.error('Memory route error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const memoryData = await req.json();
    
    // Store the memory
    const newMemory = {
      id: `memory-${Date.now()}`,
      userId: userId,
      timestamp: new Date().toISOString(),
      ...memoryData
    };
    
    memoryStorage.push(newMemory);
    
    // Keep only last 10 memories
    if (memoryStorage.length > 10) {
      memoryStorage = memoryStorage.slice(-10);
    }
    
    console.log('Stored new memory:', newMemory.id);
    
    return NextResponse.json({ success: true, memory: newMemory });

  } catch (err: any) {
    console.error('Memory POST error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
