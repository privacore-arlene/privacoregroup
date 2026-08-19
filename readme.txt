PRIVACORE GROUP — NETLIFY DEPLOY PACKAGE

Contents
  index.html            Homepage (hero, start-here, Health Check, packages, about/process,
                        practical risks, privacy responsibilities, ongoing support, contact CTA,
                        website privacy notice)
  contact.html          Contact page with Netlify form and ?interest= preselection
  exposure-check.html   Standalone free Health Check (non-graded, no scores)
  thank-you.html        Form success landing page
  assets/site.css       Shared design system
  assets/site.js        Shared behaviour (mobile menu, scroll reveal, form handling)
  assets/health-check.css / assets/health-check.js   Shared Health Check component
  _headers              Browser security headers for Netlify
  _redirects            Legacy route redirects to current sections

Deploy to Netlify
  1. Sign in to Netlify, choose Add new project, then Deploy manually (or connect the repo).
  2. Drag this folder into Netlify, or connect the GitHub repository with no build command
     and the repository root as the publish directory.
  3. Open the temporary netlify.app address and test:
       - the ten-question Health Check on desktop and mobile (no scores or grades shown)
       - all navigation links, including from /contact and /exposure-check
       - the contact form and the resulting entry under Forms ("privacore-contact")
       - ?interest= preselection, e.g. /contact?interest=business-shield
       - the privacy notice and consent checkbox
  4. In Domain management, add privacoregroup.com and follow the exact DNS
     instructions Netlify gives for the site.

Important DNS caution
  Change only the website records Netlify identifies. Preserve all MX, TXT,
  DKIM, SPF, DMARC, autodiscover, and other email-related records so moving the
  website does not interrupt business email. Do not remove the old website
  until the new netlify.app preview and form have been tested successfully.

Contact-form note
  The form uses Netlify Forms and includes a honeypot field. Netlify must process
  the deployed HTML before submissions appear in the account. After the first
  deployment, confirm that "privacore-contact" is listed under Forms and submit a
  real test message.

Privacy note
  The site includes a short website privacy notice for the contact form. Review it
  again if analytics, advertising pixels, chat tools, scheduling tools, or another
  form/email provider is added later.
