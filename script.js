/* ============================================================
   ALTRADOR — SCRIPT.JS
   Theme toggle · Nav · Scroll reveal · Footer year
   ============================================================ */

(function () {
  'use strict';

  /* ---- THEME TOGGLE ---- */
  const html        = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const STORAGE_KEY = 'altrador-theme';

  function getPreferredTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }

  // Init theme immediately (before paint to avoid flicker)
  applyTheme(getPreferredTheme());

  themeToggle.addEventListener('click', function () {
    const current = html.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  // Sync if user changes OS preference
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function (e) {
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyTheme(e.matches ? 'light' : 'dark');
    }
  });

  /* ---- MOBILE NAV ---- */
  const hamburger = document.getElementById('hamburger-btn');
  const navLinks  = document.getElementById('nav-links');

  function toggleNav(forceClose) {
    const isOpen = navLinks.classList.contains('nav-open');
    if (forceClose || isOpen) {
      navLinks.classList.remove('nav-open');
      hamburger.setAttribute('aria-expanded', 'false');
    } else {
      navLinks.classList.add('nav-open');
      hamburger.setAttribute('aria-expanded', 'true');
    }
  }

  hamburger.addEventListener('click', () => toggleNav());

  // Close on nav link click
  navLinks.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      if (window.innerWidth < 768) toggleNav(true);
    });
  });

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (
      navLinks.classList.contains('nav-open') &&
      !navLinks.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      toggleNav(true);
    }
  });

  // Close nav on resize to desktop
  window.addEventListener('resize', function () {
    if (window.innerWidth >= 768) toggleNav(true);
  });

  /* ---- SCROLL REVEAL ---- */
  const revealEls = document.querySelectorAll('[data-reveal]');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback for older browsers
    revealEls.forEach(function (el) {
      el.classList.add('revealed');
    });
  }

  /* ---- NAV SCROLL SHADOW ---- */
  const navWrapper = document.querySelector('.nav-wrapper');

  function handleNavScroll() {
    if (window.scrollY > 20) {
      navWrapper.style.boxShadow = '0 1px 32px rgba(0,0,0,0.25)';
    } else {
      navWrapper.style.boxShadow = 'none';
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });

  /* ---- ACTIVE NAV LINK ON SCROLL ---- */
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinkEls.forEach(function (link) {
            link.classList.toggle(
              'nav-link--active',
              link.getAttribute('href') === '#' + id
            );
          });
        }
      });
    },
    { rootMargin: '-40% 0px -40% 0px' }
  );

  sections.forEach(function (sec) { sectionObserver.observe(sec); });

  /* ---- FOOTER YEAR ---- */
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- SMOOTH ANCHOR SCROLL (fallback for older browsers) ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
