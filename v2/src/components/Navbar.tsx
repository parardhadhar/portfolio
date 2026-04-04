import { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';
import gsap from 'gsap';

const navLinks = ['About', 'Work', 'Education', 'Tech', 'Contact'];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });

    // Animate in
    gsap.from('.nav-item', {
      y: -30,
      opacity: 0,
      stagger: 0.08,
      duration: 0.8,
      ease: 'power3.out',
      delay: 0.5,
    });

    // Active section tracking
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { threshold: 0.4 }
    );
    sections.forEach(s => observer.observe(s));

    return () => {
      window.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <nav
      className="nav-item"
      style={{
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 40px',
        transition: 'background 0.4s ease, border-color 0.4s ease',
        background: scrolled ? 'rgba(4, 0, 10, 0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : '1px solid transparent',
      }}
    >
      <a
        href="#hero"
        style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
          fontSize: '1.1rem',
          letterSpacing: '0.15em',
          color: '#fff',
          textDecoration: 'none',
        }}
      >
        P·D
      </a>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        {navLinks.map(link => {
          const id = link.toLowerCase();
          return (
            <a
              key={link}
              href={`#${id}`}
              style={{
                fontSize: '0.75rem',
                letterSpacing: '0.08em',
                color: active === id ? '#d4ff00' : 'rgba(200,200,220,0.6)',
                textDecoration: 'none',
                transition: 'color 0.3s',
                fontFamily: "'Inter', sans-serif",
                position: 'relative',
              }}
              onMouseEnter={e => {
                if (active !== id)
                  (e.currentTarget as HTMLElement).style.color = '#fff';
              }}
              onMouseLeave={e => {
                if (active !== id)
                  (e.currentTarget as HTMLElement).style.color = 'rgba(200,200,220,0.6)';
              }}
            >
              {link}
              {active === id && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: -4,
                    left: 0,
                    width: '100%',
                    height: 1,
                    background: '#d4ff00',
                  }}
                />
              )}
            </a>
          );
        })}

        <a
          href="/Parardha_Dhar_CV_0.pdf"
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            border: '1px solid rgba(255,255,255,0.2)',
            padding: '8px 20px',
            borderRadius: '100px',
            fontSize: '0.7rem',
            color: '#ccc',
            textDecoration: 'none',
            transition: 'all 0.3s',
            fontFamily: "'Inter', sans-serif",
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = '#d4ff00';
            el.style.color = '#d4ff00';
            el.style.boxShadow = '0 0 20px rgba(212,255,0,0.15)';
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = 'rgba(255,255,255,0.2)';
            el.style.color = '#ccc';
            el.style.boxShadow = 'none';
          }}
        >
          <FileText size={13} /> CV
        </a>
      </div>
    </nav>
  );
}
