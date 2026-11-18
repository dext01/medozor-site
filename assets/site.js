'use strict';

const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
function closeMenu() {
  mobileNav.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.querySelector('.menu-label').textContent = 'Меню';
}
menuButton.addEventListener('click', () => {
  const opening = menuButton.getAttribute('aria-expanded') !== 'true';
  mobileNav.hidden = !opening;
  menuButton.setAttribute('aria-expanded', String(opening));
  menuButton.querySelector('.menu-label').textContent = opening ? 'Закрыть' : 'Меню';
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !mobileNav.hidden) {
    closeMenu();
    menuButton.focus();
  }
});
document.addEventListener('click', event => {
  if (!mobileNav.hidden && !event.target.closest('.site-header')) closeMenu();
});
window.matchMedia('(min-width: 761px)').addEventListener('change', event => {
  if (event.matches) closeMenu();
});

const station = document.querySelector('.station-demo');
const tabs = [...station.querySelectorAll('[role="tab"]')];
const conversation = station.querySelector('.sample-conversation');
const initialConversation = conversation.innerHTML;
const resetButton = station.querySelector('.reset-example');
const durationCheck = station.querySelector('#duration-check');
const initialCheck = durationCheck.innerHTML;
const questionButtons = [...station.querySelectorAll('[data-question]')];
const playback = station.querySelector('.demo-playback');
const playButton = station.querySelector('.demo-play-toggle');
const stepLabel = station.querySelector('.demo-step');
const playNote = station.querySelector('.demo-playback-note');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const asked = new Set();
const examples = {
  duration: ['Когда это началось?', 'Недели три назад, наверное. Раньше так часто не болела.'],
  detail: ['Где именно болит?', 'Больше здесь, в затылке. Будто давит.']
};
let state = 'idle';
let timer;
let deadline = 0;
let remaining = 0;
let nextStep = 0;
let autoStarted = false;
let pendingAnswer = '';

