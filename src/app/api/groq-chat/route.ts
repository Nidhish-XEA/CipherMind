import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export const dynamic = 'force-dynamic';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    
    console.log('=== GROQ CHAT TEST ===');
    console.log('Message:', message);
    console.log('API Key exists:', !!process.env.GROQ_API_KEY);
    console.log('API Key length:', process.env.GROQ_API_KEY?.length || 0);

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ 
        success: false, 
        error: 'GROQ_API_KEY not found in environment variables' 
      });
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a security expert. Analyze the code provided by the user and identify any security vulnerabilities. Be specific about the types of vulnerabilities and provide line numbers if possible."
        },
        {
          role: "user",
          content: message
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      max_tokens: 1024,
    });

    const response = chatCompletion.choices[0]?.message?.content || 'No response received';

    console.log('Groq response received:', response.length, 'characters');

    return NextResponse.json({ 
      success: true, 
      response: response 
    });

  } catch (error: any) {
    console.error('Groq API error:', error);
    
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Unknown error occurred',
      details: {
        apiKeyExists: !!process.env.GROQ_API_KEY,
        apiKeyLength: process.env.GROQ_API_KEY?.length || 0
      }
    }, { status: 500 });
  }
}
