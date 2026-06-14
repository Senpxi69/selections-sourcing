/* ═══════════════════════════════════════
   SELECTIONS HR — SCRIPTS
═══════════════════════════════════════ */

/* ── Sticky header ── */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── Mobile nav toggle ── */
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');

navToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

nav.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ── Active nav link on scroll ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__link');

const onScroll = () => {
  const scrollY = window.scrollY + 120;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    if (scrollY >= top && scrollY < top + height) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav__link[href="#${id}"]`);
      if (active) active.classList.add('active');
    }
  });
};
window.addEventListener('scroll', onScroll, { passive: true });

/* ── Fade-up on scroll ── */
const fadeEls = document.querySelectorAll(
  '.service-card, .step, .job-card, .testimonial, .about__metric, .stat, .feature-icon'
);
fadeEls.forEach(el => el.classList.add('fade-up'));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 60);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
fadeEls.forEach(el => observer.observe(el));

/* ── Animate stat numbers ── */
function animateCount(el, target) {
  const duration = 1800;
  const start = performance.now();
  const from = 0;

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(from + (target - from) * eased);
    // Only update the number; the +/% suffix lives in the preserved teal <span>
    el.firstChild.textContent = value.toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const statNums = document.querySelectorAll('.stat__num');
const statObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const text = el.textContent.trim();
      const match = text.match(/^([\d,]+)([+%]?)$/);
      if (match) {
        const num = parseInt(match[1].replace(/,/g, ''));
        const tealSpan = el.querySelector('.teal');
        el.textContent = '';
        el.appendChild(document.createTextNode('0'));
        if (tealSpan) el.appendChild(tealSpan);
        animateCount(el, num);
      }
      statObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
statNums.forEach(el => statObserver.observe(el));

/* ── Form submit ── */
function handleSubmit(e) {
  e.preventDefault();
  const toast = document.getElementById('toast');
  toast.classList.add('show');
  e.target.reset();
  setTimeout(() => toast.classList.remove('show'), 4000);
}

/* ── Smooth scroll for anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const href = anchor.getAttribute('href');
    if (!href || href === '#') return;          // ignore placeholder links
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── FAQ accordion (Contact page) ── */
document.querySelectorAll('.faq-item__q').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('.faq-item').classList.toggle('open');
  });
});

/* ── CV file-name preview (Submit CV page) ── */
const cvFile = document.getElementById('cvFile');
if (cvFile) {
  cvFile.addEventListener('change', () => {
    const nameEl = document.getElementById('cvFileName');
    if (nameEl) nameEl.textContent = cvFile.files.length ? cvFile.files[0].name : '';
  });
}

/* ── Scroll progress bar + back-to-top (injected, all pages) ── */
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.appendChild(progressBar);

const toTop = document.createElement('button');
toTop.className = 'to-top';
toTop.setAttribute('aria-label', 'Back to top');
toTop.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
document.body.appendChild(toTop);

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
  toTop.classList.toggle('show', scrollTop > 600);
}, { passive: true });
