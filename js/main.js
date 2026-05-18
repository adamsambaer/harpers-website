/* ═══════════════════════════════════════════════════════════════
   HARPER'S — main.js
   Nav · Scroll Reveal · Game Day Words · Nightlife Slideshow
   Spotlight · Counters · Merch Tilt · Parallax
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── 0. HERO VIDEO: Loop 2 seconds early ─── */
  const heroVideo = document.querySelector('.hero-video');
  if (heroVideo) {
    heroVideo.addEventListener('timeupdate', function () {
      if (this.duration && this.currentTime >= this.duration - 2) {
        this.currentTime = 0;
      }
    });
  }

  /* ─── 1. NAV: Transparent → Frosted Glass on Scroll ─── */
  const nav = document.getElementById('site-nav');
  const hamburger = document.getElementById('nav-hamburger');
  const navLinks = document.getElementById('nav-links');
  const navOverlay = document.getElementById('nav-overlay');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  function toggleMobileNav(open) {
    navLinks.classList.toggle('mobile-open', open);
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
    navOverlay.style.display = open ? 'block' : 'none';
    document.body.style.overflow = open ? 'hidden' : '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.contains('mobile-open');
    toggleMobileNav(!isOpen);
  });
  navOverlay.addEventListener('click', () => toggleMobileNav(false));

  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => toggleMobileNav(false));
  });

  /* ─── 2. SMOOTH SCROLL for anchor links ─── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = nav.offsetHeight + 8;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    });
  });

  /* ─── 3. GENERAL SCROLL REVEAL (Intersection Observer) ─── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ─── 4. GAME DAY: Word-by-word staggered reveal ─── */
  const words = document.querySelectorAll('.wd');
  const gamedayHeading = document.getElementById('gameday-heading');

  if (words.length && gamedayHeading) {
    const wordObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          words.forEach((word, i) => {
            setTimeout(() => {
              word.classList.add('visible');
              if (i === words.length - 1) {
                gamedayHeading.classList.add('words-visible');
              }
            }, i * 80);
          });
          wordObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    wordObserver.observe(gamedayHeading);
  }

  /* ─── 5. NIGHTLIFE SLIDESHOW: Auto-advance crossfade ─── */
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  let currentSlide = 0;
  let slideshowTimer = null;

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  function startSlideshow() {
    slideshowTimer = setInterval(() => goToSlide(currentSlide + 1), 5000);
  }

  function resetSlideshow() {
    clearInterval(slideshowTimer);
    startSlideshow();
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goToSlide(parseInt(dot.dataset.slide));
      resetSlideshow();
    });
  });

  if (slides.length > 1) startSlideshow();

  /* ─── 6. NIGHTLIFE SPOTLIGHT: Follows mouse position ─── */
  const nightlifeSection = document.querySelector('.nightlife');
  const nightlifeGlow = document.getElementById('nightlife-glow');

  if (nightlifeSection && nightlifeGlow) {
    nightlifeSection.addEventListener('mousemove', (e) => {
      const rect = nightlifeSection.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      nightlifeGlow.style.setProperty('--gx', x + '%');
      nightlifeGlow.style.setProperty('--gy', y + '%');
    }, { passive: true });

    nightlifeSection.addEventListener('mouseleave', () => {
      nightlifeGlow.style.setProperty('--gx', '50%');
      nightlifeGlow.style.setProperty('--gy', '50%');
    });
  }

  /* ─── 7. COUNTER ANIMATION: Gives Back + Game Day stats ─── */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';

    if (prefersReducedMotion) {
      el.textContent = prefix + target.toLocaleString() + suffix;
      return;
    }

    const duration = 2200;
    let start = null;

    function step(timestamp) {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.round(easeOutQuart(progress) * target);
      el.textContent = prefix + value.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

  /* ─── 8. MERCH ITEMS: 3D tilt on hover ─── */
  document.querySelectorAll('.merch-item').forEach(item => {
    item.addEventListener('mousemove', (e) => {
      const rect = item.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      item.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.02)`;
    });
    item.addEventListener('mouseleave', () => {
      item.style.transform = 'perspective(900px) rotateY(0) rotateX(0) scale(1)';
      setTimeout(() => { item.style.transform = ''; }, 300);
    });
  });

  /* ─── 9. FOOD ITEMS: Reveal stagger override via parent ─── */
  const foodGrid = document.querySelector('.food-grid');
  if (foodGrid) {
    const foodObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const items = entry.target.querySelectorAll('.food-item');
          items.forEach((item, i) => {
            setTimeout(() => item.classList.add('visible'), i * 90);
          });
          foodObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    foodObserver.observe(foodGrid);
  }

  /* ─── 10. PATIO: Horizontal parallax on photos ─── */
  const patioPhotos = document.querySelectorAll('.patio-photo img');
  if (patioPhotos.length) {
    window.addEventListener('scroll', () => {
      patioPhotos.forEach((img, i) => {
        const rect = img.closest('.patio-photo').getBoundingClientRect();
        const center = rect.top + rect.height / 2 - window.innerHeight / 2;
        const shift = (center / window.innerHeight) * 24 * (i % 2 === 0 ? 1 : -1);
        img.style.transform = `translateX(${shift}px) scale(1.08)`;
      });
    }, { passive: true });
  }

  /* ─── 11. HERO: Hide scroll cue on scroll ─── */
  const scrollCue = document.querySelector('.hero-scroll-cue');
  if (scrollCue) {
    window.addEventListener('scroll', () => {
      scrollCue.style.opacity = window.scrollY > 80 ? '0' : '1';
    }, { passive: true });
  }

  /* ─── 12. GAME DAY: Parallax background drift ─── */
  const gamedayImg = document.querySelector('.gameday-img');
  if (gamedayImg) {
    window.addEventListener('scroll', () => {
      const rect = gamedayImg.closest('.gameday').getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const progress = rect.top / window.innerHeight;
      gamedayImg.style.transform = `scale(1.14) translateY(${progress * 44}px)`;
    }, { passive: true });
  }

  /* ─── 13. BREWERY SECTION: Parallax background drift ─── */
  const breweryImg = document.querySelector('.brewery-img');
  if (breweryImg) {
    window.addEventListener('scroll', () => {
      const rect = breweryImg.closest('.brewery').getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const progress = rect.top / window.innerHeight;
      breweryImg.style.transform = `scale(1.14) translateY(${progress * 44}px)`;
    }, { passive: true });
  }

  /* ─── 14. DRINK ARM: Scroll-driven — follows your scroll through the section ─── */
  const drinkArmWrap = document.querySelector('.drink-arm-wrap');
  const thisweekSection = document.getElementById('this-week');

  if (drinkArmWrap && thisweekSection) {
    let armExtended = false;

    function updateDrinkArm() {
      const rect = thisweekSection.getBoundingClientRect();
      const windowH = window.innerHeight;
      const sectionH = rect.height;

      const scrolled = windowH - rect.top;
      const total = windowH + sectionH;
      const progress = Math.max(0, Math.min(1, scrolled / total));

      // Latch open once fully extended; only release when scrolling back up
      if (progress >= 0.75) armExtended = true;
      if (progress < 0.55) armExtended = false;

      let arm;
      if (armExtended) {
        arm = 1;
      } else if (progress < 0.55) {
        arm = 0;
      } else {
        arm = (progress - 0.55) / 0.2;
      }

      drinkArmWrap.style.transform = `translateX(${(1 - arm) * -110}%)`;
    }

    window.addEventListener('scroll', updateDrinkArm, { passive: true });
    updateDrinkArm();
  }

  /* ─── 13. LOGO FALLBACK: Show text if logo PNG missing ─── */
  document.querySelectorAll('.logo-img').forEach(img => {
    img.addEventListener('error', () => {
      img.style.display = 'none';
      const fallback = img.nextElementSibling;
      if (fallback) fallback.style.display = 'block';
    });
  });

});
