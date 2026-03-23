import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { code, language } = await req.json();
    
    if (!code || !language) {
      return NextResponse.json({ error: 'Missing code or language' }, { status: 400 });
    }

    // Simple mock analysis that always finds vulnerabilities
    const vulnerabilities = [];
    const lines = code.split('\n');
    
    // SQL Injection
    if (code.includes('SELECT') && code.includes('${')) {
      vulnerabilities.push({
        type: 'SQL Injection',
        severity: 'critical',
        line: lines.findIndex(line => line.includes('SELECT')) + 1,
        description: 'SQL query uses string concatenation with user input',
        code: lines.find(line => line.includes('SELECT'))?.trim(),
        fix: 'Use parameterized queries'
      });
    }
    
    // Hardcoded credentials
    if (code.includes('ADMIN_SECRET')) {
      vulnerabilities.push({
        type: 'Hardcoded Credentials',
        severity: 'critical',
        line: lines.findIndex(line => line.includes('ADMIN_SECRET')) + 1,
        description: 'Hardcoded admin key found',
        code: lines.find(line => line.includes('ADMIN_SECRET'))?.trim(),
        fix: 'Use environment variables'
      });
    }
    
    // Command injection
    if (code.includes('exec(')) {
      vulnerabilities.push({
        type: 'Command Injection',
        severity: 'critical',
        line: lines.findIndex(line => line.includes('exec(')) + 1,
        description: 'Direct execution of user input',
        code: lines.find(line => line.includes('exec('))?.trim(),
        fix: 'Avoid executing user input'
      });
    }
    
    // Weak random
    if (code.includes('Math.random()')) {
      vulnerabilities.push({
        type: 'Insecure Random Generation',
        severity: 'medium',
        line: lines.findIndex(line => line.includes('Math.random()')) + 1,
        description: 'Using predictable random number generator',
        code: lines.find(line => line.includes('Math.random()'))?.trim(),
        fix: 'Use crypto.randomBytes()'
      });
    }

    const result = {
      success: true,
      findings: vulnerabilities,
      analysis: {
        summary: {
          total: vulnerabilities.length,
          critical: vulnerabilities.filter(v => v.severity === 'critical').length,
          high: vulnerabilities.filter(v => v.severity === 'high').length,
          medium: vulnerabilities.filter(v => v.severity === 'medium').length,
          low: 0,
          score: Math.max(0, 100 - vulnerabilities.length * 10)
        },
        vulnerabilities,
        recommendations: ['Fix all critical vulnerabilities', 'Use secure coding practices']
      },
      score: Math.max(0, 100 - vulnerabilities.length * 10),
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(result);

  } catch (error: any) {
    return NextResponse.json({ 
      error: 'Analysis failed',
      details: error.message 
    }, { status: 500 });
  }
}
