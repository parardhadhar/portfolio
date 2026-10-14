import { useEffect, useRef, useState } from 'react';
import { Menu, X, Sun, Moon, ArrowUpRight } from 'lucide-react';

const navLinks = ['About', 'Work', 'Education', 'Tech', 'Contact'];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    try { return localStorage.getItem('portfolio-theme') === 'dark'; } catch { return false; }
  });
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.body.classList.toggle('dark-theme', isDark);
    try { localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light'); } catch { /* Storage may be disabled. */ }
  }, [isDark]);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    menuRef.current?.querySelector<HTMLAnchorElement>('a')?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
      if (event.key === 'Tab') {
        const links = Array.from(menuRef.current?.querySelectorAll<HTMLAnchorElement>('a') ?? []);
        const controls = [toggleRef.current, ...links].filter((el): el is HTMLButtonElement | HTMLAnchorElement => el !== null);
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    const media = window.matchMedia('(min-width: 901px)');
    const onResize = () => { if (media.matches) setMenuOpen(false); };
    document.addEventListener('keydown', onKey);
    media.addEventListener('change', onResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKey);
      media.removeEventListener('change', onResize);
    };
  }, [menuOpen]);

  const closeMenu = () => { setMenuOpen(false); toggleRef.current?.focus(); };
  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Main navigation">
        <a className="wordmark" href="#hero" onClick={closeMenu}>PARARDHA DHAR<span>.</span></a>
        <div className="desktop-nav">{navLinks.map(link => <a key={link} href={`#${link.toLowerCase()}`}>{link}</a>)}</div>
        <div className="nav-actions">
          <button className="icon-button" onClick={() => setIsDark(!isDark)} aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}>{isDark ? <Sun size={19} /> : <Moon size={19} />}</button>
          <a className="resume-link" href="/Parardha_Dhar_SDE_Resume.pdf" target="_blank" rel="noreferrer">Resume <ArrowUpRight size={16} /></a>
          <button ref={toggleRef} className="icon-button menu-toggle" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
        </div>
      </nav>
      <div id="mobile-navigation" className="mobile-menu" ref={menuRef} hidden={!menuOpen}>
        <p className="eyebrow">EXPLORE</p>
        {navLinks.map((link, index) => <a key={link} href={`#${link.toLowerCase()}`} onClick={closeMenu}><span>0{index + 1}</span>{link}<ArrowUpRight size={22} /></a>)}
        <a href="/Parardha_Dhar_SDE_Resume.pdf" target="_blank" rel="noreferrer" onClick={closeMenu}><span>↗</span>Resume<ArrowUpRight size={22} /></a>
      </div>
    </header>
  );
}
