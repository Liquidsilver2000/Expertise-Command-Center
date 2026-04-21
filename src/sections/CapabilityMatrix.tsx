import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Database, 
  Workflow, 
  BarChart3, 
  Code2, 
  FlaskConical, 
  BrainCircuit, 
  Bot, 
  AppWindow 
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const capabilities = [
  {
    icon: Database,
    title: 'Data Platforms',
    description: 'Azure, AWS, GCP, Snowflake, Databricks',
    color: 'cyan',
  },
  {
    icon: Workflow,
    title: 'Pipelines',
    description: 'Airflow, dbt, Spark, serverless ETL',
    color: 'emerald',
  },
  {
    icon: BarChart3,
    title: 'BI & Reporting',
    description: 'Tableau, Power BI, Looker, notebooks',
    color: 'amber',
  },
  {
    icon: Code2,
    title: 'Analytics Engineering',
    description: 'Clean models, tests, docs, lineage',
    color: 'violet',
  },
  {
    icon: FlaskConical,
    title: 'Experimentation',
    description: 'Design, power analysis, readouts',
    color: 'cyan',
  },
  {
    icon: BrainCircuit,
    title: 'ML Prototyping',
    description: 'Regression, classification, time series',
    color: 'emerald',
  },
  {
    icon: Bot,
    title: 'Automation',
    description: 'Python scripts, APIs, alerts, scheduling',
    color: 'amber',
  },
  {
    icon: AppWindow,
    title: 'Apps & Tools',
    description: 'Streamlit, internal portals, low-code',
    color: 'violet',
  },
];

const colorClasses: Record<string, { glow: string; text: string; border: string }> = {
  cyan: { glow: 'shadow-glow-cyan', text: 'text-cyan', border: 'border-cyan/30' },
  emerald: { glow: 'shadow-glow-emerald', text: 'text-emerald-glow', border: 'border-emerald-glow/30' },
  amber: { glow: 'shadow-glow-amber', text: 'text-amber-glow', border: 'border-amber-glow/30' },
  violet: { glow: 'shadow-glow-violet', text: 'text-violet-glow', border: 'border-violet-glow/30' },
};

export function CapabilityMatrix() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(headerRef.current,
        { x: '-8vw', opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 80%',
            end: 'top 55%',
            scrub: true,
          }
        }
      );

      // Cards animation
      cardsRef.current.forEach((card) => {
        if (!card) return;
        gsap.fromTo(card,
          { y: '8vh', opacity: 0, scale: 0.98 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              end: 'top 60%',
              scrub: true,
            }
          }
        );
      });

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="capability-matrix"
      className="relative min-h-screen py-24 px-[6vw] z-40"
      style={{ background: '#070B14' }}
    >
      {/* Header */}
      <div ref={headerRef} className="mb-12">
        <h2 
          className="font-heading font-bold text-white mb-4"
          style={{ fontSize: 'clamp(32px, 4vw, 52px)' }}
        >
          Capability Matrix
        </h2>
        <p className="text-white/60 text-lg max-w-xl">
          Tools, deliverables, and outcomes—mapped to the domains above.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {capabilities.map((cap, i) => {
          const colors = colorClasses[cap.color];
          const Icon = cap.icon;
          
          return (
            <div
              key={cap.title}
              ref={(el) => { cardsRef.current[i] = el; }}
              className={`
                glass-card-sm p-6 group cursor-pointer
                hover:scale-[1.02] transition-all duration-300
                hover:border-cyan/30
              `}
            >
              {/* Icon */}
              <div className={`
                w-12 h-12 rounded-xl flex items-center justify-center mb-4
                bg-white/5 group-hover:bg-white/10 transition-colors
                ${colors.text}
              `}>
                <Icon className="w-6 h-6" />
              </div>

              {/* Title */}
              <h3 className="font-heading font-semibold text-white text-lg mb-2">
                {cap.title}
              </h3>

              {/* Description */}
              <p className="text-white/50 text-sm leading-relaxed">
                {cap.description}
              </p>

              {/* Hover glow effect */}
              <div className={`
                absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100
                transition-opacity duration-300 pointer-events-none
                ${colors.glow}
              `} style={{ zIndex: -1 }} />
            </div>
          );
        })}
      </div>
    </section>
  );
}
