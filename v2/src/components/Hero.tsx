import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textLeftBehind = useRef<HTMLHeadingElement>(null);
  const textRightBehind = useRef<HTMLHeadingElement>(null);
  const textLeftFront = useRef<HTMLHeadingElement>(null);
  const textRightFront = useRef<HTMLHeadingElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);
  const introOverlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // Initial cinematic loading reveal
    tl.to(introOverlayRef.current, {
      yPercent: -100,
      duration: 1.5,
      ease: 'power4.inOut',
      delay: 0.5,
    })
      .from([textLeftBehind.current, textRightBehind.current, textLeftFront.current, textRightFront.current], {
        y: 150,
        opacity: 0,
        duration: 1.5,
        stagger: 0.1,
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

    // Parallax effect on mouse move
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5) * 10;
      const yPos = (clientY / window.innerHeight - 0.5) * 10;

      gsap.to(imageRef.current, { x: xPos * 1.5, y: yPos * 1.5, duration: 1, ease: 'power2.out' });
      gsap.to([textLeftBehind.current, textLeftFront.current], { x: xPos * -1.5, duration: 1, ease: 'power2.out' });
      gsap.to([textRightBehind.current, textRightFront.current], { x: xPos * -2, duration: 1, ease: 'power2.out' });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const textStyle: React.CSSProperties = {
    position: 'absolute',
    fontFamily: "'Helvetica Neue', 'Inter', sans-serif",
    fontWeight: 500,
    fontSize: 'clamp(100px, 20vw, 30rem)',
    lineHeight: 0.8,
    letterSpacing: '-0.06em',
    top: '45%',
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
        }}
      >
        {/* TEXT BEHIND IMAGE */}
        <h1
          ref={textLeftBehind}
          style={{ ...textStyle, color: 'var(--text-main)', left: '20%', transform: 'translate(-50%, -50%)', zIndex: 1 }}
        >
          Parardha
        </h1>
        <h1
          ref={textRightBehind}
          style={{ ...textStyle, color: 'var(--text-main)', left: '80%', transform: 'translate(-50%, -50%)', zIndex: 1 }}
        >
          Dhar
        </h1>

        {/* CENTRAL IMAGE WITH TRANSPARENT BG */}
        <div
          ref={imageRef}
          style={{
            position: 'absolute',
            bottom: '0px', // Anchor to exact bottom
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2,
            width: 'clamp(300px, 45vw, 600px)',
            height: '85%',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
        >
          <img
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
          ref={textLeftFront}
          style={{
            ...textStyle,
            color: 'transparent',
            WebkitTextStroke: '2px #111',
            left: '20%',
            transform: 'translate(-50%, -50%)',
            zIndex: 3
          }}
        >
          Parardha
        </h1>
        <h1
          ref={textRightFront}
          style={{
            ...textStyle,
            color: 'transparent',
            WebkitTextStroke: '2px #111',
            left: '80%',
            transform: 'translate(-50%, -50%)',
            zIndex: 3
          }}
        >
          Dhar
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
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1.5px solid #111',
                borderRadius: '4px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--text-main)';
                e.currentTarget.style.color = 'var(--bg-color)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--text-main)';
              }}
            >
              {social.label}
            </a>
          ))}
        </div>

        {/* Role / Description - Bottom Right */}
        <div
          ref={infoRef}
          style={{
            position: 'absolute',
            bottom: '40px',
            right: '40px',
            textAlign: 'left',
            zIndex: 4,
          }}
        >
          <h2 style={{
            fontFamily: "'Helvetica Neue', 'Inter', sans-serif",
            fontWeight: 500,
            fontSize: 'clamp(1.5rem, 3.5vw, 3.5rem)',
            lineHeight: 1.05,
            letterSpacing: '-0.04em',
            color: 'var(--text-main)',
            margin: 0,
          }}>
            Creative Explorer<br />
            Full Stack Dev
          </h2>
        </div>
      </section>
    </>
  );
}
