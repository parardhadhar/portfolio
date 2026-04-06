import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textBehind = useRef<HTMLHeadingElement>(null);
  const textFront = useRef<HTMLHeadingElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);
  const introOverlayRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLSpanElement>(null);

  const roles = ["Full Stack Dev", "Unreal Engine Dev", "ML Engineer"];
  const [roleIndex, setRoleIndex] = useState(0);

  // Role cycling typewriter effect
  useEffect(() => {
    const interval = setInterval(() => {
      gsap.to(roleRef.current, {
        y: -15,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => {
          setRoleIndex((prev) => (prev + 1) % roles.length);
          gsap.fromTo(roleRef.current, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' });
        }
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const tl = gsap.timeline();

    // Initial cinematic loading reveal
    tl.to(introOverlayRef.current, {
      yPercent: -100,
      duration: 1.5,
      ease: 'power4.inOut',
      delay: 0.2,
    })
      .from([textBehind.current, textFront.current], {
        scale: 1.1,
        filter: 'blur(10px)',
        opacity: 0,
        duration: 1.5,
        ease: 'power3.out',
      }, '-=0.5')
      .from(imageRef.current, {
        scale: 0.95,
        y: 100,
        opacity: 0,
        duration: 1.8,
        ease: 'power4.out',
      }, '-=1.2')
      .from([socialRef.current, infoRef.current, scrollCueRef.current], {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: 'power2.out',
        stagger: 0.1
      }, '-=1');

    // Subtle floating breathing effect on the image
    gsap.to(imageRef.current, {
      y: '+=15',
      duration: 3,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    });
    
    // Scroll Indicator bounce
    gsap.to(scrollCueRef.current, {
      y: '+=8',
      duration: 1.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    });

    // Advanced Parallax effect on mouse move with quick tilt
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5) * 10;
      const yPos = (clientY / window.innerHeight - 0.5) * 10;

      // Mouse parallax overlays with breathing animation safely
      gsap.to(imageRef.current, { x: xPos * 2, y: yPos * 1, rotate: xPos * 0.1, duration: 1, ease: 'power2.out' });
      gsap.to([textBehind.current, textFront.current], { x: xPos * -3, y: yPos * -1.5, duration: 1, ease: 'power2.out' });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const textStyle: React.CSSProperties = {
    position: 'absolute',
    fontFamily: "'Inter', sans-serif",
    fontWeight: 400, // Slightly bolder for impact
    fontSize: 'clamp(3rem, 16vw, 25rem)', // Scaled to full horizontal space
    lineHeight: 0.85,
    letterSpacing: '-0.06em',
    top: '50%', // Anchored exactly to the middle horizontally
    left: '50%',
    width: '100%',
    textAlign: 'center',
    transform: 'translate(-50%, -50%)',
    margin: 0,
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
  };

  return (
    <>
      {/* Intro Black Overlay */}
      <div
        ref={introOverlayRef}
        style={{
          position: 'fixed',
          inset: 0,
          background: '#050505',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Inter', sans-serif",
          color: 'var(--bg-color)',
          fontSize: '1rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
        }}
      >
        <div className="animate-pulse">Loading Cinematic Experience</div>
      </div>

      <section
        id="hero"
        ref={containerRef}
        style={{
          position: 'relative',
          height: '100vh',
          width: '100%',
          background: 'var(--bg-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          transition: 'background 1.5s ease',
        }}
      >
        {/* Subtle CSS Noise Grain for premium photography feel */}
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.03,
          pointerEvents: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          zIndex: 0
        }} />

        {/* TEXT BEHIND IMAGE */}
        <h1
          ref={textBehind}
          style={{ ...textStyle, color: 'var(--text-main)', zIndex: 1 }}
        >
          Parardha Dhar
        </h1>

        {/* CENTRAL IMAGE WITH TRANSPARENT BG */}
        <div
          style={{
            position: 'absolute',
            bottom: '0px', 
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2,
            height: '105vh', // Hard-anchor scaling so it completely stretches high
            width: '100vw', 
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            pointerEvents: 'none', 
          }}
        >
          <img
            ref={imageRef}
            src="/photo.png"
            alt="Parardha Dhar"
            style={{
              height: '100%', 
              width: 'auto', 
              maxWidth: 'none', // Disallow any horizontal choking
              objectFit: 'contain',
              objectPosition: 'center bottom',
              filter: 'grayscale(100%) contrast(1.15) brightness(1.05)',
            }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://images.unsplash.com/photo-1542044896530-05d85be9b11a?q=80&w=1000&auto=format&fit=crop";
            }}
          />
        </div>

        {/* TEXT IN FRONT OF IMAGE (STROKED) */}
        <h1
          ref={textFront}
          style={{
            ...textStyle,
            color: 'transparent',
            WebkitTextStroke: '2px var(--text-main)',
            zIndex: 3
          }}
        >
          Parardha Dhar
        </h1>

        {/* Social Links - Bottom Left */}
        <div
          ref={socialRef}
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '40px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            zIndex: 4,
          }}
        >
          {[
            { icon: 'x', label: '𝕏' },
            { icon: 'in', label: 'in' },
            { icon: 'ig', label: 'ig' }
          ].map((social) => (
            <a
              key={social.icon}
              href="#"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '1rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                textDecoration: 'none',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--border-color)',
                borderRadius: '50%',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                background: 'transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--text-main)';
                e.currentTarget.style.color = 'var(--bg-color)';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--text-main)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {social.label}
            </a>
          ))}
        </div>

        {/* Centered Intentional Info & Role (Replaces detached right element) */}
        <div
          ref={infoRef}
          style={{
            position: 'absolute',
            bottom: '60px',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            zIndex: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <h2 style={{
            fontFamily: "'Helvetica Neue', 'Inter', sans-serif",
            fontWeight: 500,
            fontSize: 'clamp(0.9rem, 1.2vw, 1.5rem)',
            color: 'var(--text-main)',
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            Creative Explorer <span style={{ color: 'var(--text-muted)' }}>|</span> 
            <span ref={roleRef} style={{ display: 'inline-block', minWidth: '200px', textAlign: 'left', fontWeight: 600 }}>
              {roles[roleIndex]}
            </span>
          </h2>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.9rem',
            color: 'var(--text-muted)',
            margin: 0,
            letterSpacing: '0.05em',
            fontStyle: 'italic'
          }}>
            Building where 3D meets the web.
          </p>
        </div>

        {/* Scroll Cue Indicator */}
        <div
          ref={scrollCueRef}
          style={{
            position: 'absolute',
            bottom: '15px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            opacity: 0.6
          }}
        >
          <div style={{ width: '1px', height: '24px', background: 'var(--text-muted)' }} />
        </div>

      </section>
    </>
  );
}