function selectTab(tab, focus = false) {
  tabs.forEach(item => {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
  });
  stepLabel.textContent = `${String(tabs.indexOf(tab) + 1).padStart(2, '0')} / ${tab.textContent}`;
  if (focus) tab.focus();
}
function bubble(role, text) {
  const block = document.createElement('div');
  block.className = role === 'Вы' ? 'sample-question' : 'sample-answer';
  const name = document.createElement('span');
  name.textContent = role;
  const content = document.createElement('p');
  content.textContent = text;
  block.append(name, content);
  return block;
}
function appendMessage(role, text) {
  conversation.append(bubble(role, text));
  conversation.scrollTop = conversation.scrollHeight;
}
function markDuration() {
  asked.add('duration');
  questionButtons.find(button => button.dataset.question === 'duration').setAttribute('aria-pressed', 'true');
  durationCheck.classList.remove('not-asked');
  durationCheck.innerHTML = '<span class="check-icon" aria-hidden="true">✓</span><div>Уточнили начало симптомов<small>«Когда это началось?»</small></div>';
}
function resetConversation() {
  asked.clear();
  pendingAnswer = '';
  conversation.innerHTML = initialConversation;
  conversation.scrollTop = 0;
  durationCheck.innerHTML = initialCheck;
  durationCheck.classList.add('not-asked');
  questionButtons.forEach(button => button.setAttribute('aria-pressed', 'false'));
  resetButton.hidden = true;
}
function showTyping(answer) {
  pendingAnswer = answer;
  const block = bubble('Галина Петровна', '');
  block.classList.add('typing-indicator');
  block.setAttribute('aria-label', 'В примере пациентка готовит ответ');
  block.querySelector('p').innerHTML = '<i></i><i></i><i></i>';
  conversation.append(block);
  conversation.scrollTop = conversation.scrollHeight;
}
function finishAnswer() {
  conversation.querySelector('.typing-indicator')?.remove();
  if (pendingAnswer) appendMessage('Галина Петровна', pendingAnswer);
  pendingAnswer = '';
}
function updatePlayback() {
  station.classList.toggle('is-playing', state === 'playing');
  const labels = { idle: 'Смотреть показ ▷', playing: 'Пауза Ⅱ', paused: 'Продолжить ▷', finished: 'Повторить ↺' };
  playButton.textContent = labels[state];
  playNote.textContent = { idle: 'Короткий показ станции', playing: 'Демонстрация · шаблонные реплики', paused: 'Показ приостановлен', finished: 'Теперь можно попробовать самим' }[state];
}
function pause() {
  if (state !== 'playing') return;
  clearTimeout(timer);
  remaining = Math.max(0, deadline - performance.now());
  state = 'paused';
  updatePlayback();
}
function takeControl() {
  autoStarted = true;
  clearTimeout(timer);
  state = 'idle';
  conversation.setAttribute('aria-live', 'polite');
  finishAnswer();
  updatePlayback();
}
const steps = [
  { delay: 500, run: () => appendMessage('Вы', 'Здравствуйте. Что вас беспокоит?') },
  { delay: 1400, run: () => showTyping('Голова в последнее время болит. Особенно по утрам.') },
  { delay: 1200, run: finishAnswer },
  { delay: 3200, run: () => appendMessage('Вы', examples.duration[0]) },
  { delay: 1400, run: () => showTyping(examples.duration[1]) },
  { delay: 1200, run: () => { finishAnswer(); markDuration(); resetButton.hidden = false; } },
  { delay: 3500, run: () => selectTab(tabs[1]) },
  { delay: 5000, run: () => selectTab(tabs[2]) },
  { delay: 5000, run: () => { state = 'finished'; conversation.setAttribute('aria-live', 'polite'); updatePlayback(); } }
];
function schedule(delay) {
  remaining = delay;
  deadline = performance.now() + delay;
  timer = setTimeout(() => {
    if (state !== 'playing') return;
    steps[nextStep++].run();
    if (state === 'playing' && nextStep < steps.length) schedule(steps[nextStep].delay);
  }, delay);
}
function play() {
  autoStarted = true;
  const resuming = state === 'paused';
  if (!resuming) {
    resetConversation();
    selectTab(tabs[0]);
    conversation.replaceChildren();
    nextStep = 0;
  }
  state = 'playing';
  conversation.setAttribute('aria-live', 'off');
  updatePlayback();
  schedule(resuming ? remaining : steps[0].delay);
}
playback.hidden = false;
playButton.addEventListener('click', () => state === 'playing' ? pause() : play());
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => { takeControl(); selectTab(tab); });
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) {
      event.preventDefault();
      takeControl();
      selectTab(tabs[next], true);
    }
  });
});
questionButtons.forEach(button => {
  button.addEventListener('click', () => {
    takeControl();
    const key = button.dataset.question;
    if (asked.has(key)) return;
    asked.add(key);
    button.setAttribute('aria-pressed', 'true');
    appendMessage('Вы', examples[key][0]);
    appendMessage('Галина Петровна', examples[key][1]);
    resetButton.hidden = false;
    if (key === 'duration') markDuration();
  });
});
resetButton.addEventListener('click', () => {
  takeControl();
  resetConversation();
  questionButtons[0].focus();
});
// Reading, keyboard navigation and leaving the page take precedence over the demo.
station.addEventListener('focusin', event => { if (event.target !== playButton) pause(); });
document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
reducedMotion.addEventListener('change', event => { if (event.matches) pause(); });
if ('IntersectionObserver' in window) {
  new IntersectionObserver(entries => {
    const visible = entries[0].isIntersecting && entries[0].intersectionRatio >= 0.55;
    if (!visible) pause();
    else if (!autoStarted && !document.hidden && !reducedMotion.matches && !station.contains(document.activeElement)) play();
  }, { threshold: 0.55 }).observe(station);
}
