'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, BrainCircuit, ShieldAlert, Zap, Repeat, Target, Lock, Code, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MatrixRain from '@/components/landing/MatrixRain';
import { useEffect, useState, useRef } from 'react';

const Typewriter = ({ strings }: { strings: string[] }) => {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentStr = strings[index];
      if (isDeleting) {
        setText(currentStr.substring(0, text.length - 1));
        if (text === '') {
          setIsDeleting(false);
          setIndex((prev) => (prev + 1) % strings.length);
        }
      } else {
        setText(currentStr.substring(0, text.length + 1));
        if (text === currentStr) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      }
    }, isDeleting ? 40 : 80);
    return () => clearTimeout(timer);
  }, [text, isDeleting, index, strings]);

  return <span className="text-primary font-mono border-r-2 border-primary pr-1 animate-pulse">{text}</span>;
};

// Neural Network Background Component
const NeuralNetwork = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }

    const nodes: Node[] = [];
    const nodeCount = 50;
    const connectionDistance = 150;

    // Initialize nodes
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw nodes
      nodes.forEach((node, i) => {
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off walls
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        // Draw connections
        nodes.forEach((otherNode, j) => {
          if (i === j) return;
          const distance = Math.sqrt(
            Math.pow(node.x - otherNode.x, 2) + Math.pow(node.y - otherNode.y, 2)
          );

          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(otherNode.x, otherNode.y);
            ctx.strokeStyle = `rgba(0, 212, 255, ${0.1 * (1 - distance / connectionDistance)})`;
            ctx.stroke();
          }
        });

        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 212, 255, 0.6)';
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0"
      style={{ opacity: 0.3 }}
    />
  );
};

