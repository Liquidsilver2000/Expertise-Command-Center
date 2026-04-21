import { useEffect, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { AnimatedBackground } from './components/effects/AnimatedBackground';
import { Navigation } from './components/Navigation';
import { HeroSection } from './sections/HeroSection';
import { DomainSection } from './sections/DomainSection';
import { CapabilityMatrix } from './sections/CapabilityMatrix';
import { ContactSection } from './sections/ContactSection';
import './App.css';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Domain data
const domains = [
  {
    id: 'domain-01',
    domainNumber: 'DOMAIN 01',
    title: 'Data Infrastructure',
    bullets: [
      'Cloud data platforms (Azure, AWS, GCP)',
      'Data lakes, warehouses, and lakehouses',
      'ETL/ELT pipelines and orchestration',
      'Streaming ingestion (Kafka, Kinesis)',
      'Governance, lineage, and security',
    ],
    caption: 'Systems that move and store data at scale.',
    imageSrc: `${import.meta.env.BASE_URL}domain-infra.jpg`,
    imageAlt: 'Data Infrastructure',
    layout: 'image-left' as const,
  },
  {
    id: 'domain-02',
    domainNumber: 'DOMAIN 02',
    title: 'Analytics & BI',
    bullets: [
      'Self-service dashboards and reporting',
      'KPI design and metric consistency',
      'A/B testing and experiment analysis',
      'Customer segmentation and cohorts',
      'Narrative delivery for stakeholders',
    ],
    caption: 'Turn raw signals into decisions.',
    imageSrc: `${import.meta.env.BASE_URL}domain-analytics.jpg`,
    imageAlt: 'Analytics & BI',
    layout: 'image-right' as const,
  },
  {
    id: 'domain-03',
    domainNumber: 'DOMAIN 03',
    title: 'Programming & Modeling',
    bullets: [
      'Python & SQL for analytics and ML',
      'Predictive modeling and forecasting',
      'Feature engineering and validation',
      'Statistical testing and uncertainty',
      'MLOps basics: versioning, monitoring',
    ],
    caption: 'Code that learns—and explains itself.',
    imageSrc: `${import.meta.env.BASE_URL}domain-modeling.jpg`,
    imageAlt: 'Programming & Modeling',
    layout: 'image-left' as const,
  },
  {
    id: 'domain-04',
    domainNumber: 'DOMAIN 04',
    title: 'Automation & Apps',
    bullets: [
      'Workflow automation and scheduling',
      'Internal tools and lightweight apps',
      'API integrations and connectors',
      'Alerting, QA checks, and remediation',
      'Documentation and runbooks',
    ],
    caption: 'Ship faster with less toil.',
    imageSrc: `${import.meta.env.BASE_URL}domain-automation.jpg`,
    imageAlt: 'Automation & Apps',
    layout: 'image-right' as const,
    cta: 'See the full capability matrix →',
  },
];

function App() {
  // Global scroll snap for pinned sections
  useLayoutEffect(() => {
    // Wait for all ScrollTriggers to be created
    const timer = setTimeout(() => {
      const pinned = ScrollTrigger.getAll()
        .filter(st => st.vars.pin)
        .sort((a, b) => a.start - b.start);
      
      const maxScroll = ScrollTrigger.maxScroll(window);
      
      if (!maxScroll || pinned.length === 0) return;

      // Build ranges and snap targets from pinned sections
      const pinnedRanges = pinned.map(st => ({
        start: st.start / maxScroll,
        end: (st.end ?? st.start) / maxScroll,
        center: (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
      }));

      // Create global snap
      ScrollTrigger.create({
        snap: {
          snapTo: (value: number) => {
            // Check if within any pinned range (with small buffer)
            const inPinned = pinnedRanges.some(
              r => value >= r.start - 0.02 && value <= r.end + 0.02
            );
            
            // If not in a pinned section, allow free scroll
            if (!inPinned) return value;

            // Find nearest pinned center
            const target = pinnedRanges.reduce((closest, r) =>
              Math.abs(r.center - value) < Math.abs(closest - value) ? r.center : closest,
              pinnedRanges[0]?.center ?? 0
            );

            return target;
          },
          duration: { min: 0.15, max: 0.35 },
          delay: 0,
          ease: 'power2.out',
        }
      });
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  const scrollToCapabilityMatrix = () => {
    const element = document.getElementById('capability-matrix');
    if (element) {
      gsap.to(window, {
        duration: 1.2,
        scrollTo: { y: element, offsetY: 0 },
        ease: 'power3.inOut',
      });
    }
  };

  return (
    <div className="relative min-h-screen bg-navy-500">
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Domain Sections */}
        {domains.map((domain, index) => (
          <DomainSection
            key={domain.id}
            {...domain}
            zIndex={20 + index}
            onCtaClick={domain.cta ? scrollToCapabilityMatrix : undefined}
          />
        ))}
        
        {/* Capability Matrix */}
        <CapabilityMatrix />
        
        {/* Contact Section */}
        <ContactSection />
      </main>
    </div>
  );
}

export default App;
