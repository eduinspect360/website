// nav.js — Balanced version: Original layout with W3C compliant colours
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

const pages = [
  { href: 'index.html',      label: 'Home' },
  { href: 'platform.html',   label: 'Platform' },
  { href: 'use-cases.html',  label: 'Use cases' },
  { href: 'compliance.html', label: 'Compliance' },
  { href: 'about.html',      label: 'About us' },
  { href: 'resources.html',  label: 'Resources' },
  { href: 'contact.html',    label: 'Contact' },
];

const navLinks = pages.map(p =>
  `<a href="${p.href}" class="${currentPage === p.href ? 'active' : ''}">${p.label}</a>`
).join('');

// 1. NAVBAR GENERATION (Restored to original structure)
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
          <div class="footer-logo">
            <img src="icon-white-bg.png" alt="Logo" class="footer-icon" style="filter: brightness(0) invert(1);">
            <div class="footer-brand-text">
              <div class="footer-brand-name" style="color: #ffffff;">EDUINSPECT360</div>
              <div class="footer-brand-tag" style="color: var(--blue-mid);">Empowering Educational Excellence</div>
            </div>
          </div>
          <p style="margin-top:20px; color: var(--blue-mid);">
            School inspection management software for local authorities, Multi-Academy Trusts, and inspection bodies across the UK and international centres.
          </p>
        </div>
        
        <div class="footer-col">
          <h4>Platform</h4>
          <a href="platform.html" style="color: var(--blue-mid);">Features overview</a>
          <a href="compliance.html" style="color: var(--blue-mid);">Ofsted EIF alignment</a>
          <a href="use-cases.html" style="color: var(--blue-mid);">For local authorities</a>
          <a href="use-cases.html" style="color: var(--blue-mid);">For MATs</a>
        </div>

        <div class="footer-col">
          <h4>Company</h4>
          <a href="about.html" style="color: var(--blue-mid);">About us</a>
          <a href="resources.html" style="color: var(--blue-mid);">Resources</a>
          <a href="contact.html" style="color: var(--blue-mid);">Contact us</a>
        </div>

        <div class="footer-col">
          <h4>Legal</h4>
          <a href="privacy.html" style="color: var(--blue-mid);">Privacy policy</a>
          <a href="terms.html" style="color: var(--blue-mid);">Terms of use</a>
          <a href="governance.html" style="color: var(--blue-mid);">Data governance</a>
          <a href="cookies.html" style="color: var(--blue-mid);">Cookie policy</a>
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
    navMenu.classList.toggle('open');
  });
}