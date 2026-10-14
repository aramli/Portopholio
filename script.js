const root = document.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

// ---------- Tema terang/gelap ----------
const toggle = document.getElementById('themeToggle');
try { const saved = localStorage.getItem('theme'); if (saved) root.dataset.theme = saved; } catch (e) {}
toggle.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  try { localStorage.setItem('theme', next); } catch (e) {}
});

// ---------- Toast + salin email ----------
const toast = document.getElementById('toast');
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 1800);
}
document.getElementById('copyEmail').addEventListener('click', async (e) => {
  try { await navigator.clipboard.writeText(e.currentTarget.dataset.email); showToast('Email tersalin'); }
  catch (err) { showToast('Gagal menyalin, salin manual ya'); }
});
document.getElementById('year').textContent = new Date().getFullYear();

// ---------- Progress bar scroll ----------
const progress = document.getElementById('progress');
function onScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + '%';
}
addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ---------- Menu aktif sesuai section ----------
const links = [...document.querySelectorAll('.topbar nav a')];
const spy = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
links.forEach((a) => { const s = document.querySelector(a.getAttribute('href')); if (s) spy.observe(s); });

// ---------- Motion (dilewati kalau pengguna memilih reduce motion) ----------
if (!reduce) {
  // Nama: huruf muncul satu-satu
  const h1 = document.querySelector('.hero h1');
  h1.innerHTML = [...h1.textContent].map((c, i) => `<span class="ch" style="--i:${i}">${c}</span>`).join('');

  // Teks role mengetik
  const roles = ['HR Officer', 'System Developer', 'Payroll PIC', 'Food Hunter', 'Mahasiswa Informatika'];
  const typed = document.getElementById('typed');
  let r = 0, c = 0, del = false;
  (function tick() {
    const word = roles[r];
    typed.textContent = word.slice(0, c);
    if (!del && c === word.length) { del = true; return setTimeout(tick, 1400); }
    if (del && c === 0) { del = false; r = (r + 1) % roles.length; }
    c += del ? -1 : 1;
    setTimeout(tick, del ? 40 : 85);
  })();

  // Reveal saat scroll, dengan jeda bertingkat
  const targets = document.querySelectorAll('.about, .project, .skills li, .edu, .timeline li, .polaroid, .contact, .section > h2, .lead');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target;
      el.classList.add('in');
      io.unobserve(el);
      const delay = parseFloat(el.style.getPropertyValue('--d')) || 0;
      setTimeout(() => el.classList.remove('reveal', 'in'), 900 + delay * 1000);
    });
  }, { threshold: 0.15 });
  targets.forEach((el) => {
    const idx = [...el.parentElement.children].indexOf(el);
    el.style.setProperty('--d', Math.min(idx, 6) * 0.09 + 's');
    el.classList.add('reveal');
    io.observe(el);
  });

  // Kartu miring 3D mengikuti kursor (hanya perangkat dengan mouse)
  if (finePointer) {
    document.querySelectorAll('.project, .edu').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const b = el.getBoundingClientRect();
        const x = (e.clientX - b.left) / b.width - 0.5, y = (e.clientY - b.top) / b.height - 0.5;
        el.style.transition = 'transform .1s ease-out, border-color .2s, box-shadow .25s';
        el.style.transform = `perspective(700px) rotateX(${-y * 7}deg) rotateY(${x * 7}deg) translateY(-4px)`;
      });
      el.addEventListener('pointerleave', () => {
        el.style.transition = 'transform .45s cubic-bezier(.2,.8,.2,1), border-color .2s, box-shadow .25s';
        el.style.transform = '';
      });
    });
  }
}
