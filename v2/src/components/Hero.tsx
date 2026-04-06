import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Instagram, Github, Linkedin, ChevronDown } from 'lucide-react';

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

    tl.to(introOverlayRef.current, {
      yPercent: -100,
      duration: 1.5,
      ease: 'power4.inOut',
      delay: 0.2,
    })
      .from([textBehind.current, textFront.current], {
        scale: 1.05,
        opacity: 0,
        duration: 1.5,
        ease: 'power3.out',
      }, '-=0.5')
      .from(imageRef.current, {
        scale: 0.98,
        y: 60,
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

    gsap.to(imageRef.current, {
      y: '+=10',
      duration: 4,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    });
    
    gsap.to(scrollCueRef.current, {
      y: '+=5',
      duration: 1.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    });

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5) * 20;
      const yPos = (clientY / window.innerHeight - 0.5) * 10;

      gsap.to(imageRef.current, { x: xPos * 1, y: yPos * 0.5, rotate: xPos * 0.05, duration: 1.2, ease: 'power2.out' });
      gsap.to([textBehind.current, textFront.current], { x: xPos * -2, y: yPos * -1.2, duration: 1.2, ease: 'power2.out' });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const textStyle: React.CSSProperties = {
    position: 'absolute',
    fontFamily: "'Helvetica Neue', 'Inter', sans-serif",
    fontWeight: 900,
    fontSize: 'clamp(4.5rem, 18vw, 24rem)', 
    lineHeight: 0.8,
    letterSpacing: '-0.07em',
    top: '52%', // Adjusted slightly lower for optimal visual balance with portrait
    left: '50%',
    width: '100%',
    textAlign: 'center',
    transform: 'translate(-50%, -50%)',
    margin: 0,
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
    textTransform: 'uppercase',
  };

  return (
    <>
      <div
        ref={introOverlayRef}
        style={{
          position: 'fixed',
          inset: 0,
          background: '#0a0a0a',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Inter', sans-serif",
          color: '#fff',
          fontSize: '0.7rem',
          letterSpacing: '0.4em',
          textTransform: 'uppercase',
        }}
      >
        <div className="animate-pulse">PARARDHA DHAR // CORE v2.0</div>
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
        }}
      >
        {/* TEXT BEHIND IMAGE */}
        <h1
          ref={textBehind}
          className="hero-name theme-trans"
          style={{ ...textStyle, color: 'var(--text-main)', zIndex: 1 }}
        >
          Parardha Dhar
        </h1>

        {/* CENTRAL IMAGE - Reframed and Perfectly Centered */}
        <div
          style={{
            position: 'absolute',
            bottom: '0', 
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2,
            height: '100vh',
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
              height: '92vh', 
              width: 'auto', 
              objectFit: 'contain',
              filter: 'grayscale(100%) contrast(1.1) brightness(1.05)',
            }}
          />
        </div>

        {/* TEXT IN FRONT OF IMAGE (STROKED) */}
        <h1
          ref={textFront}
          className="hero-name theme-trans"
          style={{
            ...textStyle,
            color: 'transparent',
            WebkitTextStroke: '1px var(--text-main)',
            zIndex: 3
          }}
        >
          Parardha Dhar
        </h1>

        {/* Social Links - Bottom Left - Visual Icons */}
        <div
          ref={socialRef}
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '40px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            zIndex: 4,
          }}
        >
          {[
            { icon: <Instagram size={20} />, label: 'Instagram', href: 'https://www.instagram.com/parardha.er/' },
            { icon: <Github size={20} />, label: 'Github', href: 'https://github.com/parardhadhar' },
            { icon: <Linkedin size={20} />, label: 'Linkedin', href: 'https://linkedin.com/in/parardhadhar' }
          ].map((social, i) => (
            <a
              key={i}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              aria-label={social.label}
              style={{
                color: 'var(--text-main)',
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--border-color)',
                borderRadius: '50%',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                background: 'transparent'
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
              {social.icon}
            </a>
          ))}
        </div>

        {/* Editorial Role Info - Bottom Right */}
        <div
          ref={infoRef}
          style={{
            position: 'absolute',
            bottom: '50px',
            right: '50px',
            textAlign: 'right',
            zIndex: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '8px',
          }}
        >
          <div style={{ overflow: 'hidden' }}>
            <p style={{
              fontFamily: "'Helvetica Neue', 'Inter', sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(1rem, 2.5vw, 2.2rem)',
              color: 'var(--text-main)',
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              lineHeight: 0.9,
            }}>
              Creative Explorer
            </p>
          </div>
          <div style={{ overflow: 'hidden', minHeight: '1.5em', display: 'flex', alignItems: 'center' }}>
            <span 
              ref={roleRef} 
              style={{ 
                fontFamily: "'Inter', sans-serif", 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: 'var(--text-muted)',
                letterSpacing: '0.15em',
                textTransform: 'uppercase'
              }}
            >
              / {roles[roleIndex]}
            </span>
          </div>
          <div style={{ 
            marginTop: '12px', 
            width: '60px', 
            height: '1px', 
            background: 'var(--text-main)',
            opacity: 0.3 
          }} />
        </div>

        {/* Scroll Cue Indicator */}
        <div
          ref={scrollCueRef}
          style={{
            position: 'absolute',
            bottom: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <span style={{ fontFamily: "Inter", fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3em', color: 'var(--text-muted)' }}>Explore</span>
          <ChevronDown size={20} color="var(--text-muted)" strokeWidth={1.5} />
        </div>

      </section>
    </>
  );
}
