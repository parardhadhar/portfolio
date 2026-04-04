import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import HeroScene from './HeroScene';

const ROLES = ['Creative Technologist', 'Unreal Engine Developer', 'ML Engineer', 'Full-Stack Dev'];

export default function Hero() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3 });
    tl.from('.hero-eyebrow', { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out' })
      .from(headingRef.current, { opacity: 0, y: 60, duration: 1.2, ease: 'power3.out' }, '-=0.4')
      .from(taglineRef.current, { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out' }, '-=0.6')
      .from(statsRef.current, { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out' }, '-=0.5')
      .from(scrollHintRef.current, { opacity: 0, duration: 1 }, '-=0.2');

    // Typewriter role cycling
    let roleIdx = 0;
    let charIdx = 0;
    let direction: 'typing' | 'deleting' = 'typing';
    let timer: ReturnType<typeof setTimeout>;

    const typeRole = () => {
      const el = roleRef.current;
      if (!el) return;
      const target = ROLES[roleIdx];

      if (direction === 'typing') {
        charIdx++;
        el.textContent = target.slice(0, charIdx);
        if (charIdx === target.length) {
          direction = 'deleting';
          timer = setTimeout(typeRole, 2000);
        } else {
          timer = setTimeout(typeRole, 80);
        }
      } else {
        charIdx--;
        el.textContent = target.slice(0, charIdx);
        if (charIdx === 0) {
          direction = 'typing';
          roleIdx = (roleIdx + 1) % ROLES.length;
          timer = setTimeout(typeRole, 300);
        } else {
          timer = setTimeout(typeRole, 40);
        }
      }
    };

    const startTimer = setTimeout(typeRole, 2000);
    return () => {
      clearTimeout(startTimer);
      clearTimeout(timer);
    };
  }, []);

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {/* 3D Scene — full bleed background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
        }}
      >
        <HeroScene />
      </div>

      {/* Gradient overlay so text is readable */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 60% 80% at 75% 50%, transparent 0%, #04000a 70%), radial-gradient(ellipse 40% 60% at 50% 100%, #04000a 0%, transparent 60%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '1200px',
          width: '100%',
          margin: '0 auto',
          padding: '0 40px',
          paddingTop: '120px',
        }}
      >
        {/* Eyebrow */}
        <div
          className="hero-eyebrow"
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '0.65rem',
            letterSpacing: '0.3em',
            color: '#d4ff00',
            marginBottom: '1.5rem',
            textTransform: 'uppercase',
          }}
        >
          Creative Technologist // 2026
        </div>

        {/* Main heading */}
        <h1
          ref={headingRef}
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(3rem, 8vw, 7.5rem)',
            lineHeight: 0.9,
            letterSpacing: '-0.03em',
            color: '#ffffff',
            margin: 0,
            maxWidth: '14ch',
          }}
        >
          Worlds built
          <br />
          <span
            style={{
              WebkitTextStroke: '1px rgba(255,255,255,0.3)',
              color: 'transparent',
              fontStyle: 'italic',
            }}
          >
            at the edge
          </span>
          <br />
          of art &amp; code.
        </h1>

        {/* Animated role */}
        <div
          ref={taglineRef}
          style={{
            marginTop: '2rem',
            fontFamily: "'Inter', sans-serif",
            fontSize: '1rem',
            color: 'rgba(200,200,220,0.7)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <span>Currently:</span>
          <span
            ref={roleRef}
            style={{
              color: '#d4ff00',
              fontWeight: 500,
              borderRight: '2px solid #d4ff00',
              paddingRight: '3px',
              minWidth: '2ch',
              display: 'inline-block',
            }}
          >
            Creative Technologist
          </span>
        </div>

        {/* Stats */}
        <div
          ref={statsRef}
          style={{
            display: 'flex',
            gap: '2.5rem',
            marginTop: '3.5rem',
            alignItems: 'center',
          }}
        >
          {[
            { num: '3+', label: 'Years Experience' },
            { num: 'UE5', label: 'Core Expertise' },
            { num: '∞', label: 'Ideas' },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
              <div>
                <div
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 700,
                    fontSize: '2rem',
                    color: '#fff',
                    lineHeight: 1,
                  }}
                >
                  {s.num}
                </div>
                <div
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '0.6rem',
                    letterSpacing: '0.2em',
                    color: 'rgba(200,200,220,0.45)',
                    marginTop: '4px',
                    textTransform: 'uppercase',
                  }}
                >
                  {s.label}
                </div>
              </div>
              {i < 2 && (
                <div
                  style={{
                    width: 1,
                    height: 40,
                    background: 'rgba(255,255,255,0.1)',
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '3rem' }}>
          <a
            href="#work"
            style={{
              background: '#d4ff00',
              color: '#000',
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: '0.8rem',
              padding: '14px 32px',
              borderRadius: '100px',
              textDecoration: 'none',
              letterSpacing: '0.05em',
              transition: 'all 0.3s',
              display: 'inline-block',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = 'translateY(-3px)';
              el.style.boxShadow = '0 20px 40px rgba(212,255,0,0.3)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = 'none';
              el.style.boxShadow = 'none';
            }}
          >
            View Work
          </a>
          <a
            href="#contact"
            style={{
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff',
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: '0.8rem',
              padding: '14px 32px',
              borderRadius: '100px',
              textDecoration: 'none',
              letterSpacing: '0.05em',
              transition: 'all 0.3s',
              display: 'inline-block',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = 'rgba(255,255,255,0.6)';
              el.style.transform = 'translateY(-3px)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = 'rgba(255,255,255,0.2)';
              el.style.transform = 'none';
            }}
          >
            Get in Touch
          </a>
        </div>
      </div>

      {/* Scroll hint */}
      <div
        ref={scrollHintRef}
        style={{
          position: 'absolute',
          bottom: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
          zIndex: 2,
        }}
      >
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '0.55rem',
            letterSpacing: '0.25em',
            color: 'rgba(200,200,220,0.4)',
            textTransform: 'uppercase',
          }}
        >
          Scroll to explore
        </span>
        <div
          style={{
            width: 1,
            height: 60,
            background: 'linear-gradient(to bottom, rgba(200,200,220,0.4), transparent)',
            animation: 'pulse 2s ease-in-out infinite',
          }}
        />
      </div>
    </section>
  );
}
