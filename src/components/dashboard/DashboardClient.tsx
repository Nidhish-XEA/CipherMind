'use client';

import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { BrainCircuit, Loader2, Play, AlertOctagon, AlertTriangle, ShieldAlert, CheckCircle, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const LANGUAGES = [
  { id: 'javascript', name: 'JavaScript' },
  { id: 'python', name: 'Python' },
  { id: 'java', name: 'Java' },
  { id: 'cpp', name: 'C++' },
  { id: 'go', name: 'Go' },
];

export default function DashboardClient({ user }: { user: any }) {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('// Write or paste your code here\n\nfunction processInput(input) {\n  // eval(input);\n  return "Processed: " + input;\n}\n');
  const [analyzing, setAnalyzing] = useState(false);
  const [findings, setFindings] = useState<any[] | null>(null);
  const [memories, setMemories] = useState<any[]>([]);

  useEffect(() => {
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    try {
      const res = await fetch('/api/memory?query=all past mistakes and vulnerabilities');
      const data = await res.json();
      if (data.memories) {
        setMemories(Array.isArray(data.memories) ? data.memories : [data.memories]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setFindings(null);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language })
      });
      const data = await res.json();
      
      if (data.findings) {
        setFindings(data.findings);
        fetchMemories(); // Refresh memories after analysis adds them
      } else {
        setFindings([]);
      }
    } catch (e) {
      console.error(e);
      setFindings([]);
    } finally {
      setAnalyzing(false);
    }
  };

  const SeverityIcon = ({ level }: { level: string }) => {
    switch(level.toLowerCase()) {
      case 'critical': return <AlertOctagon className="w-5 h-5 text-red-500" />;
      case 'high': return <AlertOctagon className="w-5 h-5 text-orange-500" />;
      case 'medium': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default: return <ShieldAlert className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] p-4 gap-4 overflow-hidden">
      {/* LEFT: Editor Area */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="glass-card p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="font-mono font-bold text-lg text-white">Project Protocol</h2>
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-black/50 border border-white/10 text-white text-sm rounded-md px-3 py-1 font-mono outline-none focus:border-primary/50"
            >
              {LANGUAGES.map(lang => (
                <option key={lang.id} value={lang.id}>{lang.name}</option>
              ))}
            </select>
          </div>
          <Button 
            onClick={handleAnalyze} 
            disabled={analyzing || !code.trim()}
            className="bg-primary hover:bg-primary/80 text-black font-bold font-mono transition-transform hover:scale-105"
          >
            {analyzing ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {analyzing ? 'Scanning Protocol...' : 'Analyze Code'}
          </Button>
        </div>

        <div className="flex-1 glass-card rounded-xl overflow-hidden border border-white/10">
          <Editor
            height="100%"
            language={language}
            theme="vs-dark"
            value={code}
            onChange={(val) => setCode(val || '')}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: 'JetBrains Mono, Space Mono, monospace',
              padding: { top: 16 }
            }}
          />
        </div>

        {/* Results Panel */}
        <div className="h-1/3 glass-card rounded-xl p-4 overflow-y-auto border border-white/10">
          <h3 className="font-mono text-primary font-bold mb-4 flex items-center gap-2">
            <BrainCircuit className="w-5 h-5" /> 
            Groq Analysis Results
          </h3>
          
          {analyzing && (
            <div className="flex items-center justify-center h-24 text-primary animate-pulse font-mono">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Scanning for vulnerabilities via Hindsight memory...
            </div>
          )}

          {!analyzing && findings && findings.length === 0 && (
            <div className="flex items-center justify-center p-8 text-success font-mono bg-success/5 border border-success/20 rounded-lg">
              <CheckCircle className="w-6 h-6 mr-2" /> No critical vulnerabilities detected. Perfect execution.
            </div>
          )}

          {!analyzing && findings && findings.length > 0 && (
            <div className="space-y-4">
              {findings.map((f, i) => (
                <Card key={i} className="bg-black/40 border-white/5 p-4 relative overflow-hidden group">
                  <div className={`absolute top-0 left-0 w-1 h-full 
                    ${f.severity === 'Critical' ? 'bg-red-500' : 
                      f.severity === 'High' ? 'bg-orange-500' : 
                      f.severity === 'Medium' ? 'bg-yellow-500' : 'bg-blue-500'}`} 
                  />
                  <div className="pl-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <SeverityIcon level={f.severity} />
                        <span className="font-bold text-white font-mono">{f.issue_type}</span>
                        <span className="text-xs text-gray-400 font-mono bg-white/5 px-2 py-1 rounded">Line {f.line_number}</span>
                      </div>
                      <span className={`text-xs font-bold font-mono px-2 py-1 rounded 
                        ${f.severity === 'Critical' ? 'bg-red-500/20 text-red-400' : 
                          f.severity === 'High' ? 'bg-orange-500/20 text-orange-400' : 
                          f.severity === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'}`}>
                        {f.severity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 mb-4">{f.explanation}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                        <span className="text-xs text-green-400 font-mono mb-2 block">Suggested Fix</span>
                        <pre className="text-xs text-gray-300 font-mono overflow-x-auto whitespace-pre-wrap">{f.suggested_fix}</pre>
                      </div>
                      <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-3">
                        <span className="text-xs text-secondary font-mono mb-2 block">Memory Insight</span>
                        <p className="text-xs text-gray-300">{f.learning_tip}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: Memory Sidebar */}
      <div className="w-80 glass-card rounded-xl p-4 flex flex-col border border-white/10">
        <h3 className="font-mono text-secondary font-bold mb-4 flex items-center justify-between">
          <span className="flex items-center gap-2"><History className="w-5 h-5" /> Memory DB</span>
          <span className="text-xs bg-white/10 px-2 py-1 rounded text-white">{memories.length} items</span>
        </h3>
        
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
          {memories.length === 0 ? (
            <p className="text-xs text-gray-500 font-mono text-center mt-10">No past mistakes recorded. Analyze code to seed your mentor's memory.</p>
          ) : (
            memories.map((m, i) => {
              const content = typeof m === 'string' ? m : (m.content || JSON.stringify(m));
              const isCrit = content.includes('Critical') || content.includes('High');
              return (
                <div key={i} className={`p-3 rounded-lg border text-xs font-mono transition-colors hover:bg-white/5 cursor-default
                  ${isCrit ? 'bg-red-500/5 border-red-500/20' : 'bg-black/50 border-white/5'}`}>
                  <p className="text-gray-300 line-clamp-4">{content}</p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
