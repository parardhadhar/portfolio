import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const text1Ref = useRef<HTMLHeadingElement>(null);
  const text2Ref = useRef<HTMLHeadingElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.2 });
    
    // Parallax effect on mouse move
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5) * 20;
      const yPos = (clientY / window.innerHeight - 0.5) * 20;

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
        x: xPos * -2,
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
      scale: 0.9,
      opacity: 0,
      duration: 1.5,
      ease: 'expo.out',
    }, '-=1.2')
    .from([socialRef.current, infoRef.current], {
      opacity: 0,
      y: 20,
      duration: 1,
      stagger: 0.2,
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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f4f4f4',
        overflow: 'hidden',
      }}
    >
      {/* Huge Background Typography */}
      <h1
        ref={text1Ref}
        style={{
          position: 'absolute',
          fontFamily: "'Helvetica Neue', 'Inter', sans-serif",
          fontWeight: 700,
          fontSize: '18vw',
          lineHeight: 0.8,
          letterSpacing: '-0.05em',
          color: '#111',
          top: '50%',
          left: '48%',
          transform: 'translate(-50%, -100%)',
          margin: 0,
          whiteSpace: 'nowrap',
          zIndex: 1,
        }}
      >
        Parardha
      </h1>

      {/* Central Portrait Layer */}
      <div
        ref={imageRef}
        style={{
          position: 'relative',
          zIndex: 2,
          width: 'clamp(250px, 35vw, 450px)',
          height: 'clamp(350px, 45vw, 600px)',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        <img 
          src="/photo.jpg" 
          alt="Parardha Dhar" 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'grayscale(100%) contrast(1.1) brightness(1.05)',
          }}
          onError={(e) => {
            // Fallback if photo placeholder is missing
            const target = e.target as HTMLImageElement;
            target.src = "https://images.unsplash.com/photo-1542044896530-05d85be9b11a?q=80&w=1000&auto=format&fit=crop";
          }}
        />
        {/* Subtle inner shadow for the image */}
        <div style={{
          position: 'absolute',
          inset: 0,
          boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)',
          borderRadius: '12px',
          pointerEvents: 'none'
        }} />
      </div>

      {/* Foreground Huge Typography Overlay (Blend difference creates the cutout effect) */}
      <h1
        ref={text2Ref}
        className="blend-difference"
        style={{
          position: 'absolute',
          fontFamily: "'Helvetica Neue', 'Inter', sans-serif",
          fontWeight: 700,
          fontSize: '18vw',
          lineHeight: 0.8,
          letterSpacing: '-0.05em',
          top: '50%',
          left: '52%',
          transform: 'translate(-50%, 0)',
          margin: 0,
          whiteSpace: 'nowrap',
          zIndex: 3,
        }}
      >
        Dhar
      </h1>

      {/* Social Links - Left */}
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
        {['tw', 'in', 'ig'].map((social) => (
          <a
            key={social}
            href="#"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.75rem',
              fontWeight: 500,
              textTransform: 'uppercase',
              color: '#111',
              textDecoration: 'none',
              letterSpacing: '0.05em',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.5')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            {social}
          </a>
        ))}
      </div>

      {/* Role / Description - Right */}
      <div
        ref={infoRef}
        style={{
          position: 'absolute',
          bottom: '40px',
          right: '40px',
          textAlign: 'right',
          zIndex: 4,
        }}
      >
        <h2 style={{
          fontFamily: "'Helvetica Neue', 'Inter', sans-serif",
          fontWeight: 500,
          fontSize: '2rem',
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
          color: '#111',
          margin: 0,
        }}>
          Creative Technologist<br/>
          Full Stack Dev
        </h2>
      </div>

    </section>
  );
}
