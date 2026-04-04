/* ============================================================
   PARARDHA DHAR — Portfolio Script
   Cinematic scroll-driven interactions
   ============================================================ */

'use strict';

/* ── CUSTOM CURSOR ── */
(function () {
  const cursor = document.getElementById('cursor');
  const dot    = document.getElementById('cursor-dot');
  let mx = -100, my = -100;
  let cx = -100, cy = -100;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  // Smooth cursor follow
  function animateCursor() {
    cx += (mx - cx) * 0.12;
    cy += (my - cy) * 0.12;
    cursor.style.left = cx + 'px';
    cursor.style.top  = cy + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover effect on interactive elements
  const hoverTargets = 'a, button, .project-item, .skill-card, .tag';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverTargets)) {
      document.body.classList.add('cursor-hover');
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverTargets)) {
      document.body.classList.remove('cursor-hover');
    }
  });
})();

/* ── INTRO CANVAS — Particle Field ── */
(function () {
  const canvas = document.getElementById('intro-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COUNT = 90;
  const ACCENT = [212, 255, 0];

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x  = Math.random() * W;
      this.y  = init ? Math.random() * H : H + 20;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = -(Math.random() * 0.4 + 0.1);
      this.r  = Math.random() * 1.5 + 0.3;
      this.alpha = Math.random() * 0.6 + 0.1;
      this.life = 0;
      this.maxLife = Math.random() * 300 + 150;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life++;
      if (this.life > this.maxLife || this.y < -20) this.reset(false);
    }
    draw() {
      const t = this.life / this.maxLife;
      const a = this.alpha * (t < 0.2 ? t / 0.2 : t > 0.8 ? (1 - t) / 0.2 : 1);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${ACCENT.join(',')},${a})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  // Draw faint grid lines
  function drawGrid() {
    ctx.strokeStyle = 'rgba(212,255,0,0.025)';
    ctx.lineWidth = 1;
    const step = 80;
    for (let x = 0; x < W; x += step) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += step) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawGrid();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ── ENTER SITE ── */
function enterSite() {
  const intro = document.getElementById('intro');
  const main  = document.getElementById('main');

  intro.style.transition = 'opacity 0.9s cubic-bezier(0.7,0,0.84,0)';
  intro.style.opacity = '0';

  setTimeout(() => {
    intro.style.display = 'none';
    main.style.display  = 'block';
    // Trigger initial reveals
    document.body.style.overflow = 'auto';
    observeReveal();
    initNav();
  }, 900);
}

// Allow scroll on intro too when scrolled
document.addEventListener('wheel', () => {
  if (document.getElementById('intro').style.display !== 'none') {
    enterSite();
  }
}, { once: true });

/* ── NAV SCROLL ── */
function initNav() {
  const nav = document.getElementById('nav');
  function onScroll() {
    if (window.scrollY > 60) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── SCROLL REVEAL ── */
function observeReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-line, .reveal-card, .reveal-project');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  els.forEach(el => obs.observe(el));
}

/* ── PARALLAX HERO BG TEXT ── */
function initParallax() {
  const bgText = document.querySelector('.hero-bg-text');
  if (!bgText) return;
  window.addEventListener('scroll', () => {
    const s = window.scrollY;
    bgText.style.transform = `translate(-50%, calc(-50% + ${s * 0.25}px))`;
  }, { passive: true });
}

/* ── PROJECT ITEM RIPPLE ── */
function initProjectHovers() {
  document.querySelectorAll('.project-item').forEach(item => {
    item.addEventListener('mousemove', e => {
      const rect = item.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
      const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
      item.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(212,255,0,0.04) 0%, transparent 60%)`;
    });
    item.addEventListener('mouseleave', () => {
      item.style.background = '';
    });
  });
}

/* ── MARQUEE PAUSE ON HOVER ── */
function initMarquee() {
  const track = document.getElementById('marquee-track');
  if (!track) return;
  track.addEventListener('mouseenter', () => {
    track.style.animationPlayState = 'paused';
  });
  track.addEventListener('mouseleave', () => {
    track.style.animationPlayState = 'running';
  });
}

/* ── SMOOTH NAV CLICKS ── */
function initSmoothNav() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ── INTRO: GLITCH TEXT EFFECT ── */
function initGlitch() {
  const nameLines = document.querySelectorAll('.name-line');
  nameLines.forEach(line => {
    const orig = line.dataset.text || line.textContent;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    function glitch() {
      let iter = 0;
      const interval = setInterval(() => {
        line.textContent = orig
          .split('')
          .map((c, i) => {
            if (i < iter) return orig[i];
            if (c === ' ') return ' ';
            return chars[Math.floor(Math.random() * chars.length)];
          }).join('');
        if (iter >= orig.length) {
          clearInterval(interval);
          line.textContent = orig;
        }
        iter += 1 / 3;
      }, 30);
    }

    // Glitch once on load after animation
    setTimeout(glitch, 2000);

    // Glitch on hover
    line.closest('.intro-name')?.addEventListener('mouseenter', glitch);
  });
}

/* ── TYPING COUNTER ANIMATION ── */
function animateCounters() {
  const stats = [
    { el: document.querySelector('.stat-num'), target: 3, suffix: '+', delay: 0 },
  ];
  // We'll use a general counter for all .stat-num elements
  document.querySelectorAll('.stat-num').forEach(el => {
    const rawText = el.textContent.trim();
    const num = parseInt(rawText);
    if (isNaN(num)) return;
    const suffix = rawText.replace(/\d/g, '');
    el.textContent = '0' + suffix;

    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        let start = 0;
        const end = num;
        const dur = 1200;
        const step = dur / (end || 1);
        const timer = setInterval(() => {
          start++;
          el.textContent = start + suffix;
          if (start >= end) clearInterval(timer);
        }, step);
        obs.unobserve(el);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
  });
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  initGlitch();
  // Main site functions get called after enterSite()
});

// Called after intro exits
const _origEnter = window.enterSite || function(){};
window.enterSite = function() {
  enterSite();
  setTimeout(() => {
    initParallax();
    initProjectHovers();
    initMarquee();
    initSmoothNav();
    animateCounters();
  }, 950);
};
