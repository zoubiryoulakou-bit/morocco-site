// ═══════════════════════════════════════════════════════
//  MYCULTURE 2026 — script.js
// ═══════════════════════════════════════════════════════

// ─── LOADER ───
window.addEventListener('load', () => {
  document.body.style.overflow = 'hidden';
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }, 2200);
});

// ─── CUSTOM CURSOR ───
const cursorDot   = document.getElementById('cursorDot');
const cursorTrail = document.getElementById('cursorTrail');

if (cursorDot && cursorTrail) {
  let mouseX = 0, mouseY = 0;
  let trailX = 0, trailY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top  = mouseY + 'px';
  });

  // Smooth trailing cursor
  function animateTrail() {
    trailX += (mouseX - trailX) * 0.12;
    trailY += (mouseY - trailY) * 0.12;
    cursorTrail.style.left = trailX + 'px';
    cursorTrail.style.top  = trailY + 'px';
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  const hoverTargets = 'a, button, .mosaic-item, .fest-card, .tkt-card, .review-card, .why-card, .srv-card, .pkg-card, .upcoming-item, .social-card, .manifesto-img';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => cursorTrail.classList.add('hovered'));
    el.addEventListener('mouseleave', () => cursorTrail.classList.remove('hovered'));
  });

  // Re-apply to dynamically visible elements
  const cursorObserver = new MutationObserver(() => {
    document.querySelectorAll(hoverTargets).forEach(el => {
      if (!el.dataset.cursorBound) {
        el.dataset.cursorBound = '1';
        el.addEventListener('mouseenter', () => cursorTrail.classList.add('hovered'));
        el.addEventListener('mouseleave', () => cursorTrail.classList.remove('hovered'));
      }
    });
  });
  cursorObserver.observe(document.body, { subtree: true, childList: true });
}

// ─── NAVIGATION ───
const navLinks  = document.querySelectorAll('.nav-link[data-page]');
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navLinks');
const navEl     = document.getElementById('nav');

function showPage(pageId) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active');
    p.style.display = 'none';
  });

  // Show target page
  const page = document.getElementById(pageId);
  if (page) {
    page.style.display = 'block';
    page.classList.add('active');
    void page.offsetWidth; // force reflow
    page.classList.add('page-enter');
    setTimeout(() => page.classList.remove('page-enter'), 600);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Update nav active state
  navLinks.forEach(l => {
    l.classList.toggle('active', l.dataset.page === pageId);
  });

  // Close mobile menu
  navMenu?.classList.remove('open');
  hamburger?.classList.remove('open');

  // Re-init observers for new page
  setTimeout(() => {
    initReveal();
    initCounters();
  }, 100);
}

// Nav link clicks
navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    showPage(link.dataset.page);
  });
});

// data-goto clicks (anywhere in the page)
document.addEventListener('click', e => {
  const el = e.target.closest('[data-goto]');
  if (el) {
    e.preventDefault();
    showPage(el.dataset.goto);
  }
});

// Hamburger
hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navMenu?.classList.toggle('open');
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
  navEl?.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// Logo click
document.querySelectorAll('.nav-logo').forEach(logo => {
  logo.addEventListener('click', e => {
    e.preventDefault();
    showPage('home');
  });
});

// ─── SCROLL REVEAL ───
function initReveal() {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
    revealObserver.observe(el);
  });
}
initReveal();

// ─── COUNTER ANIMATION ───
const countedEls = new WeakSet();

function animateCounter(el) {
  if (countedEls.has(el)) return;
  countedEls.add(el);

  const target   = parseInt(el.dataset.target) || 0;
  const suffix   = el.dataset.suffix || '';
  const duration = 1800;
  const start    = performance.now();

  const update = (now) => {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 4);
    el.textContent = Math.floor(eased * target).toLocaleString() + suffix;
    if (p < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

function initCounters() {
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-target]').forEach(el => {
    counterObserver.observe(el);
  });
}
initCounters();

// ─── TICKET BUY BUTTON ───
document.addEventListener('click', e => {
  const btn = e.target.closest('.btn-buy');
  if (!btn) return;

  const original = btn.innerHTML;
  const originalBg = btn.style.background;
  btn.innerHTML = '✓ Added!';
  btn.style.background = '#22c55e';
  btn.disabled = true;
  btn.style.cursor = 'default';

  setTimeout(() => {
    btn.innerHTML = original;
    btn.style.background = originalBg;
    btn.disabled = false;
    btn.style.cursor = '';
  }, 2600);
});

// ─── CONTACT FORM ───
document.addEventListener('submit', e => {
  if (!e.target.classList.contains('contact-form')) return;
  e.preventDefault();

  const btn = e.target.querySelector('button[type="submit"]');
  const original = btn.innerHTML;

  btn.innerHTML = '✓ رسالتك وصلت — Message Sent!';
  btn.style.background = '#22c55e';
  btn.disabled = true;
  e.target.reset();

  setTimeout(() => {
    btn.innerHTML = original;
    btn.style.background = '';
    btn.disabled = false;
  }, 3500);
});

// ─── PARALLAX HERO IMAGE (subtle) ───
window.addEventListener('scroll', () => {
  const heroImg = document.querySelector('#home .hero-img');
  if (heroImg && window.scrollY < window.innerHeight) {
    heroImg.style.transform = `scale(1) translateY(${window.scrollY * 0.2}px)`;
  }
}, { passive: true });

// ─── UPCOMING ITEMS — navigate to events ───
document.querySelectorAll('.upcoming-item').forEach(item => {
  item.addEventListener('click', () => showPage('events'));
});

// ─── INIT ───
// Make sure only home is visible on start
document.querySelectorAll('.page').forEach(p => {
  p.style.display = p.id === 'home' ? 'block' : 'none';
  if (p.id !== 'home') p.classList.remove('active');
});
showPage('home');