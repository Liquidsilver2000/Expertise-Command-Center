import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    const particleCount = 35;
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.4 + 0.2,
    }));

    let frameCount = 0;
    const animate = () => {
      frameCount++;
      // Render every 2nd frame for performance (30fps)
      if (frameCount % 2 === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update and draw particles
        particlesRef.current.forEach((particle, i) => {
          // Update position
          particle.x += particle.vx;
          particle.y += particle.vy;

          // Wrap around edges
          if (particle.x < 0) particle.x = canvas.width;
          if (particle.x > canvas.width) particle.x = 0;
          if (particle.y < 0) particle.y = canvas.height;
          if (particle.y > canvas.height) particle.y = 0;

          // Draw particle
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(46, 233, 255, ${particle.opacity})`;
          ctx.fill();

          // Draw connections (only check every 5th particle for performance)
          if (i % 5 === 0) {
            particlesRef.current.slice(i + 1).forEach((other, j) => {
              if (j % 3 !== 0) return;
              const dx = particle.x - other.x;
              const dy = particle.y - other.y;
              const distance = Math.sqrt(dx * dx + dy * dy);

              if (distance < 100) {
                ctx.beginPath();
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(other.x, other.y);
                ctx.strokeStyle = `rgba(46, 233, 255, ${0.08 * (1 - distance / 100)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
              }
            });
          }
        });
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Base gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #070B14 0%, #0B1222 50%, #070B14 100%)',
        }}
      />
      
      {/* Grid overlay */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(46, 233, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(46, 233, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ opacity: 0.8 }}
      />
      
      {/* Vignette */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(7, 11, 20, 0.5) 100%)',
        }}
      />
      
      {/* Subtle radial glow */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(46, 233, 255, 0.03) 0%, transparent 50%)',
        }}
      />
    </div>
  );
}
