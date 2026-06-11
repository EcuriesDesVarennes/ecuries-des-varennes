const includes = document.querySelectorAll('[data-include]');

const headerMarkup = `
  <header class="nav" aria-label="En-tête du site">
    <a class="logo" href="../home/" aria-label="Écuries des Varennes">
      <img src="../img/logo_ecurie_des_varennes.png" alt="Écuries des Varennes" width="1280" height="917" decoding="async" />
    </a>
    <nav aria-label="Navigation principale">
      <ul>
        <li><a data-nav="home" href="../home/">Accueil</a></li>
        <li><a data-nav="activities" href="../nos-activites/">Nos activités</a></li>
        <li><a data-nav="domain" href="../le-domaine/">Le domaine</a></li>
        <li><a data-nav="gallery" href="../galerie/">Galerie</a></li>
        <li><a data-nav="contact" href="../contact/">Contact</a></li>
      </ul>
    </nav>
    <a href="../contact/" class="cta">Réserver</a>
  </header>
`;

const footerMarkup = `
  <footer class="footer" aria-label="Pied de page">
    <div class="foot-grid">
      <div>
        <a class="logo-f" href="../home/" aria-label="Écuries des Varennes">
          <img src="../img/logo_ecurie_des_varennes_N&B.png" alt="Écuries des Varennes" width="1280" height="917" decoding="async" />
        </a>
        <div class="tag">Le cheval au cœur de nos activités</div>
        <div class="socials" aria-label="Réseaux sociaux">
          <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i class="ti ti-brand-instagram" aria-hidden="true"></i></a>
          <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i class="ti ti-brand-facebook" aria-hidden="true"></i></a>
        </div>
      </div>
      <div>
        <h5>Nous trouver</h5>
        <p><a class="inline-link" href="https://www.chateau-des-varennes.fr" target="_blank" rel="noopener noreferrer">Château de Varennes</a><br />31450 Varennes<br />Haute-Garonne</p>
        <p><a class="inline-link" href="https://www.chateau-des-varennes.fr" target="_blank" rel="noopener noreferrer">Visiter le site du château</a></p>
      </div>
      <div>
        <h5>Nous contacter</h5>
        <p>ecuriesdesvarennes31@gmail.com</p>
        <p>+33 (0)X XX XX XX XX</p>
      </div>
    </div>
    <div class="credits" aria-label="Crédits du site">
      <p>Designé Perrine Vivier</p>
      <p>Developped by <a href="https://github.com/onlythejoe" target="_blank" rel="noopener noreferrer">Electronic Artefacts</a> (electronicartefacts)</p>
    </div>
    <div class="legal-links" aria-label="Liens juridiques">
      <a href="../mentions-legales/">Mentions légales</a>
      <a href="../politique-de-confidentialite/">Politique de confidentialité</a>
      <a href="../politique-de-cookies/">Cookies</a>
    </div>
    <div class="copy">© 2026 Écuries des Varennes — Tous droits réservés</div>
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
