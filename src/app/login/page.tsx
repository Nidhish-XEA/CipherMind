'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BrainCircuit, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MatrixRain from '@/components/landing/MatrixRain';

export default function Login() {
  const router = useRouter();
  const [data, setData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loginUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const callback = await signIn('credentials', {
      ...data,
      redirect: false,
    });

    if (callback?.error) {
      setError(callback.error);
      setLoading(false);
    } else if (callback?.ok) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <MatrixRain />
      <div className="glass-card w-full max-w-md p-8 rounded-2xl relative z-10 border border-white/10 shadow-2xl backdrop-blur-xl">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2 group">
            <BrainCircuit className="h-10 w-10 text-primary group-hover:scale-110 transition-transform" />
            <span className="font-mono text-2xl font-bold tracking-tight text-white group-hover:text-glow">Cipher<span className="text-secondary">Mind</span></span>
          </Link>
        </div>

        <h2 className="text-2xl font-bold font-mono text-white mb-2 text-center text-glow">Welcome Back</h2>
        <p className="text-gray-400 text-center text-sm mb-8">Enter your credentials to access your mentor.</p>

        <form onSubmit={loginUser} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1 font-mono">Email</label>
            <Input 
              type="email" 
              required
              className="bg-black/50 border-white/10 text-white focus:border-primary/50 transition-colors placeholder:text-gray-600"
              placeholder="hacker@terminal.io"
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
          
          <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/80 text-black font-bold h-12 transition-all mt-4">
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Initialize Session'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Don't have an account? <Link href="/signup" className="text-primary hover:underline font-mono">Register Here</Link>
        </div>
      </div>
    </div>
  );
}
