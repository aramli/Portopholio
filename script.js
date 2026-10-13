// Tema terang/gelap (disimpan di browser)
const root = document.documentElement;
const toggle = document.getElementById('themeToggle');
try {
  const saved = localStorage.getItem('theme');
  if (saved) root.dataset.theme = saved;
} catch (e) {}
toggle.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  try { localStorage.setItem('theme', next); } catch (e) {}
});

// Toast + salin email
const toast = document.getElementById('toast');
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 1800);
}
document.getElementById('copyEmail').addEventListener('click', async (e) => {
  try {
    await navigator.clipboard.writeText(e.currentTarget.dataset.email);
    showToast('Email tersalin');
  } catch (err) {
    showToast('Gagal menyalin, salin manual ya');
  }
});

document.getElementById('year').textContent = new Date().getFullYear();
