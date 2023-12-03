'use strict';
const headerEl = document.querySelector('.header');
const btnNavMenu = document.querySelector('.btn-mobile-nav');
const yearEl = document.querySelector('.year');
const allLinks = document.querySelectorAll('a:link');

//* Toggle navigation menu function
const handleMobileMenu = () => headerEl.classList.toggle('nav-open');

// Handle listener
btnNavMenu.addEventListener('click', handleMobileMenu);

//* Set and update current year on footer
const currentYear = new Date().getFullYear();
yearEl.textContent = currentYear;

//* Smooth scrolling animation
allLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const href = link.getAttribute('href');

    // Scroll back to top
    if (href === '#') window.scrollTo({ top: 0, behavior: 'smooth' });

    // Scroll to certain section in HTML
    if (href !== '#' && href.startsWith('#')) {
      const sectionToScroll = document.querySelector(href);
      sectionToScroll.scrollIntoView({ behavior: 'smooth' });
    }

    // Close mobile navigation
    if (link.classList.contains('main-nav-link'))
      headerEl.classList.remove('nav-open');
  });
});

//* Implementing sticky navigation
const sectionHeroEl = document.querySelector('.section-hero');
const observerOptions = {
  // In the vieport
  root: null,
  threshold: 0,
  rootMargin: '-80px',
};
const observer = new IntersectionObserver(function (entries) {
  const ent = entries[0];
  !ent.isIntersecting
    ? document.body.classList.add('sticky')
    : document.body.classList.remove('sticky');
}, observerOptions);
observer.observe(sectionHeroEl);
