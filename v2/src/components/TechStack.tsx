import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollReveal from './ScrollReveal';

gsap.registerPlugin(ScrollTrigger);

const techCategories = [
  {
    label: 'Real-Time 3D',
    color: '#111',
    items: [
      { name: 'Unreal Engine 5', level: 92 },
      { name: 'Three.js / WebGL', level: 85 },
      { name: 'Blender', level: 80 },
      { name: 'Lumen + Nanite', level: 88 },
    ],
  },
  {
    label: 'Web & Frontend',
    color: '#333',
    items: [
      { name: 'React / Next.js', level: 90 },
      { name: 'TypeScript', level: 85 },
      { name: 'GSAP / Animation', level: 88 },
      { name: 'Node.js', level: 78 },
    ],
  },
  {
    label: 'AI & Machine Learning',
    color: '#222',
    items: [
      { name: 'Python', level: 88 },
      { name: 'TensorFlow / PyTorch', level: 75 },
      { name: 'Gemini / LLM APIs', level: 82 },
      { name: 'Data Analysis', level: 78 },
    ],
  },
];

const tools = [
  'VS Code', 'Git / GitHub', 'Figma', 'GIMP', 'Postman', 'Firebase', 'Vercel', 'Docker (basics)',
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
        <span style={{ color: '#111' }}>{name}</span>
        <span style={{ color: '#666', fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', fontWeight: 600 }}>
          {level}%
        </span>
      </div>
      <div
        style={{
          height: 2,
          background: 'rgba(0,0,0,0.1)',
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
              color: '#666',
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
              color: '#111',
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
                border: '1px solid rgba(0,0,0,0.15)',
                borderRadius: 0,
                padding: '32px 32px',
                transition: 'all 0.4s ease',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = '#fff';
                el.style.borderColor = 'rgba(0,0,0,0.3)';
                el.style.transform = 'translateY(-4px)';
                el.style.boxShadow = `0 20px 40px rgba(0,0,0,0.05)`;
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = 'transparent';
                el.style.borderColor = 'rgba(0,0,0,0.15)';
                el.style.transform = 'none';
                el.style.boxShadow = 'none';
              }}
            >
              <h3
                style={{
                  fontFamily: "'Helvetica Neue', 'Inter', sans-serif",
                  fontWeight: 700,
                  fontSize: '1.25rem',
                  color: '#111',
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
            color: '#666',
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
                color: '#444',
                transition: 'all 0.3s',
                cursor: 'default',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = '#111';
                el.style.color = '#fff';
                el.style.background = '#111';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'rgba(0,0,0,0.15)';
                el.style.color = '#444';
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
