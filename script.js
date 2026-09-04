const openLetter = document.querySelector('#open-letter');
const letterStage = document.querySelector('#letter-stage');
const yesButton = document.querySelector('#yes-button');
const notNowButton = document.querySelector('#not-now-button');
const respectNote = document.querySelector('#respect-note');
const celebration = document.querySelector('#celebration');
const closeCelebration = document.querySelector('#close-celebration');
const soundToggle = document.querySelector('#sound-toggle');
const loveSong = document.querySelector('#love-song');

let shyCount = 0;

function updateMusicControl(isPlaying) {
  soundToggle.setAttribute('aria-pressed', String(isPlaying));
  soundToggle.querySelector('.sound-label').textContent = isPlaying ? 'our song is playing' : 'play our song';
}

function playOurSong() {
  loveSong.play().then(() => updateMusicControl(true)).catch(() => {
    // Browsers can block sound until the first tap. Opening the envelope retries it.
    updateMusicControl(false);
  });
}

// Start right away when the browser permits it; otherwise the envelope tap is the first allowed moment.
playOurSong();

openLetter.addEventListener('click', () => {
  playOurSong();
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

soundToggle.addEventListener('click', () => {
  if (loveSong.paused) {
    playOurSong();
  } else {
    loveSong.pause();
    updateMusicControl(false);
  }
});

loveSong.addEventListener('pause', () => updateMusicControl(false));
loveSong.addEventListener('play', () => updateMusicControl(true));
