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
    color: '#d4ff00',
  },
  {
    role: 'B.Tech — Computer Science',
    company: 'University',
    period: '2024 — Present',
    type: 'Academic',
    description:
      'Pursuing Bachelor of Technology in Computer Science (Reg. 24BCG10003). Specializing in machine learning, computer graphics, and full-stack development alongside hands-on project work.',
    tags: ['Data Structures', 'Machine Learning', 'Computer Graphics', 'DBMS'],
    color: '#5227FF',
  },
  {
    role: 'Game Developer & 3D Artist',
    company: 'Personal Projects',
    period: '2022 — 2023',
    type: 'Project-based',
    description:
      'Developed photorealistic game environments with ray-traced lighting, Nanite geometry, and Lumen global illumination. Rigged and animated vehicles in Blender with physics-based suspension.',
    tags: ['Blender', 'Rigging', 'Nanite', 'Lumen', 'PCG'],
    color: '#08f7fe',
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
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.6rem',
              letterSpacing: '0.3em',
              color: '#d4ff00',
              display: 'block',
              marginBottom: '1.5rem',
              textTransform: 'uppercase',
            }}
          >
            / Experience
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
            background: 'linear-gradient(to bottom, #d4ff00, rgba(255,255,255,0.05), transparent)',
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
                {/* Dot */}
                <div
                  style={{
                    position: 'absolute',
                    left: -5,
                    top: 6,
                    width: 11,
                    height: 11,
                    borderRadius: '50%',
                    background: exp.color,
                    boxShadow: `0 0 20px ${exp.color}80`,
                    zIndex: 2,
                  }}
                />

                {/* Card */}
                <div
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 20,
                    padding: '32px 36px',
                    transition: 'all 0.4s ease',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = 'rgba(255,255,255,0.06)';
                    el.style.borderColor = `${exp.color}40`;
                    el.style.transform = 'translateX(8px)';
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = 'rgba(255,255,255,0.03)';
                    el.style.borderColor = 'rgba(255,255,255,0.08)';
                    el.style.transform = 'none';
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
                          fontFamily: "'Syne', sans-serif",
                          fontWeight: 700,
                          fontSize: '1.25rem',
                          color: '#fff',
                          margin: '0 0 4px',
                        }}
                      >
                        {exp.role}
                      </h3>
                      <div
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: '0.8rem',
                          color: exp.color,
                        }}
                      >
                        {exp.company}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                      <span
                        style={{
                          fontFamily: "'Space Mono', monospace",
                          fontSize: '0.65rem',
                          color: 'rgba(200,220,255,0.45)',
                          letterSpacing: '0.1em',
                        }}
                      >
                        {exp.period}
                      </span>
                      <span
                        style={{
                          fontFamily: "'Space Mono', monospace",
                          fontSize: '0.55rem',
                          padding: '3px 10px',
                          borderRadius: '100px',
                          border: `1px solid ${exp.color}50`,
                          color: exp.color,
                          letterSpacing: '0.1em',
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
                      lineHeight: 1.8,
                      color: 'rgba(200,210,230,0.65)',
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
                          fontFamily: "'Space Mono', monospace",
                          fontSize: '0.55rem',
                          letterSpacing: '0.1em',
                          padding: '4px 12px',
                          borderRadius: 6,
                          background: 'rgba(255,255,255,0.05)',
                          color: 'rgba(200,220,255,0.5)',
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
