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
  color: string;
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
    tags: ['Python', 'Leaflet.js', 'Machine Learning', 'GIS', 'Firebase', 'NCRB Data'],
    color: '#08f7fe',
    size: 'large',
    href: '#',
    imageBg: 'linear-gradient(135deg, rgba(8,247,254,0.12) 0%, rgba(82,39,255,0.08) 100%)',
  },
  {
    num: '02',
    title: 'UE5 Cave Environment',
    year: '2024',
    status: 'Completed',
    desc: 'Photorealistic bioluminescent cave in Unreal Engine 5',
    longDesc:
      'A full cinematic cave environment rendered in UE5 with Lumen global illumination, bioluminescent flora via Niagara VFX, volumetric atmospheric fog, and ultra-detail geometry via Nanite. Every asset placed, lit, and styled by hand.',
    tags: ['Unreal Engine 5', 'Nanite', 'Lumen', 'Niagara VFX', 'PCG', 'Megascans'],
    color: '#d4ff00',
    size: 'normal',
    href: '#',
    imageBg: 'linear-gradient(135deg, rgba(212,255,0,0.10) 0%, rgba(8,247,254,0.06) 100%)',
  },
  {
    num: '03',
    title: 'UE5 Beach Environment',
    year: '2024',
    status: 'Completed',
    desc: 'Dynamic ocean & coastal scene with ray-traced lighting',
    longDesc:
      'A photorealistic beach environment in UE5 featuring a dynamic ocean simulation, wave caustics, ray-traced reflections on wet sand, volumetric cloud systems, and a full day-night lighting cycle driven by a sky atmosphere component.',
    tags: ['Unreal Engine 5', 'Dynamic Ocean', 'Lumen', 'Sky Atmosphere', 'Wave Simulation'],
    color: '#5227FF',
    size: 'normal',
    href: '#',
    imageBg: 'linear-gradient(135deg, rgba(82,39,255,0.12) 0%, rgba(212,255,0,0.06) 100%)',
  },
  {
    num: '04',
    title: 'AI Tutor Bot',
    year: '2024',
    status: 'Deployed',
    desc: 'Multi-model AI assistant with vision on Telegram',
    longDesc:
      'A production-deployed Telegram bot powered by Google Gemini and Groq with a smart model fallback chain. Supports multimodal image analysis, conversation memory, Firebase logging, and local data storage — built to help students with coursework at any time.',
    tags: ['Python', 'Gemini API', 'Groq', 'Firebase', 'Telegram Bot', 'Vision AI'],
    color: '#FF9FFC',
    size: 'large',
    href: '#',
    imageBg: 'linear-gradient(135deg, rgba(255,159,252,0.10) 0%, rgba(82,39,255,0.08) 100%)',
  },
  {
    num: '05',
    title: 'Car Rig & Animation',
    year: '2023',
    status: 'Completed',
    desc: 'Full mechanical vehicle rig in Blender with cinematic keyframes',
    longDesc:
      'A complete mechanical rigging project in Blender — IK/FK chain setup for wheels, physics-driven suspension using rigid body constraints, driver expressions coupling steering to wheel rotation, and a final cinematic animation with curve-path following and depth-of-field camera work.',
    tags: ['Blender', 'Rigging', 'Physics Simulation', 'IK/FK', 'Animation', 'Cinematics'],
    color: '#ff7b54',
    size: 'normal',
    href: '#',
    imageBg: 'linear-gradient(135deg, rgba(255,123,84,0.12) 0%, rgba(255,159,252,0.06) 100%)',
  },
  {
    num: '06',
    title: 'OpenEnv Hackathon Entry',
    year: '2024',
    status: 'Submitted',
    desc: 'Custom OpenEnv environment for Meta Hackathon',
    longDesc:
      'A fully compliant Meta Hackathon OpenEnv submission featuring a real-world task simulation environment with typed models, deterministic graders, baseline inference, and a containerized Docker deployment. Accompanied by a dark-themed pitch deck.',
    tags: ['Python', 'OpenEnv', 'Docker', 'AI Agents', 'Meta Llama'],
    color: '#66d9e8',
    size: 'normal',
    href: '#',
    imageBg: 'linear-gradient(135deg, rgba(102,217,232,0.10) 0%, rgba(82,39,255,0.08) 100%)',
  },
  {
    num: '07',
    title: 'Blueprint Editor — Nexus Games',
    year: '2024',
    status: 'In Progress',
    desc: 'Multiplayer collaborative game design tool with AI assist',
    longDesc:
      'A browser-based multiplayer blueprint editor for the Nexus Games India platform. Features private room creation (3-person cap), real-time collaboration via WebSocket, AI logic template suggestions, offline saving, and a polished simulation panel.',
    tags: ['React', 'WebSocket', 'AI Templates', 'Multiplayer', 'Firebase', 'TypeScript'],
    color: '#a78bfa',
    size: 'normal',
    href: '#',
    imageBg: 'linear-gradient(135deg, rgba(167,139,250,0.12) 0%, rgba(255,159,252,0.06) 100%)',
  },
];

