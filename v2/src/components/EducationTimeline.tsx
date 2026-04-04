import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface TimelineItem {
  year: string;
  title: string;
  institution: string;
  location: string;
  type: 'education' | 'achievement' | 'milestone';
  description: string;
  details?: string[];
  color: string;
}

const timelineData: TimelineItem[] = [
  {
    year: '2024 — Present',
    title: 'B.Tech — Computer Science & Engineering',
    institution: 'Symbiosis University of Applied Sciences',
    location: 'Indore, India',
    type: 'education',
    color: '#d4ff00',
    description:
      'Pursuing Bachelor of Technology in CSE (Reg. 24BCG10003). Specializing in machine learning, computer graphics, operating systems, and full-stack development.',
    details: [
      'Data Structures & Algorithms',
      'Computer Graphics & Visualization',
      'Machine Learning Foundations',
      'Database Management Systems',
      'Operating Systems & Unix Tools',
      'Software Engineering Principles',
      'Computer Networks',
    ],
  },
  {
    year: '2023 — 2024',
    title: 'Unreal Engine 5 — Advanced Environment Art',
    institution: 'Independent Study & Projects',
    location: 'Self-directed',
    type: 'milestone',
    color: '#08f7fe',
    description:
      "Deep dived into Unreal Engine 5's cutting-edge tech stack: Nanite virtualized geometry, Lumen global illumination, and Procedural Content Generation framework. Built full cave and beach environments from scratch.",
    details: [
      'Nanite — Ultra-detail geometry streaming',
      'Lumen — Fully dynamic real-time GI',
      'PCG Framework — Procedural environment generation',
      'Volumetric lighting & atmospheric fog',
      'Megascans integration with Quixel Bridge',
      'Ray-traced reflections & shadows',
    ],
  },
  {
    year: '2023',
    title: '3D Animation & Mechanical Rigging',
    institution: 'Blender — Independent Projects',
    location: 'Self-directed',
    type: 'milestone',
    color: '#FF9FFC',
    description:
      'Mastered mechanical rigging workflows in Blender — from IK/FK chain setups to physics-driven vehicle suspensions and cinematic animation sequences.',
    details: [
      'IK/FK chain setups for articulated rigs',
      'Physics-based vehicle suspension system',
      'Driver constraints for mechanical coupling',
      'Camera rigging for cinematic compositions',
      'Keyframe animation with graph editor polish',
    ],
  },
  {
    year: '2022 — 2023',
    title: 'Full-Stack Web Development',
    institution: 'Various Platforms & Projects',
    location: 'Online / Remote',
    type: 'education',
    color: '#5227FF',
    description:
      'Systematically learned modern web development — from fundamentals to React, Node.js, databases, and deployment. Built and shipped complete applications.',
    details: [
      'HTML5 / CSS3 / Vanilla JavaScript',
      'React & component-based architecture',
      'Node.js + Express backend development',
      'Firebase Realtime DB & Firestore',
      'REST API design & integration',
      'Vercel & Render deployment pipelines',
    ],
  },
  {
    year: '2022',
    title: 'Python & Machine Learning Foundations',
    institution: 'Independent Study',
    location: 'Self-directed',
    type: 'education',
    color: '#ff7b54',
    description:
      'Built a strong Python foundation and applied it toward ML — from NumPy/Pandas data wrangling to TensorFlow model training and deploying AI APIs.',
    details: [
      'Python — NumPy, Pandas, Matplotlib',
      'Scikit-learn for classical ML pipeline',
      'TensorFlow / Keras neural networks',
      'Gemini & Groq API integration',
      'NLP — text classification & sentiment',
      'GIS data processing with GeoPandas',
    ],
  },
];

