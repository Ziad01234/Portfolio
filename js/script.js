/**
 * Portfolio JavaScript
 * Developer: Ziad Sayed
 * Role: Back-End .NET Developer
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. THEME SWITCHER (Dark/Light Mode)
  // --------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const htmlElement = document.documentElement;

  // Retrieve stored theme or default to 'dark'
  const savedTheme = localStorage.getItem('ziad_portfolio_theme') || 'dark';
  setTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
      showToast(`Switched to ${newTheme} mode`);
    });
  }

  function setTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem('ziad_portfolio_theme', theme);
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    }
  }

  // --------------------------------------------------------------------------
  // 2. SCROLL PROGRESS INDICATOR & NAVBAR SHADOW
  // --------------------------------------------------------------------------
  const scrollProgressBar = document.getElementById('scroll-progress');
  const navbar = document.querySelector('.navbar');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercentage = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (scrollProgressBar) {
      scrollProgressBar.style.width = `${scrollPercentage}%`;
    }

    if (navbar) {
      if (scrollTop > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  }, { passive: true });

  // --------------------------------------------------------------------------
  // 3. MOBILE NAVIGATION DRAWER
  // --------------------------------------------------------------------------
  const mobileNavToggle = document.getElementById('mobile-nav-toggle');
  const navLinksContainer = document.getElementById('nav-links');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileNavToggle && navLinksContainer) {
    mobileNavToggle.addEventListener('click', () => {
      const isOpen = navLinksContainer.classList.toggle('open');
      mobileNavToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navLinksContainer.classList.contains('open')) {
          navLinksContainer.classList.remove('open');
          mobileNavToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navLinksContainer.contains(e.target) && !mobileNavToggle.contains(e.target)) {
        if (navLinksContainer.classList.contains('open')) {
          navLinksContainer.classList.remove('open');
          mobileNavToggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
  }

  // --------------------------------------------------------------------------
  // 4. SCROLL SPY (ACTIVE NAV LINK HIGHLIGHTING)
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const matchingLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

      if (matchingLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          matchingLink.classList.add('active');
        } else {
          matchingLink.classList.remove('active');
        }
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  updateActiveNavLink();

  // --------------------------------------------------------------------------
  // 5. INTERSECTION OBSERVER FOR FADE-IN ANIMATIONS
  // --------------------------------------------------------------------------
  const fadeElements = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window) {
    const fadeObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    fadeElements.forEach(el => fadeObserver.observe(el));
  } else {
    // Fallback for older browsers
    fadeElements.forEach(el => el.classList.add('is-visible'));
  }

  // --------------------------------------------------------------------------
  // 6. COPY TO CLIPBOARD HELPERS WITH TOAST
  // --------------------------------------------------------------------------
  const copyEmailBtns = document.querySelectorAll('.js-copy-email');
  const targetEmail = 'ziad2006sayed2006@gmail.com';
  const copyPhoneBtns = document.querySelectorAll('.js-copy-phone');
  const targetPhone = '+20 155 500 2293';

  function copyTextToClipboard(text, successMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => {
          showToast(successMsg);
        })
        .catch(() => {
          fallbackCopy(text, successMsg);
        });
    } else {
      fallbackCopy(text, successMsg);
    }
  }

  copyEmailBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      copyTextToClipboard(targetEmail, 'Email address copied to clipboard!');
    });
  });

  copyPhoneBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      copyTextToClipboard(targetPhone, 'Phone number copied: +20 155 500 2293');
    });
  });

  function fallbackCopy(text, successMsg) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand('copy');
      showToast(successMsg || 'Copied to clipboard!');
    } catch (err) {
      showToast(text);
    }
    document.body.removeChild(tempInput);
  }

  // --------------------------------------------------------------------------
  // 7. TOAST NOTIFICATION UTILITY
  // --------------------------------------------------------------------------
  const toast = document.getElementById('toast-notification');
  const toastMessage = document.getElementById('toast-message');
  let toastTimer = null;

  function showToast(message) {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = message;
    toast.classList.add('active');

    if (toastTimer) clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.remove('active');
    }, 3200);
  }

  // --------------------------------------------------------------------------
  // 8. CONTACT FORM SUBMISSION HANDLER
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('sender-name');
      const emailInput = document.getElementById('sender-email');
      const subjectInput = document.getElementById('message-subject');
      const messageInput = document.getElementById('message-body');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const subject = subjectInput ? subjectInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';

      if (!name || !email || !message) {
        if (formStatus) {
          formStatus.className = 'form-status error';
          formStatus.textContent = 'Please fill out all required fields.';
        }
        return;
      }

      // Format mailto link for direct sending via user's email client
      const encodedSubject = encodeURIComponent(subject ? `[Portfolio Contact] ${subject}` : `[Portfolio Contact] Message from ${name}`);
      const encodedBody = encodeURIComponent(`Hello Ziad,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n`);
      const mailtoLink = `mailto:${targetEmail}?subject=${encodedSubject}&body=${encodedBody}`;

      if (formStatus) {
        formStatus.className = 'form-status success';
        formStatus.innerHTML = `
          <strong>Thank you, ${escapeHTML(name)}!</strong><br>
          Your message is prepared. Opening your mail app, or click below:
          <div style="margin-top: 0.5rem;">
            <a href="${mailtoLink}" class="btn btn-sm btn-primary" style="margin-right: 0.5rem;">
              Send via Email App
            </a>
          </div>
        `;
      }

      // Launch mailto client
      window.location.href = mailtoLink;

      showToast('Drafting message in your email client...');
      contactForm.reset();
    });
  }

  function escapeHTML(str) {
    const p = document.createElement('p');
    p.appendChild(document.createTextNode(str));
    return p.innerHTML;
  }

  // --------------------------------------------------------------------------
  // 9. SMOOTH SCROLL FOR BACK-TO-TOP & ANCHORS
  // --------------------------------------------------------------------------
  const backToTopBtn = document.getElementById('back-to-top-btn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --------------------------------------------------------------------------
  // 10. PROFILE PHOTO VARIATION SWITCHER
  // --------------------------------------------------------------------------
  const photoSwitchBtns = document.querySelectorAll('.photo-switch-btn');
  const aboutAvatarImg = document.getElementById('about-avatar-img');

  if (photoSwitchBtns.length > 0 && aboutAvatarImg) {
    photoSwitchBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const newSrc = btn.getAttribute('data-src');
        if (newSrc && !aboutAvatarImg.src.endsWith(newSrc)) {
          aboutAvatarImg.style.opacity = '0.3';
          aboutAvatarImg.style.transform = 'scale(0.95)';
          
          setTimeout(() => {
            aboutAvatarImg.src = newSrc;
            aboutAvatarImg.style.opacity = '1';
            aboutAvatarImg.style.transform = 'scale(1)';
          }, 160);

          photoSwitchBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          showToast(`Photo updated: ${btn.textContent.trim()}`);
        }
      });
    });
  }
});

