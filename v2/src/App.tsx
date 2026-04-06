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
      background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.1), transparent)',
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
        duration: 2.5,
        ease: 'expo.inOut',
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
          background: 'var(--bg-color)',
          minHeight: '100vh',
          overflowX: 'hidden',
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
