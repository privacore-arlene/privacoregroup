PRIVACORE GROUP — ONE-PAGE WEBSITE (static, no build step)

Positioning: senior-led privacy, GRC, cybersecurity-governance and responsible-AI
governance advisory, with change-management and adoption support, for Canadian
organizations.

Contents
  index.html        The whole site: header, hero, who we help, services, readiness &
                    governance packages, how we work,
                    why PrivaCore, about, contact, footer with website privacy notice.
                    All editable copy lives here, one commented block per section.
  assets/site.css   Styles. Colour, type and spacing tokens are at the top (:root).
  assets/site.js    BUSINESS_EMAIL constant (single source of truth for the email) and
                    the footer copyright year.
  assets/logo.svg / logo-light.svg   Existing PrivaCore Group logo (header / footer).
  _headers          Security headers. The CSP allows only this site's own files — no
                    third-party scripts, fonts, analytics or embeds.
  _redirects        Retired pages (/about, /contact, /industries/*, etc.) redirect to the
                    matching section of the one-page site.

Changing the business email
  1. Edit BUSINESS_EMAIL near the top of assets/site.js.
  2. In index.html, find and replace the old address (no-JavaScript fallback and the
     schema.org data in <head>).

Name-free, team-first brand
  The site shows no personal names, headshots or individual bios. Add role-based team
  descriptions or credentials (e.g. CISA/CISM) only after status and availability are
  confirmed, and never attribute a credential to the whole team unless every member holds it.

Readiness & governance packages
  Scoped advisory/readiness work only. Never claim PrivaCore issues SOC reports or
  certifications, guarantees an audit opinion, or makes an organization compliant.
  Add a framework package (e.g. ISO/IEC 27001, SOC 1) only once delivery capability is
  confirmed; say "partner-supported" only if a real partner has agreed to the arrangement.

Contact method
  Email only (mailto: links). There is no contact form, phone number, booking widget,
  newsletter, social feed, analytics, advertising pixel or cookie banner. If any of these
  are added later, update the footer privacy notice and _headers first.

Preview locally
  Any static file server from the repository root, e.g.  python -m http.server 8080

Deploy
  Netlify, no build command, repository root as the publish directory. Preserve all
  email-related DNS records (MX, TXT, SPF, DKIM, DMARC) when changing domain settings.
