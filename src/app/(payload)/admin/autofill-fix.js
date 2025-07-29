// Fix autofill issues on login page
if (typeof window !== 'undefined') {
  // Function to fix autofilled inputs
  function fixAutofill() {
    const inputs = document.querySelectorAll(
      '.login__form input[type="email"], .login__form input[type="password"]'
    );

    inputs.forEach((input) => {
      // Force a style recalculation
      input.style.fontSize = '15px';
      input.style.padding = '14px 16px';

      // Check if input is autofilled
      try {
        const isAutofilled = input.matches(':-webkit-autofill');
        if (isAutofilled) {
          // Force focus/blur to apply styles
          input.blur();

          // Re-apply styles
          setTimeout(() => {
            input.style.fontSize = '15px';
            input.style.padding = '14px 16px';
          }, 10);
        }
      } catch {
        // Fallback for browsers that don't support :autofill
      }

      // Fix double-click issue
      input.addEventListener('focus', function () {
        this.select();
      });
    });
  }

  // Run on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixAutofill);
  } else {
    fixAutofill();
  }

  // Run after a delay to catch late autofills
  setTimeout(fixAutofill, 100);
  setTimeout(fixAutofill, 500);
  setTimeout(fixAutofill, 1000);

  // Watch for changes
  const observer = new MutationObserver(fixAutofill);
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['value'],
  });
}
