import { useEffect, useState } from 'react';
import gsap from 'gsap';

const navLinks = ['About', 'Work', 'Education', 'Tech', 'Contact'];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setProgress(windowHeight > 0 ? (totalScroll / windowHeight) * 100 : 0);
      
      // Sync dark mode state with body class for the toggle UI
      setIsDark(document.body.classList.contains('dark-theme'));
    };
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

  const toggleTheme = () => {
    const body = document.body;
    if (body.classList.contains('dark-theme')) {
      body.classList.remove('dark-theme');
      setIsDark(false);
    } else {
      body.classList.add('dark-theme');
      setIsDark(true);
    }
  };

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          width: '100%',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: scrolled ? '16px 40px' : '24px 40px',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          background: scrolled ? 'var(--nav-bg)' : 'transparent',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--border-light)' : '1px solid transparent',
          color: 'var(--text-main)',
        }}
      >
        {/* Scroll Progress Bar */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '2px',
            width: `${progress}%`,
            background: 'var(--text-main)',
            transition: 'width 0.1s ease',
            zIndex: 101,
          }}
        />

        {/* Logo */}
        <div className="nav-item" style={{ flex: 1 }}>
          <a
            href="#hero"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              fontSize: '0.9rem',
              letterSpacing: '-0.02em',
              color: 'var(--text-main)',
              textDecoration: 'none',
              textTransform: 'uppercase'
            }}
          >
            © PD.
          </a>
        </div>

        {/* Desktop Links */}
        <div className="nav-center" style={{ flex: 2, display: 'flex', justifyContent: 'center', gap: '3rem' }}>
          {navLinks.map(link => {
            const id = link.toLowerCase();
            return (
              <a
                key={link}
                className="nav-item"
                href={`#${id}`}
                style={{
                  fontSize: '0.75rem',
                  letterSpacing: '0.05em',
                  fontWeight: 600,
                  color: active === id ? 'var(--text-main)' : 'var(--text-muted)',
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                  transition: 'color 0.3s',
                  fontFamily: "'Inter', sans-serif",
                  position: 'relative',
                }}
              >
                {link}
              </a>
            );
          })}
        </div>

        {/* Actions (Toggle + Resume + Burger) */}
        <div className="nav-item" style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '20px' }}>
          
          <button 
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label="Toggle Theme"
            style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
          >
            {isDark ? '☼' : '☾'}
          </button>

          <a
            href="/resume.pdf"
            target="_blank"
            rel="noreferrer"
            className="desktop-only"
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--text-main)',
              textDecoration: 'none',
              fontFamily: "'Inter', sans-serif",
              textTransform: 'uppercase',
              border: '1px solid var(--border-color)',
              padding: '8px 16px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'var(--text-main)';
              (e.currentTarget as HTMLElement).style.color = 'var(--bg-color)';
            }}
            onMouseLeave={e => {
               (e.currentTarget as HTMLElement).style.background = 'transparent';
               (e.currentTarget as HTMLElement).style.color = 'var(--text-main)';
            }}
          >
            CV
          </a>

          <div 
            className={`burger ${menuOpen ? 'active' : ''}`} 
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>

      {/* Mobile Nav Overlay */}
      <div className={`mobile-nav-overlay ${menuOpen ? 'active' : ''}`}>
        {navLinks.map((link, i) => (
          <a 
            key={link}
            href={`#${link.toLowerCase()}`}
            className="mobile-link"
            onClick={() => setMenuOpen(false)}
            style={{ transitionDelay: `${i * 0.1}s` }}
          >
            {link}
          </a>
        ))}
        <a 
          href="/resume.pdf" 
          className="mobile-link" 
          style={{ fontSize: '1.5rem', color: 'var(--text-muted)', transitionDelay: '0.5s' }}
        >
          Resume
        </a>
      </div>
    </>
  );
}
