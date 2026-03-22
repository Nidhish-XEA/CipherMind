'use client';

import { useEffect, useRef } from 'react';

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    setCanvasSize();

    const letters = '01#%&*';
    const fonSize = 14;
    let columns = canvas.width / fonSize;
    let drops: number[] = Array(Math.floor(columns)).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = fonSize + 'px var(--font-space-mono)';

      for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        
        ctx.fillStyle = Math.random() > 0.98 ? '#00d4ff' : '#0a6341';
        
        ctx.fillText(text, i * fonSize, drops[i] * fonSize);

        if (drops[i] * fonSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const intervalId = setInterval(draw, 40);

    const handleResize = () => {
      setCanvasSize();
      columns = canvas.width / fonSize;
      drops = Array(Math.floor(columns)).fill(1);
    };
    
    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 opacity-20 pointer-events-none mix-blend-screen"
    />
  );
}
