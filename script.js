const opening = document.querySelector('#opening');
const openButton = document.querySelector('#openInvitation');
const main = document.querySelector('#mainContent');
const weddingMusic = document.querySelector('#weddingMusic');
const musicToggle = document.querySelector('#musicToggle');
let currentLanguage = 'fr';

function updateMusicButton() {
  const playing = !weddingMusic.paused;
  musicToggle.setAttribute('aria-pressed', String(playing));
  musicToggle.querySelector('.music-label').textContent = currentLanguage === 'fr'
    ? (playing ? 'Pause' : 'Musique')
    : (playing ? 'Pause' : 'Music');
  musicToggle.setAttribute('aria-label', currentLanguage === 'fr'
    ? (playing ? 'Mettre la musique en pause' : 'Activer la musique')
    : (playing ? 'Pause music' : 'Play music'));
}

const translations = [
  ['.seal-prompt', 'Open the invitation', 'Ouvrir l’invitation'],
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
  document.querySelector('.hero-eyebrow-line1').textContent = language === 'fr' ? 'Notre' : 'Our wedding';
  document.querySelector('.hero-eyebrow-line2').textContent = language === 'fr' ? ' bénédiction nuptiale' : ' blessing';
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
  weddingMusic.play().then(updateMusicButton).catch(updateMusicButton);
  opening.classList.add('opened');
  opening.setAttribute('aria-hidden', 'true');
  main.setAttribute('aria-hidden', 'false');
  document.body.classList.remove('locked');
  document.querySelector('.hero .reveal').classList.add('visible');
  setTimeout(() => opening.remove(), 1100);
});

musicToggle.addEventListener('click', () => {
  if (weddingMusic.paused) weddingMusic.play().then(updateMusicButton).catch(updateMusicButton);
  else { weddingMusic.pause(); updateMusicButton(); }
});

weddingMusic.addEventListener('play', updateMusicButton);
weddingMusic.addEventListener('pause', updateMusicButton);

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
