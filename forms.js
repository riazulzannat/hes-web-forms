// Helios Equipment Services - client-side checks for the web forms (UI-07).
// The browser checks the required fields, e-mail format and lengths; this script
// shows the messages, blocks sending until the reCAPTCHA box is ticked, and stops
// a second click from creating a duplicate lead or case.
// Salesforce still re-checks everything on its side (reCAPTCHA, restricted picklists).
(function () {
  var forms = document.querySelectorAll('form[data-validate]');
  Array.prototype.forEach.call(forms, function (form) {
    var captchaError = form.querySelector('#captcha-error');
    var submitButton = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', function (event) {
      var fieldsOk = form.checkValidity();
      var captchaOk = typeof grecaptcha !== 'undefined' && grecaptcha.getResponse().length > 0;

      form.classList.add('was-validated');
      if (captchaError) {
        captchaError.classList.toggle('show', !captchaOk);
      }

      if (!fieldsOk || !captchaOk) {
        event.preventDefault();
        var firstInvalid = form.querySelector(':invalid');
        if (firstInvalid) {
          firstInvalid.focus();
        }
        return;
      }
      submitButton.disabled = true;
      submitButton.dataset.label = submitButton.textContent;
      submitButton.textContent = 'Sending…';
    });

    // If the visitor comes back with the browser's Back button, make the button usable again.
    window.addEventListener('pageshow', function () {
      if (submitButton.dataset.label) {
        submitButton.disabled = false;
        submitButton.textContent = submitButton.dataset.label;
      }
    });
  });
})();
