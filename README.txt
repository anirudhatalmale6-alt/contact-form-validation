CONTACT FORM VALIDATION — vanilla JS, no libraries
==================================================

Files
-----
  index.html   the form markup
  styles.css   your styles + a small block for error/success states
  script.js    the validation logic (this is the only new file)


What it does
------------
  * Blocks the page refresh on submit (event.preventDefault()).
  * Name: required, 2+ characters, letters/spaces/hyphens/apostrophes
    (so O'Brien, Anne-Marie and Jr. all pass).
  * Email: required, must look like name@example.com.
  * Errors appear inline under each field, both at once, and clear
    themselves as soon as the visitor fixes them.
  * On success: an inline confirmation panel appears below the button,
    styled with the same radius / type scale / spacing as the card,
    and the form resets.


Dropping this into YOUR existing markup
---------------------------------------
script.js finds everything by id. If you keep these ids, nothing else
needs to change:

  form ...........  id="contactForm"   (plus the novalidate attribute,
                                        so the browser's own popups stay
                                        out of the way)
  name input .....  id="name"
  email input ....  id="email"
  name error .....  id="nameError"     <span> under the name field
  email error ....  id="emailError"    <span> under the email field

Each input should sit inside an element with class="field" — that's the
wrapper the red border is applied to.

Then paste the success panel block from index.html (the div with
id="formSuccess") wherever you want the message to appear, and copy the
two commented sections at the bottom of styles.css ("Validation states"
and "Success message").

If your ids differ, just change the getElementById calls at the top of
script.js — they're all in one place.


Hooking up a real send
----------------------
Right now a valid submit shows the confirmation straight away. To post
to a backend instead, replace the showSuccess(...) call in the submit
handler with your fetch(), and call showSuccess() in its .then().


Notes
-----
  * No libraries, no frameworks, no build step. Open index.html directly.
  * The visitor's name and email go into the message via textContent,
    never innerHTML, so typed markup can't execute.
  * The success panel uses aria-live="polite" and the errors use
    role="alert", so screen readers announce them.
  * The fade-in respects prefers-reduced-motion, and it only animates —
    the message is visible with animations off.
  * Tested in Chromium at 1000px and 390px wide: 37 checks, all passing.