function ProjectCard({ p }: { p: Project }) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.from(el, {
        y: 60,
        opacity: 0,
        duration: 1.1,
        ease: 'power4.out',
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
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 24,
          overflow: 'hidden',
          textDecoration: 'none',
          transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)',
          position: 'relative',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.background = 'rgba(255,255,255,0.055)';
          el.style.borderColor = `${p.color}35`;
          el.style.transform = 'translateY(-8px)';
          el.style.boxShadow = `0 32px 80px ${p.color}12`;
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.background = 'rgba(255,255,255,0.03)';
          el.style.borderColor = 'rgba(255,255,255,0.07)';
          el.style.transform = 'none';
          el.style.boxShadow = 'none';
        }}
      >
        {/* Gradient image area */}
        <div
          style={{
            background: p.imageBg,
            minHeight: p.size === 'large' ? 240 : 180,
            flexBasis: p.size === 'large' ? '45%' : 'auto',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Project number — large decorative */}
          <span
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: p.size === 'large' ? '8rem' : '6rem',
              color: `${p.color}15`,
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
                fontFamily: "'Space Mono', monospace",
                fontSize: '0.52rem',
                letterSpacing: '0.15em',
                padding: '4px 10px',
                borderRadius: 100,
                border: `1px solid ${p.color}50`,
                color: p.color,
                textTransform: 'uppercase' as const,
              }}
            >
              {p.status}
            </span>
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '0.52rem',
                letterSpacing: '0.1em',
                color: 'rgba(200,220,255,0.3)',
              }}
            >
              {p.year}
            </span>
          </div>
        </div>

        {/* Content */}
        <div
          style={{
            padding: p.size === 'large' ? '40px 40px' : '28px 28px',
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
          }}
        >
          <h3
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: p.size === 'large' ? '1.8rem' : '1.35rem',
              color: '#fff',
              margin: '0 0 8px',
              transition: 'color 0.3s',
              lineHeight: 1.2,
            }}
          >
            {p.title}
          </h3>

          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.8rem',
              color: p.color,
              marginBottom: 12,
              fontStyle: 'italic',
            }}
          >
            {p.desc}
          </p>

          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: p.size === 'large' ? '0.9rem' : '0.82rem',
              lineHeight: p.size === 'large' ? 1.8 : 1.75,
              color: 'rgba(200,210,230,0.58)',
              marginBottom: 20,
              flex: 1,
            }}
          >
            {p.longDesc}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: 20 }}>
            {p.tags.map(tag => (
              <span
                key={tag}
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '0.52rem',
                  padding: '4px 10px',
                  borderRadius: 6,
                  border: `1px solid ${p.color}28`,
                  color: p.color,
                  letterSpacing: '0.08em',
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
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.58rem',
              color: p.color,
              letterSpacing: '0.15em',
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
    'Unreal Engine 5 ✦',
    'Machine Learning ✦',
    'WebGL / Three.js ✦',
    'Full-Stack Dev ✦',
    '3D Animation ✦',
    'AI Integration ✦',
    'Python ✦',
    'React / TypeScript ✦',
  ];
  const doubled = [...words, ...words];

  return (
    <div
      style={{
        overflow: 'hidden',
        padding: '40px 0',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '3rem',
          animation: 'marquee 30s linear infinite',
          whiteSpace: 'nowrap',
        }}
      >
        {doubled.map((word, i) => (
          <span
            key={i}
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(1.5rem,3vw,2.5rem)',
              letterSpacing: '-0.02em',
              color: i % 4 === 1 ? 'rgba(212,255,0,0.18)' : 'rgba(255,255,255,0.06)',
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
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.6rem',
              letterSpacing: '0.3em',
              color: '#d4ff00',
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
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                letterSpacing: '-0.03em',
                color: '#fff',
                margin: 0,
                lineHeight: 1,
              }}
            >
              Featured Projects
            </h2>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.85rem',
                color: 'rgba(200,220,255,0.35)',
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
