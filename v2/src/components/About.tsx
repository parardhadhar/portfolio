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
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
              fontSize: '0.75rem',
              letterSpacing: '0.1em',
              color: '#666',
              display: 'block',
              marginBottom: '1.5rem',
              textTransform: 'uppercase',
            }}
          >
            / About
          </span>
          <h2
            style={{
              fontFamily: "'Helvetica Neue', 'Inter', sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              lineHeight: 1.1,
              color: '#111',
              margin: '0 0 1.5rem',
              letterSpacing: '-0.03em',
            }}
          >
            I engineer immersive{' '}
            <span
              style={{
                fontStyle: 'italic',
                color: '#666',
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
              fontSize: '1.05rem',
              lineHeight: 1.7,
              color: '#444',
              margin: '0 0 1.5rem',
            }}
          >
            I'm{' '}
            <strong style={{ color: '#111', fontWeight: 600 }}>Parardha Dhar</strong>, a creative
            technologist blending{' '}
            <span style={{ color: '#111', fontWeight: 500 }}>Unreal Engine artistry</span> with{' '}
            <span style={{ color: '#111', fontWeight: 500 }}>Machine Learning</span> and{' '}
            <span style={{ color: '#111', fontWeight: 500 }}>Full-Stack Engineering</span>. I build things that
            sit at the intersection of computation and creativity — from real-time 3D worlds to
            intelligent web systems.
          </p>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '1.05rem',
              lineHeight: 1.7,
              color: '#777',
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
              marginTop: '2.5rem',
            }}
          >
            {skills.map(skill => (
              <span
                key={skill}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.75rem',
                  letterSpacing: '0.02em',
                  padding: '10px 18px',
                  border: '1px solid rgba(0,0,0,0.1)',
                  borderRadius: '100px',
                  color: '#444',
                  background: 'transparent',
                  transition: 'all 0.3s',
                  cursor: 'default',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = '#111';
                  el.style.color = '#111';
                  el.style.background = 'rgba(0,0,0,0.02)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'rgba(0,0,0,0.1)';
                  el.style.color = '#444';
                  el.style.background = 'transparent';
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
            borderRadius: 0,
            overflow: 'hidden',
            aspectRatio: '3/4',
            maxHeight: 560,
            background: 'rgba(0,0,0,0.03)',
          }}
        >
          <img
            src="/hero_bg.png"
            alt="About — Unreal Environment"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'grayscale(100%) contrast(1.1)',
              transition: 'filter 1s ease, transform 1.5s ease',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLImageElement;
              el.style.filter = 'grayscale(0%) contrast(1.1)';
              el.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLImageElement;
              el.style.filter = 'grayscale(100%) contrast(1.1)';
              el.style.transform = 'scale(1)';
            }}
          />
          {/* Corner label */}
          <div
            style={{
              position: 'absolute',
              bottom: 24,
              left: 24,
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.6rem',
              fontWeight: 500,
              color: '#fff',
              letterSpacing: '0.1em',
              mixBlendMode: 'difference',
            }}
          >
            UNREAL ENGINE 5 — ENVIRONMENT ART
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
