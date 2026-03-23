'use client';

import { useState, useEffect, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { BrainCircuit, Loader2, Play, AlertOctagon, AlertTriangle, ShieldAlert, CheckCircle, History, Upload, FileText, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const LANGUAGES = [
  { id: 'javascript', name: 'JavaScript' },
  { id: 'typescript', name: 'TypeScript' },
  { id: 'python', name: 'Python' },
  { id: 'java', name: 'Java' },
  { id: 'cpp', name: 'C++' },
  { id: 'c', name: 'C' },
  { id: 'go', name: 'Go' },
  { id: 'php', name: 'PHP' },
  { id: 'ruby', name: 'Ruby' },
];

export default function DashboardClient({ user }: { user: any }) {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('// Write or paste your code here\n\nfunction processInput(input) {\n  // eval(input);\n  return "Processed: " + input;\n}\n');
  const [analyzing, setAnalyzing] = useState(false);
  const [findings, setFindings] = useState<any[] | null>(null);
  const [memories, setMemories] = useState<any[]>([]);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [uploadMode, setUploadMode] = useState<'snippet' | 'file'>('snippet');
  const [fileName, setFileName] = useState<string>('');
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());
  const [fixedCards, setFixedCards] = useState<Set<number>>(new Set());
  const [scanningLine, setScanningLine] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    try {
      const res = await fetch(`/api/memory/${user.id}`);
      const data = await res.json();
      setMemories(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validExtensions = ['.js', '.ts', '.py', '.java', '.go', '.cpp', '.c', '.php', '.rb'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a supported code file.",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setCode(content);
      setFileName(file.name);
      
      // Auto-detect language
      const langMap: { [key: string]: string } = {
        '.js': 'javascript',
        '.ts': 'typescript', 
        '.py': 'python',
        '.java': 'java',
        '.go': 'go',
        '.cpp': 'cpp',
        '.c': 'c',
        '.php': 'php',
        '.rb': 'ruby'
      };
      setLanguage(langMap[fileExtension] || 'javascript');
    };
    reader.readAsText(file);
  }, [toast]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Fix copied to clipboard",
        duration: 2000
      });
    } catch (e) {
      console.error('Failed to copy:', e);
    }
  };

  const toggleCardExpansion = (index: number) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedCards(newExpanded);
  };

  const markAsFixed = (index: number) => {
    const newFixed = new Set(fixedCards);
    newFixed.add(index);
    setFixedCards(newFixed);
    toast({
      title: "Marked as fixed",
      description: "Great job fixing this vulnerability!",
      duration: 2000
    });
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setFindings(null);
    setAnalysisResult(null);
    setScanningLine(0);
    
    // Simulate scanning animation
    const lines = code.split('\n').length;
    const scanInterval = setInterval(() => {
      setScanningLine(prev => {
        if (prev >= lines) {
          clearInterval(scanInterval);
          return lines;
        }
        return prev + 1;
      });
    }, 50);
    
    try {
      const res = await fetch('/api/analyze-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language })
      });
      const data = await res.json();
      
      clearInterval(scanInterval);
      setScanningLine(lines);
      
      if (data.findings) {
        setFindings(data.findings);
        setAnalysisResult(data);
        fetchMemories();
      } else {
        setFindings([]);
        setAnalysisResult({ findings: [], score: 100, summary: "No vulnerabilities found" });
      }
    } catch (e) {
      console.error(e);
      clearInterval(scanInterval);
      setFindings([]);
      toast({
        title: "Analysis failed",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setTimeout(() => {
        setAnalyzing(false);
        setScanningLine(0);
      }, 500);
    }
  };

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!analyzing && code.trim()) {
          handleAnalyze();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [analyzing, code]);

  const SeverityIcon = ({ level }: { level: string }) => {
    switch(level.toLowerCase()) {
      case 'critical': return <AlertOctagon className="w-5 h-5 text-red-500" />;
      case 'high': return <AlertOctagon className="w-5 h-5 text-orange-500" />;
      case 'medium': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default: return <ShieldAlert className="w-5 h-5 text-blue-500" />;
    }
  };

  const ScoreMeter = ({ score }: { score: number }) => {
    const getColor = (score: number) => {
      if (score >= 80) return 'text-green-500';
      if (score >= 60) return 'text-yellow-500';
      if (score >= 40) return 'text-orange-500';
      return 'text-red-500';
    };

    const getStrokeColor = (score: number) => {
      if (score >= 80) return '#10b981';
      if (score >= 60) return '#eab308';
      if (score >= 40) return '#f97316';
      return '#ef4444';
    };

    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
      <div className="relative w-32 h-32">
        <svg className="transform -rotate-90 w-32 h-32">
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-700"
          />
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke={getStrokeColor(score)}
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-bold ${getColor(score)}`}>{score}</span>
          <span className="text-xs text-gray-400">SECURITY</span>
        </div>
      </div>
    );
  };

  const getSeverityCounts = (): { critical: number; high: number; medium: number; low: number } => {
    if (!findings) return { critical: 0, high: 0, medium: 0, low: 0 };
    return findings.reduce((acc, f) => {
      const severity = f.severity?.toLowerCase() || 'low';
      acc[severity] = (acc[severity] || 0) + 1;
      return acc;
    }, { critical: 0, high: 0, medium: 0, low: 0 });
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] p-4 gap-4 overflow-hidden">
      {/* LEFT: Editor Area */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="glass-card p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="font-mono font-bold text-lg text-white">Project Protocol</h2>
            
            {/* Mode Toggle */}
            <div className="flex items-center gap-2 bg-black/50 rounded-lg p-1 border border-white/10">
              <button
                onClick={() => setUploadMode('snippet')}
                className={`px-3 py-1 rounded text-sm font-mono transition-colors ${
                  uploadMode === 'snippet' 
                    ? 'bg-primary text-black' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4 inline mr-1" /> Snippet
              </button>
              <button
                onClick={() => setUploadMode('file')}
                className={`px-3 py-1 rounded text-sm font-mono transition-colors ${
                  uploadMode === 'file' 
                    ? 'bg-primary text-black' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Upload className="w-4 h-4 inline mr-1" /> File Upload
              </button>
            </div>

            {uploadMode === 'snippet' && (
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-black/50 border border-white/10 text-white text-sm rounded-md px-3 py-1 font-mono outline-none focus:border-primary/50"
              >
                {LANGUAGES.map(lang => (
                  <option key={lang.id} value={lang.id}>{lang.name}</option>
                ))}
              </select>
            )}

            {uploadMode === 'file' && (
              <input
                type="file"
                accept=".js,.ts,.py,.java,.go,.cpp,.c,.php,.rb"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {uploadMode === 'file' && (
              <Button
                onClick={() => document.getElementById('file-upload')?.click()}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
            )}
            
            <Button 
              onClick={handleAnalyze} 
              disabled={analyzing || !code.trim()}
              className="bg-primary hover:bg-primary/80 text-black font-bold font-mono transition-transform hover:scale-105"
            >
              {analyzing ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {analyzing ? 'Scanning Protocol...' : 'Analyze Code'}
            </Button>
          </div>
        </div>

        {/* File Name Badge */}
        {fileName && (
          <div className="glass-card px-3 py-2 rounded-lg flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            <span className="text-sm font-mono text-white">{fileName}</span>
          </div>
        )}

        <div className="flex-1 glass-card rounded-xl overflow-hidden border border-white/10 relative">
          {/* Scanning Animation Overlay */}
          {analyzing && scanningLine > 0 && (
            <div 
              className="absolute left-0 right-0 bg-primary/20 z-10 transition-all duration-100 pointer-events-none"
              style={{ 
                top: `${(scanningLine / code.split('\n').length) * 100}%`,
                height: '20px',
                transform: 'translateY(-50%)'
              }}
            >
              <div className="h-full bg-primary/40 animate-pulse" />
            </div>
          )}
          
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
        <div className="h-96 glass-card rounded-xl p-4 overflow-y-auto border border-white/10">
          <h3 className="font-mono text-primary font-bold mb-4 flex items-center gap-2">
            <BrainCircuit className="w-5 h-5" /> 
            Groq Analysis Results
          </h3>
          
          {/* Score Meter and Summary */}
          {analysisResult && !analyzing && (
            <div className="mb-6 p-4 bg-black/40 rounded-lg border border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <ScoreMeter score={analysisResult.score || 0} />
                </div>
                <div className="flex-1 ml-6">
                  <h4 className="font-mono text-white font-bold mb-2">Security Assessment</h4>
                  <p className="text-sm text-gray-300 mb-3">{analysisResult.summary || 'Analysis complete'}</p>
                  
                  {/* Severity Summary */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {(() => {
                      const counts = getSeverityCounts();
                      return Object.entries(counts).map(([severity, count]) => 
                        count > 0 && (
                          <span key={severity} className={`text-xs font-bold font-mono px-2 py-1 rounded ${
                            severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                            severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                            severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-blue-500/20 text-blue-400'
                          }`}>
                            {count} {severity.charAt(0).toUpperCase() + severity.slice(1)}
                          </span>
                        )
                      );
                    })()}
                  </div>
                  
                  {/* Repeat Mistake Warning */}
                  {analysisResult.is_repeat_mistake && (
                    <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-2">
                      <p className="text-xs text-orange-400 font-mono">
                        ⚠️ {analysisResult.repeat_note || "You've made this mistake before!"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {analyzing && (
            <div className="flex flex-col items-center justify-center h-24 text-primary animate-pulse font-mono">
              <Loader2 className="w-6 h-6 animate-spin mb-2" /> 
              Scanning for vulnerabilities via Hindsight memory...
              <p className="text-xs text-gray-400 mt-1">Press Ctrl+Enter to analyze</p>
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
                <Card 
                  key={i} 
                  className={`bg-black/40 border-white/5 p-4 relative overflow-hidden group transition-all ${
                    fixedCards.has(i) ? 'opacity-50' : ''
                  }`}
                >
                  <div className={`absolute top-0 left-0 w-1 h-full 
                    ${f.severity === 'Critical' ? 'bg-red-500' : 
                      f.severity === 'High' ? 'bg-orange-500' : 
                      f.severity === 'Medium' ? 'bg-yellow-500' : 'bg-blue-500'}`} 
                  />
                  
                  {fixedCards.has(i) && (
                    <div className="absolute top-2 right-2 bg-green-500/20 text-green-400 text-xs font-mono px-2 py-1 rounded">
                      ✓ FIXED
                    </div>
                  )}
                  
                  <div className="pl-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <SeverityIcon level={f.severity} />
                        <span className={`font-bold text-white font-mono ${
                          fixedCards.has(i) ? 'line-through' : ''
                        }`}>{f.issue_type}</span>
                        <span className="text-xs text-gray-400 font-mono bg-white/5 px-2 py-1 rounded">Line {f.line_number}</span>
                      </div>
                      <span className={`text-xs font-bold font-mono px-2 py-1 rounded 
                        ${f.severity === 'Critical' ? 'bg-red-500/20 text-red-400' : 
                          f.severity === 'High' ? 'bg-orange-500/20 text-orange-400' : 
                          f.severity === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'}`}>
                        {f.severity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 mb-3">{f.explanation}</p>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 mb-3">
                      <button
                        onClick={() => toggleCardExpansion(i)}
                        className="text-xs text-primary hover:text-primary/80 font-mono flex items-center gap-1"
                      >
                        {expandedCards.has(i) ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        {expandedCards.has(i) ? 'Hide Fix' : 'Show Fix'}
                      </button>
                      
                      {expandedCards.has(i) && (
                        <>
                          <button
                            onClick={() => copyToClipboard(f.suggested_fix)}
                            className="text-xs text-white hover:text-primary font-mono flex items-center gap-1"
                          >
                            <Copy className="w-3 h-3" /> Copy Fix
                          </button>
                          
                          {!fixedCards.has(i) && (
                            <button
                              onClick={() => markAsFixed(i)}
                              className="text-xs text-green-400 hover:text-green-300 font-mono flex items-center gap-1"
                            >
                              <Check className="w-3 h-3" /> Mark as Fixed
                            </button>
                          )}
                        </>
                      )}
                    </div>
                    
                    {/* Expandable Code Diff */}
                    {expandedCards.has(i) && (
                      <div className="space-y-3 animate-in slide-in-from-top duration-200">
                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                          <span className="text-xs text-red-400 font-mono mb-2 block">❌ Vulnerable Code:</span>
                          <pre className="text-xs text-gray-300 font-mono overflow-x-auto whitespace-pre-wrap">{f.vulnerable_code}</pre>
                        </div>
                        
                        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                          <span className="text-xs text-green-400 font-mono mb-2 block">✅ Suggested Fix:</span>
                          <pre className="text-xs text-gray-300 font-mono overflow-x-auto whitespace-pre-wrap">{f.suggested_fix}</pre>
                        </div>
                        
                        <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-3">
                          <span className="text-xs text-secondary font-mono mb-2 block">💡 Learning Tip:</span>
                          <p className="text-xs text-gray-300">{f.learning_tip}</p>
                        </div>
                      </div>
                    )}
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
              const content = typeof m === 'string' ? m : (m.text || m.content || JSON.stringify(m));
              const isCrit = content.toLowerCase().includes('critical') || content.toLowerCase().includes('high');
              
              // Extract issue type and language from content
              const issueTypeMatch = content.match(/(\w+\s*(?:injection|xss|csrf|vulnerability|error|mistake))/i);
              const languageMatch = content.match(/(javascript|python|java|cpp|c\+\+|go|php|ruby)/i);
              
              return (
                <div key={i} className={`p-3 rounded-lg border text-xs font-mono transition-colors hover:bg-white/5 cursor-default
                  ${isCrit ? 'bg-red-500/5 border-red-500/20' : 'bg-black/50 border-white/5'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-bold ${
                      isCrit ? 'text-red-400' : 'text-blue-400'
                    }`}>
                      {issueTypeMatch ? issueTypeMatch[1] : 'Security Issue'}
                    </span>
                    {languageMatch && (
                      <span className="text-gray-500 bg-white/10 px-1 py-0.5 rounded">
                        {languageMatch[1]}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-300 line-clamp-3 text-xs leading-relaxed">
                    {content.length > 150 ? content.substring(0, 150) + '...' : content}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
