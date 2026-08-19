PRIVACORE GROUP — NETLIFY DEPLOY PACKAGE

Positioning: Cybersecurity · Fraud · Privacy — "Protect the systems, payments and
information your business depends on."

Contents
  index.html            Homepage (hero, core services, managed security, email &
                        payment fraud (BEC), industries, how we work, Business Risk
                        Check, audit packages, about, final CTA, website privacy notice)
  contact.html          Contact page with Netlify form and ?interest=/?industry= preselection
  exposure-check.html   Standalone Free Business Risk Check (non-graded, no scores)
  resources.html        Practical guides, extended risk scenarios, and Canadian privacy-law
                        (PIPEDA / Law 25 / BC & Alberta PIPA) reference content
  thank-you.html        Form success landing page
  industries/*.html     Construction (featured specialization), healthcare, property
                        management, professional services, retail & hospitality
  assets/site.css       Shared design system (navy / slate / warm white / muted gold palette)
  assets/site.js        Shared behaviour (mobile menu, dropdowns, scroll reveal, form
                        handling, BBB_PROFILE_URL constant for the BBB badge component)
  assets/health-check.css / assets/health-check.js   Shared Business Risk Check component
  _headers              Browser security headers for Netlify (CSP allows the official
                        BBB seal image host, seal-mbc.bbb.org)
  _redirects            Legacy route redirects to current sections

Deploy to Netlify
  1. Sign in to Netlify, choose Add new project, then Deploy manually (or connect the repo).
  2. Drag this folder into Netlify, or connect the GitHub repository with no build command
     and the repository root as the publish directory.
  3. Open the temporary netlify.app address and test:
       - the ten-question Business Risk Check on desktop and mobile (no scores or grades shown)
       - all navigation links and the Services/Industries dropdowns, including from /contact
         and /exposure-check
       - the contact form and the resulting entry under Forms ("privacore-contact")
       - ?interest= / ?industry= preselection, e.g. /contact?interest=business-shield
       - the BBB Accredited Business link in the hero, About section and footer
       - the privacy notice and consent checkbox
  4. In Domain management, add privacoregroup.com and follow the exact DNS
     instructions Netlify gives for the site.

Configuration
  BBB_PROFILE_URL is defined once, near the top of assets/site.js, and populates every
  [data-bbb-badge] link on the site. Update it there if the official BBB profile URL changes.

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
