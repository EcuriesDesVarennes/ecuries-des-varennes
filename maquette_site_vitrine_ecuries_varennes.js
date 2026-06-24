const includes = document.querySelectorAll('[data-include]');
const CONTACT_EMAIL = 'ecuriesdesvarennes31@gmail.com';

async function loadInclude(node) {
  try {
    const response = await fetch(node.dataset.include, { credentials: 'same-origin', cache: 'no-cache' });
    if (!response.ok) {
      throw new Error(`Failed to load include: ${node.dataset.include}`);
    }
    node.outerHTML = await response.text();
  } catch {
    console.warn(`Unable to load include: ${node.dataset.include}`);
  }
}

async function loadIncludes() {
  await Promise.all(Array.from(includes, loadInclude));
}

function setActiveNav() {
  const page = document.body.dataset.page;
  if (!page) return;

  document.querySelectorAll('[data-nav]').forEach((link) => {
    const isActive = link.dataset.nav === page;
    link.classList.toggle('active', isActive);

    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

function setupMobileNav() {
  const header = document.querySelector('.nav');
  const toggle = header?.querySelector('[data-menu-toggle]');
  const menu = header?.querySelector('#primary-navigation');
  if (!header || !toggle || !menu) return;

  const desktopLayout = window.matchMedia('(min-width: 721px)');

  const setOpen = (isOpen) => {
    header.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
  };

  toggle.addEventListener('click', () => {
    setOpen(!header.classList.contains('is-open'));
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('click', (event) => {
    if (!header.classList.contains('is-open') || header.contains(event.target)) return;
    setOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setOpen(false);
    }
  });

  desktopLayout.addEventListener('change', (event) => {
    if (event.matches) {
      setOpen(false);
    }
  });
}

function setupContactForm() {
  const form = document.querySelector('[data-contact-form]');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!form.reportValidity()) {
      return;
    }

    const formData = new FormData(form);
    const rawSubject = String(formData.get('subject') || '').trim();
    const subject = rawSubject || 'Demande depuis le site';
    const name = String(formData.get('name') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const message = String(formData.get('message') || '').trim();

    const bodyLines = [
      `Nom: ${name}`,
      `Email: ${email}`,
      phone ? `Téléphone: ${phone}` : null,
      '',
      message,
    ].filter((line) => line !== null);

    const mailto = new URL(`mailto:${CONTACT_EMAIL}`);
    mailto.searchParams.set('subject', subject);
    mailto.searchParams.set('body', bodyLines.join('\n'));

    window.location.href = mailto.toString();
  });
}

function setupHeroParallax() {
  const hero = document.querySelector('.page-hero--banner');
  if (!hero) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const isMobileLayout = window.matchMedia('(max-width: 1024px)');

  const resetMotionVars = () => {
    hero.style.setProperty('--banner-bg-shift', '0px');
    hero.style.setProperty('--banner-horse-shift', '0px');
    hero.style.setProperty('--banner-bg-drift-x', '0px');
    hero.style.setProperty('--banner-bg-drift-y', '0px');
    hero.style.setProperty('--banner-horse-drift-x', '0px');
    hero.style.setProperty('--banner-horse-drift-y', '0px');
    hero.style.setProperty('--banner-horse-tilt', '0deg');
  };

  if (reducedMotion.matches || isMobileLayout.matches) {
    resetMotionVars();
    return;
  }

  let ticking = false;
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const update = () => {
    ticking = false;
    const heroTop = hero.offsetTop || 0;
    const heroHeight = Math.max(hero.offsetHeight || 1, 1);
    const viewportHeight = Math.max(window.innerHeight || 1, 1);
    const travel = Math.max(heroHeight - viewportHeight * 0.25, 1);
    const progress = clamp(((window.scrollY || 0) - heroTop + viewportHeight * 0.25) / travel, 0, 1);

    hero.style.setProperty('--banner-bg-shift', `${Math.round(progress * -32)}px`);
    hero.style.setProperty('--banner-horse-shift', `${Math.round(progress * 10)}px`);
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  };

  const onPointerMove = (event) => {
    const rect = hero.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const x = clamp((event.clientX - rect.left) / rect.width - 0.5, -0.5, 0.5);
    const y = clamp((event.clientY - rect.top) / rect.height - 0.5, -0.5, 0.5);

    hero.style.setProperty('--banner-bg-drift-x', `${Math.round(x * -14)}px`);
    hero.style.setProperty('--banner-bg-drift-y', `${Math.round(y * -8)}px`);
    hero.style.setProperty('--banner-horse-drift-x', `${Math.round(x * 18)}px`);
    hero.style.setProperty('--banner-horse-drift-y', `${Math.round(y * 8)}px`);
    hero.style.setProperty('--banner-horse-tilt', `${(x * -1.1).toFixed(2)}deg`);
  };

  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  hero.addEventListener('pointermove', onPointerMove, { passive: true });
  hero.addEventListener('pointerleave', resetMotionVars);
}

async function init() {
  await loadIncludes();
  setActiveNav();
  setupMobileNav();
  setupContactForm();
  setupHeroParallax();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  void init();
}
