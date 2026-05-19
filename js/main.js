/* ═══════════════════════════════════════════════════════════════
   HARPER'S — main.js
   Nav · Scroll Reveal · Game Day Words · Nightlife Slideshow
   Spotlight · Counters · Merch Tilt · Parallax
   ═══════════════════════════════════════════════════════════════ */

/* Disable browser scroll restoration so refresh always lands at the top */
if (history.scrollRestoration) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

document.addEventListener('DOMContentLoaded', () => {

  /* ─── 0. HERO VIDEO: Autoplay + loop 2 seconds early ─── */
  const heroVideo = document.querySelector('.hero-video');

  if (heroVideo) {
    heroVideo.addEventListener('timeupdate', function () {
      if (this.duration && this.currentTime >= this.duration - 2) {
        this.currentTime = 0;
      }
    });

    /* Explicit play() covers browsers that require it despite the autoplay attribute.
       touchstart retry handles iOS Low Power Mode: user touch re-enables autoplay. */
    heroVideo.play().catch(() => {});
    const playOnTouch = () => {
      heroVideo.play().catch(() => {});
      document.removeEventListener('touchstart', playOnTouch);
    };
    document.addEventListener('touchstart', playOnTouch, { once: true });
  }

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
  function toggleMobileNav(open) {
    navLinks.classList.toggle('mobile-open', open);
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
    navOverlay.style.display = open ? 'block' : 'none';
    document.body.style.overflow = open ? 'hidden' : '';
  }

  hamburger.addEventListener('click', () => {
    toggleMobileNav(!navLinks.classList.contains('mobile-open'));
  });
  navOverlay.addEventListener('click', () => toggleMobileNav(false));
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => toggleMobileNav(false));
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

  /* ─── 3. CONSOLIDATED SCROLL HANDLER (single RAF tick) ─── */
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
    patioPhotos.forEach((img, i) => {
      const rect = img.closest('.patio-photo').getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > wh) return;
      const center = rect.top + rect.height / 2 - wh / 2;
      const shift  = (center / wh) * 24 * (i % 2 === 0 ? 1 : -1);
      img.style.transform = `translateX(${shift}px) scale(1.08)`;
    });

    /* Game day parallax */
    if (gamedayImg) {
      const rect = gamedayImg.closest('.gameday').getBoundingClientRect();
      if (rect.bottom >= 0 && rect.top <= wh) {
        gamedayImg.style.transform = `scale(1.14) translateY(${(rect.top / wh) * 44}px)`;
      }
    }

    /* Brewery parallax */
    if (breweryImg) {
      const rect = breweryImg.closest('.brewery').getBoundingClientRect();
      if (rect.bottom >= 0 && rect.top <= wh) {
        breweryImg.style.transform = `scale(1.14) translateY(${(rect.top / wh) * 44}px)`;
      }
    }

    /* JIT photo scroll-driven reveal (slides in from right, parallel with drink arm) */
    if (aboutJitWrap && thisweekSection) {
      const rect     = thisweekSection.getBoundingClientRect();
      const scrolled = wh - rect.top;
      const total    = wh + rect.height;
      const progress = Math.max(0, Math.min(1, scrolled / total));

      if (progress >= 0.75) jitExtended = true;
      if (progress < 0.45)  jitExtended = false;

      const jit = jitExtended ? 1 : progress < 0.50 ? 0 : (progress - 0.50) / 0.25;
      aboutJitWrap.style.transform = `translateX(${(1 - jit) * 100}%)`;
    }

    /* Drink arm scroll-driven reveal */
    if (drinkArmWrap && thisweekSection) {
      const rect     = thisweekSection.getBoundingClientRect();
      const scrolled = wh - rect.top;
      const total    = wh + rect.height;
      const progress = Math.max(0, Math.min(1, scrolled / total));

      if (progress >= 0.75) armExtended = true;
      if (progress < 0.45)  armExtended = false;

      const arm = armExtended ? 1 : progress < 0.50 ? 0 : (progress - 0.50) / 0.25;
      drinkArmWrap.style.transform = `translateX(${(1 - arm) * -110}%)`;
    }

    scrollTick = false;
  }

  window.addEventListener('scroll', () => {
    if (!scrollTick) {
      scrollTick = true;
      requestAnimationFrame(handleScroll);
    }
  }, { passive: true });

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

});
