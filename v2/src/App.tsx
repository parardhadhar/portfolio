import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Work from './components/Work';
import EducationTimeline from './components/EducationTimeline';
import TechStack from './components/TechStack';
import Contact from './components/Contact';
import Footer from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

const Divider = () => (
  <div
    className="section-divider"
    style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 40px',
      height: 1,
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
    }}
  />
);

function App() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';

    gsap.utils.toArray<HTMLElement>('.section-divider').forEach(div => {
      gsap.from(div, {
        scaleX: 0,
        transformOrigin: 'left',
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: { trigger: div, start: 'top 85%', once: true },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <>
      <CustomCursor />
      <div
        style={{
          background: '#04000a',
          minHeight: '100vh',
          overflowX: 'hidden',
          cursor: 'none',
        }}
      >
        <Navbar />
        <main>
          <Hero />
          <Divider />
          <About />
          <Divider />
          <Work />
          <Divider />
          <EducationTimeline />
          <Divider />
          <TechStack />
          <Divider />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;
