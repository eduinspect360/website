// nav.js — Shared navigation and footer with Accessibility & UK English updates
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
  `<a href="${p.href}" class="${currentPage === p.href ? 'active' : ''}" style="color: inherit; text-decoration: none;">${p.label}</a>`
).join('');

// 1. GENERATE NAVBAR
const navbarContainer = document.getElementById('navbar');
if (navbarContainer) {
  navbarContainer.innerHTML = `
  <nav class="navbar">
    <div class="container">
      <div class="navbar-inner">
        <a href="index.html" class="navbar-logo-wrap">
          <img src="icon-white-bg.png" alt="EDUINSPECT360 icon" class="navbar-icon">
          <div class="navbar-wordmark">
            <span class="navbar-name" style="color: var(--green);">EDUINSPECT360</span>
            <span class="navbar-tagline" style="color: var(--blue);">Empowering Educational Excellence</span>
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

// 2. GENERATE FOOTER
const footerContainer = document.getElementById('footer');
if (footerContainer) {
  footerContainer.innerHTML = `
  <footer class="footer" style="background: var(--blue-deeper); color: #ffffff; padding: 60px 0 30px 0;">
    <div class="container">
      <div class="footer-grid" style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; margin-bottom: 40px;">
        
        <div class="footer-brand-col">
          <div class="footer-logo" style="display: flex; align-items: center;">
            <img src="icon-white-bg.png" alt="Logo" style="width: 32px; filter: brightness(0) invert(1);">
            <div style="margin-left: 12px;">
              <div style="font-weight: 700; font-size: 18px; letter-spacing: 0.5px;">EDUINSPECT360</div>
              <div style="font-size: 10px; text-transform: uppercase; color: var(--blue-mid);">Empowering Educational Excellence</div>
            </div>
          </div>
          <p style="margin-top: 20px; color: var(--blue-mid); line-height: 1.6; font-size: 13px;">
            School inspection management software for local authorities, Multi-Academy Trusts, and inspection bodies across the UK and international centres.
          </p>
        </div>

        <div class="footer-col">
          <h4 style="color: #ffffff; font-size: 14px; margin-bottom: 20px; font-family: var(--font-head);">Platform</h4>
          <ul style="list-style: none; padding: 0; font-size: 13px; line-height: 2.2;">
            <li><a href="platform.html" style="color: var(--blue-mid); text-decoration: none;">Features overview</a></li>
            <li><a href="compliance.html" style="color: var(--blue-mid); text-decoration: none;">Ofsted EIF alignment</a></li>
            <li><a href="use-cases.html" style="color: var(--blue-mid); text-decoration: none;">For local authorities</a></li>
            <li><a href="use-cases.html" style="color: var(--blue-mid); text-decoration: none;">For MATs</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4 style="color: #ffffff; font-size: 14px; margin-bottom: 20px; font-family: var(--font-head);">Company</h4>
          <ul style="list-style: none; padding: 0; font-size: 13px; line-height: 2.2;">
            <li><a href="about.html" style="color: var(--blue-mid); text-decoration: none;">About us</a></li>
            <li><a href="resources.html" style="color: var(--blue-mid); text-decoration: none;">Resources</a></li>
            <li><a href="contact.html" style="color: var(--blue-mid); text-decoration: none;">Contact us</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4 style="color: #ffffff; font-size: 14px; margin-bottom: 20px; font-family: var(--font-head);">Legal</h4>
          <ul style="list-style: none; padding: 0; font-size: 13px; line-height: 2.2;">
            <li><a href="privacy.html" style="color: var(--blue-mid); text-decoration: none;">Privacy policy</a></li>
            <li><a href="terms.html" style="color: var(--blue-mid); text-decoration: none;">Terms of use</a></li>
            <li><a href="governance.html" style="color: var(--blue-mid); text-decoration: none;">Data governance</a></li>
            <li><a href="cookies.html" style="color: var(--blue-mid); text-decoration: none;">Cookie policy</a></li>
          </ul>
        </div>

      </div>

      <div class="footer-bottom" style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 30px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px;">
        <p style="color: var(--blue-mid); font-size: 12px; margin: 0;">
          © 2025 EDUINSPECT360 Limited &nbsp;·&nbsp; inquiries@eduinspect360.com &nbsp;·&nbsp; 2 Wheeleys Road, Birmingham B15 2LD
        </p>
        <div style="background: rgba(255,255,255,0.05); padding: 4px 12px; border-radius: 4px; font-size: 11px; color: var(--blue-mid);">
          UK Company No. 15126870
        </div>
      </div>
    </div>
  </footer>`;
}

// 3. SAFE EVENT LISTENERS (Prevents "Cannot read properties of null" error)
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
  });
}