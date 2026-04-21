import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface RadarVisualizationProps {
  className?: string;
}

export function RadarVisualization({ className = '' }: RadarVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);
  const ringsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Animate rings on mount
    ringsRef.current.forEach((ring, i) => {
      if (ring) {
        gsap.fromTo(ring,
          { scale: 0.8, opacity: 0 },
          { 
            scale: 1, 
            opacity: 1, 
            duration: 0.8, 
            delay: i * 0.15,
            ease: 'power2.out'
          }
        );
      }
    });

    // Continuous sweep rotation
    if (sweepRef.current) {
      gsap.to(sweepRef.current, {
        rotation: 360,
        duration: 8,
        repeat: -1,
        ease: 'none',
      });
    }

    return () => {
      gsap.killTweensOf(sweepRef.current);
      ringsRef.current.forEach(ring => {
        gsap.killTweensOf(ring);
      });
    };
  }, []);

  const setRingRef = (el: HTMLDivElement | null, index: number) => {
    if (el) ringsRef.current[index] = el;
  };

  return (
    <div 
      ref={containerRef}
      className={`relative flex items-center justify-center ${className}`}
    >
      {/* Outer glow */}
      <div 
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(46, 233, 255, 0.08) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Radar rings */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          ref={(el) => setRingRef(el, i)}
          className="absolute rounded-full border border-white/10"
          style={{
            width: `${(3 - i) * 33}%`,
            height: `${(3 - i) * 33}%`,
            boxShadow: i === 0 ? '0 0 30px rgba(46, 233, 255, 0.1)' : 'none',
          }}
        />
      ))}

      {/* Radar sweep */}
      <div 
        ref={sweepRef}
        className="absolute w-full h-full rounded-full overflow-hidden"
        style={{ opacity: 0.15 }}
      >
        <div 
          className="absolute w-1/2 h-1/2"
          style={{
            background: 'conic-gradient(from 0deg, transparent 0deg, rgba(46, 233, 255, 0.6) 60deg, transparent 60deg)',
            transformOrigin: '100% 100%',
            left: 0,
            top: 0,
          }}
        />
      </div>

      {/* Crosshairs */}
      <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-cyan/20 to-transparent" />
      <div className="absolute h-full w-px bg-gradient-to-b from-transparent via-cyan/20 to-transparent" />

      {/* Center dot */}
      <div 
        className="absolute w-3 h-3 rounded-full bg-cyan"
        style={{
          boxShadow: '0 0 20px rgba(46, 233, 255, 0.8)',
        }}
      />

      {/* Decorative dots at cardinal directions */}
      {[
        { top: '0%', left: '50%' },
        { top: '50%', left: '100%' },
        { top: '100%', left: '50%' },
        { top: '50%', left: '0%' },
      ].map((pos, i) => (
        <div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-cyan/60"
          style={{
            ...pos,
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 10px rgba(46, 233, 255, 0.5)',
          }}
        />
      ))}
    </div>
  );
}
