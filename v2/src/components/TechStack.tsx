import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollReveal from './ScrollReveal';

gsap.registerPlugin(ScrollTrigger);

const techCategories = [
  {
    label: 'Real-Time 3D',
    color: '#d4ff00',
    items: [
      { name: 'Unreal Engine 5', level: 92 },
      { name: 'Three.js / WebGL', level: 85 },
      { name: 'Blender', level: 80 },
      { name: 'Lumen + Nanite', level: 88 },
    ],
  },
  {
    label: 'Web & Frontend',
    color: '#08f7fe',
    items: [
      { name: 'React / Next.js', level: 90 },
      { name: 'TypeScript', level: 85 },
      { name: 'GSAP / Animation', level: 88 },
      { name: 'Node.js', level: 78 },
    ],
  },
  {
    label: 'AI & Machine Learning',
    color: '#FF9FFC',
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
        }}
      >
        <span style={{ color: 'rgba(200,220,255,0.8)' }}>{name}</span>
        <span style={{ color: 'rgba(200,220,255,0.4)', fontFamily: "'Space Mono', monospace", fontSize: '0.65rem' }}>
          {level}%
        </span>
      </div>
      <div
        style={{
          height: 3,
          background: 'rgba(255,255,255,0.06)',
          borderRadius: 100,
          overflow: 'hidden',
        }}
      >
        <div
          ref={barRef}
          style={{
            height: '100%',
            width: 0,
            background: `linear-gradient(90deg, ${color}99, ${color})`,
            borderRadius: 100,
            boxShadow: `0 0 12px ${color}60`,
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
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.6rem',
              letterSpacing: '0.3em',
              color: '#d4ff00',
              display: 'block',
              marginBottom: '1.5rem',
              textTransform: 'uppercase',
            }}
          >
            / Tech I Use
          </span>
          <h2
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              letterSpacing: '-0.03em',
              color: '#fff',
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
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 20,
                padding: '32px 28px',
              }}
            >
              <h3
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: cat.color,
                  marginBottom: 24,
                  letterSpacing: '0.05em',
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
            fontFamily: "'Space Mono', monospace",
            fontSize: '0.6rem',
            letterSpacing: '0.25em',
            color: 'rgba(200,220,255,0.35)',
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
                fontSize: '0.75rem',
                padding: '8px 18px',
                borderRadius: 100,
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(200,220,255,0.55)',
                transition: 'all 0.3s',
                cursor: 'default',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'rgba(212,255,0,0.4)';
                el.style.color = '#d4ff00';
                el.style.background = 'rgba(212,255,0,0.04)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'rgba(255,255,255,0.1)';
                el.style.color = 'rgba(200,220,255,0.55)';
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
