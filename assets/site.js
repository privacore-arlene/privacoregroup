// PrivaCore Group — site behaviour
(function () {
  'use strict';

  // Single source of truth for the public business email.
  // Every [data-business-email] element is populated from this constant:
  //   data-business-email="link" → sets the mailto: href only
  //   data-business-email="text" → sets the mailto: href and the visible text
  // index.html repeats the same address as a no-JavaScript fallback; keep them in sync.
  var BUSINESS_EMAIL = 'info@privacoregroup.com';

  document.querySelectorAll('[data-business-email]').forEach(function (el) {
    el.setAttribute('href', 'mailto:' + BUSINESS_EMAIL);
    if (el.getAttribute('data-business-email') === 'text') el.textContent = BUSINESS_EMAIL;
  });

  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
