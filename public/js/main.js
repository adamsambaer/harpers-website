/* ═══════════════════════════════════════════════════════════════
   HARPER'S — main.js
   Nav · Scroll Reveal · Game Day Words · Nightlife Slideshow
   Spotlight · Counters · Merch Tilt · Parallax
   ═══════════════════════════════════════════════════════════════ */

/* Disable browser scroll restoration so refresh always lands at the top */
if (history.scrollRestoration) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

document.addEventListener('DOMContentLoaded', () => {

  /* ─── HERO LOGO: hold animation until image is fully decoded ─── */
  const heroLogoEl  = document.querySelector('.hero-logo');
  const heroLogoImg = heroLogoEl ? heroLogoEl.querySelector('img') : null;
  if (heroLogoEl && heroLogoImg) {
    heroLogoEl.style.animationPlayState = 'paused';
    heroLogoImg.decode()
      .then(() => { heroLogoEl.style.animationPlayState = ''; })
      .catch(() => { heroLogoEl.style.animationPlayState = ''; });
  }

  /* ─── 0. HERO VIDEO: Autoplay + loop 2 seconds early ─── */
  const heroVideo = document.querySelector('.hero-video');

  if (heroVideo) {
    heroVideo.addEventListener('timeupdate', function () {
      if (this.duration && this.currentTime >= this.duration - 2) {
        this.currentTime = 0;
      }
    });

    heroVideo.play().catch(() => {});
    const playOnTouch = () => {
      heroVideo.play().catch(() => {});
      document.removeEventListener('touchstart', playOnTouch);
    };
    document.addEventListener('touchstart', playOnTouch, { once: true });
  }

  /* ─── IMAGE LAZY FADE-IN ─── */
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    img.classList.add('lazy-img');
    if (img.complete && img.naturalWidth > 0) {
      img.classList.add('img-loaded');
    } else {
      img.addEventListener('load', () => img.classList.add('img-loaded'));
    }
  });

  /* ─── GATHER DOM REFS (single pass) ─── */
  const nav             = document.getElementById('site-nav');
  const hamburger       = document.getElementById('nav-hamburger');
  const navLinks        = document.getElementById('nav-links');
  const navOverlay      = document.getElementById('nav-overlay');
  const scrollCue       = document.querySelector('.hero-scroll-cue');
  const patioPhotos     = document.querySelectorAll('.patio-photo img');
  const gamedayImg      = document.querySelector('.gameday-img');
  const breweryImg      = document.querySelector('.brewery-img');
  const drinkArmWrap    = document.querySelector('.drink-arm-wrap');
  const thisweekSection = document.getElementById('this-week');
  const aboutJitWrap    = document.querySelector('.about-jit-wrap');
  const aboutSection    = document.getElementById('about');

  /* ─── 1. NAV MOBILE MENU ─── */
  let navCloseTimer = null;

  function openMobileNav() {
    if (navCloseTimer) { clearTimeout(navCloseTimer); navCloseTimer = null; }
    navLinks.classList.remove('closing');
    navLinks.classList.add('mobile-open');
    navOverlay.classList.remove('closing');
    navOverlay.style.display = 'block';
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    if (!navLinks.classList.contains('mobile-open')) return;
    navLinks.classList.add('closing');
    navOverlay.classList.add('closing');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    navCloseTimer = setTimeout(() => {
      navLinks.classList.remove('mobile-open', 'closing');
      navOverlay.classList.remove('closing');
      navOverlay.style.display = 'none';
      navCloseTimer = null;
    }, 300);
  }

  function toggleMobileNav(open) {
    open ? openMobileNav() : closeMobileNav();
  }

  hamburger.addEventListener('click', () => {
    toggleMobileNav(!navLinks.classList.contains('mobile-open'));
  });
  navOverlay.addEventListener('click', () => closeMobileNav());
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => closeMobileNav());
  });

  /* ─── 2. SMOOTH SCROLL ─── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - nav.offsetHeight - 8, behavior: 'smooth' });
    });
  });

  /* ─── 3. POSITION CACHE — computed once, never during scroll ─── */
  let posCache = {};

  function refreshCache() {
    const sy = window.scrollY;
    if (patioPhotos.length) {
      posCache.patio = Array.from(patioPhotos).map(img => {
        const el = img.closest('.patio-photo');
        const r  = el.getBoundingClientRect();
        return { top: r.top + sy, height: el.offsetHeight };
      });
    }
    if (gamedayImg) {
      const el = gamedayImg.closest('.gameday');
      const r  = el.getBoundingClientRect();
      posCache.gamedayTop = r.top + sy;
      posCache.gamedayH   = el.offsetHeight;
    }
    if (breweryImg) {
      const el = breweryImg.closest('.brewery');
      const r  = el.getBoundingClientRect();
      posCache.breweryTop = r.top + sy;
      posCache.breweryH   = el.offsetHeight;
    }
    if (thisweekSection) {
      const r = thisweekSection.getBoundingClientRect();
      posCache.thisweekTop = r.top + sy;
      posCache.thisweekH   = thisweekSection.offsetHeight;
    }
  }

  /* ─── CONSOLIDATED SCROLL HANDLER (single RAF tick, zero getBCR) ─── */
  let scrollTick  = false;
  let armExtended = false;
  let jitExtended = false;

  function handleScroll() {
    const scrollY = window.scrollY;
    const wh      = window.innerHeight;

    /* Nav frosted glass */
    nav.classList.toggle('scrolled', scrollY > 60);

    /* Hero scroll cue fade */
    if (scrollCue) scrollCue.style.opacity = scrollY > 80 ? '0' : '1';

    /* Patio horizontal parallax */
    if (posCache.patio) {
      patioPhotos.forEach((img, i) => {
        const pos = posCache.patio[i];
        if (!pos) return;
        const top    = pos.top - scrollY;
        const bottom = top + pos.height;
        if (bottom < 0 || top > wh) return;
        const center = top + pos.height / 2 - wh / 2;
        const shift  = (center / wh) * 24 * (i % 2 === 0 ? 1 : -1);
        img.style.transform = `translateX(${shift}px) scale(1.08)`;
      });
    }

    /* Game day parallax */
    if (gamedayImg && posCache.gamedayTop !== undefined) {
      const top    = posCache.gamedayTop - scrollY;
      const bottom = top + posCache.gamedayH;
      if (bottom >= 0 && top <= wh) {
        gamedayImg.style.transform = `scale(1.14) translateY(${(top / wh) * 44}px)`;
      }
    }

    /* Brewery parallax */
    if (breweryImg && posCache.breweryTop !== undefined) {
      const top    = posCache.breweryTop - scrollY;
      const bottom = top + posCache.breweryH;
      if (bottom >= 0 && top <= wh) {
        breweryImg.style.transform = `scale(1.14) translateY(${(top / wh) * 44}px)`;
      }
    }

    /* JIT photo + drink arm scroll-driven reveal */
    if (posCache.thisweekTop !== undefined) {
      const scrolled = wh - (posCache.thisweekTop - scrollY);
      const total    = wh + posCache.thisweekH;
      const progress = Math.max(0, Math.min(1, scrolled / total));

      if (aboutJitWrap) {
        if (progress >= 0.68) jitExtended = true;
        if (progress <  0.50) jitExtended = false;
        const jitT = Math.max(0, Math.min(1, (progress - 0.55) / 0.13));
        const jit  = jitExtended ? 1 : jitT * jitT * (3 - 2 * jitT);
        aboutJitWrap.style.transform = `translateX(${(1 - jit) * 100}%)`;
      }

      if (drinkArmWrap) {
        if (progress >= 0.68) armExtended = true;
        if (progress <  0.50) armExtended = false;
        const armT = Math.max(0, Math.min(1, (progress - 0.55) / 0.13));
        const arm  = armExtended ? 1 : armT * armT * (3 - 2 * armT);
        drinkArmWrap.style.transform = `translateX(${(1 - arm) * -110}%)`;
      }
    }

    scrollTick = false;
  }

  window.addEventListener('scroll', () => {
    if (!scrollTick) {
      scrollTick = true;
      requestAnimationFrame(handleScroll);
    }
  }, { passive: true });

  /* Refresh cache on resize (layout changes) and after full page load (lazy images settle) */
  let resizeTick = false;
  window.addEventListener('resize', () => {
    if (!resizeTick) {
      resizeTick = true;
      requestAnimationFrame(() => { refreshCache(); handleScroll(); resizeTick = false; });
    }
  }, { passive: true });
  window.addEventListener('load', () => { refreshCache(); handleScroll(); }, { once: true });

  refreshCache();
  handleScroll(); /* run once on load */

  /* ─── 4. IMAGE PRE-LOADER: start fetching lazy images well before they animate ─── */
  const imagePreloadObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('img[loading="lazy"]').forEach(img => {
          img.setAttribute('loading', 'eager');
        });
        imagePreloadObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px 600px 0px' });

  document.querySelectorAll('section, .food-grid, .patio-photos, .merch-grid, .nightlife-slides').forEach(el => {
    imagePreloadObserver.observe(el);
  });

  /* ─── 5. SCROLL REVEAL ─── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px 40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ─── 6. GAME DAY: Word-by-word staggered reveal ─── */
  const words         = document.querySelectorAll('.wd');
  const gamedayHeading = document.getElementById('gameday-heading');

  if (words.length && gamedayHeading) {
    const wordObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          words.forEach((word, i) => {
            setTimeout(() => {
              word.classList.add('visible');
              if (i === words.length - 1) gamedayHeading.classList.add('words-visible');
            }, i * 80);
          });
          wordObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    wordObserver.observe(gamedayHeading);
  }

  /* ─── 7. NIGHTLIFE SLIDESHOW ─── */
  const slides = document.querySelectorAll('.slide');
  const dots   = document.querySelectorAll('.dot');
  let currentSlide  = 0;
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

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goToSlide(parseInt(dot.dataset.slide));
      clearInterval(slideshowTimer);
      startSlideshow();
    });
  });

  if (slides.length > 1) startSlideshow();

  /* ─── NIGHTLIFE BACKGROUNDS: defer slides 2-4 until section nears viewport ─── */
  const nightlifeSlidesContainer = document.getElementById('nightlife-slides');
  if (nightlifeSlidesContainer) {
    const bgObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          nightlifeSlidesContainer.querySelectorAll('.slide[data-bg]').forEach(slide => {
            slide.style.backgroundImage = `url("${slide.dataset.bg}")`;
          });
          bgObserver.disconnect();
        }
      });
    }, { rootMargin: '0px 0px 400px 0px' });
    bgObserver.observe(nightlifeSlidesContainer);
  }

  /* ─── 8. NIGHTLIFE SPOTLIGHT: follows mouse ─── */
  const nightlifeSection = document.querySelector('.nightlife');
  const nightlifeGlow    = document.getElementById('nightlife-glow');

  if (nightlifeSection && nightlifeGlow) {
    nightlifeSection.addEventListener('mousemove', (e) => {
      const rect = nightlifeSection.getBoundingClientRect();
      nightlifeGlow.style.setProperty('--gx', ((e.clientX - rect.left) / rect.width * 100) + '%');
      nightlifeGlow.style.setProperty('--gy', ((e.clientY - rect.top) / rect.height * 100) + '%');
    }, { passive: true });
    nightlifeSection.addEventListener('mouseleave', () => {
      nightlifeGlow.style.setProperty('--gx', '50%');
      nightlifeGlow.style.setProperty('--gy', '50%');
    });
  }

  /* ─── 9. COUNTER ANIMATION ─── */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';

    if (prefersReducedMotion) {
      el.textContent = prefix + target.toLocaleString() + suffix;
      return;
    }

    // Set text to final value, measure the block's rendered width, then lock it.
    // This pins the CSS grid column to its maximum size before the count starts
    // so the layout never shifts as the number grows.
    const block = el.closest('.counter-block');
    if (block) {
      el.textContent = prefix + target.toLocaleString() + suffix;
      block.style.minWidth = block.getBoundingClientRect().width + 'px';
      el.textContent = prefix + '0' + suffix;
    }

    const duration = 2200;
    let start = null;
    function step(ts) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const value    = Math.round((1 - Math.pow(1 - progress, 3)) * target);
      el.textContent = prefix + value.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* Givesback counter-blocks: boxes are static, count up when in view */
  const counterBlockObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const counterEl = entry.target.querySelector('.counter');
      if (counterEl) animateCounter(counterEl);
      counterBlockObserver.unobserve(entry.target);
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.counter-block').forEach(block =>
    counterBlockObserver.observe(block)
  );

  /* Standalone counters (e.g. gameday stats) */
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.counter:not(.counter-block .counter)').forEach(el =>
    counterObserver.observe(el)
  );

  /* ─── 10. SECTION VIDEOS: play only when visible, pause when scrolled away ─── */
  const sectionVideos = document.querySelectorAll('.video-item video');
  if (sectionVideos.length) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.play().catch(() => {});
        } else {
          entry.target.pause();
        }
      });
    }, { threshold: 0.2 });
    sectionVideos.forEach(v => videoObserver.observe(v));
  }

  /* ─── 11. MERCH: 3D tilt on hover ─── */
  document.querySelectorAll('.merch-item').forEach(item => {
    item.addEventListener('mousemove', (e) => {
      const rect = item.getBoundingClientRect();
      const x    = (e.clientX - rect.left) / rect.width  - 0.5;
      const y    = (e.clientY - rect.top)  / rect.height - 0.5;
      item.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.02)`;
    });
    item.addEventListener('mouseleave', () => {
      item.style.transform = 'perspective(900px) rotateY(0) rotateX(0) scale(1)';
      setTimeout(() => { item.style.transform = ''; }, 300);
    });
  });

  /* ─── 12. FOOD ITEMS: stagger reveal ─── */
  const foodGrid = document.querySelector('.food-grid');
  if (foodGrid) {
    const foodObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.food-item').forEach((item, i) => {
            setTimeout(() => item.classList.add('visible'), i * 90);
          });
          foodObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    foodObserver.observe(foodGrid);
  }

  /* ─── 13. LOGO FALLBACK ─── */
  document.querySelectorAll('.logo-img').forEach(img => {
    img.addEventListener('error', () => {
      img.style.display = 'none';
      const fallback = img.nextElementSibling;
      if (fallback) fallback.style.display = 'block';
    });
  });

  /* ─── 14. MOBILE CAROUSEL: dots, swipe hint, tap-to-modal ─── */
  if (window.matchMedia('(max-width: 540px)').matches) {
    const eventCards = document.querySelectorAll('.event-card');
    const grid       = document.querySelector('.event-cards-grid');
    /* Modal */
    const modal    = document.createElement('div');
    const modalImg = document.createElement('div');
    modal.id    = 'card-modal';
    modalImg.id = 'card-modal-img';
    modal.appendChild(modalImg);
    document.body.appendChild(modal);

    function openModal(card) {
      const bg = card.querySelector('.ecard-bg');
      const s  = getComputedStyle(bg);
      modalImg.style.backgroundImage    = s.backgroundImage;
      modalImg.style.backgroundPosition = s.backgroundPosition;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
    function closeModal() {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }

    let didScroll = false;

    eventCards.forEach(card => {
      card.addEventListener('touchstart', () => {
        didScroll = false;
      }, { passive: true });

      card.addEventListener('touchmove', () => {
        didScroll = true;
      }, { passive: true });

      card.addEventListener('touchend', e => {
        if (didScroll) return;
        e.preventDefault();
        openModal(card);
      });
    });

    modal.addEventListener('touchend', closeModal, { passive: true });

    /* Dots + swipe hint */
    if (grid && eventCards.length) {
      const dotsWrap = document.createElement('div');
      dotsWrap.className = 'cards-dots';

      const hint = document.createElement('div');
      hint.className = 'cards-swipe-hint';
      hint.textContent = '← swipe →';

      const dots = Array.from(eventCards).map((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'cards-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Event ${i + 1} of ${eventCards.length}`);
        dotsWrap.appendChild(dot);
        return dot;
      });

      /* Insert dots then hint right after the grid */
      grid.after(dotsWrap, hint);

      let hintGone = false;
      grid.addEventListener('scroll', () => {
        const cardW = eventCards[0].offsetWidth + 12;
        const idx   = Math.min(Math.round(grid.scrollLeft / cardW), dots.length - 1);
        dots.forEach((d, i) => d.classList.toggle('active', i === idx));
        if (!hintGone && grid.scrollLeft > 20) {
          hintGone = true;
          hint.classList.add('hidden');
        }
      }, { passive: true });
    }
  }

  /* ─── 15. BOOKING FORM ─── */
  const bookingForm    = document.getElementById('booking-form');
  const bookingSuccess = document.getElementById('booking-success');
  const bfError        = document.getElementById('bf-error');

  if (bookingForm && bookingSuccess && bfError) {
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRe = /^\+?[\d\s\-\(\)\.]{7,20}$/;

    /* Clear invalid state when user starts correcting a field */
    bookingForm.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('input',  () => field.classList.remove('invalid'));
      field.addEventListener('change', () => field.classList.remove('invalid'));
    });

    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      /* Reset error UI */
      bfError.classList.remove('visible');
      bookingForm.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));

      /* Validate required fields */
      let valid = true;
      bookingForm.querySelectorAll('[required]').forEach(field => {
        if (!field.value.trim()) {
          field.classList.add('invalid');
          valid = false;
        }
      });

      /* Email format */
      const emailField = document.getElementById('bf-email');
      if (emailField && emailField.value && !emailRe.test(emailField.value)) {
        emailField.classList.add('invalid');
        valid = false;
      }

      /* Phone format */
      const phoneField = document.getElementById('bf-phone');
      if (phoneField && phoneField.value && !phoneRe.test(phoneField.value)) {
        phoneField.classList.add('invalid');
        valid = false;
      }

      if (!valid) {
        bfError.classList.add('visible');
        /* Scroll to the first invalid field */
        const firstInvalid = bookingForm.querySelector('.invalid');
        if (firstInvalid) firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      /* Disable submit while sending */
      const submitBtn = bookingForm.querySelector('.bf-submit');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;

      try {
        const response = await fetch(bookingForm.action, {
          method: 'POST',
          body: new FormData(bookingForm),
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          bookingForm.style.display = 'none';
          bookingSuccess.classList.add('visible');
          bookingSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          throw new Error('non-ok response');
        }
      } catch {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        bfError.textContent = 'Something went wrong. Please try again or call us at 517-333-4040.';
        bfError.classList.add('visible');
      }
    });
  }

});
