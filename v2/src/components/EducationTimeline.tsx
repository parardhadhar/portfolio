import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollReveal from './ScrollReveal';

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
    year: 'Sep 2024 — 2028',
    title: 'Bachelor of Technology in Computer Science and Engineering',
    institution: 'VIT Bhopal University',
    location: 'Bhopal, India',
    type: 'education',
    description:
      'Pursuing B.Tech with a current GPA of 8.68/10.0. Deeply engaged in core CS fundamentals and advanced AI/ML coursework.',
    details: [
      'Data Structures and Algorithms',
      'Operating Systems',
      'Artificial Intelligence / Machine Learning',
      'Computer Graphics',
      'Database Management Systems',
      'Unix Tools and Scripting',
      'Real-Time Systems',
    ],
  },
  {
    year: 'May 2024',
    title: 'Higher Secondary Graduation',
    institution: 'Don Bosco School',
    location: 'Darjeeling, India',
    type: 'education',
    description:
      'Completed secondary education with a focus on science and mathematics, laying the foundation for engineering studies.',
  },
];

const certifications = [
  { title: 'Oracle Cloud Infrastructure 2025', issuer: 'Generative AI Professional (Oracle)' },
  { title: 'AI/ML for Geo Data Analysis', issuer: 'ISRO — Indian Space Research Organisation' },
  { title: 'Supervised Machine Learning', issuer: 'Regression & Classification (DeepLearning.AI)' },
  { title: 'Machine Learning with Python', issuer: 'IBM' },
  { title: 'Security Principles in Cloud Computing', issuer: 'Google Cloud' },
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
      gsap.from(card, {
        x: isLeft ? -80 : 80,
        opacity: 0,
        duration: 1.1,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          once: true,
        },
      });

      gsap.from(dot, {
        scale: 0,
        duration: 0.6,
        ease: 'back.out(3)',
        scrollTrigger: {
          trigger: dot,
          start: 'top 85%',
          once: true,
        },
      });

      gsap.from(line, {
        scaleX: 0,
        transformOrigin: isLeft ? 'right center' : 'left center',
        duration: 0.8,
        delay: 0.3,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: line,
          start: 'top 85%',
          once: true,
        },
      });
    });

    return () => ctx.revert();
  }, [index]);

  const isLeft = index % 2 === 0;

  return (
    <div
      className="timeline-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 40px 1fr',
        alignItems: 'start',
        marginBottom: 80,
        position: 'relative',
      }}
    >
      {isLeft ? (
        <div ref={cardRef} className="timeline-card-wrapper" style={{ paddingRight: 40 }}>
          <div
            className="timeline-card"
            style={{
              background: 'transparent',
              border: `1px solid var(--border-color)`,
              borderRadius: 0,
              padding: '32px',
              transition: 'all 0.4s ease',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.6rem', fontWeight: 700, padding: '4px 10px', background: 'var(--text-main)', color: 'var(--bg-color)', textTransform: 'uppercase' }}>
                Education
              </span>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                {item.year}
              </span>
            </div>
            <h3 style={{ fontFamily: "'Helvetica Neue', 'Inter', sans-serif", fontWeight: 700, fontSize: '1.25rem', color: 'var(--text-main)', margin: '12px 0 8px', letterSpacing: '-0.02em' }}>
              {item.title}
            </h3>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)', marginBottom: 12, fontStyle: 'italic' }}>
              {item.institution}
            </div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--text-muted)' }}>
              {item.description}
            </p>
            {item.details && (
              <ul style={{ listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: 20 }}>
                {item.details.map(d => (
                  <li key={d} style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.65rem', padding: '6px 12px', background: 'var(--border-light)', color: 'var(--text-main)', fontWeight: 600 }}>
                    {d}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div ref={lineRef} className="timeline-horizontal-line" style={{ position: 'absolute', top: 36, right: 40, width: 40, height: 1, background: 'var(--border-color)' }} />
        </div>
      ) : <div />}

      <div className="timeline-dot-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 30 }}>
        <div ref={dotRef} style={{ width: 12, height: 12, background: 'var(--text-main)', border: '2px solid var(--bg-color)', outline: '1px solid var(--text-main)', flexShrink: 0 }} />
      </div>

      {!isLeft ? (
        <div ref={cardRef} className="timeline-card-wrapper" style={{ paddingLeft: 40 }}>
          <div
            className="timeline-card"
            style={{
              background: 'transparent',
              border: `1px solid var(--border-color)`,
              borderRadius: 0,
              padding: '32px',
              transition: 'all 0.4s ease',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.6rem', fontWeight: 700, padding: '4px 10px', background: 'var(--text-main)', color: 'var(--bg-color)', textTransform: 'uppercase' }}>
                Education
              </span>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                {item.year}
              </span>
            </div>
            <h3 style={{ fontFamily: "'Helvetica Neue', 'Inter', sans-serif", fontWeight: 700, fontSize: '1.25rem', color: 'var(--text-main)', margin: '12px 0 8px', letterSpacing: '-0.02em' }}>
              {item.title}
            </h3>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)', marginBottom: 12, fontStyle: 'italic' }}>
              {item.institution}
            </div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--text-muted)' }}>
              {item.description}
            </p>
          </div>
          <div ref={lineRef} className="timeline-horizontal-line" style={{ position: 'absolute', top: 36, left: 40, width: 40, height: 1, background: 'var(--border-color)' }} />
        </div>
      ) : <div />}
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
    <section id="education" className="mobile-padding" style={{ padding: '140px 40px', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 100 }}>
        <ScrollReveal>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', letterSpacing: '0.1em', fontWeight: 500, color: 'var(--text-muted)', display: 'block', marginBottom: '1.5rem', textTransform: 'uppercase' }}>
            / Path
          </span>
          <h2 style={{ fontFamily: "'Helvetica Neue', 'Inter', sans-serif", fontWeight: 700, fontSize: 'clamp(3rem, 6vw, 5.5rem)', color: 'var(--text-main)', margin: '0 0 1rem', lineHeight: 1 }}>
            Academic <span style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>Foundations</span>
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '1.05rem', color: 'var(--text-muted)', maxWidth: 500, margin: '0 auto' }}>
            A rigorous academic journey through Computer Science and Engineering at VIT Bhopal.
          </p>
        </ScrollReveal>
      </div>

      <div style={{ position: 'relative' }}>
        <div ref={lineRef} className="timeline-center-line" style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'var(--border-color)', transform: 'translateX(-50%)' }} />
        {timelineData.map((item, i) => (
          <TimelineCard key={i} item={item} index={i} />
        ))}
      </div>

      <div style={{ marginTop: 140 }}>
        <ScrollReveal>
          <div style={{ textAlign: 'left', marginBottom: 60 }}>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', letterSpacing: '0.1em', fontWeight: 500, color: 'var(--text-muted)', display: 'block', marginBottom: '1rem', textTransform: 'uppercase' }}>
              / Certifications
            </span>
            <h3 style={{ fontFamily: "'Helvetica Neue', 'Inter', sans-serif", fontWeight: 700, fontSize: '2.5rem', color: 'var(--text-main)', margin: 0 }}>
              Professional Validations
            </h3>
          </div>
        </ScrollReveal>

        <div className="stack-on-mobile" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {certifications.map((cert, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <div 
                style={{ 
                  padding: '32px', 
                  border: '1px solid var(--border-color)', 
                  transition: 'all 0.3s ease',
                  background: 'transparent'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'var(--text-main)';
                  e.currentTarget.style.color = 'var(--bg-color)';
                  const h = e.currentTarget.querySelector('h4') as HTMLElement;
                  if (h) h.style.color = 'var(--bg-color)';
                  const p = e.currentTarget.querySelector('p') as HTMLElement;
                  if (p) p.style.color = 'var(--text-muted)';
                }}
                onMouseLeave={e => {
                   e.currentTarget.style.background = 'transparent';
                   e.currentTarget.style.color = 'var(--text-main)';
                   const h = e.currentTarget.querySelector('h4') as HTMLElement;
                   if (h) h.style.color = 'var(--text-main)';
                   const p = e.currentTarget.querySelector('p') as HTMLElement;
                   if (p) p.style.color = 'var(--text-muted)';
                }}
              >
                <h4 style={{ fontFamily: "'Helvetica Neue', 'Inter', sans-serif", fontWeight: 700, fontSize: '1.2rem', marginBottom: '8px', color: 'var(--text-main)', transition: 'color 0.3s' }}>
                  {cert.title}
                </h4>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>
                  {cert.issuer}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
