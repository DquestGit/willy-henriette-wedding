const opening = document.querySelector('#opening');
const openButton = document.querySelector('#openInvitation');
const main = document.querySelector('#mainContent');
const musicToggle = document.querySelector('#musicToggle');
let currentLanguage = 'fr';
let audioContext;
let musicTimer;
let musicPlaying = false;
let nextBarTime = 0;
let barIndex = 0;

const note = name => {
  const tones = { C3:130.81, D3:146.83, E3:164.81, F3:174.61, G3:196, A3:220, B3:246.94, C4:261.63, D4:293.66, E4:329.63, F4:349.23, G4:392, A4:440, B4:493.88, C5:523.25, D5:587.33, E5:659.25 };
  return tones[name];
};

function pluck(frequency, time, volume = 0.055) {
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = 'triangle';
  oscillator.frequency.setValueAtTime(frequency, time);
  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.exponentialRampToValueAtTime(volume, time + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.34);
  oscillator.connect(gain).connect(audioContext.destination);
  oscillator.start(time); oscillator.stop(time + 0.36);
}

function bass(frequency, time) {
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = 'sine'; oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.exponentialRampToValueAtTime(0.07, time + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.38);
  oscillator.connect(gain).connect(audioContext.destination);
  oscillator.start(time); oscillator.stop(time + 0.4);
}

function drum(time, high = false) {
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = high ? 'triangle' : 'sine';
  oscillator.frequency.setValueAtTime(high ? 190 : 105, time);
  oscillator.frequency.exponentialRampToValueAtTime(high ? 95 : 48, time + 0.12);
  gain.gain.setValueAtTime(high ? 0.035 : 0.09, time);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.16);
  oscillator.connect(gain).connect(audioContext.destination);
  oscillator.start(time); oscillator.stop(time + 0.18);
}

function scheduleBar(start, index) {
  const beat = 60 / 112;
  const chords = [
    { bass:'C3', notes:['E4','G4','C5','G4','E5','C5','G4','E4'] },
    { bass:'F3', notes:['F4','A4','C5','A4','F5','C5','A4','F4'] },
    { bass:'G3', notes:['G4','B4','D5','B4','G4','D5','B4','G4'] },
    { bass:'C3', notes:['E4','G4','C5','D5','E5','D5','C5','G4'] }
  ];
  const chord = chords[index % chords.length];
  chord.notes.forEach((name, step) => pluck(note(name), start + step * beat / 2, step % 2 ? 0.045 : 0.06));
  [0, 2].forEach(step => bass(note(chord.bass), start + step * beat));
  for (let step = 0; step < 8; step += 1) {
    if (step % 2 === 0) drum(start + step * beat / 2, false);
    drum(start + step * beat / 2 + beat / 4, true);
  }
}

function queueMusic() {
  while (nextBarTime < audioContext.currentTime + 1.5) {
    scheduleBar(nextBarTime, barIndex++);
    nextBarTime += (60 / 112) * 4;
  }
}

async function startMusic() {
  if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
  await audioContext.resume();
  if (musicPlaying) return;
  musicPlaying = true; nextBarTime = audioContext.currentTime + 0.08;
  queueMusic(); musicTimer = window.setInterval(queueMusic, 500);
  musicToggle.setAttribute('aria-pressed', 'true');
  updateMusicButton();
}

function stopMusic() {
  musicPlaying = false; window.clearInterval(musicTimer);
  if (audioContext) audioContext.suspend();
  musicToggle.setAttribute('aria-pressed', 'false');
  updateMusicButton();
}

function updateMusicButton() {
  const label = musicToggle.querySelector('.music-label');
  label.textContent = currentLanguage === 'fr' ? (musicPlaying ? 'Pause' : 'Musique') : (musicPlaying ? 'Pause' : 'Music');
  musicToggle.setAttribute('aria-label', currentLanguage === 'fr' ? (musicPlaying ? 'Mettre la musique en pause' : 'Activer la musique') : (musicPlaying ? 'Pause music' : 'Play music'));
}

