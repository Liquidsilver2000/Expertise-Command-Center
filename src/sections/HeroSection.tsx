import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RadarVisualization } from '../components/effects/RadarVisualization';
import { ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const domains = [
  { name: 'Infrastructure', position: 'left' },
  { name: 'Analytics', position: 'top' },
  { name: 'Modeling', position: 'right' },
  { name: 'Automation', position: 'bottom' },
];

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const radarRef = useRef<HTMLDivElement>(null);
  const domainRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bottomLeftRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Initial load animation
      const loadTl = gsap.timeline({ delay: 0.3 });

      // Radar appears
      loadTl.fromTo(radarRef.current,
        { scale: 0.85, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, ease: 'power2.out' },
        0
      );

      // Portrait appears
      loadTl.fromTo(portraitRef.current,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.9, ease: 'power2.out' },
        0.2
      );

      // Headline words animate in
      if (headlineRef.current) {
        const words = headlineRef.current.querySelectorAll('.word');
        loadTl.fromTo(words,
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.04, ease: 'power2.out' },
          0.3
        );
      }

      // Subheadline
      loadTl.fromTo(subheadlineRef.current,
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
        0.5
      );

      // Domain labels
      loadTl.fromTo(domainRefs.current.filter(Boolean),
        { y: -10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out' },
        0.6
      );

      // Bottom content
      loadTl.fromTo([bottomLeftRef.current, ctaRef.current],
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' },
        0.7
      );

      // Scroll-driven exit animation
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
          onLeaveBack: () => {
            // Reset all elements to visible when scrolling back to top
            gsap.set([headlineRef.current, subheadlineRef.current, portraitRef.current, radarRef.current, bottomLeftRef.current, ctaRef.current], {
              opacity: 1, y: 0, scale: 1
            });
            gsap.set(domainRefs.current.filter(Boolean), { opacity: 1, x: 0, y: 0 });
          }
        }
      });

      // ENTRANCE (0-30%): Hold position (already animated on load)
      // SETTLE (30-70%): Hold position
      // EXIT (70-100%): Elements exit

      // Headline exits up
      scrollTl.fromTo([headlineRef.current, subheadlineRef.current],
        { y: 0, opacity: 1 },
        { y: '-18vh', opacity: 0, ease: 'power2.in' },
        0.70
      );

      // Radar and portrait scale down and fade
      scrollTl.fromTo([radarRef.current, portraitRef.current],
        { scale: 1, opacity: 1 },
        { scale: 0.92, opacity: 0, ease: 'power2.in' },
        0.72
      );

      // Domain labels drift outward
      domainRefs.current.forEach((ref, i) => {
        if (!ref) return;
        const domain = domains[i];
        const xOffset = domain.position === 'left' ? '-6vw' : domain.position === 'right' ? '6vw' : '0';
        const yOffset = domain.position === 'top' ? '-6vh' : domain.position === 'bottom' ? '6vh' : '0';
        
        scrollTl.fromTo(ref,
          { x: 0, y: 0, opacity: 1 },
          { x: xOffset, y: yOffset, opacity: 0, ease: 'power2.in' },
          0.74
        );
      });

      // Bottom content exits
      scrollTl.fromTo([bottomLeftRef.current, ctaRef.current],
        { y: 0, opacity: 1 },
        { y: '10vh', opacity: 0, ease: 'power2.in' },
        0.76
      );

    }, section);

    return () => ctx.revert();
  }, []);

  const scrollToDomains = () => {
    const element = document.getElementById('domain-01');
    if (element) {
      gsap.to(window, {
        duration: 1.2,
        scrollTo: { y: element, offsetY: 0 },
        ease: 'power3.inOut',
      });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="section-pinned z-10 flex items-center justify-center"
    >
      {/* Headline - Top Center */}
      <div className="absolute top-[8vh] left-1/2 -translate-x-1/2 text-center z-20">
        <h1 
          ref={headlineRef}
          className="font-heading font-bold text-white tracking-tight"
          style={{ fontSize: 'clamp(32px, 5vw, 64px)' }}
        >
          {'EXPERTISE COMMAND CENTER'.split(' ').map((word, i) => (
            <span key={i} className="word inline-block mr-[0.3em]">{word}</span>
          ))}
        </h1>
        <p 
          ref={subheadlineRef}
          className="mt-4 text-white/60 text-lg md:text-xl"
        >
          Your capabilities. One command view.
        </p>
      </div>

      {/* Radar Visualization - Center */}
      <div 
        ref={radarRef}
        className="absolute"
        style={{
          width: 'min(56vh, 500px)',
          height: 'min(56vh, 500px)',
          top: '52%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <RadarVisualization className="w-full h-full" />
      </div>

      {/* Portrait - Center of Radar */}
      <div 
        ref={portraitRef}
        className="absolute z-10"
        style={{
          width: 'min(28vh, 240px)',
          height: 'min(28vh, 240px)',
          top: '52%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className="relative w-full h-full rounded-full overflow-hidden glass-card cyan-glow">
          <img 
            src={`${import.meta.env.BASE_URL}hero-portrait.jpg`}
            alt="Professional Portrait"
            className="w-full h-full object-cover"
          />
          {/* Inner ring */}
          <div className="absolute inset-2 rounded-full border border-cyan/30 pointer-events-none" />
        </div>
      </div>

      {/* Domain Labels */}
      {domains.map((domain, i) => {
        const positionStyles: Record<string, React.CSSProperties> = {
          left: { left: '12vw', top: '52%', transform: 'translateY(-50%)' },
          top: { left: '50%', top: '18vh', transform: 'translateX(-50%)' },
          right: { right: '12vw', top: '52%', transform: 'translateY(-50%)' },
          bottom: { left: '50%', bottom: '14vh', transform: 'translateX(-50%)' },
        };

        return (
          <div
            key={domain.name}
            ref={(el) => { domainRefs.current[i] = el; }}
            className="absolute z-20"
            style={positionStyles[domain.position]}
          >
            <div className="glass-card-sm px-4 py-2 hover-glow cursor-pointer group">
              <span className="label-mono text-cyan group-hover:text-white transition-colors">
                {domain.name}
              </span>
            </div>
          </div>
        );
      })}

      {/* Bottom Left - Description */}
      <div 
        ref={bottomLeftRef}
        className="absolute left-[6vw] bottom-[10vh] max-w-[26vw] hidden md:block"
      >
        <p className="text-white/60 text-sm leading-relaxed">
          A systems-led summary of what you build—data pipelines, analytics stacks, 
          predictive models, and automation.
        </p>
      </div>

      {/* Bottom Right - CTA */}
      <button
        ref={ctaRef}
        onClick={scrollToDomains}
        className="absolute right-[6vw] bottom-[10vh] btn-primary flex items-center gap-2 group"
      >
        <span>Explore the domains</span>
        <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
      </button>
    </section>
  );
}
