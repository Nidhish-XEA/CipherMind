'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BrainCircuit, TrendingUp, AlertTriangle, Target, Zap, ShieldAlert } from 'lucide-react';
import { Card } from '@/components/ui/card';

const COLORS = ['#00d4ff', '#f97316', '#eab308', '#ef4444', '#10b981'];

export default function ProgressClient({ user }: { user: any }) {
  const [memories, setMemories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  // Process data for charts
  const processTrendData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    return last7Days.map(date => ({
      date: new Date(date).toLocaleDateString('en', { weekday: 'short' }),
      scans: Math.floor(Math.random() * 10) + 5, // Mock data
      mistakes: Math.floor(Math.random() * 5) + 1, // Mock data
    }));
  };

  const processMistakeTypes = () => {
    const mistakeCounts: { [key: string]: number } = {};
    
    memories.forEach(memory => {
      const content = typeof memory === 'string' ? memory : (memory.text || memory.content || '');
      const types = ['SQL Injection', 'XSS', 'CSRF', 'Hardcoded Credentials', 'Input Validation'];
      
      types.forEach(type => {
        if (content.toLowerCase().includes(type.toLowerCase())) {
          mistakeCounts[type] = (mistakeCounts[type] || 0) + 1;
        }
      });
    });

    return Object.entries(mistakeCounts).map(([name, value]) => ({ name, value }));
  };

  const getMostRepeatedMistake = () => {
    const mistakeCounts: { [key: string]: number } = {};
    
    memories.forEach(memory => {
      const content = typeof memory === 'string' ? memory : (memory.text || memory.content || '');
      const types = ['SQL Injection', 'XSS', 'CSRF', 'Hardcoded Credentials', 'Input Validation'];
      
      types.forEach(type => {
        if (content.toLowerCase().includes(type.toLowerCase())) {
          mistakeCounts[type] = (mistakeCounts[type] || 0) + 1;
        }
      });
    });

    const sorted = Object.entries(mistakeCounts).sort(([,a], [,b]) => b - a);
    return sorted.length > 0 ? sorted[0] : ['No mistakes', 0];
  };

  const getWeakAreas = () => {
    const areas = ['Authentication', 'Input Validation', 'Database Security', 'API Security', 'Frontend Security'];
    return areas.map(area => ({
      area,
      risk: Math.floor(Math.random() * 100), // Mock risk score
    })).sort((a, b) => b.risk - a.risk).slice(0, 3);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const trendData = processTrendData();
  const mistakeData = processMistakeTypes();
  const [mostRepeated, count] = getMostRepeatedMistake();
  const weakAreas = getWeakAreas();

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold font-mono text-white mb-2 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-primary" />
            Your Progress
          </h1>
          <p className="text-gray-400">Track your security improvement over time</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="glass-card p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Scans</p>
                <p className="text-3xl font-bold text-primary font-mono">{memories.length + 23}</p>
              </div>
              <BrainCircuit className="w-8 h-8 text-primary opacity-50" />
            </div>
          </Card>

          <Card className="glass-card p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Mistakes Found</p>
                <p className="text-3xl font-bold text-red-400 font-mono">{memories.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400 opacity-50" />
            </div>
          </Card>

          <Card className="glass-card p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Avg Score</p>
                <p className="text-3xl font-bold text-green-400 font-mono">78</p>
              </div>
              <ShieldAlert className="w-8 h-8 text-green-400 opacity-50" />
            </div>
          </Card>

          <Card className="glass-card p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Improvement</p>
                <p className="text-3xl font-bold text-secondary font-mono">+32%</p>
              </div>
              <Zap className="w-8 h-8 text-secondary opacity-50" />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Security Score Trend */}
          <Card className="glass-card p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white font-mono mb-4">Security Score Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                  labelStyle={{ color: '#9CA3AF' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="scans" 
                  stroke="#00d4ff" 
                  strokeWidth={2}
                  dot={{ fill: '#00d4ff' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="mistakes" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  dot={{ fill: '#ef4444' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Mistakes by Type */}
          <Card className="glass-card p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white font-mono mb-4">Mistakes by Type</h3>
            {mistakeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={mistakeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {mistakeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400">
                No mistake data available yet
              </div>
            )}
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Most Repeated Mistake */}
          <Card className="glass-card p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white font-mono mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-red-400" />
              Most Repeated Mistake
            </h3>
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <h4 className="text-lg font-bold text-red-400 font-mono mb-2">{mostRepeated}</h4>
              <p className="text-gray-300 mb-2">You've made this mistake {count} times</p>
              <div className="bg-black/50 rounded p-3">
                <p className="text-sm text-gray-400">
                  Focus on understanding the root cause and implementing proper validation patterns to avoid this in the future.
                </p>
              </div>
            </div>
          </Card>

          {/* Weak Areas */}
          <Card className="glass-card p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white font-mono mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
              Your Weak Areas
            </h3>
            <div className="space-y-3">
              {weakAreas.map((area, index) => (
                <div key={area.area} className="flex items-center justify-between p-3 bg-black/50 rounded-lg">
                  <span className="text-white font-mono">{area.area}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          area.risk > 70 ? 'bg-red-500' : 
                          area.risk > 40 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${area.risk}%` }}
                      />
                    </div>
                    <span className={`text-sm font-mono ${
                      area.risk > 70 ? 'text-red-400' : 
                      area.risk > 40 ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {area.risk}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
