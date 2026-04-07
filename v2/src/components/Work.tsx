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
    title: 'RGC Community Hub',
    year: '2025',
    status: 'Live',
    desc: 'Engineering a resilient full-stack platform for VIT Bhopal VRGC',
    longDesc:
      'Architected and delivered a large-scale, resilient full-stack platform end-to-end. Engineered to sustain 1,800+ unique visitors and 8,300+ page views during high-traffic production events. Optimized live stream delivery for 800+ concurrent viewers with a 96/100 Real Experience Score.',
    tags: ['Next.js', 'Supabase', 'Firebase', 'Vercel', 'REST APIs', 'CI/CD'],
    size: 'large',
    href: 'https://vrgc.vercel.app',
    imageBg: 'https://iili.io/B7UxoJ4.png',
  },
  {
    num: '02',
    title: 'ISL Recognition System',
    year: '2024',
    status: 'Completed',
    desc: 'Real-time AI pipeline for Indian Sign Language',
    longDesc:
      'Developed a real-time AI pipeline converting sign language webcam input into text and speech. Implemented MediaPipe hand-landmark detection with a custom-trained TensorFlow classifier, optimized for mobile hardware with sub-100ms latency.',
    tags: ['Python', 'OpenCV', 'MediaPipe', 'TensorFlow', 'gTTS'],
    size: 'normal',
    href: '#',
    imageBg: 'https://iili.io/B7gKcIn.png',
  },
  {
    num: '03',
    title: 'PhishGuard',
    year: '2024',
    status: 'Completed',
    desc: 'ML-based Cybersecurity threat detection system',
    longDesc:
      'Engineered a machine learning-based URL classification system to detect phishing threats in real time. Containerized with Docker and deployed behind a REST API. Focused on prioritizing low false-positive rates for business operations.',
    tags: ['Python', 'scikit-learn', 'Flask', 'Docker', 'Cybersecurity'],
    size: 'normal',
    href: 'https://github.com/parardhadhar/phishguard',
    imageBg: 'https://iili.io/B7Uj8la.png',
  },
  {
    num: '04',
    title: 'Insight Engine',
    year: '2024',
    status: 'Public Space',
    desc: 'Retrieval-Augmented Generation QA System',
    longDesc:
      'Built a multi-document QA system using RAG and big data techniques. Implemented FAISS vector store with chunk-level embedding to handle large document sets with fast, consistent query latency. Deployed on Hugging Face Spaces.',
    tags: ['Python', 'LangChain', 'HuggingFace', 'FAISS', 'RAG'],
    size: 'large',
    href: 'https://huggingface.co/spaces/parardhadhar/Parardha-Insight-Engine',
    imageBg: 'https://iili.io/B7glXix.png',
  },
  {
    num: '05',
    title: 'Krishi Sahayak',
    year: '2024',
    status: 'Completed',
    desc: 'AI-Powered Smart Farming Platform',
    longDesc:
      'Developed a CNN-based crop disease classifier with a recommendation engine for fertilizer and harvest timing. Delivered through a mobile-responsive web dashboard for smallholder farmers, bridge the gap for those without agronomist access.',
    tags: ['Python', 'TensorFlow', 'Flask', 'REST API', 'Smart Farming'],
    size: 'normal',
    href: 'https://github.com/parardhadhar/Krishi-Sahayak',
    imageBg: 'https://iili.io/B7ggyUN.png',
  },
  {
    num: '06',
    title: 'UE5 Cave Environment',
    year: '2024',
    status: 'Completed',
    desc: 'Next-Gen Environment Art in Unreal Engine 5',
    longDesc:
      'A photorealistic environment project leveraging UE5 Lumen and Nanite for high-fidelity lighting and geometry. Features volumetric atmospheric effects and a custom lighting rig to create a cinematic, narrative-driven space.',
    tags: ['UE5', 'Lumen', 'Nanite', 'Environment Art', 'VFX'],
    size: 'normal',
    href: '#',
    imageBg: '/projects/cave/hero.png',
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
      className={p.size === 'large' ? 'project-card-large' : ''}
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
          border: '1px solid var(--border-color)',
          borderRadius: 0,
          overflow: 'hidden',
          textDecoration: 'none',
          color: 'var(--text-main)', // explicitly prevent default browser blue links
          transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)',
          position: 'relative',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.background = 'var(--bg-color)';
          el.style.borderColor = 'rgba(0,0,0,0.3)';
          el.style.transform = 'translateY(-4px)';
          el.style.boxShadow = `0 20px 40px rgba(0,0,0,0.05)`;
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.background = 'transparent';
          el.style.borderColor = 'var(--border-color)';
          el.style.transform = 'none';
          el.style.boxShadow = 'none';
        }}
      >
        {/* Project Image Asset */}
        <div
          style={{
            background: '#000',
            minHeight: p.size === 'large' ? 400 : 300,
            flexBasis: p.size === 'large' ? '50%' : 'auto',
            flexShrink: 0,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <img 
            src={p.imageBg} 
            alt={p.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'grayscale(100%)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
              opacity: 0.8,
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLImageElement).style.filter = 'grayscale(0%)';
              (e.currentTarget as HTMLImageElement).style.opacity = '1';
              (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.05)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLImageElement).style.filter = 'grayscale(100%)';
              (e.currentTarget as HTMLImageElement).style.opacity = '0.8';
              (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)';
            }}
          />
          {/* Project number — large typographic */}
          <span
            style={{
              position: 'absolute',
              bottom: -10,
              right: -10,
              fontFamily: "'Helvetica Neue', 'Inter', sans-serif",
              fontWeight: 700,
              fontSize: p.size === 'large' ? '12rem' : '8rem',
              color: 'rgba(255,255,255,0.05)',
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
              zIndex: 5
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
                background: 'var(--text-main)',
                color: 'var(--bg-color)',
                textTransform: 'uppercase' as const,
              }}
            >
              {p.status}
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
              color: 'var(--text-main)',
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
              color: 'var(--text-main)',
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
              color: 'var(--text-muted)',
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
              color: 'var(--text-main)',
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
              color: 'var(--text-muted)',
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
                color: 'var(--text-main)',
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
                color: 'var(--text-muted)',
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
          className="stack-on-mobile"
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