function TimelineCard({ item, index }: { item: TimelineItem; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const line = lineRef.current;
    const dot = dotRef.current;
    if (!card || !line || !dot) return;

    const isLeft = index % 2 === 0;

    const ctx = gsap.context(() => {
      // Card slide in
      gsap.from(card, {
        x: isLeft ? -80 : 80,
        opacity: 0,
        duration: 1.1,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          once: true,
        },
      });

      // Dot pulse in
      gsap.from(dot, {
        scale: 0,
        duration: 0.6,
        ease: 'back.out(3)',
        scrollTrigger: {
          trigger: dot,
          start: 'top 82%',
          once: true,
        },
      });

      // Line draw in
      gsap.from(line, {
        scaleX: 0,
        transformOrigin: isLeft ? 'right center' : 'left center',
        duration: 0.8,
        delay: 0.3,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: line,
          start: 'top 82%',
          once: true,
        },
      });
    });

    return () => ctx.revert();
  }, [index]);

  const isLeft = index % 2 === 0;

  const TypeBadge = () => {
    const labels: Record<string, string> = {
      education: 'Education',
      achievement: 'Achievement',
      milestone: 'Milestone',
    };
    return (
      <span
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: '0.5rem',
          letterSpacing: '0.15em',
          padding: '3px 10px',
          borderRadius: 100,
          border: `1px solid ${item.color}50`,
          color: item.color,
          textTransform: 'uppercase' as const,
        }}
      >
        {labels[item.type]}
      </span>
    );
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 40px 1fr',
        alignItems: 'start',
        marginBottom: 60,
        position: 'relative',
      }}
    >
      {/* Left side content or spacer */}
      {isLeft ? (
        <div ref={cardRef} style={{ paddingRight: 40 }}>
          <div
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid rgba(255,255,255,0.08)`,
              borderRadius: 20,
              padding: '32px 28px',
              transition: 'all 0.4s ease',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = 'rgba(255,255,255,0.06)';
              el.style.borderColor = `${item.color}35`;
              el.style.transform = 'translateX(-6px)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = 'rgba(255,255,255,0.03)';
              el.style.borderColor = 'rgba(255,255,255,0.08)';
              el.style.transform = 'none';
            }}
          >
            {/* Top accent */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 2,
                background: `linear-gradient(90deg, ${item.color}, transparent)`,
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <TypeBadge />
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '0.6rem',
                  color: 'rgba(200,220,255,0.35)',
                  letterSpacing: '0.08em',
                }}
              >
                {item.year}
              </span>
            </div>
            <h3
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                fontSize: '1.1rem',
                color: '#fff',
                margin: '8px 0 4px',
                lineHeight: 1.3,
              }}
            >
              {item.title}
            </h3>
            <div
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.75rem',
                color: item.color,
                marginBottom: 12,
              }}
            >
              {item.institution}
            </div>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.82rem',
                lineHeight: 1.75,
                color: 'rgba(200,210,230,0.6)',
                marginBottom: item.details ? 16 : 0,
              }}
            >
              {item.description}
            </p>
            {item.details && (
              <ul
                style={{
                  listStyle: 'none',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '6px',
                }}
              >
                {item.details.map(d => (
                  <li
                    key={d}
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '0.52rem',
                      padding: '4px 10px',
                      borderRadius: 6,
                      background: `${item.color}10`,
                      color: `${item.color}cc`,
                      letterSpacing: '0.06em',
                    }}
                  >
                    {d}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Horizontal connector line */}
          <div
            ref={lineRef}
            style={{
              position: 'absolute',
              top: 28,
              right: 40,
              width: 40,
              height: 1,
              background: `linear-gradient(to right, rgba(255,255,255,0.1), ${item.color}60)`,
            }}
          />
        </div>
      ) : (
        <div /> // spacer
      )}

      {/* Center — dot */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 24,
        }}
      >
        <div
          ref={dotRef}
          style={{
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: item.color,
            boxShadow: `0 0 0 4px rgba(4,0,10,1), 0 0 0 6px ${item.color}40, 0 0 20px ${item.color}80`,
            flexShrink: 0,
          }}
        />
      </div>

      {/* Right side content or spacer */}
      {!isLeft ? (
        <div ref={cardRef} style={{ paddingLeft: 40 }}>
          <div
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid rgba(255,255,255,0.08)`,
              borderRadius: 20,
              padding: '32px 28px',
              transition: 'all 0.4s ease',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = 'rgba(255,255,255,0.06)';
              el.style.borderColor = `${item.color}35`;
              el.style.transform = 'translateX(6px)';
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
                position: 'absolute',
                top: 0,
                right: 0,
                left: 0,
                height: 2,
                background: `linear-gradient(90deg, transparent, ${item.color})`,
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <TypeBadge />
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '0.6rem',
                  color: 'rgba(200,220,255,0.35)',
                  letterSpacing: '0.08em',
                }}
              >
                {item.year}
              </span>
            </div>
            <h3
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                fontSize: '1.1rem',
                color: '#fff',
                margin: '8px 0 4px',
                lineHeight: 1.3,
              }}
            >
              {item.title}
            </h3>
            <div
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.75rem',
                color: item.color,
                marginBottom: 12,
              }}
            >
              {item.institution}
            </div>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.82rem',
                lineHeight: 1.75,
                color: 'rgba(200,210,230,0.6)',
                marginBottom: item.details ? 16 : 0,
              }}
            >
              {item.description}
            </p>
            {item.details && (
              <ul
                style={{
                  listStyle: 'none',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '6px',
                }}
              >
                {item.details.map(d => (
                  <li
                    key={d}
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '0.52rem',
                      padding: '4px 10px',
                      borderRadius: 6,
                      background: `${item.color}10`,
                      color: `${item.color}cc`,
                      letterSpacing: '0.06em',
                    }}
                  >
                    {d}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Horizontal connector line */}
          <div
            ref={lineRef}
            style={{
              position: 'absolute',
              top: 28,
              left: 40,
              width: 40,
              height: 1,
              background: `linear-gradient(to left, rgba(255,255,255,0.1), ${item.color}60)`,
            }}
          />
        </div>
      ) : (
        <div /> // spacer
      )}
    </div>
  );
}

export default function EducationTimeline() {
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const line = lineRef.current;
    if (!line) return;
    const ctx = gsap.context(() => {
      gsap.from(line, {
        scaleY: 0,
        transformOrigin: 'top center',
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: line,
          start: 'top 70%',
          end: 'bottom 30%',
          scrub: 1,
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="education"
      style={{
        padding: '140px 40px',
        maxWidth: '1100px',
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 100 }}>
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
          / Journey
        </span>
        <h2
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
            letterSpacing: '-0.03em',
            color: '#fff',
            margin: '0 0 1rem',
            lineHeight: 1,
          }}
        >
          Education &{' '}
          <span
            style={{
              fontStyle: 'italic',
              background: 'linear-gradient(135deg, #d4ff00, #08f7fe)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Milestones
          </span>
        </h2>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '1rem',
            color: 'rgba(200,210,230,0.45)',
            maxWidth: 460,
            margin: '0 auto',
          }}
        >
          A chronological map of knowledge acquired, skills honed, and things built.
        </p>
      </div>

      {/* Timeline */}
      <div style={{ position: 'relative' }}>
        {/* Center vertical line */}
        <div
          ref={lineRef}
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            bottom: 0,
            width: 1,
            background: 'linear-gradient(to bottom, #d4ff00, rgba(82,39,255,0.4), transparent)',
            transform: 'translateX(-50%)',
          }}
        />

        {timelineData.map((item, i) => (
          <TimelineCard key={i} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}
