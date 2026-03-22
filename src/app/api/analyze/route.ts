import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Groq from 'groq-sdk';
import { hindsightClient } from '@/lib/hindsight';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

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

    // 1. Retrieve past memories from Hindsight using positional args
    let memoryContext = 'No past mistakes found.';
    try {
      const recallResponse = await hindsightClient.recall(userId, `past mistakes in ${language}`);
      const results = recallResponse?.results;
      if (Array.isArray(results) && results.length > 0) {
        memoryContext = results.map((m: any) => m.content).join('\n');
      }
    } catch (e) {
      console.error('Hindsight recall error (non-fatal):', e);
    }

    // 2. Call Groq with memory context injected
    const prompt = `You are CipherMind, an expert coding mentor. Analyze the following ${language} code for bugs, anti-patterns, and security vulnerabilities.

Here are the user's PAST MISTAKES from memory — reference them if the user is repeating a pattern:
${memoryContext}

Code to analyze:
\`\`\`${language}
${code}
\`\`\`

Return EXACTLY a JSON array of findings with no markdown or prose outside the JSON. If no issues are found, return [].
Each finding must have this shape:
{
  "issue_type": string,
  "severity": "Critical" | "High" | "Medium" | "Low",
  "line_number": number | string,
  "explanation": string,
  "suggested_fix": string,
  "learning_tip": string
}`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'qwen-2.5-coder-32b',
      temperature: 0.1,
    });

    const responseText = chatCompletion.choices[0]?.message?.content || '[]';

    // 3. Parse JSON safely (strip markdown fences if present)
    let findings: any[] = [];
    try {
      const cleaned = responseText.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim();
      findings = JSON.parse(cleaned);
      if (!Array.isArray(findings)) findings = [];
    } catch (e) {
      console.error('Failed to parse Groq JSON response:', responseText);
      return NextResponse.json({ error: 'Failed to parse AI response', raw: responseText }, { status: 500 });
    }

    // 4. Store each finding into Hindsight using positional args
    for (const f of findings) {
      const memContent = `User made a ${f.severity} mistake in ${language}: ${f.issue_type}. ` +
        `At line ${f.line_number}. Explanation: ${f.explanation}. Fix: ${f.suggested_fix}`;
      try {
        await hindsightClient.retain(userId, memContent);
      } catch (e) {
        console.error('Hindsight retain error (non-fatal):', e);
      }
    }

    return NextResponse.json({ findings });

  } catch (err: any) {
    console.error('Analyze route error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
