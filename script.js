/* =====================
   SCRIPT.JS – SmileCare Dental Clinic
===================== */

(function () {
  'use strict';

  /* ── 1. MOBILE NAV TOGGLE ──────────────────── */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  const overlay   = document.getElementById('overlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav__link, .mobile-nav__cta a');

  function openNav() {
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileNav.classList.add('open');
    mobileNav.setAttribute('aria-hidden', 'false');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
  function closeNav() {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  hamburger?.addEventListener('click', () => mobileNav.classList.contains('open') ? closeNav() : openNav());
  overlay?.addEventListener('click', closeNav);
  mobileLinks.forEach(l => l.addEventListener('click', closeNav));

  /* ── 2. HEADER SCROLL EFFECT ───────────────── */
  const header = document.getElementById('header');
  const backToTop = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const s = window.scrollY;
    header?.classList.toggle('scrolled', s > 50);
    backToTop?.classList.toggle('visible', s > 500);
  }, { passive: true });

  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ── 3. ACTIVE NAV LINK (scroll-spy) ───────── */
  const navLinks = document.querySelectorAll('.nav__link');
  const sections = document.querySelectorAll('section[id]');

  function updateActiveLink() {
    const scrollY = window.scrollY + 120;
    sections.forEach(sec => {
      if (scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight) {
        navLinks.forEach(l => {
          l.classList.remove('active');
          if (l.getAttribute('href') === '#' + sec.id) l.classList.add('active');
        });
      }
    });
  }
  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

  /* ── 4. TESTIMONIAL SLIDER ─────────────────── */
  const track    = document.getElementById('testimonial-track');
  const dotsWrap = document.getElementById('slider-dots');
  const prevBtn  = document.getElementById('slider-prev');
  const nextBtn  = document.getElementById('slider-next');

  if (track) {
    const cards  = track.querySelectorAll('.testimonial-card');
    const total  = cards.length;
    let current  = 0;
    let perView  = window.innerWidth >= 1024 ? 2 : 1;
    let maxIndex = Math.max(0, total - perView);
    let autoPlay;

    // Build dots
    for (let i = 0; i <= maxIndex; i++) {
      const dot = document.createElement('span');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    }

    function updateDots() {
      dotsWrap.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === current));
    }

    function goTo(idx) {
      current = Math.max(0, Math.min(idx, maxIndex));
      const cardWidth = cards[0].offsetWidth + 20; /* gap 20px */
      track.style.transform = `translateX(-${current * cardWidth}px)`;
      updateDots();
    }

    prevBtn?.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
    nextBtn?.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

    function resetAuto() { clearInterval(autoPlay); autoPlay = setInterval(() => goTo(current >= maxIndex ? 0 : current + 1), 4500); }
    resetAuto();

    // Touch swipe
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { diff > 0 ? goTo(current + 1) : goTo(current - 1); resetAuto(); }
    });

    // Recalculate on resize
    window.addEventListener('resize', () => {
      perView = window.innerWidth >= 1024 ? 2 : 1;
      maxIndex = Math.max(0, total - perView);
      current = Math.min(current, maxIndex);
      goTo(current);
    });
  }

  /* ── 5. COUNTER ANIMATION ──────────────────── */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const step = 16;
    const increment = target / (duration / step);
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { el.textContent = target.toLocaleString('en-IN'); clearInterval(timer); }
      else el.textContent = Math.floor(current).toLocaleString('en-IN');
    }, step);
  }

  /* ── 6. INTERSECTION OBSERVER (fade-in + counters) */
  const fadeEls = document.querySelectorAll('[data-aos]');
  fadeEls.forEach(el => el.classList.add('fade-in'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.counter').forEach(animateCounter);
        counterIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('.fade-in').forEach(el => io.observe(el));
  document.querySelectorAll('.why-us__counters').forEach(el => counterIO.observe(el));

  // Also fade service cards, doctor cards, etc.
  const autoFadeEls = document.querySelectorAll('.service-card, .doctor-card, .process-step, .testimonial-card, .gallery-item, .faq-item, .contact-card');
  autoFadeEls.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.5s ease ${i * 0.07}s, transform 0.5s ease ${i * 0.07}s`;
    io.observe(el);
    // reuse same observer – just set visible class
  });

  const cardIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'none';
        cardIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  autoFadeEls.forEach(el => cardIO.observe(el));

  /* ── 7. FAQ ACCORDION ──────────────────────── */
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      // Close all
      document.querySelectorAll('.faq-q').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        b.nextElementSibling?.classList.remove('open');
      });
      // Open clicked if it was closed
      if (!expanded) {
        btn.setAttribute('aria-expanded', 'true');
        btn.nextElementSibling?.classList.add('open');
      }
    });
  });

  /* ── 8. APPOINTMENT FORM ───────────────────── */
  const form       = document.getElementById('appointment-form');
  const modal      = document.getElementById('success-modal');
  const modalOvl   = document.getElementById('modal-overlay');
  const modalClose = document.getElementById('modal-close');

  // Set min date to today
  const dateInput = document.getElementById('appt-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name  = document.getElementById('appt-name');
    const phone = document.getElementById('appt-phone');
    let valid = true;

    [name, phone].forEach(input => {
      input.style.borderColor = '';
      if (!input.value.trim()) {
        input.style.borderColor = '#ef4444';
        valid = false;
      }
    });

    if (!valid) return;

    // Simulate form submission (replace with real API/emailJS/FormSubmit etc.)
    const submitBtn = document.getElementById('appt-submit');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

    setTimeout(() => {
      form.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-calendar-check"></i> Confirm My Appointment';
      openModal();
    }, 1400);
  });

  function openModal() {
    modal?.classList.add('show');
    modalOvl?.classList.add('show');
    document.body.style.overflow = 'hidden';
    modal?.setAttribute('aria-hidden', 'false');
  }
  function closeModal() {
    modal?.classList.remove('show');
    modalOvl?.classList.remove('show');
    document.body.style.overflow = '';
    modal?.setAttribute('aria-hidden', 'true');
  }
  modalClose?.addEventListener('click', closeModal);
  modalOvl?.addEventListener('click', closeModal);

  /* ── 9. HERO IMAGE FALLBACK ────────────────── */
  const heroImg = document.getElementById('hero-img');
  if (heroImg) {
    heroImg.onerror = function () {
      const wrap = heroImg.parentElement;
      heroImg.remove();
      wrap.insertAdjacentHTML('afterbegin', `
        <div style="
          width:100%;max-width:420px;height:440px;
          background:linear-gradient(135deg,#0ea5e9,#06b6d4);
          border-radius:32px;
          display:flex;flex-direction:column;
          align-items:center;justify-content:center;
          color:#fff;font-size:6rem;
          box-shadow:0 30px 80px rgba(14,165,233,0.25);
          position:relative;
        ">
          <i class="fas fa-user-md" style="margin-bottom:0.5rem;"></i>
          <span style="font-size:1rem;font-weight:700;opacity:0.85;">Dr. Anmol Billore</span>
        </div>
      `);
    };
  }

  const clinicImg = document.getElementById('clinic-img');
  if (clinicImg) {
    clinicImg.onerror = function () {
      clinicImg.style.cssText = `
        background:linear-gradient(135deg,#e0f2fe,#bae6fd);
        min-height:380px;display:block;
      `;
      clinicImg.removeAttribute('src');
    };
  }

  /* ── 10. SMOOTH ANCHOR SCROLL (offset for header) */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    });
  });

  /* ── 11. VIEW ALL SERVICES (mobile expand) ── */
  const viewAllBtn = document.getElementById('view-all-services-btn');
  if (viewAllBtn) {
    let expanded = false;
    viewAllBtn.addEventListener('click', () => {
      expanded = !expanded;
      document.querySelectorAll('.svc-extra').forEach(card => {
        card.classList.toggle('show', expanded);
      });
      viewAllBtn.innerHTML = expanded
        ? '<i class="fas fa-chevron-up"></i> Show Less'
        : '<i class="fas fa-th"></i> View All Services';
    });
  }

})();
