import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Project {
  num: string;
  title: string;
  year: string;
  status: string;
  desc: string;
  longDesc: string;
  tags: string[];
  size: 'large' | 'normal';
  href: string;
  imageBg?: string;
}

const projects: Project[] = [
  {
    num: '01',
    title: 'SafeRoute India',
    year: '2024',
    status: 'Live',
    desc: "AI-powered women's safety intelligence dashboard",
    longDesc:
      "A full-stack safety intelligence platform combining real-time NCRB crime data, GIS mapping via Leaflet.js, an ML heatmap engine, and a cinematic visual interface. Built to provide women with actionable, location-aware safety insights across major Indian metropolitan areas.",
    tags: ['Python', 'Leaflet.js', 'Machine Learning', 'GIS', 'Firebase'],
    size: 'large',
    href: '#',
    imageBg: '#EEEEEE',
  },
  {
    num: '02',
    title: 'UE5 Cave Environment',
    year: '2024',
    status: 'Completed',
    desc: 'Photorealistic bioluminescent cave in Unreal Engine 5',
    longDesc:
      'A full cinematic cave environment rendered in UE5 with Lumen global illumination, bioluminescent flora via Niagara VFX, volumetric atmospheric fog, and ultra-detail geometry via Nanite. Every asset placed, lit, and styled by hand.',
    tags: ['UE5', 'Nanite', 'Lumen', 'Niagara VFX', 'PCG'],
    size: 'normal',
    href: '#',
    imageBg: '#E9E9E9',
  },
  {
    num: '03',
    title: 'UE5 Beach Environment',
    year: '2024',
    status: 'Completed',
    desc: 'Dynamic ocean & coastal scene with ray-traced lighting',
    longDesc:
      'A photorealistic beach environment in UE5 featuring a dynamic ocean simulation, wave caustics, ray-traced reflections on wet sand, volumetric cloud systems, and a full day-night lighting cycle driven by a sky atmosphere component.',
    tags: ['UE5', 'Dynamic Ocean', 'Lumen', 'Sky Atmosphere'],
    size: 'normal',
    href: '#',
    imageBg: '#E4E4E4',
  },
  {
    num: '04',
    title: 'AI Tutor Bot',
    year: '2024',
    status: 'Deployed',
    desc: 'Multi-model AI assistant with vision on Telegram',
    longDesc:
      'A production-deployed Telegram bot powered by Google Gemini and Groq with a smart model fallback chain. Supports multimodal image analysis, conversation memory, Firebase logging, and local data storage — built to help students with coursework at any time.',
    tags: ['Python', 'Gemini API', 'Groq', 'Vision AI'],
    size: 'large',
    href: '#',
    imageBg: '#DFDFDF',
  },
  {
    num: '05',
    title: 'Car Rig & Animation',
    year: '2023',
    status: 'Completed',
    desc: 'Full mechanical vehicle rig in Blender with cinematic keyframes',
    longDesc:
      'A complete mechanical rigging project in Blender — IK/FK chain setup for wheels, physics-driven suspension using rigid body constraints, driver expressions coupling steering to wheel rotation, and a final cinematic animation with curve-path following and depth-of-field camera work.',
    tags: ['Blender', 'Rigging', 'Physics', 'Animation'],
    size: 'normal',
    href: '#',
    imageBg: '#E9E9E9',
  },
  {
    num: '06',
    title: 'OpenEnv Hackathon Entry',
    year: '2024',
    status: 'Submitted',
    desc: 'Custom OpenEnv environment for Meta Hackathon',
    longDesc:
      'A fully compliant Meta Hackathon OpenEnv submission featuring a real-world task simulation environment with typed models, deterministic graders, baseline inference, and a containerized Docker deployment. Accompanied by a dark-themed pitch deck.',
    tags: ['Python', 'OpenEnv', 'Docker', 'AI Agents'],
    size: 'normal',
    href: '#',
    imageBg: '#EEEEEE',
  },
  {
    num: '07',
    title: 'Blueprint Editor',
    year: '2024',
    status: 'In Progress',
    desc: 'Multiplayer collaborative game design tool with AI assist',
    longDesc:
      'A browser-based multiplayer blueprint editor for the Nexus Games India platform. Features private room creation (3-person cap), real-time collaboration via WebSocket, AI logic template suggestions, offline saving, and a polished simulation panel.',
    tags: ['React', 'WebSocket', 'AI Templates', 'Multiplayer'],
    size: 'normal',
    href: '#',
    imageBg: '#E4E4E4',
  },
];

