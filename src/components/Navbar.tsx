import Link from 'next/link';
import { BrainCircuit, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 glass-panel border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <BrainCircuit className="h-8 w-8 text-primary group-hover:animate-pulse-slow" />
              <span className="font-mono text-xl font-bold tracking-tight text-white group-hover:text-glow transition-all">
                Cipher<span className="text-secondary font-bold">Mind</span>
              </span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link href="#features" className="text-gray-300 hover:text-primary text-sm font-medium transition-colors">Features</Link>
              <Link href="#how-it-works" className="text-gray-300 hover:text-primary text-sm font-medium transition-colors">How it works</Link>
              <Link href="/progress" className="text-gray-300 hover:text-primary text-sm font-medium transition-colors flex items-center gap-1">
                <TrendingUp className="w-4 h-4" /> Progress
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10">Sign In</Button>
            </Link>
            <Link href="/signup">
              <div className="interactive-border rounded-md">
                <Button className="bg-background text-primary border border-primary/50 hover:bg-primary/10 rounded-md">
                  Get Started
                </Button>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
