import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

export function Navigation() {
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Show navigation after scrolling past hero
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight;
      
      setIsScrolled(scrollY > 50);
      setIsVisible(scrollY > heroHeight * 0.5);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      gsap.to(window, {
        duration: 1.2,
        scrollTo: { y: element, offsetY: 0 },
        ease: 'power3.inOut',
      });
    }
  };

  const navItems = [
    { label: 'Capabilities', id: 'capability-matrix' },
    { label: 'Domains', id: 'domain-01' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
    >
      <div 
        className={`mx-6 mt-4 rounded-2xl transition-all duration-300 ${
          isScrolled ? 'glass-panel py-3 px-6' : 'bg-transparent py-4 px-6'
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button 
            onClick={() => scrollToSection('hero')}
            className="font-heading font-bold text-xl tracking-tight text-white hover:text-cyan transition-colors"
          >
            ECC
          </button>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="label-mono text-white/70 hover:text-cyan transition-colors animated-underline"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white/70 hover:text-cyan transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