const translations = [
  ['.seal-prompt', 'Open the invitation', 'Ouvrir l’invitation'],
  ['.hero .eyebrow', 'Our wedding blessing', 'Notre bénédiction nuptiale'],
  ['.hero-date', 'Saturday, 8 August 2026', 'Samedi 8 août 2026'],
  ['.hero-place', 'Brussels', 'Bruxelles'],
  ['.hero .button', 'Discover our invitation', 'Découvrir notre invitation'],
  ['.intro .eyebrow', 'Dear parents, family and friends', 'Chers parents, familles et amis'],
  ['.intro h2', 'We are getting married', 'Nous nous marions'],
  ['.intro .lead', 'It is with immense joy that we invite you to celebrate our wedding blessing with us.', 'C’est avec une immense joie que nous vous invitons à célébrer notre bénédiction nuptiale.'],
  ['blockquote', '“Love is patient, love is kind.”', '« L’amour est patient, l’amour est plein de bonté. »'],
  ['blockquote cite', '1 Corinthians 13:4', '1 Corinthiens 13:4'],
  ['.countdown-section .eyebrow', 'Until our special day', 'Dans l’attente de ce grand jour'],
  ['#countdownTitle', 'The countdown', 'Le compte à rebours'],
  ['#days + span', 'Days', 'Jours'],
  ['#hours + span', 'Hours', 'Heures'],
  ['#seconds + span', 'Seconds', 'Secondes'],
  ['.programme .eyebrow', 'The order of the day', 'Le déroulement de la journée'],
  ['#programmeTitle', 'Our programme', 'Notre programme'],
  ['#addCalendar', 'Add to my calendar', 'Ajouter à mon calendrier'],
  ['.gift-section .eyebrow', 'Your presence is our greatest gift', 'Votre présence est notre plus beau cadeau'],
  ['#giftTitle', 'A gift from the heart', 'Une attention pour nous'],
  ['#giftTitle + p', 'Should you wish to honour us with a contribution, a gift box will be available at the reception.', 'Si vous souhaitez nous accompagner par une contribution, une urne sera mise à votre disposition lors de la réception.'],
  ['#giftTitle + p + p', 'For those who prefer, a contribution may also be made by bank transfer.', 'Pour celles et ceux qui le préfèrent, une participation peut également être effectuée par virement.'],
  ['.bank-details p:nth-of-type(1) span', 'Account holder', 'Titulaire'],
  ['.bank-details p:nth-of-type(2) span', 'ING account', 'Compte ING'],
  ['.bank-details p:nth-of-type(3) span', 'Reference', 'Communication'],
  ['#copyIban', 'Copy IBAN', 'Copier l’IBAN'],
  ['footer .eyebrow', 'We look forward to sharing this wonderful day with you', 'Au plaisir de partager cette merveilleuse journée avec vous']
];

function setLanguage(language) {
  currentLanguage = language;
  document.documentElement.lang = language;
  translations.forEach(([selector, en, fr]) => {
    const element = document.querySelector(selector);
    if (element) element.childNodes[0].textContent = language === 'fr' ? fr : en;
  });
  const cards = document.querySelectorAll('.event-card');
  const ceremony = cards[0];
  const reception = cards[1];
  ceremony.querySelector('time').textContent = language === 'fr' ? '12h45' : '12:45 PM';
  ceremony.querySelector('.event-kicker').textContent = language === 'fr' ? 'Bénédiction nuptiale' : 'Wedding blessing';
  ceremony.querySelector('h3').textContent = language === 'fr' ? 'Église Néo-Apostolique de Belgique' : 'New Apostolic Church of Belgium';
  ceremony.querySelector('address').innerHTML = language === 'fr' ? '80, avenue Franz Guillaume<br>1070 Bruxelles' : '80 Avenue Franz Guillaume<br>1070 Brussels';
  reception.querySelector('time').textContent = language === 'fr' ? '17h30' : '5:30 PM';
  reception.querySelector('.event-kicker').textContent = language === 'fr' ? 'Cocktail · Dîner · Soirée dansante' : 'Cocktail · Dinner · Dancing';
  reception.querySelector('address').innerHTML = language === 'fr' ? '36, rue des Bassins<br>1070 Bruxelles' : '36 Rue des Bassins<br>1070 Brussels';
  document.querySelectorAll('.text-link').forEach(link => link.childNodes[0].textContent = language === 'fr' ? 'Voir l’itinéraire ' : 'Get directions ');
  openButton.setAttribute('aria-label', language === 'fr' ? 'Ouvrir l’invitation de Willy et Henriette' : 'Open Willy and Henriette’s invitation');
  document.querySelector('.language-switch').setAttribute('aria-label', language === 'fr' ? 'Choisir la langue' : 'Choose language');
  document.querySelectorAll('[data-language]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.language === language)));
  updateMusicButton();
  const bankButton = document.querySelector('#showBank');
  bankButton.textContent = bankButton.getAttribute('aria-expanded') === 'true'
    ? (language === 'fr' ? 'Masquer les coordonnées bancaires' : 'Hide bank details')
    : (language === 'fr' ? 'Voir les coordonnées bancaires' : 'View bank details');
}

document.querySelectorAll('[data-language]').forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.language)));
setLanguage('fr');

