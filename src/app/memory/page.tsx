'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { BrainCircuit, Filter, AlertOctagon, AlertTriangle, ShieldAlert, History, Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function MemoryPage() {
  const { data: session } = useSession();
  const [memories, setMemories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('All');

  useEffect(() => {
    if (session?.user?.id) {
      fetchMemories();
    }
  }, [session]);

  const fetchMemories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/memory?query=all past mistakes and secure coding issues');
      const data = await res.json();
      if (data.memories) {
        setMemories(Array.isArray(data.memories) ? data.memories.map((m: any) => typeof m === 'string' ? m : (m.content || JSON.stringify(m))) : []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getSeverity = (content: string) => {
    if (content.includes('Critical')) return 'Critical';
    if (content.includes('High')) return 'High';
    if (content.includes('Medium')) return 'Medium';
    return 'Low';
  };

  const getLanguage = (content: string) => {
    const match = content.match(/mistake in (\w+):/i);
    return match ? match[1] : 'Unknown';
  };

  const filteredMemories = memories.filter(m => {
    const matchesSearch = m.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === 'All' || getSeverity(m) === filterSeverity;
    return matchesSearch && matchesSeverity;
  });

  const SeverityIcon = ({ level }: { level: string }) => {
    switch(level) {
      case 'Critical': return <AlertOctagon className="w-5 h-5 text-red-500" />;
      case 'High': return <AlertOctagon className="w-5 h-5 text-orange-500" />;
      case 'Medium': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default: return <ShieldAlert className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-mono font-bold text-glow flex items-center gap-3">
            <History className="w-8 h-8 text-secondary" /> Vectors of Memory
          </h1>
          <p className="text-gray-400 mt-2">Explore the neural database of your past weaknesses.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-black/40 p-2 rounded-lg border border-white/10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="Search memories..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 bg-transparent border-none focus-visible:ring-0 text-white w-64"
            />
          </div>
          <div className="h-6 w-px bg-white/10 mx-2" />
          <div className="flex items-center gap-2 px-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select 
              value={filterSeverity} 
              onChange={e => setFilterSeverity(e.target.value)}
              className="bg-transparent text-sm text-gray-300 outline-none cursor-pointer"
            >
              <option value="All" className="bg-background">All Severities</option>
              <option value="Critical" className="bg-background text-red-400">Critical</option>
              <option value="High" className="bg-background text-orange-400">High</option>
              <option value="Medium" className="bg-background text-yellow-400">Medium</option>
              <option value="Low" className="bg-background text-blue-400">Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-64 text-primary animate-pulse font-mono">
              Fetching semantic context from Hindsight...
            </div>
          ) : filteredMemories.length === 0 ? (
            <div className="glass-card p-12 text-center rounded-xl border border-white/5">
              <BrainCircuit className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-mono text-gray-400">No memories found.</h3>
              <p className="text-sm text-gray-500 mt-2">Adjust your filters or analyze more code.</p>
            </div>
          ) : (
            filteredMemories.map((m, i) => {
              const severity = getSeverity(m);
              const lang = getLanguage(m);
              
              return (
                <Card key={i} className="glass-card bg-black/40 border-white/5 p-6 hover:border-primary/30 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <SeverityIcon level={severity} />
                      <span className="font-bold font-mono text-white text-lg">Stored Oversight</span>
                      <span className="bg-white/10 px-2 py-1 rounded text-xs text-gray-300 font-mono border border-white/5">{lang}</span>
                    </div>
                    <span className={`text-xs font-bold font-mono px-3 py-1 rounded-full 
                        ${severity === 'Critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 
                          severity === 'High' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 
                          severity === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 
                          'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>
                        {severity}
                    </span>
                  </div>
                  <div className="text-gray-300 text-sm leading-relaxed border-l-2 border-primary/30 pl-4 py-1">
                    {m.replace(/User made a .* mistake in \w+:/i, '').trim()}
                  </div>
                </Card>
              );
            })
          )}
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6 rounded-xl border border-white/5">
            <h3 className="font-mono text-primary font-bold mb-4">Neural Diagnostics</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Critical Density</span>
                  <span className="text-red-400 font-mono">
                    {memories.length ? Math.round((memories.filter(m => getSeverity(m) === 'Critical').length / memories.length) * 100) : 0}%
                  </span>
                </div>
                <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500" style={{ width: `${memories.length ? Math.round((memories.filter(m => getSeverity(m) === 'Critical').length / memories.length) * 100) : 0}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Logic Flaws</span>
                  <span className="text-orange-400 font-mono">
                    {memories.length ? Math.round((memories.filter(m => getSeverity(m) === 'High').length / memories.length) * 100) : 0}%
                  </span>
                </div>
                <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500" style={{ width: `${memories.length ? Math.round((memories.filter(m => getSeverity(m) === 'High').length / memories.length) * 100) : 0}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-xl border border-white/5 bg-secondary/5">
            <h3 className="font-mono text-secondary font-bold mb-2">Mentor Note</h3>
            <p className="text-sm text-gray-300">Your specific vulnerability patterns are embedded securely in Hindsight. The AI queries these vectors on every future scan to prevent regressions.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
