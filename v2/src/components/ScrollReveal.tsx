import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  from?: 'bottom' | 'left' | 'right' | 'fade';
  threshold?: number;
}

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  from = 'bottom',
  threshold = 0.2,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fromVars: gsap.TweenVars = { opacity: 0, duration: 1, delay };
    if (from === 'bottom') fromVars.y = 60;
    if (from === 'left') fromVars.x = -60;
    if (from === 'right') fromVars.x = 60;

    const ctx = gsap.context(() => {
      gsap.from(el, {
        ...fromVars,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: `top ${(1 - threshold) * 100}%`,
          once: true,
        },
      });
    });

    return () => ctx.revert();
  }, [delay, from, threshold]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
