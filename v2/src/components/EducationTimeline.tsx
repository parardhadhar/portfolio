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
}

const timelineData: TimelineItem[] = [
  {
    year: '2024 — Present',
    title: 'B.Tech — Computer Science & Engineering',
    institution: 'Symbiosis University of Applied Sciences',
    location: 'Indore, India',
    type: 'education',
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
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.60rem',
          letterSpacing: '0.1em',
          padding: '4px 10px',
          fontWeight: 600,
          background: '#111',
          color: '#fff',
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
        marginBottom: 80,
        position: 'relative',
      }}
    >
      {/* Left side content or spacer */}
      {isLeft ? (
        <div ref={cardRef} style={{ paddingRight: 40 }}>
          <div
            style={{
              background: 'transparent',
              border: `1px solid rgba(0,0,0,0.15)`,
              borderRadius: 0,
              padding: '32px 32px',
              transition: 'all 0.4s ease',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = '#fff';
              el.style.borderColor = 'rgba(0,0,0,0.3)';
              el.style.transform = 'translateX(-6px)';
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
            {/* Top accent solid fill on hover, initially just thin border mapping later */}
            <div
              className="accent-top"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 2,
                background: '#111',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <TypeBadge />
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.70rem',
                  fontWeight: 600,
                  color: '#666',
                  letterSpacing: '0.05em',
                }}
              >
                {item.year}
              </span>
            </div>
            <h3
              style={{
                fontFamily: "'Helvetica Neue', 'Inter', sans-serif",
                fontWeight: 700,
                fontSize: '1.25rem',
                color: '#111',
                margin: '12px 0 4px',
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
              }}
            >
              {item.title}
            </h3>
            <div
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.85rem',
                fontWeight: 500,
                color: '#444',
                marginBottom: 12,
                fontStyle: 'italic',
              }}
            >
              {item.institution}
            </div>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.9rem',
                lineHeight: 1.7,
                color: '#555',
                marginBottom: item.details ? 20 : 0,
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
                  gap: '8px',
                }}
              >
                {item.details.map(d => (
                  <li
                    key={d}
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.65rem',
                      padding: '6px 12px',
                      borderRadius: 0,
                      background: '#f9f9f9',
                      color: '#333',
                      border: '1px solid rgba(0,0,0,0.1)',
                      fontWeight: 500,
                      letterSpacing: '0.05em',
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
              top: 36,
              right: 40,
              width: 40,
              height: 1,
              background: 'rgba(0,0,0,0.2)',
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
          paddingTop: 30,
        }}
      >
        <div
          ref={dotRef}
          style={{
            width: 14,
            height: 14,
            borderRadius: 0,
            background: '#111',
            border: '2px solid #fff',
            boxShadow: '0 0 0 1px #111',
            flexShrink: 0,
          }}
        />
      </div>

      {/* Right side content or spacer */}
      {!isLeft ? (
        <div ref={cardRef} style={{ paddingLeft: 40 }}>
          <div
            style={{
              background: 'transparent',
              border: `1px solid rgba(0,0,0,0.15)`,
              borderRadius: 0,
              padding: '32px 32px',
              transition: 'all 0.4s ease',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = '#fff';
              el.style.borderColor = 'rgba(0,0,0,0.3)';
              el.style.transform = 'translateX(6px)';
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
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                left: 0,
                height: 2,
                background: '#111',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <TypeBadge />
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.70rem',
                  fontWeight: 600,
                  color: '#666',
                  letterSpacing: '0.05em',
                }}
              >
                {item.year}
              </span>
            </div>
            <h3
              style={{
                fontFamily: "'Helvetica Neue', 'Inter', sans-serif",
                fontWeight: 700,
                fontSize: '1.25rem',
                color: '#111',
                margin: '12px 0 4px',
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
              }}
            >
              {item.title}
            </h3>
            <div
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.85rem',
                fontWeight: 500,
                color: '#444',
                marginBottom: 12,
                fontStyle: 'italic',
              }}
            >
              {item.institution}
            </div>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.9rem',
                lineHeight: 1.7,
                color: '#555',
                marginBottom: item.details ? 20 : 0,
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
                  gap: '8px',
                }}
              >
                {item.details.map(d => (
                  <li
                    key={d}
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.65rem',
                      padding: '6px 12px',
                      borderRadius: 0,
                      background: '#f9f9f9',
                      color: '#333',
                      border: '1px solid rgba(0,0,0,0.1)',
                      fontWeight: 500,
                      letterSpacing: '0.05em',
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
              top: 36,
              left: 40,
              width: 40,
              height: 1,
              background: 'rgba(0,0,0,0.2)',
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
          / Journey
        </span>
        <h2
          style={{
            fontFamily: "'Helvetica Neue', 'Inter', sans-serif",
            fontWeight: 700,
            fontSize: 'clamp(3rem, 6vw, 5.5rem)',
            letterSpacing: '-0.04em',
            color: '#111',
            margin: '0 0 1rem',
            lineHeight: 1,
          }}
        >
          Education &{' '}
          <span
            style={{
              fontStyle: 'italic',
              color: '#666',
            }}
          >
            Milestones
          </span>
        </h2>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '1.05rem',
            color: '#444',
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
            background: 'rgba(0,0,0,0.1)',
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
