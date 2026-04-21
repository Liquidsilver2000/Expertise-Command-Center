import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Send, Linkedin, Github, Mail } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Headline animation
      gsap.fromTo(headlineRef.current,
        { y: '6vh', opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: headlineRef.current,
            start: 'top 80%',
            end: 'top 55%',
            scrub: true,
          }
        }
      );

      // Form animation
      gsap.fromTo(formRef.current,
        { x: '10vw', opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: formRef.current,
            start: 'top 80%',
            end: 'top 55%',
            scrub: true,
          }
        }
      );

    }, section);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setSubmitted(true);
    setFormData({ name: '', email: '', company: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative min-h-screen py-24 px-[6vw] z-50"
      style={{ background: '#070B14' }}
    >
      {/* Radial glow behind form */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 70% 30%, rgba(46, 233, 255, 0.05) 0%, transparent 50%)',
        }}
      />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
        {/* Left - Headline */}
        <div ref={headlineRef} className="lg:sticky lg:top-24">
          <h2 
            className="font-heading font-bold text-white mb-6"
            style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}
          >
            Let's build the<br />next system.
          </h2>
          <p className="text-white/60 text-lg mb-8 max-w-md">
            Tell me what you're shipping. I'll respond with a plan.
          </p>

          {/* Social Links */}
          <div className="flex gap-4">
            {[
              { icon: Linkedin, href: '#', label: 'LinkedIn' },
              { icon: Github, href: '#', label: 'GitHub' },
              { icon: Mail, href: 'mailto:hello@example.com', label: 'Email' },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                className="w-12 h-12 rounded-xl glass-card-sm flex items-center justify-center
                  text-white/60 hover:text-cyan hover:border-cyan/30 transition-all duration-300
                  hover:scale-105"
                aria-label={label}
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Right - Form */}
        <div ref={formRef} className="glass-panel p-8 md:p-10">
          {submitted ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-cyan/20 flex items-center justify-center mx-auto mb-6">
                <Send className="w-8 h-8 text-cyan" />
              </div>
              <h3 className="font-heading font-semibold text-white text-2xl mb-2">
                Message sent!
              </h3>
              <p className="text-white/60">
                I'll get back to you within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="label-mono text-white/50 mb-2 block">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3
                      text-white placeholder-white/30 focus:outline-none focus:border-cyan/50
                      transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="label-mono text-white/50 mb-2 block">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3
                      text-white placeholder-white/30 focus:outline-none focus:border-cyan/50
                      transition-colors"
                    placeholder="you@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="label-mono text-white/50 mb-2 block">Company</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3
                    text-white placeholder-white/30 focus:outline-none focus:border-cyan/50
                    transition-colors"
                  placeholder="Your company (optional)"
                />
              </div>

              <div>
                <label className="label-mono text-white/50 mb-2 block">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3
                    text-white placeholder-white/30 focus:outline-none focus:border-cyan/50
                    transition-colors resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary py-4 flex items-center justify-center gap-2
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-cyan/30 border-t-cyan rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span>Send message</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-24 pt-8 border-t border-white/10 text-center">
        <p className="text-white/40 text-sm font-mono">
          © {new Date().getFullYear()} — Built with precision.
        </p>
      </div>
    </section>
  );
}
