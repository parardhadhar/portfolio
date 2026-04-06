import { useEffect, useState } from 'react';
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
      y: -20,
      opacity: 0,
      stagger: 0.1,
      duration: 1.2,
      ease: 'power3.out',
      delay: 0.2,
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
      style={{
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px 40px',
        transition: 'background 0.4s ease, border-color 0.4s ease',
        background: scrolled ? 'rgba(244, 244, 244, 0.9)' : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,0,0,0.05)' : '1px solid transparent',
        color: '#111',
      }}
    >
      <div className="nav-item" style={{ flex: 1 }}>
        <a
          href="#hero"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500,
            fontSize: '0.85rem',
            letterSpacing: '-0.02em',
            color: '#111',
            textDecoration: 'none',
          }}
        >
          © Parardha Dhar
        </a>
      </div>

      <div style={{ flex: 2, display: 'flex', justifyContent: 'center', gap: '3rem' }}>
        {navLinks.map(link => {
          const id = link.toLowerCase();
          return (
            <a
              key={link}
              className="nav-item"
              href={`#${id}`}
              style={{
                fontSize: '0.85rem',
                letterSpacing: '-0.02em',
                color: active === id ? '#111' : '#666',
                textDecoration: 'none',
                transition: 'color 0.3s',
                fontFamily: "'Inter', sans-serif",
                position: 'relative',
              }}
              onMouseEnter={e => {
                if (active !== id)
                  (e.currentTarget as HTMLElement).style.color = '#111';
              }}
              onMouseLeave={e => {
                if (active !== id)
                  (e.currentTarget as HTMLElement).style.color = '#666';
              }}
            >
              {link}
            </a>
          );
        })}
      </div>

      <div className="nav-item" style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
        <a
          href="/Parardha_Dhar_CV_0.pdf"
          target="_blank"
          rel="noreferrer"
          style={{
            fontSize: '0.85rem',
            letterSpacing: '-0.02em',
            color: '#111',
            textDecoration: 'none',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500,
            transition: 'opacity 0.3s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.opacity = '0.6';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.opacity = '1';
          }}
        >
          Resume
        </a>
      </div>
    </nav>
  );
}
