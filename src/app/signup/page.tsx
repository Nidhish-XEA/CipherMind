'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BrainCircuit, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MatrixRain from '@/components/landing/MatrixRain';

export default function Signup() {
  const router = useRouter();
  const [data, setData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const registerUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const userInfo = await response.json();

      if (!response.ok) {
        throw new Error(userInfo.error || 'Something went wrong');
      }

      router.push('/login');
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <MatrixRain />
      <div className="glass-card w-full max-w-md p-8 rounded-2xl relative z-10 border border-white/10 shadow-2xl backdrop-blur-xl">
        <div className="flex justify-center mb-6">
          <Link href="/" className="flex items-center gap-2 group">
            <BrainCircuit className="h-10 w-10 text-primary group-hover:scale-110 transition-transform" />
            <span className="font-mono text-2xl font-bold tracking-tight text-white group-hover:text-glow">Cipher<span className="text-secondary">Mind</span></span>
          </Link>
        </div>

        <h2 className="text-2xl font-bold font-mono text-white mb-2 text-center text-glow">Create Identity</h2>
        <p className="text-gray-400 text-center text-sm mb-6">Register to access your personal AI mentor.</p>

        <form onSubmit={registerUser} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1 font-mono">Alias (Name)</label>
            <Input 
              type="text" 
              required
              className="bg-black/50 border-white/10 text-white focus:border-primary/50 transition-colors"
              placeholder="Neo"
              value={data.name} 
              onChange={e => setData({...data, name: e.target.value})} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1 font-mono">Email</label>
            <Input 
              type="email" 
              required
              className="bg-black/50 border-white/10 text-white focus:border-primary/50 transition-colors placeholder:text-gray-600"
              placeholder="neo@matrix.io"
              value={data.email} 
              onChange={e => setData({...data, email: e.target.value})} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1 font-mono">Password</label>
            <Input 
              type="password" 
              required
              className="bg-black/50 border-white/10 text-white focus:border-primary/50 transition-colors"
              placeholder="••••••••"
              value={data.password} 
              onChange={e => setData({...data, password: e.target.value})} 
            />
          </div>
          
          {error && <p className="text-red-400 text-sm font-mono text-center">{error}</p>}
          
          <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/80 text-black font-bold h-12 transition-all mt-4 border border-primary">
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Register Identity'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Already have an account? <Link href="/login" className="text-primary hover:underline font-mono">Login Here</Link>
        </div>
      </div>
    </div>
  );
}
