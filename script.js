/* =====================
   SCRIPT.JS – Infinity Dental Clinic
   Multi-page | Dynamic content via Decap CMS / Netlify
===================== */

// Detect current page
const PAGE = document.body.dataset.page || 'home';

(function () {
  'use strict';

  /* ── 1. MOBILE NAV TOGGLE ──────────────────── */
  const hamburger  = document.getElementById('hamburger');
  const mobileNav  = document.getElementById('mobile-nav');
  const overlay    = document.getElementById('overlay');
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
  const header   = document.getElementById('header');
  const backToTop = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    const s = window.scrollY;
    header?.classList.toggle('scrolled', s > 50);
    backToTop?.classList.toggle('visible', s > 500);
  }, { passive: true });
  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ── 3. ACTIVE NAV LINK ──────────────────────── */
  // Nav links point to separate HTML pages — no scroll-spy needed.

  /* ── 4. COUNTER ANIMATION ──────────────────── */
  function animateCounter(el) {
    const target    = parseInt(el.dataset.target, 10);
    const duration  = 1800;
    const step      = 16;
    const increment = target / (duration / step);
    let current     = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { el.textContent = target.toLocaleString('en-IN'); clearInterval(timer); }
      else el.textContent = Math.floor(current).toLocaleString('en-IN');
    }, step);
  }

  /* ── 5. INTERSECTION OBSERVER (fade-in + counters) */
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

  document.querySelectorAll('[data-aos]').forEach(el => {
    el.classList.add('fade-in');
    io.observe(el);
  });
  document.querySelectorAll('.why-us__counters').forEach(el => counterIO.observe(el));

  const cardIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'none';
        cardIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  function observeCards() {
    document.querySelectorAll('.service-card, .process-step, .faq-item, .contact-card').forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = `opacity 0.5s ease ${i * 0.07}s, transform 0.5s ease ${i * 0.07}s`;
      cardIO.observe(el);
    });
  }
  observeCards();

  /* ── 6. FAQ ACCORDION ──────────────────────── */
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('.faq-q').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        b.nextElementSibling?.classList.remove('open');
      });
      if (!expanded) {
        btn.setAttribute('aria-expanded', 'true');
        btn.nextElementSibling?.classList.add('open');
      }
    });
  });

  /* ── 7. APPOINTMENT FORM ───────────────────── */
  const form       = document.getElementById('appointment-form');
  const modal      = document.getElementById('success-modal');
  const modalOvl   = document.getElementById('modal-overlay');
  const modalClose = document.getElementById('modal-close');

  const dateInput = document.getElementById('appt-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }
  form?.addEventListener('submit', (e) => {
    // Client-side validation before Netlify Forms submits
    const name  = document.getElementById('appt-name');
    const phone = document.getElementById('appt-phone');
    let valid = true;
    [name, phone].forEach(input => {
      input.style.borderColor = '';
      if (!input.value.trim()) { input.style.borderColor = '#ef4444'; valid = false; }
    });
    if (!valid) { e.preventDefault(); return; }
    // Allow native Netlify Forms submission — do not call e.preventDefault()
    const submitBtn = document.getElementById('appt-submit');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
  });
  function openSuccessModal() {
    modal?.classList.add('show');
    modalOvl?.classList.add('show');
    document.body.style.overflow = 'hidden';
    modal?.setAttribute('aria-hidden', 'false');
  }
  function closeSuccessModal() {
    modal?.classList.remove('show');
    modalOvl?.classList.remove('show');
    document.body.style.overflow = '';
    modal?.setAttribute('aria-hidden', 'true');
  }
  modalClose?.addEventListener('click', closeSuccessModal);
  modalOvl?.addEventListener('click', closeSuccessModal);

  /* ── 8. HERO/CLINIC IMAGE FALLBACK ─────────── */
  const heroImg = document.getElementById('hero-img');
  if (heroImg) {
    heroImg.onerror = function () {
      const wrap = heroImg.parentElement;
      heroImg.remove();
      wrap.insertAdjacentHTML('afterbegin', `
        <div style="
          width:100%;max-width:420px;height:440px;
          background:linear-gradient(135deg,#0ea5e9,#06b6d4);
          border-radius:32px;display:flex;flex-direction:column;
          align-items:center;justify-content:center;
          color:#fff;font-size:6rem;
          box-shadow:0 30px 80px rgba(14,165,233,0.25);position:relative;
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
      clinicImg.style.cssText = 'background:linear-gradient(135deg,#e0f2fe,#bae6fd);min-height:380px;display:block;';
      clinicImg.removeAttribute('src');
    };
  }

  /* ── 9. SMOOTH ANCHOR SCROLL (offset for header) */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
    });
  });

  /* ── 10. VIEW ALL SERVICES (mobile expand) ── */
  const viewAllBtn = document.getElementById('view-all-services-btn');
  if (viewAllBtn) {
    let expanded = false;
    viewAllBtn.addEventListener('click', () => {
      expanded = !expanded;
      document.querySelectorAll('.svc-extra').forEach(card => card.classList.toggle('show', expanded));
      viewAllBtn.innerHTML = expanded
        ? '<i class="fas fa-chevron-up"></i> Show Less'
        : '<i class="fas fa-th"></i> View All Services';
    });
  }

  /* ═══════════════════════════════════════════════════════
     DYNAMIC CONTENT — loaded from /_data/*.json via fetch
  ══════════════════════════════════════════════════════════ */

  /**
   * Fetch a JSON or text file. Returns null on failure with a console warning.
   */
  async function safeFetch(url, asText = false) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return asText ? await res.text() : await res.json();
    } catch (err) {
      console.warn(`[SiteData] Could not load ${url}:`, err.message);
      return null;
    }
  }

  /* ── 11. TESTIMONIALS (dynamic) ─────────────── */
  async function loadTestimonials() {
    const track    = document.getElementById('testimonial-track');
    if (!track) return;

    const data = await safeFetch('/_data/testimonials.json');
    const reviews = data?.reviews;
    if (!reviews || !reviews.length) {
      // Fall back to static content already in HTML (track is empty, add fallback)
      renderFallbackTestimonials(track);
      return;
    }

    track.innerHTML = reviews.map(r => {
      const starsHtml = '★'.repeat(r.stars || 5);
      const avatar = r.avatar
        || `https://ui-avatars.com/api/?name=${encodeURIComponent(r.name)}&background=e0f2fe&color=0284c7&bold=true&size=60`;
      return `
        <div class="testimonial-card">
          <div class="t-stars-top">${starsHtml}</div>
          <p>"${r.text}"</p>
          <div class="testimonial-patient">
            <img src="${avatar}" alt="${r.name}" loading="lazy" />
            <div>
              <strong>${r.name}</strong>
              <span>${r.treatment} · ${r.location}</span>
            </div>
          </div>
        </div>`;
    }).join('');

    initTestimonialSlider();
  }

  function renderFallbackTestimonials(track) {
    const fallback = [
      { name: 'Priya Sharma', location: 'Indore', treatment: 'Smile Makeover', text: 'Dr. Anmol completely transformed how I smile! The clinical experience was incredible and the procedure was genuinely painless. Truly the best dental facility in Indore.', stars: 5, avatar: 'https://i.pravatar.cc/60?img=32' },
      { name: 'Rahul Verma', location: 'Vijay Nagar', treatment: 'Dental Implant', text: 'I visited Infinity Dental Clinic for a dental implant. Dr. Billore is phenomenal — the care standard is supreme, no discomfort at all. Highly recommended!', stars: 5, avatar: 'https://i.pravatar.cc/60?img=47' },
      { name: 'Anita Gupta', location: 'Indore', treatment: 'Root Canal (RCT)', text: 'I went in fearing a Root Canal, but it was done in a single sitting! Thoroughly impressed by the premium comfort and transparency from start to finish.', stars: 5, avatar: 'https://i.pravatar.cc/60?img=3' },
      { name: 'Arjun Malhotra', location: 'Scheme 54', treatment: 'Braces', text: 'Got my braces done here. Dr. Billore explained everything patiently. The results are amazing — my teeth alignment is perfect now!', stars: 5, avatar: 'https://i.pravatar.cc/60?img=12' }
    ];
    track.innerHTML = fallback.map(r => `
      <div class="testimonial-card">
        <div class="t-stars-top">${'★'.repeat(r.stars)}</div>
        <p>"${r.text}"</p>
        <div class="testimonial-patient">
          <img src="${r.avatar}" alt="${r.name}" loading="lazy" />
          <div><strong>${r.name}</strong><span>${r.treatment} · ${r.location}</span></div>
        </div>
      </div>`).join('');
    initTestimonialSlider();
  }

  function initTestimonialSlider() {
    const track    = document.getElementById('testimonial-track');
    const dotsWrap = document.getElementById('slider-dots');
    const prevBtn  = document.getElementById('slider-prev');
    const nextBtn  = document.getElementById('slider-next');
    if (!track) return;

    const cards  = track.querySelectorAll('.testimonial-card');
    const total  = cards.length;
    let current  = 0;
    let perView  = window.innerWidth >= 1024 ? 2 : 1;
    let maxIndex = Math.max(0, total - perView);
    let autoPlay;

    dotsWrap.innerHTML = '';
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
      const cardWidth = cards[0].offsetWidth + 20;
      track.style.transform = `translateX(-${current * cardWidth}px)`;
      updateDots();
    }
    prevBtn?.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
    nextBtn?.addEventListener('click', () => { goTo(current + 1); resetAuto(); });
    function resetAuto() {
      clearInterval(autoPlay);
      autoPlay = setInterval(() => goTo(current >= maxIndex ? 0 : current + 1), 4500);
    }
    resetAuto();

    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { diff > 0 ? goTo(current + 1) : goTo(current - 1); resetAuto(); }
    });
    window.addEventListener('resize', () => {
      perView = window.innerWidth >= 1024 ? 2 : 1;
      maxIndex = Math.max(0, total - perView);
      current = Math.min(current, maxIndex);
      goTo(current);
    });
  }

  /* ── 12. BEFORE & AFTER GALLERY ─────────────── */
  let allBAcases = [];
  let baFilteredCases = [];
  let baCurrent = 0;

  async function loadBeforeAfter() {
    const wrap   = document.getElementById('ba-slider-wrap');
    const dotsEl = document.getElementById('ba-dots');
    if (!wrap) return;

    const data = await safeFetch('/_data/before-after.json');
    const cases = data?.cases;
    if (!cases || !cases.length) {
      wrap.innerHTML = '<div class="ba-loading"><i class="fas fa-images"></i> No cases added yet.</div>';
      return;
    }
    allBAcases = cases;
    baFilteredCases = [...cases];
    renderBAGallery();
    initBANavigation();
    initBAFilters();
  }

  function buildBACard(c) {
    return `
      <div class="ba-card" data-category="${c.category || ''}">
        <div class="ba-card__header">
          <div class="ba-card__title">${c.title}</div>
          <div class="ba-card__tag">${c.category || 'Transformation'}</div>
        </div>
        ${c.description ? `<div class="ba-card__desc">${c.description}</div>` : ''}
        <div class="ba-comparison" id="bac-${Math.random().toString(36).slice(2)}">
          <img class="ba-comparison__before-img" src="${c.before_img}" alt="Before – ${c.title}" loading="lazy" />
          <div class="ba-comparison__after">
            <img class="ba-comparison__after-img" src="${c.after_img}" alt="After – ${c.title}" loading="lazy" />
          </div>
          <div class="ba-comparison__handle">
            <div class="ba-comparison__handle-circle">
              <i class="fas fa-arrows-alt-h"></i>
            </div>
          </div>
          <span class="ba-label ba-label--before">Before</span>
          <span class="ba-label ba-label--after">After</span>
        </div>
      </div>`;
  }

  function renderBAGallery() {
    const wrap   = document.getElementById('ba-slider-wrap');
    const dotsEl = document.getElementById('ba-dots');
    if (!wrap) return;

    const isDesktop = window.innerWidth >= 1024;
    const perView   = isDesktop ? 2 : 1;
    baCurrent       = 0;

    wrap.innerHTML = `<div class="ba-track" id="ba-track">${baFilteredCases.map(buildBACard).join('')}</div>`;
    initBASLiderDrag();

    // Dots
    if (dotsEl) {
      const maxIdx = Math.max(0, baFilteredCases.length - perView);
      dotsEl.innerHTML = '';
      for (let i = 0; i <= maxIdx; i++) {
        const dot = document.createElement('span');
        dot.className = 'ba-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => baGoTo(i));
        dotsEl.appendChild(dot);
      }
    }
  }

  function baGoTo(idx) {
    const isDesktop = window.innerWidth >= 1024;
    const perView   = isDesktop ? 2 : 1;
    const maxIdx    = Math.max(0, baFilteredCases.length - perView);
    baCurrent = Math.max(0, Math.min(idx, maxIdx));

    const track    = document.getElementById('ba-track');
    const firstCard = track?.querySelector('.ba-card');
    if (!track || !firstCard) return;
    const cardW = firstCard.offsetWidth + 24; // 1.5rem gap
    track.style.transform = `translateX(-${baCurrent * cardW}px)`;

    document.querySelectorAll('.ba-dot').forEach((d, i) => d.classList.toggle('active', i === baCurrent));
  }

  function initBANavigation() {
    document.getElementById('ba-prev')?.addEventListener('click', () => baGoTo(baCurrent - 1));
    document.getElementById('ba-next')?.addEventListener('click', () => baGoTo(baCurrent + 1));
    window.addEventListener('resize', () => { renderBAGallery(); }, { passive: true });
  }

  function initBAFilters() {
    document.querySelectorAll('.ba-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.ba-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        baFilteredCases = filter === 'all' ? [...allBAcases] : allBAcases.filter(c => c.category === filter);
        renderBAGallery();
      });
    });
  }

  /* Before/After drag interaction */
  function initBASLiderDrag() {
    document.querySelectorAll('.ba-comparison').forEach(comp => {
      const afterDiv = comp.querySelector('.ba-comparison__after');
      const handle   = comp.querySelector('.ba-comparison__handle');
      if (!afterDiv || !handle) return;

      function setPos(clientX) {
        const rect = comp.getBoundingClientRect();
        let pct = ((clientX - rect.left) / rect.width) * 100;
        pct = Math.max(5, Math.min(95, pct));
        afterDiv.style.width = pct + '%';
        handle.style.left    = pct + '%';
      }

      // Mouse
      let dragging = false;
      handle.addEventListener('mousedown', e => { dragging = true; e.preventDefault(); });
      window.addEventListener('mouseup',   () => { dragging = false; });
      comp.addEventListener('mousemove',   e => { if (dragging) setPos(e.clientX); });

      // Touch
      handle.addEventListener('touchstart', e => { dragging = true; e.preventDefault(); }, { passive: false });
      window.addEventListener('touchend',   () => { dragging = false; });
      comp.addEventListener('touchmove',    e => { if (dragging) setPos(e.touches[0].clientX); }, { passive: true });

      // Click anywhere on comparison to jump handle
      comp.addEventListener('click', e => {
        if (e.target.closest('.ba-comparison__handle-circle')) return;
        setPos(e.clientX);
      });
    });
  }

  /* ── 13. BLOG ──────────────────────────────── */
  let allBlogPosts = [];
  let showAllBlogs = false;

  async function loadBlog() {
    const grid = document.getElementById('blog-grid');
    if (!grid) return;

    let knownSlugs = [];
    try {
      const resp = await fetch('/_data/blog-list.json');
      if (resp.ok) {
        knownSlugs = await resp.json();
      } else {
        console.warn('blog-list.json not found, falling back to empty list.');
      }
    } catch (err) {
      console.warn('Error fetching blog-list.json:', err);
    }

    const results = await Promise.all(
      knownSlugs.map(s => safeFetch(`/_data/blog/${s}.md`, true).then(md => md ? parseFrontmatter(md, s) : null))
    );
    let posts = results.filter(Boolean);

    if (!posts.length) {
      grid.innerHTML = '<div class="ba-loading" style="padding:2rem;"><i class="fas fa-pencil-alt"></i> No blog posts published yet.</div>';
      return;
    }

    // Sort by date descending
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    allBlogPosts = posts;
    if (PAGE === 'post') {
      renderSinglePost();
    } else {
      renderBlogCards();
    }
  }

  /**
   * Parse YAML frontmatter + markdown body from a .md string.
   */
  function parseFrontmatter(md, slug) {
    const match = md.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
    if (!match) return null;
    const yamlStr = match[1];
    const body    = match[2];
    const meta    = {};
    yamlStr.split('\n').forEach(line => {
      const idx = line.indexOf(':');
      if (idx === -1) return;
      const key = line.slice(0, idx).trim();
      let val    = line.slice(idx + 1).trim().replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
      meta[key] = val;
    });
    meta.slug = slug;
    meta.body = body;
    return meta;
  }

  function formatDate(dateStr) {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch { return dateStr; }
  }

  function renderBlogCards() {
    const grid = document.getElementById('blog-grid');
    if (!grid || !allBlogPosts.length) return;

    // On home page show only 2 preview cards; on blog.html show all
    const previewCount = PAGE === 'home' ? 2 : (showAllBlogs ? allBlogPosts.length : 6);
    const visible = allBlogPosts.slice(0, previewCount);
    const THUMB_PLACEHOLDER = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="600" height="300"><rect width="100%" height="100%" fill="#e0f2fe"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="48" fill="#0ea5e9">🦷</text></svg>')}`;
    grid.innerHTML = visible.map((post, i) => {
      const isFeatured = post.featured === 'true' || post.featured === true;
      return `
        <a href="post.html?slug=${post.slug}" class="blog-card${isFeatured && i === 0 ? ' blog-card--featured' : ''}" style="text-decoration: none; color: inherit;">
          <div class="blog-card__thumb-wrap">
            <img class="blog-card__thumb" src="${post.thumbnail || THUMB_PLACEHOLDER}" alt="${post.title}" loading="lazy" onerror="this.src='${THUMB_PLACEHOLDER}'" />
          </div>
          <div class="blog-card__body">
            <div class="blog-card__meta">
              <span class="blog-card__cat">${post.category || 'Dental Tips'}</span>
              <span class="blog-card__date"><i class="fas fa-calendar-alt"></i> ${formatDate(post.date)}</span>
            </div>
            <h3 class="blog-card__title">${post.title}</h3>
            <p class="blog-card__excerpt">${post.excerpt || ''}</p>
            <span class="blog-card__read">Read Article <i class="fas fa-arrow-right"></i></span>
          </div>
        </a>`;
    }).join('');

    // On home page: hide the toggle button (page has its own "View All" link)
    const viewAllBtn = document.getElementById('blog-view-all');
    if (viewAllBtn) {
      if (PAGE === 'home' || allBlogPosts.length <= 3) {
        viewAllBtn.style.display = 'none';
      } else {
        viewAllBtn.style.display = '';
        viewAllBtn.innerHTML = showAllBlogs
          ? 'Show Less <i class="fas fa-chevron-up"></i>'
          : 'View All Articles <i class="fas fa-arrow-right"></i>';
        viewAllBtn.onclick = () => { showAllBlogs = !showAllBlogs; renderBlogCards(); };
      }
    }
  }

  /* Single Post Page Rendering */
  function renderSinglePost() {
    if (PAGE !== 'post') return;
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');
    const contentDiv = document.getElementById('post-content');
    if (!contentDiv) return;

    const post = allBlogPosts.find(p => p.slug === slug);
    if (!post) {
      contentDiv.innerHTML = '<div class="ba-loading" style="padding:2rem;"><i class="fas fa-exclamation-circle" style="color:#ef4444;"></i> Post not found. Please return to the <a href="blog.html" style="color:var(--primary);text-decoration:underline;">blog</a>.</div>';
      return;
    }

    // Set Meta Info
    document.title = `${post.title} | Infinity Dental Clinic`;
    const titleEl = document.getElementById('post-title');
    const catEl = document.getElementById('post-category');
    const dateEl = document.getElementById('post-date');
    const thumbEl = document.getElementById('post-thumbnail');

    if (titleEl) titleEl.textContent = post.title;
    if (catEl) catEl.textContent = post.category || 'Dental Tips';
    if (dateEl) dateEl.textContent = formatDate(post.date);
    
    if (thumbEl && post.thumbnail) {
      thumbEl.src = post.thumbnail;
      thumbEl.alt = post.title;
      thumbEl.style.display = 'block';
    } else if (thumbEl) {
       thumbEl.style.display = 'none';
    }

    const bodyHtml = (typeof marked !== 'undefined' && marked.parse)
      ? marked.parse(post.body || '')
      : `<p>${(post.excerpt || '')}</p>`;

    contentDiv.innerHTML = `
      <div style="display:flex; gap: 1rem; color: var(--text-light); font-size: 0.9rem; margin-bottom: 2rem; border-bottom: 1px solid var(--border); padding-bottom: 1rem;">
         <span><i class="fas fa-user-md"></i> ${post.author || 'Dr. Anmol Billore'}</span>
         <span><i class="fas fa-calendar-alt"></i> ${formatDate(post.date)}</span>
      </div>
      ${bodyHtml}
    `;
  }

  /* ── 14. KICK OFF ALL ASYNC LOADS ─────────── */
  loadTestimonials();
  loadBeforeAfter();
  loadBlog();

})();
