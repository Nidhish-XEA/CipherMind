'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Send, Bot, User } from 'lucide-react';

export default function GroqChatbox() {
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Hello! I can help you analyze code for security vulnerabilities. Paste some code and I\'ll check it for you!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setInput('');

    try {
      const response = await fetch('/api/groq-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });

      const data = await response.json();
      
      if (data.success) {
        setMessages(prev => [...prev, { role: 'bot', content: data.response }]);
      } else {
        setMessages(prev => [...prev, { role: 'bot', content: `Error: ${data.error}` }]);
      }
    } catch (error: any) {
      setMessages(prev => [...prev, { role: 'bot', content: `Network error: ${error?.message || 'Unknown error'}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto p-4 bg-black/40 border-white/10 border-2 border-primary/30">
      <div className="flex items-center gap-2 mb-4">
        <Bot className="w-5 h-5 text-primary animate-pulse" />
        <h3 className="text-lg font-bold text-white">🔥 Groq API Test - Check if Working!</h3>
      </div>
      
      <div className="h-96 overflow-y-auto mb-4 space-y-3 p-3 bg-black/20 rounded-lg">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'bot' && <Bot className="w-4 h-4 text-primary mt-1 flex-shrink-0" />}
            {msg.role === 'user' && <User className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />}
            <div className={`max-w-[80%] p-2 rounded-lg text-sm ${
              msg.role === 'user' 
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                : 'bg-primary/20 text-primary border border-primary/30'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-2 justify-start">
            <Bot className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
            <div className="bg-primary/20 text-primary border border-primary/30 p-2 rounded-lg text-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-75"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-150"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste code here to test Groq API..."
          className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-gray-400"
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <Button 
          onClick={sendMessage} 
          disabled={loading || !input.trim()}
          className="bg-primary hover:bg-primary/80"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}
