PRIVACORE GROUP — NETLIFY DEPLOY PACKAGE

Contents
  index.html   Complete website
  _headers     Browser security headers for Netlify

Before publishing
  1. Confirm the three starting prices and typical delivery targets.
  2. Confirm each listed deliverable is a service PrivaCore can provide directly
     or through an identified provider.
  3. Confirm info@privacoregroup.com and 604-341-1651 are correct.

Deploy to the new Netlify account
  1. Sign in to the new Netlify account.
  2. Choose Add new project, then Deploy manually.
  3. Drag this folder or the PrivaCore_Netlify_Deploy_v9.zip file into Netlify.
  4. Open the temporary netlify.app address and test:
       - the ten-question health check on desktop and mobile
       - all links
       - the contact form and the resulting entry under Forms
       - the privacy notice and consent checkbox
  5. In Domain management, add privacoregroup.com and follow the exact DNS
     instructions Netlify gives for the site.

Important DNS caution
  Change only the website records Netlify identifies. Preserve all MX, TXT,
  DKIM, SPF, DMARC, autodiscover, and other email-related records so moving the
  website does not interrupt business email. Do not remove the old website
  until the new netlify.app preview and form have been tested successfully.

Contact-form note
  The form uses Netlify Forms and includes a honeypot field. Netlify must process
  the deployed HTML before submissions appear in the new account. After the first
  deployment, confirm that "privacore-contact" is listed under Forms and submit a
  real test message.

Privacy note
  The site includes a short website privacy notice for the contact form. Review it
  again if analytics, advertising pixels, chat tools, scheduling tools, or another
  form/email provider is added later.

