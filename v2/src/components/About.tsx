import ScrollReveal from './ScrollReveal';

const skills = [
  'Unreal Engine 5', 'Python / ML', 'React / Next.js',
  'Three.js', 'Blender', 'Node.js', 'TypeScript', 'GSAP',
];

export default function About() {
  return (
    <section
      id="about"
      style={{
        position: 'relative',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '140px 40px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '80px',
        alignItems: 'center',
      }}
    >
      {/* Left — Text */}
      <div>
        <ScrollReveal delay={0} from="left">
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
            / About
          </span>
          <h2
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              lineHeight: 1.1,
              color: '#fff',
              margin: '0 0 1.5rem',
              letterSpacing: '-0.02em',
            }}
          >
            I engineer immersive{' '}
            <span
              style={{
                fontStyle: 'italic',
                background: 'linear-gradient(135deg, #5227FF, #FF9FFC)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              experiences.
            </span>
            <br />
            Not just interfaces.
          </h2>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '1rem',
              lineHeight: 1.8,
              color: 'rgba(200,210,230,0.7)',
              margin: '0 0 1.5rem',
            }}
          >
            I'm{' '}
            <strong style={{ color: '#fff', fontWeight: 600 }}>Parardha Dhar</strong>, a creative
            technologist blending{' '}
            <span style={{ color: '#d4ff00' }}>Unreal Engine artistry</span> with{' '}
            <span style={{ color: '#d4ff00' }}>Machine Learning</span> and{' '}
            <span style={{ color: '#d4ff00' }}>Full-Stack Engineering</span>. I build things that
            sit at the intersection of computation and creativity — from real-time 3D worlds to
            intelligent web systems.
          </p>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '1rem',
              lineHeight: 1.8,
              color: 'rgba(200,210,230,0.5)',
            }}
          >
            Currently pursuing B.Tech (24BCG10003) while building projects that matter.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.6rem',
              marginTop: '2rem',
            }}
          >
            {skills.map(skill => (
              <span
                key={skill}
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '0.6rem',
                  letterSpacing: '0.12em',
                  padding: '8px 16px',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '100px',
                  color: 'rgba(200,220,255,0.7)',
                  background: 'rgba(255,255,255,0.03)',
                  transition: 'all 0.3s',
                  cursor: 'default',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = '#d4ff00';
                  el.style.color = '#d4ff00';
                  el.style.background = 'rgba(212,255,0,0.05)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'rgba(255,255,255,0.12)';
                  el.style.color = 'rgba(200,220,255,0.7)';
                  el.style.background = 'rgba(255,255,255,0.03)';
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </ScrollReveal>
      </div>

      {/* Right — Image card */}
      <ScrollReveal from="right" delay={0.2}>
        <div
          style={{
            position: 'relative',
            borderRadius: 24,
            overflow: 'hidden',
            aspectRatio: '3/4',
            maxHeight: 560,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.border = '1px solid rgba(212,255,0,0.3)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.08)';
          }}
        >
          <img
            src="/hero_bg.png"
            alt="About — Unreal Environment"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'contrast(1.2) saturate(0.6)',
              transition: 'filter 0.8s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLImageElement).style.filter = 'contrast(1.1) saturate(1)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLImageElement).style.filter = 'contrast(1.2) saturate(0.6)';
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, #04000a 10%, transparent 50%)',
            }}
          />
          {/* Corner label */}
          <div
            style={{
              position: 'absolute',
              bottom: 24,
              left: 24,
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.6rem',
              color: 'rgba(200,220,255,0.4)',
              letterSpacing: '0.2em',
            }}
          >
            UNREAL ENGINE 5 — ENVIRONMENT ART
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
