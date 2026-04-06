import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const text1Ref = useRef<HTMLHeadingElement>(null);
  const text2Ref = useRef<HTMLHeadingElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);
  const topTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.2 });
    
    // Parallax effect on mouse move
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5) * 10;
      const yPos = (clientY / window.innerHeight - 0.5) * 10;

      gsap.to(imageRef.current, {
        x: xPos * 1.5,
        y: yPos * 1.5,
        duration: 1,
        ease: 'power2.out',
      });
      
      gsap.to(text1Ref.current, {
        x: xPos * -1,
        duration: 1,
        ease: 'power2.out',
      });
      
      gsap.to(text2Ref.current, {
        x: xPos * -1.5,
        duration: 1,
        ease: 'power2.out',
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Initial cinematic reveal
    tl.from([text1Ref.current, text2Ref.current], {
      y: 100,
      opacity: 0,
      duration: 1.5,
      stagger: 0.2,
      ease: 'expo.out',
    })
    .from(imageRef.current, {
      scale: 0.95,
      opacity: 0,
      duration: 1.5,
      ease: 'expo.out',
    }, '-=1.2')
    .from([topTextRef.current, socialRef.current, infoRef.current], {
      opacity: 0,
      y: 20,
      duration: 1,
      stagger: 0.1,
      ease: 'power2.out',
    }, '-=1');

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section
      id="hero"
      ref={containerRef}
      style={{
        position: 'relative',
        height: '100vh',
        width: '100%',
        padding: '20px',
        background: '#fff', // Base outer background
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Inner Rounded Brutalist Border Matching Reference */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: '#f4f4f4',
        borderRadius: '24px',
        border: '1px solid #111',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
      }}>
        
        {/* Top Minimal Nav Inside the Hero Container */}
        <div ref={topTextRef} style={{
          position: 'absolute',
          top: '30px',
          left: '30px',
          right: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: "'Helvetica Neue', 'Inter', sans-serif",
          fontSize: '0.85rem',
          fontWeight: 500,
          color: '#111',
          zIndex: 5,
        }}>
          <div>© Parardha Dhar & Strategy</div>
          <div style={{ display: 'flex', gap: '40px' }}>
            <a href="#about" style={{ textDecoration: 'none', color: '#111' }}>About</a>
            <a href="#work" style={{ textDecoration: 'none', color: '#111' }}>Projects</a>
          </div>
          <div><a href="#contact" style={{ textDecoration: 'none', color: '#111' }}>Contact</a></div>
        </div>

        {/* Central Portrait Layer */}
        <div
          ref={imageRef}
          style={{
            position: 'absolute',
            bottom: '0',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1,
            width: 'clamp(300px, 45vw, 600px)',
            height: '85%',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
        >
          <img 
            src="/photo.jpg" 
            alt="Parardha Dhar" 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center bottom',
              filter: 'grayscale(100%) contrast(1.15) brightness(1.05)',
            }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://images.unsplash.com/photo-1542044896530-05d85be9b11a?q=80&w=1000&auto=format&fit=crop";
            }}
          />
        </div>

        {/* Floating Typography - Left Side 'Parardha' */}
        <h1
          ref={text1Ref}
          style={{
            position: 'absolute',
            fontFamily: "'Helvetica Neue', 'Inter', sans-serif",
            fontWeight: 500,
            fontSize: 'clamp(100px, 20vw, 30rem)',
            lineHeight: 0.8,
            letterSpacing: '-0.06em',
            color: '#fff',
            mixBlendMode: 'difference',
            top: '50%',
            left: '20%',
            transform: 'translate(-50%, -50%)',
            margin: 0,
            whiteSpace: 'nowrap',
            zIndex: 3,
            pointerEvents: 'none',
          }}
        >
          Parardha
        </h1>

        {/* Floating Typography - Right Side 'Dhar' */}
        <h1
          ref={text2Ref}
          style={{
            position: 'absolute',
            fontFamily: "'Helvetica Neue', 'Inter', sans-serif",
            fontWeight: 500,
            fontSize: 'clamp(100px, 20vw, 30rem)',
            lineHeight: 0.8,
            letterSpacing: '-0.06em',
            color: '#fff',
            mixBlendMode: 'difference',
            top: '50%',
            left: '80%',
            transform: 'translate(-50%, -50%)',
            margin: 0,
            whiteSpace: 'nowrap',
            zIndex: 3,
            pointerEvents: 'none',
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
                color: '#111',
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
                e.currentTarget.style.background = '#111';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#111';
              }}
            >
              {social.label}
            </a>
          ))}
        </div>

        {/* Role / Description - Bottom Right, huge typography matching reference */}
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
            fontSize: 'clamp(1.5rem, 3.5vw, 4rem)',
            lineHeight: 1.05,
            letterSpacing: '-0.04em',
            color: '#111',
            margin: 0,
          }}>
            Creative Explorer<br/>
            Full Stack Dev
          </h2>
        </div>

      </div>
    </section>
  );
}
