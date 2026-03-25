// nav.js — shared navigation and footer
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

document.getElementById('navbar').innerHTML = `
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
      <div class="nav-toggle" id="nav-toggle" aria-label="Open menu">
        <span></span><span></span><span></span>
      </div>
    </div>
  </div>
</nav>`;

document.getElementById('footer').innerHTML = `
<footer class="footer">
  <div class="container">
    <div class="footer-grid">
      <div>
        <div class="footer-logo-wrap">
          <img src="icon-white-bg.png" alt="EDUINSPECT360" class="footer-icon">
          <div>
            <div class="footer-brand-name">EDUINSPECT360</div>
            <div class="footer-brand-tag">Empowering Educational Excellence</div>
          </div>
        </div>
        <p style="margin-top:10px;">School inspection management software for local authorities, Multi-Academy Trusts, and inspection bodies across the UK and internationally.</p>
      </div>
      <div class="footer-col">
        <h4>Platform</h4>
        <a href="platform.html">Features overview</a>
        <a href="compliance.html">Ofsted EIF alignment</a>
        <a href="use-cases.html">For local authorities</a>
        <a href="use-cases.html">For MATs</a>
      </div>
      <div class="footer-col">
        <h4>Company</h4>
        <a href="about.html">About us</a>
        <a href="resources.html">Resources</a>
        <a href="contact.html">Contact us</a>
      </div>
     <div class="footer-col">
  <h4>Legal</h4>
  <a href="privacy.html">Privacy policy</a>
  <a href="terms.html">Terms of use</a>
  <a href="governance.html">Data governance</a>
  <a href="cookies.html">Cookie policy</a>
</div>
    </div>
    <div class="footer-bottom">
      <p>© 2025 EDUINSPECT360 Limited &nbsp;·&nbsp; inquiries@eduinspect360.com &nbsp;·&nbsp; 2 Wheeleys Road, Birmingham B15 2LD</p>
      <div class="footer-reg"><span>UK Company No. 15126870</span></div>
    </div>
  </div>
</footer>`;

document.getElementById('nav-toggle').addEventListener('click', () => {
  document.getElementById('nav-menu').classList.toggle('open');
});