function ProjectCard({ p }: { p: Project }) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.from(el, {
        y: 80,
        opacity: 0,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={cardRef}
      style={{
        gridColumn: p.size === 'large' ? 'span 2' : 'span 1',
      }}
    >
      <a
        href={p.href}
        style={{
          display: 'flex',
          flexDirection: p.size === 'large' ? 'row' : 'column',
          gap: p.size === 'large' ? 0 : 0,
          background: 'transparent',
          border: '1px solid rgba(0,0,0,0.1)',
          borderRadius: 0,
          overflow: 'hidden',
          textDecoration: 'none',
          transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)',
          position: 'relative',
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
          el.style.borderColor = 'rgba(0,0,0,0.1)';
          el.style.transform = 'none';
          el.style.boxShadow = 'none';
        }}
      >
        {/* Abstract solid area (placeholder for image) */}
        <div
          style={{
            background: p.imageBg,
            minHeight: p.size === 'large' ? 300 : 220,
            flexBasis: p.size === 'large' ? '45%' : 'auto',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Project number — large typographic */}
          <span
            style={{
              fontFamily: "'Helvetica Neue', 'Inter', sans-serif",
              fontWeight: 700,
              fontSize: p.size === 'large' ? '8rem' : '6rem',
              color: 'rgba(0,0,0,0.03)',
              letterSpacing: '-0.06em',
              lineHeight: 1,
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          >
            {p.num}
          </span>
          {/* Floating label top left */}
          <div
            style={{
              position: 'absolute',
              top: 20,
              left: 20,
              display: 'flex',
              gap: 8,
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.6rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                padding: '6px 12px',
                borderRadius: 0,
                background: '#111',
                color: '#fff',
                textTransform: 'uppercase' as const,
              }}
            >
              {p.status}
            </span>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.65rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                color: '#666',
              }}
            >
              {p.year}
            </span>
          </div>
        </div>

        {/* Content */}
        <div
          style={{
            padding: p.size === 'large' ? '40px 40px' : '32px 32px',
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
          }}
        >
          <h3
            style={{
              fontFamily: "'Helvetica Neue', 'Inter', sans-serif",
              fontWeight: 700,
              fontSize: p.size === 'large' ? '2.2rem' : '1.5rem',
              color: '#111',
              margin: '0 0 12px',
              transition: 'color 0.3s',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
          >
            {p.title}
          </h3>

          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.9rem',
              color: '#111',
              fontWeight: 500,
              marginBottom: 16,
              fontStyle: 'italic',
            }}
          >
            {p.desc}
          </p>

          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: p.size === 'large' ? '0.95rem' : '0.9rem',
              lineHeight: 1.6,
              color: '#555',
              marginBottom: 24,
              flex: 1,
            }}
          >
            {p.longDesc}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: 24 }}>
            {p.tags.map(tag => (
              <span
                key={tag}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.65rem',
                  padding: '6px 12px',
                  borderRadius: 0,
                  fontWeight: 500,
                  border: `1px solid rgba(0,0,0,0.15)`,
                  color: '#333',
                  letterSpacing: '0.05em',
                  background: '#f9f9f9',
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.70rem',
              fontWeight: 600,
              color: '#111',
              letterSpacing: '0.1em',
              textTransform: 'uppercase' as const,
            }}
          >
            View Project
            <span
              style={{ transition: 'transform 0.3s' }}
            >
              →
            </span>
          </div>
        </div>
      </a>
    </div>
  );
}

// Marquee strip between sections
function MarqueeStrip() {
  const words = [
    'Unreal Engine 5 •',
    'Machine Learning •',
    'WebGL / Three.js •',
    'Full-Stack Dev •',
    '3D Animation •',
    'AI Integration •',
    'Python •',
    'React / TypeScript •',
  ];
  const doubled = [...words, ...words];

  return (
    <div
      style={{
        overflow: 'hidden',
        padding: '60px 0',
        borderTop: '1px solid rgba(0,0,0,0.1)',
        borderBottom: '1px solid rgba(0,0,0,0.1)',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '4rem',
          animation: 'marquee 40s linear infinite',
          whiteSpace: 'nowrap',
        }}
      >
        {doubled.map((word, i) => (
          <span
            key={i}
            style={{
              fontFamily: "'Helvetica Neue', 'Inter', sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(2rem,4vw,3.5rem)',
              letterSpacing: '-0.03em',
              color: 'rgba(0,0,0,0.06)',
              textTransform: 'uppercase' as const,
              flexShrink: 0,
            }}
          >
            {word}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Work() {
  return (
    <>
      <section
        id="work"
        style={{
          padding: '140px 40px 80px',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 80 }}>
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.75rem',
              fontWeight: 500,
              letterSpacing: '0.1em',
              color: '#666',
              display: 'block',
              marginBottom: '1.5rem',
              textTransform: 'uppercase',
            }}
          >
            / Selected Work
          </span>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
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
              Featured Projects
            </h2>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.95rem',
                color: '#666',
                maxWidth: 300,
                lineHeight: 1.6,
              }}
            >
              7 projects spanning 3D environments, AI systems, and full-stack products.
            </p>
          </div>
        </div>

        {/* Project grid — 2 columns with large cards spanning both */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 20,
          }}
        >
          {projects.map((p) => (
            <ProjectCard key={p.num} p={p} />
          ))}
        </div>
      </section>

      {/* Scrolling marquee between Work and Education */}
      <MarqueeStrip />

      {/* Inject keyframe for marquee */}
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </>
  );
}
