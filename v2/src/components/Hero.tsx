import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textBehind = useRef<HTMLHeadingElement>(null);
  const textFront = useRef<HTMLHeadingElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);
  const introOverlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial setups for safe transforms
    gsap.set([textBehind.current, textFront.current], { xPercent: -50, yPercent: -50 });
    gsap.set(imageRef.current, { xPercent: -50 });

    const tl = gsap.timeline();

    // Initial cinematic loading reveal
    tl.to(introOverlayRef.current, {
      yPercent: -100,
      duration: 1.5,
      ease: 'power4.inOut',
      delay: 0.5,
    })
      .from([textBehind.current, textFront.current], {
        y: 150,
        opacity: 0,
        duration: 1.5,
        ease: 'expo.out',
      }, '-=0.5')
      .from(imageRef.current, {
        scale: 0.95,
        y: 100,
        opacity: 0,
        duration: 1.8,
        ease: 'expo.out',
      }, '-=1.2')
      .from([socialRef.current, infoRef.current], {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: 'power2.out',
      }, '-=1');

    // Subtle floating breathing effect on the image
    gsap.to(imageRef.current, {
      y: '+=15',
      duration: 3,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    });

    // Parallax effect on mouse move
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { clientX } = e;
      const xPos = (clientX / window.innerWidth - 0.5) * 10;

      // Mouse parallax overlays with breathing animation safely
      gsap.to(imageRef.current, { x: xPos * 1.5, rotate: xPos * 0.1, duration: 1, ease: 'power2.out' });
      gsap.to([textBehind.current, textFront.current], { x: xPos * -2, duration: 1, ease: 'power2.out' });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const textStyle: React.CSSProperties = {
    position: 'absolute',
    fontFamily: "'Inter', sans-serif",
    fontWeight: 300, // Minimalistic elegant weight
    fontSize: 'clamp(5rem, 15vw, 20rem)', 
    lineHeight: 0.85,
    letterSpacing: '-0.06em',
    top: '40%',
    left: '50%',
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
            width: 'clamp(300px, 60vw, 850px)',
            height: '90%', 
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            pointerEvents: 'none', // Allow clicks to pass through
          }}
        >
          <img
            ref={imageRef}
            src="/photo.png"
            alt="Parardha Dhar"
            style={{
              width: '100%',
              height: '100%',
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
                borderRadius: '50%', // Circle icons are sleeker
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

        {/* Role / Description - Bottom Right tightly styled */}
        <div
          ref={infoRef}
          style={{
            position: 'absolute',
            bottom: '40px',
            right: '40px',
            textAlign: 'right', // Align right
            zIndex: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div style={{ width: '40px', height: '1px', background: 'var(--text-main)', margin: '0 0 8px auto' }} />
          <h2 style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 400,
            fontSize: '1rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--text-main)',
            margin: 0,
          }}>
            Creative Explorer
          </h2>
          <span style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 300,
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.05em',
          }}>
            Full Stack Developer & Designer
          </span>
        </div>
      </section>
    </>
  );
}
