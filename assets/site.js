// PrivaCore Group — shared site behaviour
(function () {
  'use strict';

  // Single source of truth for the official PrivaCore Group BBB profile URL.
  // Every [data-bbb-badge] link on the site (hero, About, footer) is populated from this constant.
  var BBB_PROFILE_URL = 'https://www.bbb.org/ca/bc/vancouver/profile/threat-and-fraud-assessment/the-fraud-doctor-0037-2438602/#sealclick';
  document.querySelectorAll('[data-bbb-badge]').forEach(function (el) {
    el.setAttribute('href', BBB_PROFILE_URL);
  });

  // Scroll reveal
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('vis'); revealObserver.unobserve(e.target); }
      });
    }, { threshold: 0.07 });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('vis'); });
  }

  // Mobile navigation drawer
  var toggle = document.querySelector('[data-nav-toggle]');
  var drawer = document.getElementById('nav-drawer');
  if (toggle && drawer) {
    var setDrawer = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      drawer.hidden = !open;
    };
    toggle.addEventListener('click', function () {
      setDrawer(toggle.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setDrawer(false);
        toggle.focus();
      }
    });
    drawer.addEventListener('click', function (event) {
      if (event.target.closest('a')) setDrawer(false);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1024) setDrawer(false);
    });
  }

  // Desktop "Industries" dropdown
  document.querySelectorAll('[data-dropdown-btn]').forEach(function (btn) {
    var menu = document.getElementById(btn.getAttribute('aria-controls'));
    if (!menu) return;
    var setMenu = function (open) {
      btn.setAttribute('aria-expanded', String(open));
      menu.hidden = !open;
    };
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      setMenu(btn.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.nav-dropdown')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        btn.focus();
      }
    });
  });

  // Contact form: preselect interest from ?interest= query parameter
  var interestSelect = document.getElementById('contact-interest');
  if (interestSelect) {
    var INTEREST_MAP = {
      'risk-check-results': 'Business Risk Check results / not sure yet',
      'health-check-results': 'Business Risk Check results / not sure yet',
      'cyber-essentials': 'Cyber Essentials Audit — $497 (1–9 people)',
      'business-shield': 'Business Shield Audit — $1,197 (10–25 people)',
      'full-protection': 'Full Protection Program — $2,497 (25–100 people)',
      'incident-assessment': 'Incident Assessment (suspected BEC / fraud / compromise)',
      'incident-response': 'BEC Incident Response & Payment Fraud Assessment — starting at $1,250',
      'm365-check': 'Microsoft 365 Fraud & Security Check — $349',
      'vendor-payment-toolkit': 'Vendor Payment Verification Toolkit — $349',
      'fraud-protection': 'Email & Payment Fraud Protection',
      'managed-protection': 'Managed Security & Ongoing Protection',
      'implementation': 'Managed Security & Ongoing Protection',
      'managed-security': 'Managed Security & Ongoing Protection'
    };
    var params = new URLSearchParams(window.location.search);
    var requested = params.get('interest');
    if (requested && INTEREST_MAP[requested]) {
      interestSelect.value = INTEREST_MAP[requested];
    }
  }

  // Contact form: preselect industry from ?industry= query parameter
  var industrySelect = document.getElementById('contact-industry');
  if (industrySelect) {
    var INDUSTRY_MAP = {
      'construction': 'Construction / Developers / Contractors',
      'healthcare': 'Health / Wellness / Clinic',
      'property-management': 'Property Management / Strata',
      'professional-services': 'Professional Services (law, accounting, consulting)',
      'retail-hospitality': 'Retail / Hospitality / Restaurant',
      'other': 'Other'
    };
    var requestedIndustry = new URLSearchParams(window.location.search).get('industry');
    if (requestedIndustry && INDUSTRY_MAP[requestedIndustry]) {
      industrySelect.value = INDUSTRY_MAP[requestedIndustry];
    }
  }

  // Contact form: AJAX submit with inline success (Netlify Forms mechanics preserved)
  var cf = document.getElementById('cform');
  if (cf) {
    cf.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = cf.querySelector('button[type=submit]');
      btn.textContent = 'Sending…';
      btn.disabled = true;
      fetch(cf.getAttribute('action') || '/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(cf)).toString()
      }).then(function (response) {
        if (!response.ok) throw new Error('Form submission failed');
        cf.style.display = 'none';
        var success = document.getElementById('fsuc');
        success.style.display = 'block';
        success.focus();
      }).catch(function () {
        btn.textContent = 'Send Message →';
        btn.disabled = false;
        alert('Something went wrong — please email info@privacoregroup.com or call 604-341-1651.');
      });
    });
  }
})();
