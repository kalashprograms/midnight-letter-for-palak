const openLetter = document.querySelector('#open-letter');
const letterStage = document.querySelector('#letter-stage');
const yesButton = document.querySelector('#yes-button');
const notNowButton = document.querySelector('#not-now-button');
const respectNote = document.querySelector('#respect-note');
const celebration = document.querySelector('#celebration');
const closeCelebration = document.querySelector('#close-celebration');
const soundToggle = document.querySelector('#sound-toggle');

let shyCount = 0;
let ambientAudio;

openLetter.addEventListener('click', () => {
  document.body.classList.add('opening-letter');
  letterStage.setAttribute('aria-hidden', 'false');
  window.setTimeout(() => {
    letterStage.querySelector('.love-letter').focus?.();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 850);
});

// The supplied video slots remain beautiful if files have not been added yet.
// Add videos at media/our-moment-01.mp4 and media/our-moment-02.mp4 to activate them.
document.querySelectorAll('[data-video-card]').forEach((card) => {
  const video = card.querySelector('video');
  video.src = video.dataset.videoSrc;
  video.addEventListener('canplay', () => {
    card.classList.add('has-video');
    video.play().catch(() => {});
  }, { once: true });
  video.addEventListener('error', () => card.classList.remove('has-video'));
});

yesButton.addEventListener('click', () => {
  celebration.classList.add('show');
  celebration.setAttribute('aria-hidden', 'false');
  closeCelebration.focus();
});

closeCelebration.addEventListener('click', () => {
  celebration.classList.remove('show');
  celebration.setAttribute('aria-hidden', 'true');
  yesButton.focus();
});

celebration.addEventListener('click', (event) => {
  if (event.target === celebration) closeCelebration.click();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && celebration.classList.contains('show')) closeCelebration.click();
});

function makeNotNowShy() {
  if (shyCount >= 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  shyCount += 1;
  notNowButton.classList.remove('is-shy');
  // Restart the small, cosmetic animation; the button remains clickable.
  void notNowButton.offsetWidth;
  notNowButton.classList.add('is-shy');
  respectNote.textContent = shyCount === 1
    ? 'That button is a little shy — but your answer still matters to me.'
    : 'No rush at all. Take every bit of time you need.';
}

notNowButton.addEventListener('pointerenter', makeNotNowShy);
notNowButton.addEventListener('click', () => {
  shyCount = 2;
  notNowButton.classList.remove('is-shy');
  notNowButton.textContent = 'Thank you for being honest';
  respectNote.textContent = 'I respect your answer. There is no pressure, only care. ♡';
});

// A very quiet generated chime: sound is opt-in and never plays automatically.
soundToggle.addEventListener('click', () => {
  const label = soundToggle.querySelector('.sound-label');
  const enabled = soundToggle.getAttribute('aria-pressed') === 'true';
  if (enabled) {
    ambientAudio?.close();
    ambientAudio = undefined;
    soundToggle.setAttribute('aria-pressed', 'false');
    label.textContent = 'sound off';
    return;
  }

  try {
    ambientAudio = new (window.AudioContext || window.webkitAudioContext)();
    const master = ambientAudio.createGain();
    master.gain.value = 0.025;
    master.connect(ambientAudio.destination);
    [220, 277.18, 329.63].forEach((frequency, index) => {
      const oscillator = ambientAudio.createOscillator();
      const gain = ambientAudio.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0, ambientAudio.currentTime);
      gain.gain.linearRampToValueAtTime(0.55, ambientAudio.currentTime + 1.5 + index * 0.2);
      gain.gain.linearRampToValueAtTime(0.001, ambientAudio.currentTime + 8 + index * 1.2);
      oscillator.connect(gain).connect(master);
      oscillator.start();
      oscillator.stop(ambientAudio.currentTime + 10 + index);
    });
    soundToggle.setAttribute('aria-pressed', 'true');
    label.textContent = 'sound on';
  } catch {
    label.textContent = 'sound unavailable';
  }
});
