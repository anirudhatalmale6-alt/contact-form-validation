/* ------------------------------------------------------------------
   Contact form validation — plain vanilla JS, no libraries.
   - Blocks the page refresh on submit
   - Validates Name and Email
   - Shows an inline success message that matches the card design
   ------------------------------------------------------------------ */
(function () {
  'use strict';

  var form = document.getElementById('contactForm');
  if (!form) return;                       // nothing to do on pages without the form

  var nameInput  = document.getElementById('name');
  var emailInput = document.getElementById('email');
  var nameError  = document.getElementById('nameError');
  var emailError = document.getElementById('emailError');

  var successBox   = document.getElementById('formSuccess');
  var successName  = document.getElementById('successName');
  var successEmail = document.getElementById('successEmail');

  /* A deliberately practical email test: something@something.tld
     - no spaces, exactly one @
     - at least one dot in the domain, TLD of 2+ letters
     Intentionally not RFC-5322-complete; that regex rejects real addresses
     more often than it catches fake ones. */
  var EMAIL_RE = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)*\.[A-Za-z]{2,}$/;

  /* ---------------- helpers ---------------- */

  function setError(input, errorEl, message) {
    var field = input.closest('.field');
    if (field) field.classList.add('is-invalid');
    input.setAttribute('aria-invalid', 'true');
    errorEl.textContent = message;
  }

  function clearError(input, errorEl) {
    var field = input.closest('.field');
    if (field) field.classList.remove('is-invalid');
    input.removeAttribute('aria-invalid');
    errorEl.textContent = '';
  }

  /* ---------------- rules ---------------- */

  function validateName() {
    var value = nameInput.value.trim();

    if (value === '') {
      setError(nameInput, nameError, 'Please enter your name.');
      return false;
    }
    if (value.length < 2) {
      setError(nameInput, nameError, 'Name must be at least 2 characters.');
      return false;
    }
    // Letters, spaces, hyphens, apostrophes and dots — covers O'Brien, Anne-Marie, Jr.
    if (!/^[\p{L}][\p{L}\s'.-]*$/u.test(value)) {
      setError(nameInput, nameError, 'Please use letters only (spaces, hyphens and apostrophes are fine).');
      return false;
    }

    clearError(nameInput, nameError);
    return true;
  }

  function validateEmail() {
    var value = emailInput.value.trim();

    if (value === '') {
      setError(emailInput, emailError, 'Please enter your email address.');
      return false;
    }
    if (!EMAIL_RE.test(value)) {
      setError(emailInput, emailError, 'Please enter a valid email address, e.g. name@example.com.');
      return false;
    }

    clearError(emailInput, emailError);
    return true;
  }

  /* ---------------- success panel ---------------- */

  function showSuccess(name, email) {
    // textContent, never innerHTML — whatever the visitor typed stays inert text
    successName.textContent  = name;
    successEmail.textContent = email;

    successBox.hidden = false;
    // restart the entrance animation on repeat submissions
    successBox.classList.remove('is-visible');
    void successBox.offsetWidth;
    successBox.classList.add('is-visible');
  }

  function hideSuccess() {
    successBox.hidden = true;
    successBox.classList.remove('is-visible');
  }

  /* ---------------- events ---------------- */

  form.addEventListener('submit', function (event) {
    event.preventDefault();               // keeps the page from refreshing

    var nameOk  = validateName();
    var emailOk = validateEmail();        // both run, so both errors show at once

    if (!nameOk || !emailOk) {
      hideSuccess();
      (nameOk ? emailInput : nameInput).focus();
      return;
    }

    showSuccess(nameInput.value.trim(), emailInput.value.trim());
    form.reset();
    // drop any leftover red states the reset doesn't clear
    clearError(nameInput, nameError);
    clearError(emailInput, emailError);
  });

  /* Re-check a field once it has been flagged, so the red state clears as the
     visitor fixes it — but stay quiet on first typing. */
  nameInput.addEventListener('input', function () {
    if (nameInput.closest('.field').classList.contains('is-invalid')) validateName();
  });

  emailInput.addEventListener('input', function () {
    if (emailInput.closest('.field').classList.contains('is-invalid')) validateEmail();
  });

  nameInput.addEventListener('blur', function () {
    if (nameInput.value.trim() !== '') validateName();
  });

  emailInput.addEventListener('blur', function () {
    if (emailInput.value.trim() !== '') validateEmail();
  });

  // Typing again after a successful send hides the old confirmation
  form.addEventListener('input', function () {
    if (!successBox.hidden) hideSuccess();
  }, true);
})();
