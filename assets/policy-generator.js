/*
  PrivaCore Payment Verification Policy Generator.
  Single-screen form -> instantly generated one-page policy, entirely client-side.
  Answers are never sent anywhere unless the visitor chooses the optional
  "email this to me" capture at the end (a separate, non-honeypotted Netlify form).
*/
(function () {
  'use strict';

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, function (character) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[character];
    });
  }

  var DUAL_THRESHOLD = {
    'under-5k': '$2,500',
    '5k-25k': '$5,000',
    'over-25k': '$10,000',
    'varies': null
  };

  var INDUSTRY_LINE = {
    'construction': 'In construction, this matters most around draw requests, progress payments, and subcontractor or supplier banking changes — verify every one, even mid-project.',
    'professional-services': 'In professional services, this matters most around client trust payments, retainer changes, and any request that references an ongoing engagement.',
    'property-management': 'In property management, this matters most around owner distributions, vendor payments, and any banking change tied to a strata or ownership transition.'
  };

  function approvalParagraph(approver, threshold, teamSize) {
    var base;
    if (approver === 'one-person') {
      base = 'Today, one person approves payment changes. This policy introduces a second, independent approver for any change at or above the threshold below.';
    } else if (approver === 'two-or-more') {
      base = 'Your business already requires two or more people to approve payment changes. This policy formalizes that practice.';
    } else {
      base = 'Your business does not yet have a clear approval process for payment changes. This policy establishes one.';
    }
    if (teamSize === 'just-me') {
      base = 'Because you are the only person handling payments, add a deliberate pause instead of a second approver: before sending any payment at or above the threshold below, stop, verify by phone using a number you already had, and — if possible — ask a trusted second person (bookkeeper, accountant, or business partner) to confirm before you send it.';
    }
    return base;
  }

  function requiredStepsList(teamSize, arrivalMethod, threshold) {
    var steps = [];
    steps.push('<strong>Pause.</strong> Treat every request to change payment or banking details as unverified until confirmed — even if it follows a real conversation or comes from a known contact.');

    var arrivalLine;
    if (arrivalMethod === 'email-only') {
      arrivalLine = 'Because requests usually arrive by email only, treat any banking-detail change in an email as unverified until confirmed by phone.';
    } else if (arrivalMethod === 'email-phone') {
      arrivalLine = 'Because requests can arrive by email or phone, confirm any banking-detail change using a phone number you already had on file — never a number provided in the request itself.';
    } else if (arrivalMethod === 'portal') {
      arrivalLine = "Because requests usually arrive through a vendor portal or system, verify banking-detail changes through that platform's own secure channel, or by phone using a number you already had — not through a link or number inside a message.";
    } else {
      arrivalLine = 'Because requests can arrive through several channels, apply the same rule no matter how the request arrives: confirm using contact details you already had, never details supplied in the request itself.';
    }
    steps.push('<strong>Find the contact yourself.</strong> ' + arrivalLine);
    steps.push('<strong>Confirm verbally.</strong> Speak to a person you know, or who can prove who they are, before any money moves.');

    var dualLine = threshold
      ? (teamSize === 'just-me'
          ? 'Get a second, independent check for any payment at or above ' + threshold + '.'
          : 'A second person, independent of whoever received the request, must approve any payment at or above ' + threshold + ' before it is sent.')
      : (teamSize === 'just-me'
          ? 'Get a second, independent check for any payment involving a banking-detail change, regardless of amount.'
          : 'A second person, independent of whoever received the request, must approve any payment involving a banking-detail change, regardless of amount.');
    steps.push('<strong>Dual approval when required.</strong> ' + dualLine);
    steps.push('<strong>Record it.</strong> Note who confirmed the change, how, and when. Make this a step someone owns — not a favour someone does.');

    return steps;
  }

  function supplierListParagraph(hasList) {
    if (hasList === 'yes') {
      return 'Your business already keeps a list of verified supplier banking details. Keep it current: update it only after a change has been verified by phone, and review it periodically.';
    }
    if (hasList === 'partial') {
      return 'Your business has an informal or partial list of verified supplier banking details. Formalize it: one document, one owner, updated only after a verified phone confirmation.';
    }
    return 'Create a verified supplier list: one document recording each supplier’s confirmed banking details, who confirmed them, and when. Update it only after a new change has been verified by phone.';
  }

  function trainingParagraph(teamSize) {
    if (teamSize === 'just-me') {
      return 'Review this policy yourself at least once a year, and immediately after any change to how you send or receive payments.';
    }
    return 'Share this policy with everyone who can approve or send payments, and review it at least once a year or whenever your process changes.';
  }

  function generatePolicy(answers) {
    var threshold = DUAL_THRESHOLD[answers.paymentSize];
    var steps = requiredStepsList(answers.teamSize, answers.arrival, threshold);
    var industryLine = INDUSTRY_LINE[answers.industry];
    var today = new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' });

    var html =
      '<div class="policy-doc-head">' +
        '<div class="policy-doc-brand">PrivaCore Group</div>' +
        '<h3>Payment Verification Policy</h3>' +
        '<p class="policy-doc-date">Prepared ' + today + '</p>' +
      '</div>' +
      '<section><h4>Purpose</h4><p>This policy exists to prevent payment and banking-detail fraud by making verification a routine, written step — not a judgment call made under time pressure.' + (industryLine ? ' ' + industryLine : '') + '</p></section>' +
      '<section><h4>Core Rule</h4><p>Treat every request to change payment or banking details as unverified until confirmed through a separate, trusted channel — even if it follows a real conversation, comes from a known contact, or appears to come from inside your own organization.</p></section>' +
      '<section><h4>Required Steps</h4><p>' + approvalParagraph(answers.approver, threshold, answers.teamSize) + '</p><ol>' + steps.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ol></section>' +
      '<section><h4>Verified Supplier List</h4><p>' + supplierListParagraph(answers.hasList) + '</p></section>' +
      '<section><h4>Exceptions</h4><p>There are no exceptions for urgency. A request that feels urgent is exactly when this policy matters most — a genuine emergency still allows time for a phone call to a number you already had.</p></section>' +
      '<section><h4>Training &amp; Review</h4><p>' + trainingParagraph(answers.teamSize) + '</p></section>';

    if (answers.emphasis) {
      html += '<section><h4>Additional Emphasis</h4><p>You told us to pay particular attention to: “' + escapeHtml(answers.emphasis) + '”</p></section>';
    }

    html += '<p class="policy-doc-footer">Prepared with the PrivaCore Payment Verification Policy Generator. This is a practical business process document, not legal advice.</p>';

    return html;
  }

  function initPolicyGenerator(root) {
    // The results section lives outside this widget root (it's a sibling page
    // section, not a descendant), so this is page-scoped rather than root-scoped.
    var doc = root.ownerDocument;
    var form = root.querySelector('[data-pvp-form]');
    var formSec = doc.querySelector('[data-pvp-form-section]');
    var resultsSec = doc.querySelector('[data-pvp-results-section]');
    var output = doc.querySelector('[data-pvp-output]');
    var submitBtn = form.querySelector('[data-pvp-submit]');
    var announcer = root.querySelector('[data-pvp-announcer]');
    if (!form || !formSec || !resultsSec || !output) return;

    var requiredGroups = ['pvp-team-size', 'pvp-approver', 'pvp-payment-size', 'pvp-arrival', 'pvp-has-list'];

    function checkValidity() {
      var complete = requiredGroups.every(function (name) {
        return !!form.querySelector('input[name="' + name + '"]:checked');
      });
      submitBtn.disabled = !complete;
    }
    requiredGroups.forEach(function (name) {
      Array.prototype.forEach.call(form.querySelectorAll('input[name="' + name + '"]'), function (input) {
        input.addEventListener('change', checkValidity);
      });
    });
    checkValidity();

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var answers = {
        teamSize: data.get('pvp-team-size'),
        approver: data.get('pvp-approver'),
        paymentSize: data.get('pvp-payment-size'),
        arrival: data.get('pvp-arrival'),
        hasList: data.get('pvp-has-list'),
        industry: data.get('pvp-industry') || '',
        emphasis: (data.get('pvp-emphasis') || '').trim()
      };
      output.innerHTML = generatePolicy(answers);
      formSec.hidden = true;
      resultsSec.hidden = false;
      if (announcer) announcer.textContent = 'Your policy is ready below.';
      resultsSec.focus();
      resultsSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    var printBtn = doc.querySelector('[data-pvp-print]');
    if (printBtn) printBtn.addEventListener('click', function () { window.print(); });

    var downloadBtn = doc.querySelector('[data-pvp-download]');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', function () {
        var text = output.innerText;
        var blob = new Blob([text], { type: 'text/plain' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'PrivaCore-Payment-Verification-Policy.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    }

    var restartBtn = doc.querySelector('[data-pvp-restart]');
    if (restartBtn) {
      restartBtn.addEventListener('click', function () {
        resultsSec.hidden = true;
        formSec.hidden = false;
        formSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    var emailForm = doc.querySelector('[data-pvp-email-form]');
    if (emailForm) {
      emailForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var summaryField = emailForm.querySelector('[data-pvp-email-summary]');
        if (summaryField) summaryField.value = output.innerText;
        var submitBtn2 = emailForm.querySelector('button[type=submit]');
        submitBtn2.disabled = true;
        fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(new FormData(emailForm)).toString()
        }).then(function (response) {
          if (!response.ok) throw new Error('Policy email submission failed');
          emailForm.hidden = true;
          var success = doc.querySelector('[data-pvp-email-success]');
          if (success) success.hidden = false;
        }).catch(function () {
          submitBtn2.disabled = false;
          alert('Something went wrong — please email info@privacoregroup.com and we will send the policy directly.');
        });
      });
    }
  }

  document.querySelectorAll('[data-policy-generator]').forEach(initPolicyGenerator);
})();