export default function Home() {
  const [demoStep, setDemoStep] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const runDemo = () => {
    setIsAnalyzing(true);
    setDemoStep(1);
    setTimeout(() => {
      setDemoStep(2);
      setIsAnalyzing(false);
    }, 3000);
  };

  return (
    <div className="relative min-h-screen">
      <MatrixRain />
      <NeuralNetwork />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <div className="mb-6 p-4 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md">
            <BrainCircuit className="w-16 h-16 text-primary" />
          </div>
          
          <h1 className="flex items-center gap-3 text-5xl md:text-7xl font-bold font-mono tracking-tighter mb-6 heading-glow text-white">
            Cipher<span className="text-secondary">Mind</span> <Lock className="hidden md:inline w-12 h-12 text-success" />
          </h1>
          
          <div className="h-12 md:h-16 text-xl md:text-3xl font-medium text-gray-300 mb-8 max-w-2xl">
            <Typewriter strings={["Remembers your mistakes.", "Learns your patterns.", "Makes you unstoppable."]} />
          </div>

          <div className="flex flex-col sm:flex-row gap-6 mb-16 relative z-10 w-full sm:w-auto px-4">
            <Link href="/signup" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/80 text-black font-bold h-14 px-8 text-lg rounded-full shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all hover:scale-105">
                Start Coding Free <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="#how-it-works" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg rounded-full border-gray-600 text-white hover:bg-white/5 backdrop-blur-md">
                See How It Works
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Floating Cards (Background elements) */}
        <motion.div 
          className="hidden md:block absolute top-[20%] left-[10%] opacity-60 text-left glass-card p-4 rounded-xl border border-red-500/30 w-72 backdrop-blur-sm"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
           <p className="text-red-400 font-mono text-xs break-all">const url = `http://foo.com/` + inp;</p>
           <p className="text-xs mt-2 text-gray-400">Vuln: SSRF/Injection vector detected.</p>
        </motion.div>
        <motion.div 
          className="hidden md:block absolute top-[40%] right-[10%] opacity-60 text-left glass-card p-4 rounded-xl border border-success/30 w-72 backdrop-blur-sm"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
           <p className="text-success font-mono text-xs break-all">const url = new URL(inp, base);</p>
           <p className="text-xs mt-2 text-gray-400">Fix applied: Strict URL validation.</p>
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-white/5 bg-background/50 backdrop-blur-md py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-around items-center gap-8 font-mono text-center">
          <div>
            <div className="text-3xl font-bold text-primary mb-2 text-glow">10,000+</div>
            <div className="text-gray-400 uppercase tracking-widest text-sm font-semibold">Mistakes Remembered</div>
          </div>
          <div className="hidden md:block w-px h-16 bg-white/10" />
          <div>
            <div className="text-3xl font-bold text-secondary mb-2 text-glow">500+</div>
            <div className="text-gray-400 uppercase tracking-widest text-sm font-semibold">Developers Improved</div>
          </div>
          <div className="hidden md:block w-px h-16 bg-white/10" />
          <div>
            <div className="text-3xl font-bold text-success mb-2 text-glow">98%</div>
            <div className="text-gray-400 uppercase tracking-widest text-sm font-semibold">Accuracy</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-4 relative">
        <div className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[800px] bg-secondary/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="text-center mb-16 relative z-10">
          <h2 className="text-3xl md:text-5xl font-mono font-bold mb-4 text-glow">The Brain Engine</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">Powered by Hindsight memory and Groq AI, CipherMind builds a vector representation of your weaknesses to forge you into an elite developer.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative z-10">
          {[
            { title: "Persistent Memory", desc: "Hindsight vector DB stores every mistake you make for continuous tracking.", icon: BrainCircuit, color: "text-primary" },
            { title: "Smart Code Analysis", desc: "Groq identifies complex logic vulnerabilities and anti-patterns instantly.", icon: Zap, color: "text-secondary" },
            { title: "Personalized Feedback", desc: "Actionable advice strictly tailored to your historical coding behavior.", icon: Target, color: "text-success" },
            { title: "Progress Tracking", desc: "Watch your mistake rate drop over time through dynamic visualizations.", icon: ShieldAlert, color: "text-primary" },
            { title: "Adaptive Learning", desc: "The suggestions get deeper and harder as your core skills improve.", icon: Repeat, color: "text-secondary" },
            { title: "Secure Code Focus", desc: "Stop shipping OWASP Top 10 vulnerabilities into production environments.", icon: Lock, color: "text-success" },
          ].map((feat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5, scale: 1.02 }}
              className="glass-card p-6 rounded-2xl flex flex-col group cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform" />
              <feat.icon className={`w-12 h-12 mb-4 ${feat.color} group-hover:scale-110 transition-transform duration-300`} />
              <h3 className="text-xl font-bold mb-2 font-mono text-white group-hover:text-primary transition-colors">{feat.title}</h3>
              <p className="text-gray-400">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 relative bg-[#0d0d14]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-mono font-bold mb-16 heading-glow">The Adaptive Loop</h2>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-4 lg:gap-8">
            {/* Step 1 */}
            <div className="flex-1 glass-card p-8 rounded-2xl relative z-10 w-full md:max-w-xs text-left">
              <div className="text-6xl font-black text-white/[0.03] absolute top-2 right-4">01</div>
              <h4 className="text-xl font-bold text-primary mb-4 font-mono">Submit Code</h4>
              <p className="text-gray-400 text-sm">Write or paste your code snippet. Select your language. Hit Analyze.</p>
            </div>
            <ArrowRight className="hidden md:block w-8 h-8 text-gray-700" />
            
            {/* Step 2 */}
            <div className="flex-1 glass-card p-8 rounded-2xl relative z-10 w-full md:max-w-xs text-left border-primary/20 bg-primary/[0.02]">
              <div className="text-6xl font-black text-white/[0.03] absolute top-2 right-4">02</div>
              <h4 className="text-xl font-bold text-secondary mb-4 font-mono">AI Analyzes</h4>
              <p className="text-gray-400 text-sm">Groq scans for bugs while querying your Hindsight memory for repeating flaws.</p>
            </div>
            <ArrowRight className="hidden md:block w-8 h-8 text-gray-700" />
            
            {/* Step 3 */}
            <div className="flex-1 glass-card p-8 rounded-2xl relative z-10 w-full md:max-w-xs text-left">
              <div className="text-6xl font-black text-white/[0.03] absolute top-2 right-4">03</div>
              <h4 className="text-xl font-bold text-success mb-4 font-mono">Memory Learns</h4>
              <p className="text-gray-400 text-sm">New mistakes are instantly stored. Your mentor adapts definitively to your weaknesses.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Demo Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-mono font-bold mb-4 heading-glow">Live Demo</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">See CipherMind in action - watch it detect vulnerabilities in real-time</p>
          </div>

          <div className="glass-card rounded-2xl p-8 border border-white/10">
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-sm font-mono text-gray-400">demo.js</span>
              </div>
              
              <div className="bg-black/50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <pre className="text-green-400">
{`function authenticateUser(username, password) {
  const query = \`SELECT * FROM users WHERE username = '\${username}' AND password = '\${password}'\`;
  return db.query(query);
}`}
                </pre>
              </div>
            </div>

            <div className="flex justify-center mb-6">
              <Button 
                onClick={runDemo}
                disabled={isAnalyzing}
                className="bg-primary hover:bg-primary/80 text-black font-bold"
              >
                {isAnalyzing ? (
                  <><motion.div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> Analyzing...</>
                ) : (
                  <>Run Analysis <Zap className="ml-2 w-4 h-4" /></>
                )}
              </Button>
            </div>

            {/* Demo Results */}
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: demoStep > 0 ? 1 : 0, height: demoStep > 0 ? 'auto' : 0 }}
              className="overflow-hidden"
            >
              <div className="border-t border-white/10 pt-6">
                <h3 className="text-lg font-bold font-mono text-white mb-4 flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5 text-primary" /> Analysis Results
                </h3>
                
                <div className="space-y-4">
                  <motion.div 
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-red-500/10 border border-red-500/30 rounded-lg p-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                      <span className="font-bold text-red-400 font-mono">SQL Injection</span>
                      <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">Critical</span>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">Direct string concatenation in SQL query allows malicious input injection</p>
                    <div className="bg-black/50 rounded p-2">
                      <code className="text-xs text-red-400">Vulnerable: {`SELECT * FROM users WHERE username = '${` + "username" + `}' AND password = '${` + "password" + `}'`}</code>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-green-500/10 border border-green-500/30 rounded-lg p-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="font-bold text-green-400 font-mono">Suggested Fix</span>
                    </div>
                    <div className="bg-black/50 rounded p-2">
                      <code className="text-xs text-green-400">Use parameterized queries or prepared statements</code>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 relative bg-[#0d0d14]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-mono font-bold mb-4 heading-glow">What Developers Say</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">Join thousands of developers who've leveled up their security skills</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                role: "Full Stack Developer",
                content: "CipherMind caught 3 SQL injection vulnerabilities I missed in code review. The memory feature is incredible - it remembers my patterns!",
                rating: 5
              },
              {
                name: "Marcus Rodriguez",
                role: "Security Engineer",
                content: "As someone who mentors junior developers, this tool is a game-changer. The personalized feedback based on past mistakes is brilliant.",
                rating: 5
              },
              {
                name: "Emily Watson",
                role: "Frontend Developer",
                content: "I've reduced my security bugs by 80% since using CipherMind. The real-time analysis during development is invaluable.",
                rating: 5
              }
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 rounded-2xl border border-white/10 hover:border-primary/30 transition-all"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <span key={j} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-gray-300 mb-4 italic">&quot;{testimonial.content}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <span className="text-black font-bold text-sm">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-mono font-semibold text-white">{testimonial.name}</div>
                    <div className="text-xs text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-background py-16 text-center">
        <div className="flex items-center justify-center gap-2 mb-4 group cursor-pointer">
          <BrainCircuit className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
          <span className="font-mono font-bold text-2xl text-glow">Cipher<span className="text-secondary">Mind</span></span>
        </div>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">Designed for continuous improvement and cognitive security awareness.</p>
        <div className="inline-block glass-panel px-6 py-2 rounded-full border border-primary/20 hover:border-primary/50 transition-colors">
          <span className="text-sm font-mono text-primary font-bold">Built for HackWithBengaluru 2.0</span>
        </div>
      </footer>
    </div>
  );
}
