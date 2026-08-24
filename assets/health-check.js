/*
  PrivaCore Health Check — plain-language, no-score version.
  IMPORTANT DESIGN RULES:
  - There is deliberately no numeric score, percentage, grade, or risk band.
  - Results are not created until all 10 answers are supplied.
  - "Not sure" is a valid information gap, not a failure.
  - This component never recommends a paid package.
  - Answers stay in browser memory only; nothing is sent anywhere.
*/
(function () {
  'use strict';

  var QUESTIONS = [
    {
      category: 'Recovering important files',
      helper: 'Why this matters: backups only help when you can actually restore the information you need.',
      prompt: 'If your business files, client records, booking system, or shared drive were locked or deleted today, could you get them back?',
      choices: [
        ['solid', 'Yes — our important information is backed up, stored separately, and someone has checked that we can restore it.'],
        ['review', 'Partly — we think backups exist, but we have not recently checked whether they work.'],
        ['priority', 'Not yet — we do not have a reliable backup and recovery routine.'],
        ['unknown', 'Not sure — I would need to ask our IT person or software provider.']
      ],
      nextStep: 'Ask the person or provider responsible for backups to show how an important file would be restored, and record who owns that check.'
    },
    {
      category: 'Payment-change requests',
      helper: 'Why this matters: a familiar-looking email can be fake. Never use the phone number included in the change request to verify it.',
      prompt: 'If a supplier emailed to say their bank account had changed, would someone at your company call a known phone number to confirm before sending payment?',
      choices: [
        ['solid', 'Yes — we confirm every payment-detail change by phone or in person, using contact details we already have.'],
        ['review', 'Sometimes — we confirm some changes, depending on the amount or request.'],
        ['priority', 'Not yet — we normally trust payment-change emails from known contacts.'],
        ['unknown', 'Not sure — I do not know what our usual practice is.']
      ],
      nextStep: 'Write and share a simple rule: confirm every payment-detail change using a known contact method before payment is sent.'
    },
    {
      category: 'Suspicious messages',
      helper: 'Why this matters: a simple pause-and-verify process is usually more useful than telling people to "be careful."',
      prompt: 'If a staff member received an unexpected invoice, shared-file request, or urgent email from a manager, would they know how to pause and check it safely?',
      choices: [
        ['solid', 'Yes — staff know the steps to take and have practised or discussed them recently.'],
        ['review', 'Partly — we have talked about scams, but we do not have a consistent process.'],
        ['priority', 'Not yet — staff would be expected to use their own judgment.'],
        ['unknown', 'Not sure — I am not sure what guidance staff have received.']
      ],
      nextStep: 'Give staff one written "pause and verify" rule for unexpected invoices, shared-file requests, and urgent payment emails.'
    },
    {
      category: 'Second sign-in step',
      helper: 'Why this matters: a second sign-in step makes a stolen password much less useful to an attacker.',
      prompt: 'When people sign in to business email, online banking, accounting, or administrator accounts, do they use a second sign-in step, such as a code on a phone or an authenticator app?',
      choices: [
        ['solid', 'Yes — it is turned on for business email, banking, and important administrator accounts.'],
        ['review', 'Partly — some people or accounts use it, but not all important ones.'],
        ['priority', 'Not yet — we usually sign in with only a username and password.'],
        ['unknown', 'Not sure — I need help checking which accounts use it.']
      ],
      nextStep: 'Start by confirming that the second sign-in step is enabled for business email, banking, and administrator accounts.'
    },
    {
      category: 'Software updates',
      helper: 'Why this matters: updates repair known weaknesses that criminals can look for at scale.',
      prompt: 'Is one person or provider responsible for making sure business computers, phones, routers, browsers, and key software receive security updates?',
      choices: [
        ['solid', 'Yes — updates happen automatically where possible, and someone checks the exceptions.'],
        ['review', 'Partly — we update when prompted, but no one owns the full routine.'],
        ['priority', 'Not yet — we rely on whatever was installed by default.'],
        ['unknown', 'Not sure — I do not know who is responsible.']
      ],
      nextStep: 'Name one person or provider responsible for updates, including router, phone, browser, and office-software exceptions.'
    },
    {
      category: 'When systems fail',
      helper: 'Why this matters: a short, usable plan saves time when normal systems are unavailable.',
      prompt: 'If your email, files, booking system, or payment system suddenly stopped working, would your team know who makes decisions and whom to call first?',
      choices: [
        ['solid', 'Yes — we have a simple written plan with contacts and first steps.'],
        ['review', 'Partly — key people have an informal understanding, but it is not written down.'],
        ['priority', 'Not yet — we would work it out in the moment.'],
        ['unknown', 'Not sure — I do not know whether a plan exists.']
      ],
      nextStep: 'Create a one-page first-response list: decision-maker, IT/provider contact, insurer, key systems, and customer/staff communication owner.'
    },
    {
      category: 'Where client information goes',
      helper: 'Why this matters: you cannot make sensible privacy or security decisions if you do not know where information is stored or shared.',
      prompt: 'Could you make a list of the software tools and outside providers that store client or customer information for your business?',
      choices: [
        ['solid', 'Yes — we know the main tools/providers and what client information they hold.'],
        ['review', 'Partly — we know the main ones but have not made a complete list.'],
        ['priority', 'Not yet — we use several tools and have not tracked this.'],
        ['unknown', 'Not sure — I would need help identifying them.']
      ],
      nextStep: 'Make a simple list of the tools and providers that hold client or customer information, who owns each account, and what information they store.'
    },
    {
      category: 'Checking new providers',
      helper: 'Why this matters: outside providers can be helpful, but your business still needs to understand how they handle your information.',
      prompt: 'Before using a new service that will hold client or customer information, do you check what it says about privacy, security, and what happens if there is a problem?',
      choices: [
        ['solid', 'Yes — we use a simple review checklist or ask clear questions before approving it.'],
        ['review', 'Partly — we usually look at the provider, but not in a consistent way.'],
        ['priority', 'Not yet — we choose tools mainly for price or convenience.'],
        ['unknown', 'Not sure — I do not know how providers are approved.']
      ],
      nextStep: 'Use a short provider checklist before a new tool stores client information: what it holds, where it is stored, how incidents are reported, and how data can be returned or deleted.'
    },
    {
      category: 'Explaining privacy to customers',
      helper: 'Why this matters: privacy responsibilities depend on your business, location, and activities. A clear public notice is one practical starting point, not a substitute for advice.',
      prompt: 'Can a customer easily find a current, plain-language explanation of what personal information your business collects, why you use it, and whom to contact with a privacy question?',
      choices: [
        ['solid', 'Yes — we have a current privacy notice and know who is responsible for privacy questions.'],
        ['review', 'Partly — we have a policy or website notice, but it may be out of date or hard to find.'],
        ['priority', 'Not yet — we do not have a clear privacy notice or owner.'],
        ['unknown', 'Not sure — I would need someone to review what we have.']
      ],
      nextStep: 'Find your current privacy notice, confirm that a customer can locate it easily, and name the person responsible for privacy questions.'
    },
    {
      category: 'Independent review',
      helper: 'Why this matters: an independent review should give you clarity and a practical sequence of next steps—not simply a list of problems.',
      prompt: 'In the last two years, has someone independent reviewed your business’s actual security and privacy practices and given you a written list of priorities?',
      choices: [
        ['solid', 'Yes — we received a written review and have acted on the priorities.'],
        ['review', 'Partly — someone looked at parts of our setup, but we did not get a complete written plan.'],
        ['priority', 'Not yet — this would be our first independent review.'],
        ['unknown', 'Not sure — I do not know whether a review was completed.']
      ],
      nextStep: 'Gather any prior review or IT-provider documentation. If none exists, identify the business questions you need an independent review to answer.'
    }
  ];

  function escapeHtml(value) {
    return value.replace(/[&<>'"]/g, function (character) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[character];
    });
  }

  function initHealthCheck(root) {
    var state = { current: 0, answers: new Array(QUESTIONS.length).fill(null) };

    root.innerHTML =
      '<div class="hc-card">' +
        '<div data-hc-panel>' +
          '<div class="hc-progress-row">' +
            '<p class="hc-step" data-hc-step>Question 1 of 10</p>' +
            '<p class="hc-category" data-hc-category></p>' +
          '</div>' +
          '<div class="hc-progress-track" aria-hidden="true"><div class="hc-progress-fill" data-hc-progress></div></div>' +
          '<div class="sr-only" data-hc-announcer aria-live="polite" aria-atomic="true"></div>' +
          '<form novalidate>' +
            '<fieldset class="hc-fieldset" data-hc-fieldset></fieldset>' +
            '<div class="hc-navigation">' +
              '<button class="hc-button hc-button-secondary" type="button" data-hc-back data-testid="hc-back-button" hidden>← Back</button>' +
              '<button class="hc-button hc-button-primary" type="button" data-hc-next data-testid="hc-next-button" disabled>Next →</button>' +
            '</div>' +
          '</form>' +
        '</div>' +
        '<section class="hc-results" data-hc-results hidden tabindex="-1" aria-labelledby="hc-results-title">' +
          '<p class="hc-eyebrow">Your self-check summary</p>' +
          '<h3 id="hc-results-title">Here is what to confirm next.</h3>' +
          '<p class="hc-results-intro">This is a summary of your self-reported answers, not a security rating. It does not test systems or establish legal compliance.</p>' +
          '<div class="hc-summary-grid">' +
            '<section class="hc-summary hc-summary-good" aria-labelledby="hc-solid-title">' +
              '<h4 id="hc-solid-title">What looks solid</h4>' +
              '<ul data-hc-solid-list></ul>' +
            '</section>' +
            '<section class="hc-summary hc-summary-check" aria-labelledby="hc-check-title">' +
              '<h4 id="hc-check-title">What to clarify</h4>' +
              '<ul data-hc-check-list></ul>' +
            '</section>' +
          '</div>' +
          '<section class="hc-next-steps" aria-labelledby="hc-next-steps-title">' +
            '<h4 id="hc-next-steps-title">Three practical next steps</h4>' +
            '<ol data-hc-priority-list></ol>' +
          '</section>' +
          '<p class="hc-results-note"><strong>What a Fraud &amp; Cyber Risk Assessment adds:</strong> this free check is self-reported and educational. An assessment reviews evidence, workflows, and priorities in the context of your business.</p>' +
          '<p class="hc-results-note" data-testid="hc-assessment-nudge"><strong>Concerned about what this could mean for your business?</strong> <a href="/contact?interest=fraud-cyber-risk-assessment">Request a Fraud &amp; Cyber Risk Assessment →</a></p>' +
          '<div class="hc-email-capture" data-testid="hc-email-capture">' +
            '<p class="hc-email-label">Want the prioritized checklist emailed to you? <span>(optional — your results above are already complete without it)</span></p>' +
            '<form class="hc-email-form" name="privacore-risk-check-email" method="POST" data-netlify="true" data-hc-email-form data-testid="hc-email-form">' +
              '<input type="hidden" name="form-name" value="privacore-risk-check-email">' +
              '<label class="sr-only" for="hc-email-input">Email address</label>' +
              '<input class="finp" type="email" id="hc-email-input" name="email" placeholder="you@yourbusiness.com" required data-testid="hc-email-input">' +
              '<button class="hc-button hc-button-primary" type="submit" data-testid="hc-email-submit">Email me the checklist</button>' +
            '</form>' +
            '<p class="hc-email-success" data-hc-email-success hidden data-testid="hc-email-success">Thanks — we\'ll send that over shortly.</p>' +
          '</div>' +
          '<div class="hc-results-actions">' +
            '<a class="hc-button hc-button-primary" href="/contact?interest=fraud-cyber-risk-assessment" data-testid="hc-assessment-link">Request a Fraud &amp; Cyber Risk Assessment</a>' +
            '<a class="hc-button hc-button-secondary" href="/contact?interest=health-check-results" data-testid="hc-talk-results-link">Talk through my results — free</a>' +
            '<button class="hc-button hc-button-secondary" type="button" data-hc-restart data-testid="hc-retake-button">← Retake the Business Fraud Check</button>' +
          '</div>' +
        '</section>' +
      '</div>';

    var panel = root.querySelector('[data-hc-panel]');
    var results = root.querySelector('[data-hc-results]');
    var fieldset = root.querySelector('[data-hc-fieldset]');
    var step = root.querySelector('[data-hc-step]');
    var category = root.querySelector('[data-hc-category]');
    var progress = root.querySelector('[data-hc-progress]');
    var announcer = root.querySelector('[data-hc-announcer]');
    var back = root.querySelector('[data-hc-back]');
    var next = root.querySelector('[data-hc-next]');
    var emailForm = root.querySelector('[data-hc-email-form]');
    if (emailForm) {
      emailForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var submitBtn = emailForm.querySelector('button[type=submit]');
        submitBtn.disabled = true;
        fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(new FormData(emailForm)).toString()
        }).then(function (response) {
          if (!response.ok) throw new Error('Email checklist submission failed');
          emailForm.hidden = true;
          var success = root.querySelector('[data-hc-email-success]');
          success.hidden = false;
        }).catch(function () {
          submitBtn.disabled = false;
          alert('Something went wrong — please email info@privacoregroup.com and we will send the checklist directly.');
        });
      });
    }

    function renderQuestion(moveFocus) {
      var question = QUESTIONS[state.current];
      var currentAnswer = state.answers[state.current];
      var number = state.current + 1;
      step.textContent = 'Question ' + number + ' of ' + QUESTIONS.length;
      category.textContent = question.category;
      progress.style.width = (number / QUESTIONS.length) * 100 + '%';
      fieldset.innerHTML =
        '<p class="hc-helper">' + escapeHtml(question.helper) + '</p>' +
        '<legend class="hc-legend" tabindex="-1" data-testid="hc-question-heading">' + escapeHtml(question.prompt) + '</legend>' +
        '<div class="hc-options">' +
          question.choices.map(function (choice) {
            return '<label class="hc-option" data-testid="hc-choice-' + choice[0] + '">' +
              '<input type="radio" name="hc-answer" value="' + choice[0] + '"' + (currentAnswer === choice[0] ? ' checked' : '') + '>' +
              '<span>' + escapeHtml(choice[1]) + '</span>' +
            '</label>';
          }).join('') +
        '</div>';
      back.hidden = state.current === 0;
      next.textContent = state.current === QUESTIONS.length - 1 ? 'See my summary →' : 'Next →';
      next.disabled = currentAnswer === null;
      announcer.textContent = 'Question ' + number + ' of ' + QUESTIONS.length + ': ' + question.category + '.';
      Array.prototype.forEach.call(fieldset.querySelectorAll('input'), function (input) {
        input.addEventListener('change', function (event) {
          state.answers[state.current] = event.target.value;
          next.disabled = false;
          announcer.textContent = 'Answer selected. Choose Next to continue.';
        });
      });
      if (moveFocus) {
        var legend = fieldset.querySelector('.hc-legend');
        if (legend && legend.focus) legend.focus();
      }
    }

    function addListItem(list, text) {
      var item = document.createElement('li');
      item.textContent = text;
      list.appendChild(item);
    }

    function showResults() {
      panel.hidden = true;
      results.hidden = false;
      var grouped = { solid: [], review: [], priority: [], unknown: [] };
      state.answers.forEach(function (answer, index) { grouped[answer].push(QUESTIONS[index]); });

      var solidList = root.querySelector('[data-hc-solid-list]');
      var checkList = root.querySelector('[data-hc-check-list]');
      var priorityList = root.querySelector('[data-hc-priority-list]');
      solidList.replaceChildren();
      checkList.replaceChildren();
      priorityList.replaceChildren();

      if (grouped.solid.length) {
        grouped.solid.forEach(function (question) { addListItem(solidList, question.category); });
      } else {
        addListItem(solidList, 'No areas were marked fully in place yet. That is a starting point for practical improvement, not a failure label.');
      }

      grouped.review.concat(grouped.unknown).forEach(function (question) { addListItem(checkList, question.category); });
      if (!checkList.children.length) addListItem(checkList, 'No areas were marked partly in place or not sure.');

      var priorities = grouped.priority.concat(grouped.review, grouped.unknown).slice(0, 3);
      if (priorities.length) {
        priorities.forEach(function (question) { addListItem(priorityList, question.nextStep); });
      } else {
        addListItem(priorityList, 'Review your current practices annually and update your written contacts, providers, and responsibilities when they change.');
      }

      announcer.textContent = 'Your self-check summary is now shown.';
      results.focus();
    }

    next.addEventListener('click', function () {
      if (state.answers[state.current] === null) return;
      if (state.current === QUESTIONS.length - 1) {
        showResults();
        return;
      }
      state.current += 1;
      renderQuestion(true);
    });

    back.addEventListener('click', function () {
      if (state.current === 0) return;
      state.current -= 1;
      renderQuestion(true);
    });

    root.querySelector('[data-hc-restart]').addEventListener('click', function () {
      state.current = 0;
      state.answers.fill(null);
      results.hidden = true;
      panel.hidden = false;
      renderQuestion(true);
    });

    renderQuestion(false);
  }

  document.querySelectorAll('[data-health-check]').forEach(initHealthCheck);
})();
