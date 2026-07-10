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
    initScrollDepth();
    initPointerGlow();
    initMobileWow();
  }

  initMobileStickyCta();
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

/* 3D hero scene — follows mouse with depth layers */
function initHero3D() {
  const showcase = document.getElementById('heroShowcase');
  const stage = showcase?.querySelector('.hero-showcase__stage');
  const phone = showcase?.querySelector('[data-tilt-phone]');
  const orbit = showcase?.querySelector('.hero-orbit');
  if (!showcase || !stage || !phone) return;
  if (window.innerWidth < 1024) return;

  let raf = null;
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  const render = () => {
    currentX += (targetX - currentX) * 0.1;
    currentY += (targetY - currentY) * 0.1;

    const t = performance.now() / 1000;
    const idleY = Math.sin(t * 0.9) * 8;
    const idleRot = Math.sin(t * 0.55) * 2.2;
    const idleX = Math.cos(t * 0.4) * 1.2;

    stage.style.transform = `
      perspective(1400px)
      rotateY(${currentX * 14 + idleRot}deg)
      rotateX(${-currentY * 10 + idleX}deg)
      translateY(${idleY * 0.25}px)
      translateZ(${Math.abs(currentX) * 20}px)
    `;

    phone.style.transform = `
      translateZ(${60 + Math.abs(currentY) * 30}px)
      rotateY(${currentX * 7}deg)
      rotateX(${-currentY * 5}deg)
      translateY(${idleY}px)
      scale(${1 + Math.abs(currentX) * 0.02})
    `;

    if (orbit) {
      orbit.style.transform = `
        translateZ(${-40 + currentX * 20}px)
        rotateY(${currentX * -6}deg)
        rotateX(${currentY * 4}deg)
      `;
    }

    const badge = showcase.querySelector('.sync-badge');
    if (badge) {
      badge.style.transform = `
        translateZ(${90 + Math.abs(currentX) * 20}px)
        translateY(${currentY * 16 - idleY * 0.6}px)
        translateX(${currentX * 22}px)
        rotateY(${currentX * -8}deg)
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

/* Soft 3D tilt on cards — lerped, with layered icons */
function initCardTilt() {
  if (window.innerWidth < 768) return;

  const cards = document.querySelectorAll(
    '.feature-card, .step-card, .pricing-card, .compare-card, .problem-card, .demo-chat .phone-mockup, .credibility-item'
  );

  cards.forEach(card => {
    card.classList.add('card-3d');

    let raf = null;
    let targetRX = 0;
    let targetRY = 0;
    let currentRX = 0;
    let currentRY = 0;
    let targetX = 0.5;
    let targetY = 0.5;
    let hovering = false;

    if (!card.querySelector('.card-3d__glare')) {
      const glare = document.createElement('div');
      glare.className = 'card-3d__glare';
      card.appendChild(glare);
    }

    const glare = card.querySelector('.card-3d__glare');
    const icon = card.querySelector(
      '.feature-card__icon, .step-card__icon, .problem-card__icon, .credibility-item__icon'
    );

    const tick = () => {
      currentRX += (targetRX - currentRX) * 0.14;
      currentRY += (targetRY - currentRY) * 0.14;

      if (hovering) {
        card.style.transform = `
          perspective(900px)
          rotateX(${currentRX}deg)
          rotateY(${currentRY}deg)
          translateY(-10px)
          translateZ(18px)
          scale(1.035)
        `;

        if (glare) {
          glare.style.background = `radial-gradient(circle at ${targetX * 100}% ${targetY * 100}%, rgba(255,255,255,0.45), transparent 50%)`;
          glare.style.opacity = '1';
        }

        if (icon) {
          icon.style.transform = `
            translateZ(42px)
            scale(1.16)
            rotateY(${currentRY * -0.6}deg)
            rotateX(${currentRX * 0.5}deg)
          `;
        }
      }

      if (hovering || Math.abs(currentRX - targetRX) > 0.05 || Math.abs(currentRY - targetRY) > 0.05) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = null;
      }
    };

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      targetX = (e.clientX - rect.left) / rect.width;
      targetY = (e.clientY - rect.top) / rect.height;
      targetRX = (0.5 - targetY) * 16;
      targetRY = (targetX - 0.5) * 20;
      hovering = true;
      if (!raf) raf = requestAnimationFrame(tick);
    });

    card.addEventListener('mouseleave', () => {
      hovering = false;
      targetRX = 0;
      targetRY = 0;
      card.style.transform = '';
      if (glare) glare.style.opacity = '0';
      if (icon) icon.style.transform = '';
      if (!raf) raf = requestAnimationFrame(tick);
    });
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
        const speed = 0.1 + i * 0.05;
        const drift = Math.sin(y * 0.002 + i) * 20;
        orb.style.transform = `translateY(${y * speed}px) translateX(${drift}px) scale(${1 + i * 0.02})`;
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
      btn.style.transform = `translate(${x * 0.22}px, ${y * 0.28 - 4}px) scale(1.04)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

/* Scroll-linked 3D depth — no opacity fade */
function initScrollDepth() {
  if (window.innerWidth < 1024) return;

  const layers = document.querySelectorAll(
    '.features-grid, .steps-grid, .compare-grid, .pricing-plans, .demo-grid, .solution__flow'
  );
  if (!layers.length) return;

  let ticking = false;

  const update = () => {
    const vh = window.innerHeight;
    layers.forEach((el, i) => {
      const rect = el.getBoundingClientRect();
      const mid = rect.top + rect.height / 2;
      const progress = (mid - vh / 2) / vh;
      const clamped = Math.max(-1, Math.min(1, progress));
      const rotX = clamped * -4;
      const rotY = Math.sin(clamped * Math.PI) * (i % 2 === 0 ? 2.5 : -2.5);
      el.style.transform = `perspective(1400px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }, { passive: true });

  update();
}

/* Soft pointer glow following cursor on dark CTA */
function initPointerGlow() {
  if (window.innerWidth < 1024) return;

  const cta = document.querySelector('.cta-section');
  if (!cta) return;

  const glow = document.createElement('div');
  glow.setAttribute('aria-hidden', 'true');
  Object.assign(glow.style, {
    position: 'absolute',
    width: '420px',
    height: '420px',
    borderRadius: '50%',
    pointerEvents: 'none',
    background: 'radial-gradient(circle, rgba(37,211,102,0.22) 0%, transparent 70%)',
    transform: 'translate(-50%, -50%)',
    left: '50%',
    top: '50%',
    zIndex: '0',
    transition: 'opacity 0.4s ease',
    opacity: '0',
  });
  cta.style.position = 'relative';
  cta.appendChild(glow);

  cta.addEventListener('mousemove', (e) => {
    const rect = cta.getBoundingClientRect();
    glow.style.left = `${e.clientX - rect.left}px`;
    glow.style.top = `${e.clientY - rect.top}px`;
    glow.style.opacity = '1';
  });

  cta.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
  });
}

/* Mobile: scroll-in card rise + soft hero parallax */
function initMobileWow() {
  if (window.innerWidth > 768) return;

  const cards = document.querySelectorAll(
    '.feature-card, .step-card, .problem-card, .pricing-card, .compare-card, .credibility-item'
  );

  if (cards.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-inview');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' }
    );
    cards.forEach(card => observer.observe(card));
  }

  const phone = document.querySelector('.phone-mockup--hero');
  if (!phone) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        phone.style.transform = `translateY(${y * 0.12}px)`;
      }
      ticking = false;
    });
  }, { passive: true });
}

/* Mobile sticky WhatsApp CTA after leaving hero */
function initMobileStickyCta() {
  const bar = document.getElementById('mobileStickyCta');
  const hero = document.getElementById('hero');
  if (!bar || !hero) return;

  if (window.innerWidth > 768) {
    bar.hidden = true;
    return;
  }

  bar.hidden = false;

  const update = () => {
    const heroBottom = hero.getBoundingClientRect().bottom;
    const nearFooter = window.innerHeight + window.scrollY > document.body.scrollHeight - 280;
    bar.classList.toggle('is-visible', heroBottom < 40 && !nearFooter);
  };

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      bar.hidden = true;
      bar.classList.remove('is-visible');
    } else {
      bar.hidden = false;
      update();
    }
  });
  update();
}
