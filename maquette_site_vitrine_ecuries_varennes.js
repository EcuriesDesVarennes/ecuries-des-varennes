const includes = document.querySelectorAll('[data-include]');

const headerMarkup = `
  <header class="nav" aria-label="En-tête du site">
    <a class="logo" href="index.html" aria-label="Écuries des Varennes">
      <img src="img/logo_ecurie_des_varennes.png" alt="Écuries des Varennes" width="1280" height="917" decoding="async" />
    </a>
    <nav aria-label="Navigation principale">
      <ul>
        <li><a data-nav="home" href="index.html">Accueil</a></li>
        <li><a data-nav="activities" href="nos-activites.html">Nos activités</a></li>
        <li><a data-nav="domain" href="le-domaine.html">Le domaine</a></li>
        <li><a data-nav="gallery" href="galerie.html">Galerie</a></li>
        <li><a data-nav="contact" href="contact.html">Contact</a></li>
      </ul>
    </nav>
    <a href="contact.html" class="cta">Réserver</a>
  </header>
`;

const footerMarkup = `
  <footer class="footer" aria-label="Pied de page">
    <div class="foot-grid">
      <div>
        <a class="logo-f" href="index.html" aria-label="Écuries des Varennes">
          <img src="img/logo_ecurie_des_varennes_N&B.png" alt="Écuries des Varennes" width="1280" height="917" decoding="async" />
        </a>
        <div class="tag">Le cheval au cœur de nos activités</div>
        <div class="socials" aria-label="Réseaux sociaux">
          <a href="#" aria-label="Instagram"><i class="ti ti-brand-instagram" aria-hidden="true"></i></a>
          <a href="#" aria-label="Facebook"><i class="ti ti-brand-facebook" aria-hidden="true"></i></a>
        </div>
      </div>
      <div>
        <h5>Nous trouver</h5>
        <p>Le Château<br />31450 Varennes<br />Haute-Garonne</p>
      </div>
      <div>
        <h5>Nous contacter</h5>
        <p>ecuriesdesvarennes31@gmail.com</p>
        <p>+33 (0)X XX XX XX XX</p>
      </div>
    </div>
    <div class="copy">© 2026 Écuries des Varennes — Tous droits réservés · Mentions légales · Politique de confidentialité</div>
  </footer>
`;

async function loadInclude(node) {
  try {
    const response = await fetch(node.dataset.include, { credentials: 'same-origin' });
    if (!response.ok) {
      throw new Error(`Failed to load include: ${node.dataset.include}`);
    }
    node.outerHTML = await response.text();
    return;
  } catch {
    node.outerHTML = node.dataset.include.includes('header') ? headerMarkup : footerMarkup;
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

function enhanceForms() {
  document.querySelectorAll('form').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
    });
  });
}

async function init() {
  await loadIncludes();
  setActiveNav();
  enhanceForms();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  void init();
}
