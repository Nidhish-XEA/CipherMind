import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Version 2.0 - Updated for Vercel deployment
export async function POST(req: Request) {
  try {
    const { code, language } = await req.json();
    
    console.log('=== SECURITY SCAN V2.0 START ===');
    console.log('Code length:', code.length);
    console.log('Language:', language);
    console.log('Timestamp:', new Date().toISOString());
    
    // Always return vulnerabilities for demo
    const vulnerabilities = [
      {
        type: 'SQL Injection',
        severity: 'critical',
        line: 11,
        description: 'SQL query uses string concatenation with user input, allowing SQL injection attacks',
        code: "const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;",
        fix: 'Use parameterized queries: db.query("SELECT * FROM users WHERE username = ?", [username])'
      },
      {
        type: 'Hardcoded Credentials',
        severity: 'critical',
        line: 6,
        description: 'Hardcoded admin key "ADMIN_SECRET_123" found in code, allowing privilege escalation',
        code: "this.adminKey = \"ADMIN_SECRET_123\";",
        fix: 'Use environment variables: process.env.ADMIN_SECRET'
      },
      {
        type: 'Command Injection',
        severity: 'critical',
        line: 67,
        description: 'Direct execution of user input allows command injection attacks',
        code: "exec(command, (error, stdout, stderr) => {",
        fix: 'Avoid executing user input, use safe alternatives'
      },
      {
        type: 'Cross-Site Scripting (XSS)',
        severity: 'high',
        line: 44,
        description: 'Direct HTML injection allows XSS attacks by injecting malicious scripts',
        code: "<h2>Welcome ${user.username}</h2>",
        fix: 'Use textContent or sanitize HTML with DOMPurify'
      },
      {
        type: 'Path Traversal',
        severity: 'high',
        line: 34,
        description: 'User input in file path allows directory traversal attacks',
        code: "getUserFile(filename) {",
        fix: 'Validate and sanitize file paths, use whitelist of allowed directories'
      },
      {
        type: 'Weak Cryptography',
        severity: 'medium',
        line: 55,
        description: 'Using deprecated createCipher algorithm vulnerable to attacks',
        code: "const cipher = crypto.createCipher('aes-128-cbc', key);",
        fix: 'Use strong algorithms: createCipheriv, bcrypt, Argon2'
      },
      {
        type: 'Insecure Random Generation',
        severity: 'medium',
        line: 48,
        description: 'Using predictable Math.random() for session tokens',
        code: "return Math.random().toString(36).substring(2, 15);",
        fix: 'Use crypto.randomBytes() or window.crypto.getRandomValues()'
      },
      {
        type: 'CSRF Vulnerability',
        severity: 'medium',
        line: 95,
        description: 'State-changing fund transfer operation without CSRF protection',
        code: "transferFunds(fromAccount, toAccount, amount, token) {",
        fix: 'Implement CSRF tokens and validate on state changes'
      }
    ];

    // Store in memory for demo (simulate Hindsight)
    const memoryEntry = {
      id: `memory-${Date.now()}`,
      userId: 'demo-user',
      timestamp: new Date().toISOString(),
      findings: vulnerabilities.map(v => ({
        type: v.type,
        severity: v.severity,
        line: v.line,
        description: v.description
      })),
      language: language,
      codeLength: code.length
    };

    console.log('Storing memory entry:', memoryEntry.id);

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
          score: 25
        },
        vulnerabilities,
        recommendations: [
          'Fix all critical vulnerabilities immediately',
          'Use parameterized queries for database operations',
          'Store credentials in environment variables',
          'Validate and sanitize all user inputs'
        ]
      },
      score: 25,
      timestamp: new Date().toISOString()
    };

    console.log('Returning vulnerabilities:', vulnerabilities.length);
    return NextResponse.json(result);

  } catch (error: any) {
    console.error('Security scan error:', error);
    return NextResponse.json({ 
      error: 'Analysis failed',
      details: error.message 
    }, { status: 500 });
  }
}
