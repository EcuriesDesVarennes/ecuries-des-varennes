const includes = document.querySelectorAll('[data-include]');
const CONTACT_EMAIL = 'ecuriesdesvarennes31@gmail.com';

async function loadInclude(node) {
  try {
    const response = await fetch(node.dataset.include, { credentials: 'same-origin' });
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
  if (reducedMotion.matches || isMobileLayout.matches) {
    hero.style.setProperty('--banner-bg-shift', '0px');
    hero.style.setProperty('--banner-horse-shift', '0px');
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

  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
}

async function init() {
  await loadIncludes();
  setActiveNav();
  setupContactForm();
  setupHeroParallax();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  void init();
}
