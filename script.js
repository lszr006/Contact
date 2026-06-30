// Contact form handler
const contactForm = document.getElementById('contactForm');
const submitBtn = contactForm.querySelector('.btn-submit');

contactForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value;
  const message = document.getElementById('message').value.trim();

  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, subject, message }),
    });

    if (!res.ok) throw new Error('Request failed');

    submitBtn.textContent = 'Message Sent!';
    contactForm.reset();
  } catch (err) {
    submitBtn.textContent = 'Failed — Try Again';
  } finally {
    setTimeout(function () {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }, 3000);
  }
});

// Scroll-triggered fade-in animations
function initFadeIn() {
  const targets = document.querySelectorAll(
    '.service-card, .contact-form, .section-title, .contact-subtitle'
  );

  targets.forEach(function (el) {
    el.classList.add('fade-in');
  });

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach(function (el) {
    observer.observe(el);
  });
}

document.addEventListener('DOMContentLoaded', initFadeIn);
