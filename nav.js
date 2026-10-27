// nav.js: Balanced version: Original layout with W3C compliant colours

// CONSENT-GATED GOOGLE ANALYTICS 4 + COOKIE BANNER
// GA4 (gtag.js) is NEVER injected unless the visitor has chosen "Accept".
// Choice is stored in localStorage under 'cookieConsent' ('granted' | 'denied').
// The old 'cookiesAccepted' key is deliberately ignored: it never meant consent.
(function() {
    const GA_ID = 'G-72GC5HPZWV';
    const KEY = 'cookieConsent';

    function getConsent() {
        try { return window.localStorage.getItem(KEY); } catch (e) { return null; }
    }
    function setConsent(v) {
        try {
            if (v === null) window.localStorage.removeItem(KEY);
            else window.localStorage.setItem(KEY, v);
        } catch (e) { /* storage unavailable: choice not persisted */ }
    }
    function hasGranted() { return getConsent() === 'granted'; }

    function loadGA() {
        if (window.__ga4Loaded) return;
        window.__ga4Loaded = true;
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
        document.head.appendChild(script);
        window.dataLayer = window.dataLayer || [];
        function gtag() { window.dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', GA_ID);
    }

    function removeBanner() {
        const b = document.getElementById('cookie-banner');
        if (b) b.remove();
    }

    function showBanner() {
        if (document.getElementById('cookie-banner') || !document.body) return;
        const btn = 'flex:1 1 0; min-width:96px; min-height:40px; background:#2c6f90; border:2px solid #2c6f90; color:#fff; padding:8px 16px; border-radius:6px; cursor:pointer; font-family:inherit; font-size:13px; font-weight:600;';
        const b = document.createElement('div');
        b.id = 'cookie-banner';
        b.setAttribute('role', 'region');
        b.setAttribute('aria-label', 'Cookie consent');
        b.style.cssText = 'position:fixed; bottom:20px; left:50%; transform:translateX(-50%); width:90%; max-width:600px; background:#fff; border:1px solid #d0e6f0; border-radius:12px; box-shadow:0 10px 25px rgba(0,0,0,0.1); padding:16px 20px; display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; z-index:10000; gap:16px;';
        b.innerHTML =
            '<div style="flex:1 1 280px; font-family:\'Poppins\',sans-serif; font-size:13px; color:#3a4a5a; line-height:1.5;">' +
            'We use cookie-free analytics, and Google Analytics cookies only if you agree. Read our ' +
            '<a href="privacy.html" style="color:#2c6f90; text-decoration:underline;">Privacy Policy</a> and ' +
            '<a href="cookies.html" style="color:#2c6f90; text-decoration:underline;">Cookie Policy</a>.</div>' +
            '<div style="display:flex; gap:10px; flex:1 1 220px;">' +
            '<button type="button" id="cookie-accept" style="' + btn + '">Accept</button>' +
            '<button type="button" id="cookie-reject" style="' + btn + '">Reject</button></div>';
        document.body.appendChild(b);
        document.getElementById('cookie-accept').addEventListener('click', function() {
            setConsent('granted'); removeBanner(); loadGA();
        });
        document.getElementById('cookie-reject').addEventListener('click', function() {
            setConsent('denied'); removeBanner();
        });
    }

    // Footer "Cookie settings" link: clears the choice and re-shows the banner.
    window.openCookieSettings = function() {
        setConsent(null);
        removeBanner();
        showBanner();
    };

    if (hasGranted()) loadGA();

    function init() { if (getConsent() === null) showBanner(); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();

// 1. GLOBAL REDIRECTS (Force HTTPS and WWW for GitHub Pages)
(function() {
    const host = window.location.hostname;
    const protocol = window.location.protocol;

    // Redirect if accessing via the non-www apex domain or via insecure HTTP
    if (host === "eduinspect360.com" || (host === "www.eduinspect360.com" && protocol === "http:")) {
        window.location.replace("https://www.eduinspect360.com" + window.location.pathname + window.location.search);
    }
})();

// ... existing code follows ...
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

const pages = [
  { href: 'index.html',      label: 'Home' },
  { href: 'platform.html',   label: 'Platform' },
  { href: 'inspectorates.html', label: 'Inspectorates' },
  { href: 'use-cases.html',  label: 'Use cases' },
  { href: 'compliance.html', label: 'Compliance' },
  { href: 'about.html',      label: 'About us' },
  { href: 'resources.html',  label: 'Resources' },
  { href: 'contact.html',    label: 'Contact' },
];

const navLinks = pages.map(p =>
  `<a href="${p.href}" class="${currentPage === p.href ? 'active' : ''}">${p.label}</a>`
).join('');

// 1. NAVBAR GENERATION (Restored with Mobile Toggle)
const navbarContainer = document.getElementById('navbar');
if (navbarContainer) {
  navbarContainer.innerHTML = `
  <nav class="navbar">
    <div class="container">
      <div class="navbar-inner">
        <a href="index.html" class="navbar-logo-wrap">
          <img src="icon-white-bg.png" alt="EDUINSPECT360 icon" class="navbar-icon">
          <div class="navbar-wordmark">
            <span class="navbar-name">EDUINSPECT360</span>
            <span class="navbar-tagline">Empowering Educational Excellence</span>
          </div>
        </a>
        
        <button class="nav-toggle" id="nav-toggle" aria-label="Open menu" aria-expanded="false">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div class="navbar-links" id="nav-menu">
          ${navLinks}
          <a href="contact.html" class="nav-cta">Request a briefing</a>
        </div>
      </div>
    </div>
  </nav>`;
}

// 2. FOOTER GENERATION (Original layout with compliant colours)
const footerContainer = document.getElementById('footer');
if (footerContainer) {
  footerContainer.innerHTML = `
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand-col">
         <div class="footer-logo-wrap">
          <img src="icon-white-bg.png" alt="EDUINSPECT360" class="footer-icon">
        <div class="footer-brand-text">
              <div class="footer-brand-name" style="color: #ffffff;">EDUINSPECT360</div>
              <div class="footer-brand-tag" style="color: var(--blue-mid);">Empowering Educational Excellence</div>
            </div>
          </div>
          <p style="margin-top:20px; color: var(--blue-mid);">
            Inspection management software for national inspectorates and education bodies, configurable to regional, district or institution level.
          </p>
        </div>
        
        <div class="footer-col">
          <h4>Platform</h4>
          <a href="platform.html" style="color: var(--blue-mid);">Features overview</a>
          <a href="compliance.html" style="color: var(--blue-mid);">Framework alignment</a>
          <a href="use-cases.html" style="color: var(--blue-mid);">For regional and district bodies</a>
          <a href="use-cases.html" style="color: var(--blue-mid);">For institution groups</a>
          <a href="inspectorates.html" style="color: var(--blue-mid);">For national inspectorates</a>
        </div>

        <div class="footer-col">
          <h4>Company</h4>
          <a href="about.html" style="color: var(--blue-mid);">About us</a>
          <a href="resources.html" style="color: var(--blue-mid);">Resources</a>
          <a href="roi.html" style="color: var(--blue-mid);">Days Back for Inspection</a>
          <a href="business-case.html" style="color: var(--blue-mid);">Business case in a page</a>
          <a href="contact.html" style="color: var(--blue-mid);">Contact us</a>
        </div>

        <div class="footer-col">
          <h4>Legal</h4>
          <a href="privacy.html" style="color: var(--blue-mid);">Privacy policy</a>
          <a href="terms.html" style="color: var(--blue-mid);">Terms of use</a>
          <a href="governance.html" style="color: var(--blue-mid);">Data governance</a>
          <a href="trust.html" style="color: var(--blue-mid);">Trust, data &amp; AI</a>
          <a href="cookies.html" style="color: var(--blue-mid);">Cookie policy</a>
          <a href="#" id="cookie-settings-link" style="color: var(--blue-mid);">Cookie settings</a>
        </div>
      </div>

      <div class="footer-bottom">
        <p style="color: var(--blue-mid);">© 2026 EDUINSPECT360 Limited &nbsp;·&nbsp; enquiries@eduinspect360.com &nbsp;·&nbsp; 2 Wheeleys Road, Birmingham B15 2LD</p>
        <div class="footer-reg"><span style="color: var(--blue-mid);">UK Company No. 15126870</span></div>
      </div>
    </div>
  </footer>`;
}

// 3. SAFETY CHECK FOR MOBILE MENU
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    // Optional: Add a class to the toggle itself for an animation
    navToggle.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
}
// 4. COOKIE SETTINGS LINK (footer + any element with data-cookie-settings)
document.addEventListener('click', function(e) {
  const t = e.target.closest && e.target.closest('#cookie-settings-link, [data-cookie-settings]');
  if (t) { e.preventDefault(); window.openCookieSettings(); }
});
