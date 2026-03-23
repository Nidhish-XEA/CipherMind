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
  const lines = code.split('\n');
  
  // SQL Injection detection - more flexible patterns
  if (code.includes('SELECT') && code.includes('${') && code.includes('}')) {
    const sqlLine = lines.findIndex(line => line.includes('SELECT') && line.includes('${')) + 1;
    vulnerabilities.push({
      type: 'SQL Injection',
      severity: 'critical',
      line: sqlLine,
      description: 'SQL query uses string concatenation with user input, allowing SQL injection attacks',
      code: lines[sqlLine - 1]?.trim(),
      fix: 'Use parameterized queries: db.query("SELECT * FROM users WHERE username = ?", [username])'
    });
  }
  
  // Hardcoded credentials - broader detection
  if (code.includes('ADMIN_SECRET') || code.includes('password123') || code.includes('sk-')) {
    const credLine = lines.findIndex(line => 
      line.includes('ADMIN_SECRET') || line.includes('password123') || line.includes('sk-')
    ) + 1;
    vulnerabilities.push({
      type: 'Hardcoded Credentials',
      severity: 'critical',
      line: credLine,
      description: 'Hardcoded password or API key found in code',
      code: lines[credLine - 1]?.trim(),
      fix: 'Use environment variables: process.env.ADMIN_SECRET'
    });
  }
  
  // Command injection - detect exec calls
  if (code.includes('exec(') || code.includes('execSync')) {
    const execLine = lines.findIndex(line => line.includes('exec(') || line.includes('execSync')) + 1;
    vulnerabilities.push({
      type: 'Command Injection',
      severity: 'critical',
      line: execLine,
      description: 'Direct execution of user input allows command injection attacks',
      code: lines[execLine - 1]?.trim(),
      fix: 'Avoid executing user input, use safe alternatives'
    });
  }
  
  // XSS vulnerability - detect HTML injection
  if (code.includes('${user.') || code.includes('innerHTML') || code.includes('document.write')) {
    const xssLine = lines.findIndex(line => 
      line.includes('${user.') || line.includes('innerHTML') || line.includes('document.write')
    ) + 1;
    vulnerabilities.push({
      type: 'Cross-Site Scripting (XSS)',
      severity: 'high',
      line: xssLine,
      description: 'Direct HTML injection allows XSS attacks',
      code: lines[xssLine - 1]?.trim(),
      fix: 'Use textContent or sanitize HTML with DOMPurify'
    });
  }
  
  // Path traversal - detect file operations with user input
  if (code.includes('getUserFile') || code.includes('path.join') && code.includes('filename')) {
    const pathLine = lines.findIndex(line => 
      line.includes('getUserFile') || (line.includes('path.join') && line.includes('filename'))
    ) + 1;
    vulnerabilities.push({
      type: 'Path Traversal',
      severity: 'high',
      line: pathLine,
      description: 'User input in file path allows directory traversal attacks',
      code: lines[pathLine - 1]?.trim(),
      fix: 'Validate and sanitize file paths, use whitelist of allowed directories'
    });
  }
  
  // Weak encryption - detect deprecated crypto
  if (code.includes('createCipher') || code.includes('md5')) {
    const cryptoLine = lines.findIndex(line => line.includes('createCipher') || line.includes('md5')) + 1;
    vulnerabilities.push({
      type: 'Weak Cryptography',
      severity: 'medium',
      line: cryptoLine,
      description: 'Using deprecated or weak cryptographic algorithms',
      code: lines[cryptoLine - 1]?.trim(),
      fix: 'Use strong algorithms: createCipheriv, bcrypt, Argon2'
    });
  }
  
  // Information disclosure - detect sensitive logging
  if (code.includes('console.log') && (code.includes('password') || code.includes('API Keys') || code.includes('adminKey'))) {
    const logLine = lines.findIndex(line => 
      line.includes('console.log') && (line.includes('password') || line.includes('API Keys') || line.includes('adminKey'))
    ) + 1;
    vulnerabilities.push({
      type: 'Information Disclosure',
      severity: 'medium',
      line: logLine,
      description: 'Sensitive data being logged to console',
      code: lines[logLine - 1]?.trim(),
      fix: 'Remove sensitive data from logs, use secure logging'
    });
  }
  
  // CSRF vulnerability - detect fund transfers without CSRF
  if (code.includes('transferFunds') && !code.includes('csrf')) {
    const csrfLine = lines.findIndex(line => line.includes('transferFunds')) + 1;
    vulnerabilities.push({
      type: 'CSRF Vulnerability',
      severity: 'medium',
      line: csrfLine,
      description: 'State-changing operation without CSRF protection',
      code: lines[csrfLine - 1]?.trim(),
      fix: 'Implement CSRF tokens and validate on state changes'
    });
  }
  
  // Insecure random - detect Math.random
  if (code.includes('Math.random()')) {
    const randomLine = lines.findIndex(line => line.includes('Math.random()')) + 1;
    vulnerabilities.push({
      type: 'Insecure Random Generation',
      severity: 'medium',
      line: randomLine,
      description: 'Using predictable random number generator',
      code: lines[randomLine - 1]?.trim(),
      fix: 'Use crypto.randomBytes() or window.crypto.getRandomValues()'
    });
  }
  
  // Broken authentication - detect hardcoded admin key
  if (code.includes('checkAdminStatus') && code.includes('ADMIN_SECRET')) {
    const authLine = lines.findIndex(line => line.includes('checkAdminStatus')) + 1;
    vulnerabilities.push({
      type: 'Broken Authentication',
      severity: 'critical',
      line: authLine,
      description: 'Hardcoded admin key allows privilege escalation',
      code: lines[authLine - 1]?.trim(),
      fix: 'Use proper JWT tokens and secure authentication'
    });
  }
  
  // Insecure file upload - detect file upload without validation
  if (code.includes('uploadFile') && code.includes('Bypass validation')) {
    const uploadLine = lines.findIndex(line => line.includes('uploadFile')) + 1;
    vulnerabilities.push({
      type: 'Insecure File Upload',
      severity: 'high',
      line: uploadLine,
      description: 'File upload validation can be bypassed',
      code: lines[uploadLine - 1]?.trim(),
      fix: 'Implement proper file validation and type checking'
    });
  }
  
  // Insecure deserialization - detect unsafe JSON parsing
  if (code.includes('processUserInput') && code.includes('JSON.parse')) {
    const deserializeLine = lines.findIndex(line => line.includes('processUserInput')) + 1;
    vulnerabilities.push({
      type: 'Insecure Deserialization',
      severity: 'high',
      line: deserializeLine,
      description: 'Unsafe deserialization of user input',
      code: lines[deserializeLine - 1]?.trim(),
      fix: 'Validate and sanitize all serialized data'
    });
  }
  
  // CORS misconfiguration - detect wildcard CORS
  if (code.includes('Access-Control-Allow-Origin') && code.includes('*')) {
    const corsLine = lines.findIndex(line => line.includes('Access-Control-Allow-Origin') && line.includes('*')) + 1;
    vulnerabilities.push({
      type: 'CORS Misconfiguration',
      severity: 'medium',
      line: corsLine,
      description: 'Wildcard CORS allows any origin',
      code: lines[corsLine - 1]?.trim(),
      fix: 'Restrict CORS to specific domains only'
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
      'Use secure random number generators',
      'Restrict CORS to specific domains',
      'Implement proper file upload validation'
    ]
  };
}

export async function POST(req: Request) {
  try {
    console.log('=== ANALYSIS REQUEST STARTED ===');
    
    // Skip authentication for demo - allow direct access
    const userId = 'demo-user';

    const { code, language } = await req.json();
    console.log('Received code:', code.substring(0, 100) + '...');
    console.log('Language:', language);
    
    if (!code || !language) {
      return NextResponse.json({ error: 'Missing code or language' }, { status: 400 });
    }

    // Always use mock analysis for demo
    console.log('Calling getMockAnalysis...');
    let analysisResult = getMockAnalysis(code, language);
    console.log('Mock analysis result:', JSON.stringify(analysisResult, null, 2));

    const response = {
      success: true,
      analysis: analysisResult,
      memoryContext: 'Demo mode - no memory system',
      timestamp: new Date().toISOString()
    };
    
    console.log('Sending response:', JSON.stringify(response, null, 2));
    return NextResponse.json(response);

  } catch (error: any) {
    console.error('Analysis error:', error);
    return NextResponse.json({ 
      error: 'Analysis failed',
      details: error.message 
    }, { status: 500 });
  }
}
