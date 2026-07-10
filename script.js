/* ============================================
   SUPAI Landing Page — Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  initMobileMenu();
  initScrollReveal();
  initHeaderScroll();
  initFaqAccordion();
  initHeroTyping();
  initSmoothAnchors();

  if (!reduceMotion) {
    initHero3D();
    initCardTilt();
    initParallaxOrbs();
    initMagneticButtons();
  }
});

function initMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('nav--open');
    toggle.classList.toggle('menu-toggle--active', isOpen);
    toggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('nav--open');
      toggle.classList.remove('menu-toggle--active');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('header--scrolled', window.scrollY > 20);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -32px 0px' }
  );

  reveals.forEach(el => observer.observe(el));
}

function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');

  items.forEach(item => {
    const question = item.querySelector('.faq-item__question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('faq-item--open');

      items.forEach(other => {
        other.classList.remove('faq-item--open');
        const btn = other.querySelector('.faq-item__question');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('faq-item--open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

function initHeroTyping() {
  const replyEl = document.getElementById('heroReply');
  const textEl = document.getElementById('heroReplyText');
  if (!replyEl || !textEl) return;

  const fullText = 'מצאתי. #1045 נשלחה. מעקב: 123456789. הגעה: 2–4 ימי עסקים.';
  let charIndex = 0;
  let started = false;

  const typeChar = () => {
    if (charIndex < fullText.length) {
      textEl.textContent += fullText[charIndex];
      charIndex++;
      setTimeout(typeChar, 28);
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !started) {
          started = true;
          setTimeout(() => {
            replyEl.classList.add('visible');
            typeChar();
          }, 1000);
          observer.disconnect();
        }
      });
    },
    { threshold: 0.4 }
  );

  observer.observe(replyEl);
}

function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (!id || id === '#') return;

      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      const headerHeight = window.innerWidth <= 768 ? 64 : 76;
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* 3D hero scene — follows mouse */
function initHero3D() {
  const showcase = document.getElementById('heroShowcase');
  const stage = showcase?.querySelector('.hero-showcase__stage');
  const phone = showcase?.querySelector('[data-tilt-phone]');
  if (!showcase || !stage || !phone) return;
  if (window.innerWidth < 1024) return;

  let raf = null;
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  const render = () => {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;

    const t = performance.now() / 1000;
    const idleY = Math.sin(t * 0.8) * 6;
    const idleRot = Math.sin(t * 0.5) * 1.5;

    stage.style.transform = `
      perspective(1200px)
      rotateY(${currentX * 8 + idleRot}deg)
      rotateX(${-currentY * 6}deg)
      translateY(${idleY * 0.3}px)
    `;

    phone.style.transform = `
      translateZ(40px)
      rotateY(${currentX * 4}deg)
      rotateX(${-currentY * 3}deg)
      translateY(${idleY}px)
    `;

    const badge = showcase.querySelector('.sync-badge');
    if (badge) {
      badge.style.transform = `
        translateZ(60px)
        translateY(${currentY * 10 - idleY * 0.5}px)
        translateX(${currentX * 14}px)
      `;
    }

    raf = requestAnimationFrame(render);
  };

  showcase.addEventListener('mousemove', (e) => {
    const rect = showcase.getBoundingClientRect();
    targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
  });

  showcase.addEventListener('mouseleave', () => {
    targetX = 0;
    targetY = 0;
  });

  raf = requestAnimationFrame(render);
}

/* Soft 3D tilt on cards */
function initCardTilt() {
  if (window.innerWidth < 768) return;

  const cards = document.querySelectorAll(
    '.feature-card, .step-card, .pricing-card, .compare-card, .problem-card, .demo-chat .phone-mockup'
  );

  cards.forEach(card => {
    card.classList.add('card-3d');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotX = (0.5 - y) * 10;
      const rotY = (x - 0.5) * 12;

      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px) scale(1.02)`;

      const glare = card.querySelector('.card-3d__glare');
      if (glare) {
        glare.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.35), transparent 55%)`;
        glare.style.opacity = '1';
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      const glare = card.querySelector('.card-3d__glare');
      if (glare) glare.style.opacity = '0';
    });

    if (!card.querySelector('.card-3d__glare')) {
      const glare = document.createElement('div');
      glare.className = 'card-3d__glare';
      card.appendChild(glare);
    }
  });
}

/* Parallax orbs on scroll */
function initParallaxOrbs() {
  const orbs = document.querySelectorAll('.hero__orb');
  if (!orbs.length) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      orbs.forEach((orb, i) => {
        const speed = 0.08 + i * 0.04;
        orb.style.transform = `translateY(${y * speed}px)`;
      });
      ticking = false;
    });
  }, { passive: true });
}

/* Magnetic CTA buttons */
function initMagneticButtons() {
  if (window.innerWidth < 1024) return;

  document.querySelectorAll('.btn--primary, .btn--lg').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.2 - 2}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}
