// PrivaCore Group — shared site behaviour
(function () {
  'use strict';

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
      if (window.innerWidth >= 900) setDrawer(false);
    });
  }

  // Contact form: preselect interest from ?interest= query parameter
  var interestSelect = document.getElementById('contact-interest');
  if (interestSelect) {
    var INTEREST_MAP = {
      'health-check-results': 'Health Check results / not sure yet',
      'cyber-essentials': 'Cyber Essentials Audit — $497 (1–9 people)',
      'business-shield': 'Business Shield Audit — $1,197 (10–25 people)',
      'full-protection': 'Full Protection Program — $2,497 (25–100 people)',
      'implementation': 'Implementation and ongoing advisory',
      'managed-security': 'Managed-security provider coordination'
    };
    var params = new URLSearchParams(window.location.search);
    var requested = params.get('interest');
    if (requested && INTEREST_MAP[requested]) {
      interestSelect.value = INTEREST_MAP[requested];
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
