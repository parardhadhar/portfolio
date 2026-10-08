import { useEffect, useRef } from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import './Experience.css';

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.hero-reveal', { y: 22, opacity: 0, stagger: .09, duration: 1, ease: 'power3.out' });
      gsap.from('.editorial-portrait', { y: 45, opacity: 0, duration: 1.4, ease: 'power3.out' });
    }, element);
    media.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const portrait = element.querySelector('.portrait-motion');
      const names = element.querySelectorAll('.name-motion');
      const moveX = gsap.quickTo(portrait, 'x', { duration: 1, ease: 'power3.out' });
      const moveY = gsap.quickTo(portrait, 'y', { duration: 1, ease: 'power3.out' });
      const textX = gsap.quickTo(names, 'x', { duration: 1.3, ease: 'power3.out' });
      const move = (event: PointerEvent) => {
        const rect = element.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        moveX(x * 34); moveY(y * 20); textX(x * -22);
      };
      const reset = () => { moveX(0); moveY(0); textX(0); };
      element.addEventListener('pointermove', move);
      element.addEventListener('pointerleave', reset);
      return () => { element.removeEventListener('pointermove', move); element.removeEventListener('pointerleave', reset); };
    }, element);
    return () => media.revert();
  }, []);
  return (
    <section id="hero" className="editorial-hero" ref={root}>
      <div className="hero-coordinate hero-reveal"><span className="live-dot" /> OPEN TO CREATIVE COLLABORATIONS<span>INDIA · WORLDWIDE</span></div>
      <div className="hero-watermark" aria-hidden="true">PORTFOLIO — 2026</div>
      <div className="editorial-title name-motion"><h1>Parardha Dhar</h1></div>
      <div className="portrait-motion"><img className="editorial-portrait" src="/photo.png" alt="Parardha Dhar" fetchPriority="high" /></div>
      <div className="editorial-title title-outline name-motion" aria-hidden="true">Parardha Dhar</div>
      <div className="hero-side-note hero-reveal">CODE. CREATE.<br />BREAK THE ORDINARY.</div>
      <div className="hero-bottom">
        <div className="hero-social-rail hero-reveal">
          <a href="https://github.com/parardhadhar" target="_blank" rel="noreferrer" aria-label="GitHub">GH <ArrowUpRight size={12} /></a>
          <a href="https://linkedin.com/in/parardhadhar" target="_blank" rel="noreferrer" aria-label="LinkedIn">IN <ArrowUpRight size={12} /></a>
          <a href="https://www.instagram.com/parardha.er/" target="_blank" rel="noreferrer" aria-label="Instagram">IG <ArrowUpRight size={12} /></a>
        </div>
        <a className="hero-explore hero-reveal" href="#playground"><span>SCROLL TO EXPLORE</span><ArrowDown size={18} /></a>
        <div className="hero-role hero-reveal"><span>ENGINEER BY TRAINING.</span><strong>CREATIVE<br />BY INSTINCT<span>✳</span></strong><p>FULL STACK / AI / UNREAL ENGINE</p></div>
      </div>
    </section>
  );
}
