import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
const KeyboardScene = lazy(() => import('./KeyboardScene'));

export default function Playground() {
  const root = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false);
  const [typed, setTyped] = useState('');
  const onKey = (key: string) => setTyped(previous => key === 'BACK' ? previous.slice(0, -1) : key === 'ESC' ? '' : key === 'ENTER' ? '' : (previous + (key === 'SPACE' ? ' ' : key.length === 1 ? key : '')).slice(-32));
  const keyHandler = useRef(onKey);
  useEffect(() => { keyHandler.current = onKey; });
  useEffect(() => {
    if (!root.current) return;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setReady(true); observer.disconnect(); }
    }, { rootMargin: '300px' });
    observer.observe(root.current);
    return () => observer.disconnect();
  }, []);
  return (
    <section id="playground" className="playground" ref={root}>
      <div className="playground-topline"><span><i /> INTERACTIVE EXPERIMENT / 001</span><span>BUILT TO BE PLAYED WITH</span></div>
      <div className="playground-heading"><h2>Good things start<br />with a <em>keystroke.</em></h2><p>Software should do more than work.<br />It should make you feel something.<br /><span>Go on. Make your mark.</span></p></div>
      <div className="keyboard-stage">
        <div className="keyboard-orbit" aria-hidden="true" />
        <div className="keyboard-readout" aria-label="Keyboard output">{typed || 'MAKE SOMETHING DIFFERENT.'}<span aria-hidden="true">_</span></div>
        {ready ? <Suspense fallback={<div className="keyboard-loading">ASSEMBLING YOUR PLAYGROUND…</div>}><KeyboardScene onKey={key => keyHandler.current(key)} /></Suspense> : <div className="keyboard-loading">THE NEXT IDEA IS ONE KEY AWAY.</div>}
      </div>
      <div className="playground-bottom"><p><span className="live-dot" /> TYPE ON YOUR KEYBOARD OR TAP A KEY</p><a href="#work">See what I’ve built <ArrowUpRight size={18} /></a></div>
    </section>
  );
}