openButton.addEventListener('click', () => {
  startMusic().catch(() => updateMusicButton());
  opening.classList.add('opened');
  opening.setAttribute('aria-hidden', 'true');
  main.setAttribute('aria-hidden', 'false');
  document.body.classList.remove('locked');
  document.querySelector('.hero .reveal').classList.add('visible');
  setTimeout(() => opening.remove(), 1100);
});

musicToggle.addEventListener('click', () => musicPlaying ? stopMusic() : startMusic());

const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
}), { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(element => observer.observe(element));

const weddingDate = new Date('2026-08-08T12:45:00+02:00');
function updateCountdown() {
  const distance = Math.max(0, weddingDate.getTime() - Date.now());
  const values = { days: Math.floor(distance / 86400000), hours: Math.floor(distance / 3600000) % 24, minutes: Math.floor(distance / 60000) % 60, seconds: Math.floor(distance / 1000) % 60 };
  Object.entries(values).forEach(([id, value]) => document.querySelector(`#${id}`).textContent = String(value).padStart(2, '0'));
}
updateCountdown(); setInterval(updateCountdown, 1000);

document.querySelector('#showBank').addEventListener('click', event => {
  const details = document.querySelector('#bankDetails');
  const expanded = event.currentTarget.getAttribute('aria-expanded') === 'true';
  details.hidden = expanded;
  event.currentTarget.setAttribute('aria-expanded', String(!expanded));
  event.currentTarget.textContent = expanded ? (currentLanguage === 'fr' ? 'Voir les coordonnées bancaires' : 'View bank details') : (currentLanguage === 'fr' ? 'Masquer les coordonnées bancaires' : 'Hide bank details');
});

document.querySelector('#copyIban').addEventListener('click', async () => {
  const status = document.querySelector('#copyStatus');
  try { await navigator.clipboard.writeText('BE49310066841271'); status.textContent = currentLanguage === 'fr' ? 'IBAN copié' : 'IBAN copied'; }
  catch { status.textContent = currentLanguage === 'fr' ? 'Sélectionnez l’IBAN pour le copier' : 'Select the IBAN to copy it'; }
});

document.querySelector('#addCalendar').addEventListener('click', () => {
  const fr = currentLanguage === 'fr';
  const calendar = ['BEGIN:VCALENDAR','VERSION:2.0','BEGIN:VEVENT','UID:willy-henriette-20260808@example.local','DTSTART:20260808T104500Z','DTEND:20260809T000000Z',`SUMMARY:${fr ? 'Bénédiction nuptiale de Willy & Henriette' : 'Wedding blessing of Willy & Henriette'}`,`DESCRIPTION:${fr ? 'Bénédiction à 12h45. Cocktail, dîner et soirée à 17h30.' : 'Wedding blessing at 12:45 PM. Cocktail, dinner and dancing at 5:30 PM.'}`,'END:VEVENT','END:VCALENDAR'].join('\r\n');
  const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([calendar], { type: 'text/calendar;charset=utf-8' })); link.download = fr ? 'mariage-willy-henriette.ics' : 'wedding-willy-henriette.ics'; link.click(); URL.revokeObjectURL(link.href);
});
