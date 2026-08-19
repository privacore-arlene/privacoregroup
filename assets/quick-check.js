/*
  PrivaCore Quick Check — Microsoft 365 Fraud & Security Check intake gate.
  If the visitor tells us money has already moved to a suspected-fraudulent
  account, this is not a $349 diagnostic anymore — it's an incident. Swap the
  checkout CTA for a direct hand-off to the Incident Response page/call
  instead of letting them buy the wrong thing.
*/
(function () {
  'use strict';

  function initQuickCheck(root) {
    var moneyInputs = root.querySelectorAll('input[name="qc-money-sent"]');
    var normal = root.querySelector('[data-qc-normal]');
    var redirect = root.querySelector('[data-qc-redirect]');
    if (!moneyInputs.length || !normal || !redirect) return;

    Array.prototype.forEach.call(moneyInputs, function (input) {
      input.addEventListener('change', function () {
        var isYes = input.value === 'yes' && input.checked;
        normal.hidden = isYes;
        redirect.hidden = !isYes;
        if (isYes) redirect.focus();
      });
    });
  }

  document.querySelectorAll('[data-quick-check]').forEach(initQuickCheck);
})();
