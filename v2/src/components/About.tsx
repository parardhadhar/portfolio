import ScrollReveal from './ScrollReveal';

const skills = [
  'Python', 'Machine Learning', 'AI (RAG / LLM)', 'Next.js', 'React', 'Unreal Engine 5', 
  'Computer Vision', 'Deep Learning', 'C++', 'JavaScript', 'TypeScript', 'SQL', 
  'Docker', 'Supabase', 'Node.js', 'Vercel', 'Git'
];

export default function About() {
  return (
    <section
      id="about"
      className="mobile-padding"
      style={{
        position: 'relative',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '140px 40px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '60px',
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
              color: 'var(--text-muted)',
              display: 'block',
              marginBottom: '1.5rem',
              textTransform: 'uppercase',
            }}
          >
            / Background
          </span>
          <h2
            style={{
              fontFamily: "'Helvetica Neue', 'Inter', sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              lineHeight: 1.1,
              color: 'var(--text-main)',
              margin: '0 0 1.5rem',
              letterSpacing: '-0.03em',
            }}
          >
            Engineering resilient,{' '}
            <span
              style={{
                fontStyle: 'italic',
                color: 'var(--text-muted)',
              }}
            >
              intelligent
            </span>
            <br />
            software solutions.
          </h2>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '1.05rem',
              lineHeight: 1.7,
              color: 'var(--text-muted)',
              margin: '0 0 1.5rem',
            }}
          >
            I'm <strong style={{ color: 'var(--text-main)', fontWeight: 600 }}>Parardha Dhar</strong>, a software engineer and AI enthusiast currently pursuing a <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>B.Tech in Computer Science and Engineering</span> at <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>VIT Bhopal University (CGPA: 8.68)</span>.
          </p>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '1.05rem',
              lineHeight: 1.7,
              color: 'var(--text-muted)',
              margin: '0 0 1.5rem',
            }}
          >
            My work focuses on bridging the gap between <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>Unreal Engine high-fidelity environments</span> and <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>scalable AI systems</span>. From architecting high-traffic web platforms to developing real-time AI pipelines for social good, I prioritize application resiliency and technical sophistication.
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
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.75rem',
                  letterSpacing: '0.02em',
                  padding: '10px 18px',
                  border: '1px solid var(--border-color)',
                  borderRadius: 0,
                  color: 'var(--text-main)',
                  background: 'transparent',
                  transition: 'all 0.3s',
                  cursor: 'default',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'var(--text-main)';
                  el.style.background = 'var(--text-main)';
                  el.style.color = 'var(--bg-color)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'var(--border-color)';
                  el.style.background = 'transparent';
                  el.style.color = 'var(--text-main)';
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
              color: 'var(--bg-color)',
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
