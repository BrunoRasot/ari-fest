const audio = document.getElementById('party-song');
const toggle = document.getElementById('audio-toggle');
const icon = document.getElementById('play-icon');
const state = document.getElementById('audio-state');

function fitInvitationToMobile() {
  const artboardWidth = 328;
  const artboardHeight = 2501;
  if (window.innerWidth <= 480) {
    const scale = window.innerWidth / artboardWidth;
    document.documentElement.style.setProperty('--invitation-scale', scale);
    document.documentElement.style.setProperty('--invitation-height', `${artboardHeight * scale}px`);
  } else {
    document.documentElement.style.removeProperty('--invitation-scale');
    document.documentElement.style.removeProperty('--invitation-height');
  }
}
fitInvitationToMobile();
window.addEventListener('resize', fitInvitationToMobile);

function updatePlayer(playing) {
  icon.textContent = '';
  toggle.setAttribute('aria-label', playing ? 'Pausar música' : 'Reproducir música');
  toggle.setAttribute('aria-pressed', String(playing));
  state.textContent = '';
}
toggle.addEventListener('click', async () => {
  if (audio.paused) { try { await audio.play(); updatePlayer(true); } catch { state.textContent = 'No se pudo iniciar el audio.'; } }
  else { audio.pause(); updatePlayer(false); }
});
audio.addEventListener('ended', () => updatePlayer(false));
document.getElementById('restart-button').addEventListener('click', () => { audio.currentTime = 0; });
document.getElementById('repeat-button').addEventListener('click', (event) => {
  audio.loop = !audio.loop;
  event.currentTarget.style.opacity = audio.loop ? '1' : '.45';
});

const target = new Date('2026-11-14T22:00:00-05:00');
function updateCountdown() {
  const remaining = Math.max(0, target - new Date());
  const seconds = Math.floor(remaining / 1000);
  const days = Math.floor(seconds / 86400), hours = Math.floor(seconds % 86400 / 3600), minutes = Math.floor(seconds % 3600 / 60), secs = seconds % 60;
  document.getElementById('countdown').textContent = [days, hours, minutes, secs].map((n, i) => String(n).padStart(i ? 2 : 2, '0')).join(':');
}
updateCountdown(); setInterval(updateCountdown, 1000);

const days = document.getElementById('calendar-days');
for (let day = 1; day <= 30; day++) { const el = document.createElement('span'); el.textContent = day; if (day === 14) el.className = 'selected'; days.append(el); }

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const scrollToggle = document.getElementById('scroll-toggle');
const scrollToggleLabel = document.getElementById('scroll-toggle-label');
let autoScrollEnabled = true;
let autoScrollPausedUntil = Date.now() + 350;
let previousFrameTime = 0;

function updateScrollToggle() {
  scrollToggle.setAttribute('aria-pressed', String(autoScrollEnabled));
  scrollToggle.setAttribute('aria-label', autoScrollEnabled ? 'Pausar desplazamiento automático' : 'Iniciar desplazamiento automático');
  scrollToggleLabel.textContent = autoScrollEnabled ? 'Auto' : 'Play';
}

function pauseAutoScroll() {
  autoScrollPausedUntil = Date.now() + 7000;
}

function autoScroll(timestamp) {
  if (!previousFrameTime) previousFrameTime = timestamp;
  const elapsed = timestamp - previousFrameTime;
  previousFrameTime = timestamp;
  const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  if (autoScrollEnabled && !reducedMotion.matches && maxScroll > 0 && Date.now() > autoScrollPausedUntil) {
    if (window.scrollY >= maxScroll - 1) {
      autoScrollPausedUntil = Date.now() + 1200;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollBy(0, elapsed * 0.055);
    }
  }
  window.requestAnimationFrame(autoScroll);
}

['touchstart', 'pointerdown', 'wheel', 'keydown'].forEach((eventName) => window.addEventListener(eventName, pauseAutoScroll, { passive: true }));
scrollToggle.addEventListener('click', () => {
  autoScrollEnabled = !autoScrollEnabled;
  autoScrollPausedUntil = Date.now() + (autoScrollEnabled ? 500 : 0);
  updateScrollToggle();
});
updateScrollToggle();
window.requestAnimationFrame(autoScroll);
