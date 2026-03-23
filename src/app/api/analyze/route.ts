import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { HindsightClient } from '@vectorize-io/hindsight-client';
import Groq from 'groq-sdk';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const groq = new Groq({ 
  apiKey: process.env.GROQ_API_KEY || 'mock-key'
});

const hindsight = new HindsightClient({
  baseUrl: process.env.HINDSIGHT_INSTANCE_URL || 'https://mock.vercel.com',
  apiKey: process.env.HINDSIGHT_API_KEY || 'mock-key'
});

// Mock analysis for demo when no API keys
function getMockAnalysis(code: string, language: string) {
  const vulnerabilities = [];
  
  // SQL Injection detection
  if (code.includes('SELECT * FROM') && code.includes('${') && code.includes('}')) {
    vulnerabilities.push({
      type: 'SQL Injection',
      severity: 'critical',
      line: code.split('\n').findIndex(line => line.includes('SELECT') && line.includes('${')) + 1,
      description: 'SQL query uses string concatenation with user input, allowing SQL injection attacks',
      code: code.split('\n').find(line => line.includes('SELECT') && line.includes('${'))?.trim(),
      fix: 'Use parameterized queries: db.query("SELECT * FROM users WHERE username = ?", [username])'
    });
  }
  
  // Hardcoded credentials
  if (code.includes('password') && (code.includes('"') || code.includes("'"))) {
    vulnerabilities.push({
      type: 'Hardcoded Credentials',
      severity: 'high',
      line: code.split('\n').findIndex(line => line.includes('password') && (line.includes('"') || line.includes("'"))) + 1,
      description: 'Hardcoded password or API key found in code',
      code: code.split('\n').find(line => line.includes('password') && (line.includes('"') || line.includes("'")))?.trim(),
      fix: 'Use environment variables: process.env.DB_PASSWORD'
    });
  }
  
  // Command injection
  if (code.includes('exec(') || code.includes('eval(')) {
    vulnerabilities.push({
      type: 'Command Injection',
      severity: 'critical',
      line: code.split('\n').findIndex(line => line.includes('exec(') || line.includes('eval(')) + 1,
      description: 'Direct execution of user input allows command injection attacks',
      code: code.split('\n').find(line => line.includes('exec(') || line.includes('eval('))?.trim(),
      fix: 'Avoid executing user input, use safe alternatives'
    });
  }
  
  // XSS vulnerability
  if (code.includes('innerHTML') || code.includes('document.write')) {
    vulnerabilities.push({
      type: 'Cross-Site Scripting (XSS)',
      severity: 'high',
      line: code.split('\n').findIndex(line => line.includes('innerHTML') || line.includes('document.write')) + 1,
      description: 'Direct HTML injection allows XSS attacks',
      code: code.split('\n').find(line => line.includes('innerHTML') || line.includes('document.write'))?.trim(),
      fix: 'Use textContent or sanitize HTML with DOMPurify'
    });
  }
  
  // Path traversal
  if (code.includes('path.join') && code.includes('filename')) {
    vulnerabilities.push({
      type: 'Path Traversal',
      severity: 'high',
      line: code.split('\n').findIndex(line => line.includes('path.join') && line.includes('filename')) + 1,
      description: 'User input in file path allows directory traversal attacks',
      code: code.split('\n').find(line => line.includes('path.join') && line.includes('filename'))?.trim(),
      fix: 'Validate and sanitize file paths, use whitelist of allowed directories'
    });
  }
  
  // Weak encryption
  if (code.includes('createCipher') || code.includes('md5')) {
    vulnerabilities.push({
      type: 'Weak Cryptography',
      severity: 'medium',
      line: code.split('\n').findIndex(line => line.includes('createCipher') || line.includes('md5')) + 1,
      description: 'Using deprecated or weak cryptographic algorithms',
      code: code.split('\n').find(line => line.includes('createCipher') || line.includes('md5'))?.trim(),
      fix: 'Use strong algorithms: createCipheriv, bcrypt, Argon2'
    });
  }
  
  // Information disclosure
  if (code.includes('console.log') && (code.includes('password') || code.includes('token'))) {
    vulnerabilities.push({
      type: 'Information Disclosure',
      severity: 'medium',
      line: code.split('\n').findIndex(line => line.includes('console.log') && (line.includes('password') || line.includes('token'))) + 1,
      description: 'Sensitive data being logged to console',
      code: code.split('\n').find(line => line.includes('console.log') && (line.includes('password') || line.includes('token')))?.trim(),
      fix: 'Remove sensitive data from logs, use secure logging'
    });
  }
  
  // CSRF vulnerability
  if (code.includes('transfer') || code.includes('payment') && !code.includes('csrf')) {
    vulnerabilities.push({
      type: 'CSRF Vulnerability',
      severity: 'medium',
      line: code.split('\n').findIndex(line => line.includes('transfer') || line.includes('payment')) + 1,
      description: 'State-changing operation without CSRF protection',
      code: code.split('\n').find(line => line.includes('transfer') || line.includes('payment'))?.trim(),
      fix: 'Implement CSRF tokens and validate on state changes'
    });
  }
  
  // Insecure random
  if (code.includes('Math.random()')) {
    vulnerabilities.push({
      type: 'Insecure Random Generation',
      severity: 'medium',
      line: code.split('\n').findIndex(line => line.includes('Math.random()')) + 1,
      description: 'Using predictable random number generator',
      code: code.split('\n').find(line => line.includes('Math.random()'))?.trim(),
      fix: 'Use crypto.randomBytes() or window.crypto.getRandomValues()'
    });
  }
  
  return {
    summary: {
      total: vulnerabilities.length,
      critical: vulnerabilities.filter(v => v.severity === 'critical').length,
      high: vulnerabilities.filter(v => v.severity === 'high').length,
      medium: vulnerabilities.filter(v => v.severity === 'medium').length,
      low: vulnerabilities.filter(v => v.severity === 'low').length,
      score: Math.max(0, 100 - (vulnerabilities.filter(v => v.severity === 'critical').length * 20 + 
                                   vulnerabilities.filter(v => v.severity === 'high').length * 10 + 
                                   vulnerabilities.filter(v => v.severity === 'medium').length * 5))
    },
    vulnerabilities,
    recommendations: [
      'Use parameterized queries for database operations',
      'Store credentials in environment variables',
      'Validate and sanitize all user inputs',
      'Use strong cryptographic algorithms',
      'Implement proper authentication and authorization',
      'Add CSRF protection for state-changing operations',
      'Use secure random number generators'
    ]
  };
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    const { code, language } = await req.json();
    if (!code || !language) {
      return NextResponse.json({ error: 'Missing code or language' }, { status: 400 });
    }

    // Query Hindsight for past mistakes
    let memoryContext = 'No past mistakes recorded yet.';
    try {
      const memories = await hindsight.recall(userId, `past coding mistakes in ${language}`);
      memoryContext = memories?.results?.map((m: any) => m.text).join('\n') || 'No past mistakes recorded yet.';
    } catch (e) {
      console.error('Hindsight recall error (non-fatal):', e);
    }

    // Use mock analysis for demo, or real Groq if API key is available
    let analysisResult;
    
    if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'mock-key') {
      // Real Groq analysis
      const systemPrompt = `You are CipherMind, a strict and expert security-focused code reviewer. You MUST analyze the submitted code thoroughly and find ALL issues. Be aggressive — never say code is perfect unless it truly is. 

ALWAYS look for:
- SQL Injection, XSS, CSRF vulnerabilities
- Hardcoded credentials, API keys, passwords
- Insecure functions (eval, exec, pickle, etc.)
- Missing input validation or sanitization
- Weak or broken cryptography
- Authentication/authorization bypass
- Path traversal, file inclusion
- Information disclosure
- Insecure random generation
- Command injection

Return JSON format:
{
  "summary": {
    "total": number,
    "critical": number,
    "high": number, 
    "medium": number,
    "low": number,
    "score": number
  },
  "vulnerabilities": [
    {
      "type": "vulnerability type",
      "severity": "critical|high|medium|low",
      "line": line_number,
      "description": "detailed description",
      "code": "exact vulnerable code",
      "fix": "specific fix recommendation"
    }
  ],
  "recommendations": ["list of security recommendations"]
}

User's past mistakes context: ${memoryContext}`;

      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Analyze this ${language} code for security vulnerabilities:\n\n${code}` }
        ],
        model: 'mixtral-8x7b-32768',
        temperature: 0.1,
        response_format: { type: 'json_object' }
      });

      analysisResult = JSON.parse(completion.choices[0].message.content || '{}');
    } else {
      // Mock analysis for demo
      analysisResult = getMockAnalysis(code, language);
      console.log('Using mock analysis for demo - add GROQ_API_KEY for real analysis');
    }

    // Store findings in Hindsight
    try {
      if (analysisResult.vulnerabilities && analysisResult.vulnerabilities.length > 0) {
        const findingsText = analysisResult.vulnerabilities.map((v: any) => 
          `${v.severity} ${v.type}: ${v.description} at line ${v.line}`
        ).join('\n');
        
        await hindsight.retain(userId, `Found ${analysisResult.vulnerabilities.length} vulnerabilities in ${language}: ${findingsText}`);
      }
    } catch (e) {
      console.error('Hindsight retain error (non-fatal):', e);
    }

    return NextResponse.json({
      success: true,
      analysis: analysisResult,
      memoryContext: memoryContext.substring(0, 200) + '...',
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Analysis error:', error);
    return NextResponse.json({ 
      error: 'Analysis failed',
      details: error.message 
    }, { status: 500 });
  }
}
