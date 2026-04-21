import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface DomainSectionProps {
  id: string;
  domainNumber: string;
  title: string;
  bullets: string[];
  caption: string;
  imageSrc: string;
  imageAlt: string;
  layout: 'image-left' | 'image-right';
  cta?: string;
  onCtaClick?: () => void;
  zIndex: number;
}

export function DomainSection({
  id,
  domainNumber,
  title,
  bullets,
  caption,
  imageSrc,
  imageAlt,
  layout,
  cta,
  onCtaClick,
  zIndex,
}: DomainSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const bulletsRef = useRef<(HTMLLIElement | null)[]>([]);
  const captionRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);

  const isImageLeft = layout === 'image-left';

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        }
      });

      // ENTRANCE (0% - 30%)
      // Image card enters
      scrollTl.fromTo(imageRef.current,
        { x: isImageLeft ? '-60vw' : '60vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      // Glass panel enters
      scrollTl.fromTo(panelRef.current,
        { x: isImageLeft ? '60vw' : '-60vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0.05
      );

      // Label and title enter
      scrollTl.fromTo(labelRef.current,
        { y: '10vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.08
      );

      scrollTl.fromTo(titleRef.current,
        { y: '10vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.10
      );

      // Bullets stagger in
      bulletsRef.current.forEach((bullet, i) => {
        if (!bullet) return;
        scrollTl.fromTo(bullet,
          { x: '6vw', opacity: 0 },
          { x: 0, opacity: 1, ease: 'none' },
          0.12 + i * 0.02
        );
      });

      // Caption enters
      scrollTl.fromTo(captionRef.current,
        { y: '4vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.15
      );

      // CTA enters (if present)
      if (ctaRef.current) {
        scrollTl.fromTo(ctaRef.current,
          { y: '3vh', opacity: 0 },
          { y: 0, opacity: 1, ease: 'none' },
          0.18
        );
      }

      // SETTLE (30% - 70%): Hold positions - no animation needed

      // EXIT (70% - 100%)
      // Image exits
      scrollTl.fromTo(imageRef.current,
        { x: 0, opacity: 1 },
        { x: isImageLeft ? '-18vw' : '18vw', opacity: 0, ease: 'power2.in' },
        0.70
      );

      // Panel exits
      scrollTl.fromTo(panelRef.current,
        { x: 0, opacity: 1 },
        { x: isImageLeft ? '18vw' : '-18vw', opacity: 0, ease: 'power2.in' },
        0.72
      );

      // Text elements exit
      scrollTl.fromTo([labelRef.current, titleRef.current],
        { y: 0, opacity: 1 },
        { y: '-8vh', opacity: 0, ease: 'power2.in' },
        0.74
      );

      // Bullets exit
      bulletsRef.current.forEach((bullet) => {
        if (!bullet) return;
        scrollTl.fromTo(bullet,
          { x: 0, opacity: 1 },
          { x: '4vw', opacity: 0, ease: 'power2.in' },
          0.76
        );
      });

      // Caption exits
      scrollTl.fromTo(captionRef.current,
        { y: 0, opacity: 1 },
        { y: '3vh', opacity: 0, ease: 'power2.in' },
        0.78
      );

      // CTA exits
      if (ctaRef.current) {
        scrollTl.fromTo(ctaRef.current,
          { y: 0, opacity: 1 },
          { y: '2vh', opacity: 0, ease: 'power2.in' },
          0.80
        );
      }

    }, section);

    return () => ctx.revert();
  }, [isImageLeft]);

  const imagePosition = isImageLeft 
    ? { left: '6vw', right: 'auto' }
    : { left: 'auto', right: '6vw' };

  const panelPosition = isImageLeft
    ? { left: '52vw', right: 'auto' }
    : { left: '6vw', right: 'auto' };

  const captionPosition = isImageLeft
    ? { left: '8vw', right: 'auto', textAlign: 'left' as const }
    : { left: 'auto', right: '8vw', textAlign: 'right' as const };

  return (
    <section
      ref={sectionRef}
      id={id}
      className="section-pinned flex items-center justify-center"
      style={{ zIndex }}
    >
      {/* Image Card */}
      <div
        ref={imageRef}
        className="absolute top-[18vh] w-[40vw] h-[64vh] rounded-2xl overflow-hidden glass-card"
        style={imagePosition}
      >
        <img 
          src={imageSrc} 
          alt={imageAlt}
          className="w-full h-full object-cover"
        />
        {/* Subtle overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-500/40 to-transparent" />
      </div>

      {/* Glass Panel */}
      <div
        ref={panelRef}
        className="absolute top-[18vh] w-[42vw] h-[64vh] rounded-2xl glass-panel p-8"
        style={panelPosition}
      >
        {/* Domain Label */}
        <div ref={labelRef} className="mb-4">
          <span className="label-mono text-cyan">{domainNumber}</span>
        </div>

        {/* Title */}
        <h2 
          ref={titleRef}
          className="font-heading font-bold text-white mb-8"
          style={{ fontSize: 'clamp(28px, 3vw, 44px)' }}
        >
          {title}
        </h2>

        {/* Bullet List */}
        <ul className="space-y-4">
          {bullets.map((bullet, i) => (
            <li 
              key={i}
              ref={(el) => { bulletsRef.current[i] = el; }}
              className="bullet-item text-white/70 text-sm md:text-base leading-relaxed"
            >
              {bullet}
            </li>
          ))}
        </ul>

        {/* CTA Button (if provided) */}
        {cta && (
          <button
            ref={ctaRef}
            onClick={onCtaClick}
            className="mt-8 btn-primary text-sm"
          >
            {cta}
          </button>
        )}
      </div>

      {/* Caption */}
      <p
        ref={captionRef}
        className="absolute bottom-[14vh] max-w-[34vw] text-white/50 text-sm font-mono"
        style={captionPosition}
      >
        {caption}
      </p>
    </section>
  );
}
