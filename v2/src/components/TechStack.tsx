import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollReveal from './ScrollReveal';

gsap.registerPlugin(ScrollTrigger);

const techCategories = [
  {
    label: 'AI & Machine Learning',
    color: 'var(--text-main)',
    items: [
      { name: 'Python', level: 95 },
      { name: 'TensorFlow / Keras', level: 88 },
      { name: 'MediaPipe / OpenCV', level: 90 },
      { name: 'scikit-learn', level: 85 },
    ],
  },
  {
    label: 'Full-Stack Engineering',
    color: 'var(--text-main)',
    items: [
      { name: 'Next.js / React', level: 92 },
      { name: 'Node.js / Express', level: 85 },
      { name: 'TypeScript / JS', level: 88 },
      { name: 'Supabase / Firebase', level: 90 },
    ],
  },
  {
    label: 'Immersive Real-Time',
    color: 'var(--text-main)',
    items: [
      { name: 'Unreal Engine 5', level: 85 },
      { name: 'C++ / Blueprints', level: 80 },
      { name: 'Lumen / Nanite', level: 88 },
      { name: 'Niagara VFX', level: 75 },
    ],
  },
];

const tools = [
  'Docker', 'Git / GitHub', 'Vercel', 'Postman', 'Figma', 'Linux / Unix Tools', 'CI/CD Pipelines'
];

function SkillBar({ name, level, color, delay }: { name: string; level: number; color: string; delay: number }) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { width: '0%' },
        {
          width: `${level}%`,
          duration: 1.2,
          ease: 'power3.out',
          delay,
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true,
          },
        }
      );
    });
    return () => ctx.revert();
  }, [level, delay]);

  return (
    <div style={{ marginBottom: 16 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 8,
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.8rem',
          fontWeight: 500,
        }}
      >
        <span style={{ color: 'var(--text-main)' }}>{name}</span>
        <span style={{ color: 'var(--text-muted)', fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', fontWeight: 600 }}>
          {level}%
        </span>
      </div>
      <div
        style={{
          height: 2,
          background: 'var(--border-color)',
          borderRadius: 0,
          overflow: 'hidden',
        }}
      >
        <div
          ref={barRef}
          style={{
            height: '100%',
            width: 0,
            background: color,
            borderRadius: 0,
          }}
        />
      </div>
    </div>
  );
}

export default function TechStack() {
  return (
    <section
      id="tech"
      className="mobile-padding"
      style={{
        padding: '140px 40px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      <ScrollReveal>
        <div style={{ marginBottom: 80 }}>
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.75rem',
              letterSpacing: '0.1em',
              fontWeight: 500,
              color: 'var(--text-muted)',
              display: 'block',
              marginBottom: '1.5rem',
              textTransform: 'uppercase',
            }}
          >
            / Tech I Use
          </span>
          <h2
            style={{
              fontFamily: "'Helvetica Neue', 'Inter', sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(3rem, 6vw, 5.5rem)',
              letterSpacing: '-0.04em',
              color: 'var(--text-main)',
              margin: 0,
              lineHeight: 1,
            }}
          >
            My Toolkit
          </h2>
        </div>
      </ScrollReveal>

      {/* Skill bars grid */}
      <div
        className="tech-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 48,
          marginBottom: 80,
        }}
      >
        {techCategories.map((cat, ci) => (
          <ScrollReveal key={cat.label} delay={ci * 0.1} from="bottom">
            <div
              style={{
                background: 'transparent',
                border: '1px solid var(--border-light)',
                borderRadius: 0,
                padding: '32px 32px',
                transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = 'var(--text-main)';
                el.style.borderColor = 'var(--text-main)';
                el.style.transform = 'translateY(-8px) scale(1.02)';
                
                // Inverse text colors on hover magically
                const headers = el.querySelectorAll('h3, span');
                headers.forEach(h => (h as HTMLElement).style.setProperty('color', 'var(--bg-color)', 'important'));
                const bars = el.querySelectorAll('div > div > div');
                bars.forEach(b => {
                  if((b as HTMLElement).style.background !== 'transparent') {
                    (b as HTMLElement).style.background = 'var(--bg-color)';
                  }
                });
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = 'transparent';
                el.style.borderColor = 'var(--border-light)';
                el.style.transform = 'none';
                
                // Return text colors back
                const headers = el.querySelectorAll('h3, span');
                headers.forEach(h => (h as HTMLElement).style.removeProperty('color'));
                const bars = el.querySelectorAll('div > div > div');
                bars.forEach(b => {
                  if((b as HTMLElement).style.background !== 'transparent') {
                     (b as HTMLElement).style.background = 'var(--text-main)';
                  }
                });
              }}
            >
              <h3
                style={{
                  fontFamily: "'Helvetica Neue', 'Inter', sans-serif",
                  fontWeight: 700,
                  fontSize: '1.25rem',
                  color: 'var(--text-main)',
                  marginBottom: 24,
                  letterSpacing: '-0.02em',
                }}
              >
                {cat.label}
              </h3>
              {cat.items.map((item, ii) => (
                <SkillBar
                  key={item.name}
                  name={item.name}
                  level={item.level}
                  color={cat.color}
                  delay={ci * 0.1 + ii * 0.05}
                />
              ))}
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Tools grid */}
      <ScrollReveal>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.70rem',
            letterSpacing: '0.05em',
            fontWeight: 500,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            marginBottom: 20,
          }}
        >
          Also comfortable with
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
          {tools.map(tool => (
            <span
              key={tool}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.85rem',
                fontWeight: 500,
                padding: '8px 18px',
                borderRadius: 0,
                border: '1px solid rgba(0,0,0,0.15)',
                color: 'var(--text-muted)',
                transition: 'all 0.3s',
                cursor: 'default',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'var(--text-main)';
                el.style.color = 'var(--bg-color)';
                el.style.background = 'var(--text-main)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'var(--border-color)';
                el.style.color = 'var(--text-muted)';
                el.style.background = 'transparent';
              }}
            >
              {tool}
            </span>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}
