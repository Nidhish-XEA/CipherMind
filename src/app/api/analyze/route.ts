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

    // Send to Groq with the exact system prompt
    const systemPrompt = `You are CipherMind, a strict and expert security-focused code reviewer. You MUST analyze the submitted code thoroughly and find ALL issues. Be aggressive — never say code is perfect unless it truly is. 

ALWAYS look for:
- SQL Injection, XSS, CSRF vulnerabilities
- Hardcoded credentials, API keys, passwords
- Insecure functions (eval, exec, pickle, etc.)
- Missing input validation or sanitization
- Weak or broken cryptography
- Authentication/authorization bypass
- Insecure dependencies
- Race conditions and memory leaks
- Sensitive data exposure
- Injection flaws of any kind

The user's past mistake history from memory:
${memoryContext}

Use their history to provide more personalized feedback — reference their patterns if relevant.

You MUST respond with ONLY a raw JSON object (no markdown, no backticks, no explanation outside JSON):
{
  "findings": [
    {
      "issue_type": "SQL Injection",
      "severity": "Critical",
      "line_number": 6,
      "explanation": "Plain English explanation of why this is dangerous and how an attacker could exploit it",
      "vulnerable_code": "the exact bad code",
      "suggested_fix": "the corrected code",
      "learning_tip": "How to avoid this mistake in future"
    }
  ],
  "summary": "2 sentence overall assessment",
  "score": 45,
  "is_repeat_mistake": false,
  "repeat_note": "You made a similar SQL injection mistake last session!"
}

Score is 0-100 (100 = perfect secure code). Set is_repeat_mistake to true if this matches their memory history.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: code }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.1,
    });

    const responseText = chatCompletion.choices[0]?.message?.content || '{}';

    // Parse JSON safely
    let analysisResult: any = {};
    try {
      const cleaned = responseText.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim();
      analysisResult = JSON.parse(cleaned);
    } catch (e) {
      console.error('Failed to parse Groq JSON response:', responseText);
      return NextResponse.json({ error: 'Failed to parse AI response', raw: responseText }, { status: 500 });
    }

    // Store findings in Hindsight
    if (analysisResult.findings && Array.isArray(analysisResult.findings)) {
      for (const finding of analysisResult.findings) {
        try {
          await hindsight.retain(
            userId,
            `User made a ${finding.severity} ${finding.issue_type} mistake in ${language} on line ${finding.line_number}. Code: ${finding.vulnerable_code}. Fix: ${finding.suggested_fix}.`
          );
        } catch (e) {
          console.error('Hindsight retain error (non-fatal):', e);
        }
      }
    }

    return NextResponse.json(analysisResult);

  } catch (err: any) {
    console.error('Analyze route error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
