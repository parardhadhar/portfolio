import ScrollReveal from './ScrollReveal';

const experiences = [
  {
    role: 'Creative Technologist & Developer',
    company: 'Independent / Freelance',
    period: '2023 — Present',
    type: 'Full-time',
    description:
      'Architecting real-time 3D environments in Unreal Engine 5, building intelligent web applications with React and Python ML backends, and creating cinematic visual experiences.',
    tags: ['Unreal Engine 5', 'React', 'Python', 'Three.js', 'GSAP'],
  },
  {
    role: 'B.Tech — Computer Science',
    company: 'University',
    period: '2024 — Present',
    type: 'Academic',
    description:
      'Pursuing Bachelor of Technology in Computer Science (Reg. 24BCG10003). Specializing in machine learning, computer graphics, and full-stack development alongside hands-on project work.',
    tags: ['Data Structures', 'Machine Learning', 'Computer Graphics', 'DBMS'],
  },
  {
    role: 'Game Developer & 3D Artist',
    company: 'Personal Projects',
    period: '2022 — 2023',
    type: 'Project-based',
    description:
      'Developed photorealistic game environments with ray-traced lighting, Nanite geometry, and Lumen global illumination. Rigged and animated vehicles in Blender with physics-based suspension.',
    tags: ['Blender', 'Rigging', 'Nanite', 'Lumen', 'PCG'],
  },
];

export default function WorkExperience() {
  return (
    <section
      id="experience"
      style={{
        position: 'relative',
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
            / Experience
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
            Where I've Been
          </h2>
        </div>
      </ScrollReveal>

      {/* Timeline */}
      <div style={{ position: 'relative' }}>
        {/* Vertical line */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 1,
            background: 'var(--text-main)',
            opacity: 0.2,
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {experiences.map((exp, i) => (
            <ScrollReveal key={i} delay={i * 0.15} from="left">
              <div
                style={{
                  position: 'relative',
                  paddingLeft: 48,
                  paddingBottom: 64,
                }}
              >
                {/* Square Marker */}
                <div
                  style={{
                    position: 'absolute',
                    left: -4,
                    top: 6,
                    width: 9,
                    height: 9,
                    background: 'var(--text-main)',
                    zIndex: 2,
                  }}
                />

                {/* Brutalist Card */}
                <div
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--border-color)',
                    padding: '32px 36px',
                    transition: 'all 0.15s ease', // Snap transition for brutalist feel
                    position: 'relative',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = 'translate(-6px, -6px)';
                    el.style.boxShadow = '6px 6px 0 var(--text-main)';
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = 'translate(0, 0)';
                    el.style.boxShadow = '0px 0px 0 var(--text-main)';
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 12,
                      marginBottom: 16,
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          fontFamily: "'Helvetica Neue', 'Inter', sans-serif",
                          fontWeight: 700,
                          fontSize: '1.25rem',
                          color: 'var(--text-main)',
                          margin: '0 0 4px',
                          letterSpacing: '-0.02em',
                        }}
                      >
                        {exp.role}
                      </h3>
                      <div
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: '0.85rem',
                          color: 'var(--text-muted)',
                          fontWeight: 500,
                        }}
                      >
                        {exp.company}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                      <span
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: '0.70rem',
                          fontWeight: 600,
                          color: 'var(--text-muted)',
                          letterSpacing: '0.05em',
                        }}
                      >
                        {exp.period}
                      </span>
                      <span
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: '0.65rem',
                          padding: '4px 10px',
                          background: 'var(--text-main)',
                          color: 'var(--bg-color)',
                          fontWeight: 600,
                          letterSpacing: '0.05em',
                          textTransform: 'uppercase',
                        }}
                      >
                        {exp.type}
                      </span>
                    </div>
                  </div>

                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.9rem',
                      lineHeight: 1.7,
                      color: 'var(--text-muted)',
                      margin: '0 0 20px',
                    }}
                  >
                    {exp.description}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {exp.tags.map(tag => (
                      <span
                        key={tag}
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: '0.65rem',
                          padding: '6px 12px',
                          border: '1px solid var(--border-color)',
                          color: 'var(--text-muted)',
                          fontWeight: 500,
                          letterSpacing: '0.05em',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
