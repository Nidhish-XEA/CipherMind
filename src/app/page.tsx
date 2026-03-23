'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, BrainCircuit, ShieldAlert, Zap, Repeat, Target, Lock, Code, CheckCircle, AlertTriangle, Upload, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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

    const nodes: Array<{x: number, y: number, vx: number, vy: number}> = [];
    const nodeCount = 50;

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5
      });
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(13, 13, 20, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      nodes.forEach((node, i) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        ctx.beginPath();
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#00d4ff';
        ctx.fill();

        nodes.forEach((otherNode, j) => {
          if (i !== j) {
            const distance = Math.sqrt(
              Math.pow(node.x - otherNode.x, 2) + Math.pow(node.y - otherNode.y, 2)
            );
            
            if (distance < 150) {
              ctx.beginPath();
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(otherNode.x, otherNode.y);
              ctx.strokeStyle = `rgba(0, 212, 255, ${1 - distance / 150})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        });
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
      style={{ background: 'linear-gradient(to bottom, #0d0d14, #1a1a2e)' }}
    />
  );
};

export default function HomePage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  const [demoCode, setDemoCode] = useState(`function authenticateUser(username, password) {
  const query = \`SELECT * FROM users WHERE username = '\${username}' AND password = '\${password}'\`;
  return db.query(query);
}`);

  const runDemo = async () => {
    setIsAnalyzing(true);
    setDemoCode(`function authenticateUser(username, password) {
  const query = \`SELECT * FROM users WHERE username = '\${username}' AND password = '\${password}'\`;
  return db.query(query);
}`);
    
    setTimeout(() => {
      setDemoCode(`function authenticateUser(username, password) {
  // 🚨 SQL INJECTION DETECTED!
  const query = "SELECT * FROM users WHERE username = ? AND password = ?";
  return db.query(query, [username, password]);
}`);
      setDemoStep(1);
    }, 1500);
    
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
          
          <h1 className="text-5xl md:text-7xl font-mono font-bold mb-6 heading-glow">
            Cipher<span className="text-secondary">Mind</span>
          </h1>
          
          <div className="text-xl md:text-2xl text-gray-300 mb-8 h-8">
            <Typewriter strings={[
              "The AI Coding Mentor with Perfect Recall",
              "Never Make the Same Mistake Twice",
              "Your Personal Security Expert"
            ]} />
          </div>
          
          <p className="text-gray-400 max-w-2xl mx-auto text-lg mb-8 leading-relaxed">
            CipherMind analyzes your code, <span className="text-primary font-bold">remembers your mistakes</span>, and builds a personalized picture of your weaknesses — so you never make the same error twice.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Link href="/dashboard">
              <Button className="bg-primary hover:bg-primary/80 text-black font-bold px-8 py-3 transition-all transform hover:scale-105">
                Start Analyzing
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10 px-8 py-3">
              <ShieldAlert className="mr-2 w-5 h-5" />
              View Demo
            </Button>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span>Real-time Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <Repeat className="w-4 h-4 text-blue-400" />
              <span>Pattern Recognition</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-green-400" />
              <span>Personalized Feedback</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Live Demo Section */}
      <section className="py-24 relative bg-[#0d0d14]">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-mono font-bold mb-4 heading-glow">See It in Action</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">Watch CipherMind detect and fix vulnerabilities in real-time</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="glass-card p-6 rounded-2xl border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-sm font-mono text-gray-400">demo.js</span>
              </div>
              
              <div className="bg-black/50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <pre className={`text-green-400 ${isAnalyzing ? 'animate-pulse' : ''}`}>
                  {demoCode}
                </pre>
              </div>
            </Card>

            <div className="flex justify-center mb-6">
              <Button 
                onClick={runDemo}
                disabled={isAnalyzing}
                className="bg-primary hover:bg-primary/80 text-black font-bold px-8 py-3 transition-all transform hover:scale-105"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 w-5 h-5" />
                    Run Security Analysis
                  </>
                )}
              </Button>
            </div>

            {demoStep > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {demoStep >= 1 && (
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
                )}
                
                {demoStep >= 2 && (
                  <motion.div 
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-green-500/10 border border-green-500/30 rounded-lg p-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="font-bold text-green-400 font-mono">Fixed</span>
                      <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Secure</span>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">Used parameterized queries to prevent SQL injection attacks</p>
                    <div className="bg-black/50 rounded p-2">
                      <code className="text-xs text-green-400">Secure: db.query("SELECT * FROM users WHERE username = ? AND password = ?", [username, password])</code>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-mono font-bold mb-4 heading-glow">Features</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">Everything you need to write secure, bug-free code</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: BrainCircuit,
                title: "AI-Powered Analysis",
                description: "Advanced machine learning models detect vulnerabilities, anti-patterns, and security issues in real-time.",
                color: "text-blue-400"
              },
              {
                icon: Repeat,
                title: "Pattern Memory",
                description: "Learns from your mistakes and provides personalized feedback based on your coding history.",
                color: "text-purple-400"
              },
              {
                icon: ShieldAlert,
                title: "Security Focus",
                description: "Specialized in detecting security vulnerabilities, injection attacks, and authentication flaws.",
                color: "text-red-400"
              },
              {
                icon: Target,
                title: "Actionable Insights",
                description: "Get specific, actionable recommendations with code examples and best practices.",
                color: "text-green-400"
              },
              {
                icon: Lock,
                title: "Private & Secure",
                description: "Your code and analysis data are encrypted and never shared with third parties.",
                color: "text-yellow-400"
              },
              {
                icon: Code,
                title: "Multi-Language",
                description: "Supports JavaScript, Python, Java, C++, Go, and many more programming languages.",
                color: "text-cyan-400"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="glass-card p-6 rounded-2xl border border-white/10 hover:border-primary/30 transition-all group"
              >
                <feature.icon className={`w-12 h-12 ${feature.color} mb-4 group-hover:scale-110 transition-transform`} />
                <h3 className="text-xl font-bold text-white font-mono mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-16 relative bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "50+", label: "Vulnerability Types" },
              { number: "15+", label: "Programming Languages" },
              { number: "100K+", label: "Code Patterns" },
              { number: "24/7", label: "AI Analysis" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary font-mono">{stat.number}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-mono font-bold mb-4 heading-glow">How It Works</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">Simple three-step process to secure your code</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Submit Code",
                description: "Paste your code or upload a file in any supported programming language.",
                icon: Upload
              },
              {
                step: "02", 
                title: "AI Analysis",
                description: "Our AI analyzes your code, recalls your past mistakes, and identifies vulnerabilities.",
                icon: BrainCircuit
              },
              {
                step: "03",
                title: "Get Feedback",
                description: "Receive detailed, actionable feedback with specific fixes and security recommendations.",
                icon: CheckCircle
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="relative"
              >
                <div className="glass-card p-8 rounded-2xl border border-white/10 hover:border-primary/30 transition-all h-full">
                  <div className="text-4xl font-bold text-primary font-mono mb-4">{item.step}</div>
                  <item.icon className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-bold text-white font-mono mb-3">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{item.description}</p>
                </div>
                
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-primary" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
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
