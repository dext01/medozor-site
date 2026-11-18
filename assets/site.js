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

const tabs = [...document.querySelectorAll('[role="tab"]')];
function selectTab(tab, focus = false) {
  tabs.forEach(item => {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
  });
  if (focus) tab.focus();
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTab(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) {
      event.preventDefault();
      selectTab(tabs[next], true);
    }
  });
});

const conversation = document.querySelector('.sample-conversation');
const initialConversation = conversation.innerHTML;
const resetButton = document.querySelector('.reset-example');
const durationCheck = document.querySelector('#duration-check');
const initialCheck = durationCheck.innerHTML;
const asked = new Set();
const examples = {
  duration: ['Когда это началось?', 'Недели три назад, наверное. Раньше так часто не болела.'],
  detail: ['Где именно болит?', 'Больше здесь, в затылке. Будто давит.']
};
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
document.querySelectorAll('[data-question]').forEach(button => {
  button.addEventListener('click', () => {
    const key = button.dataset.question;
    if (asked.has(key)) return;
    asked.add(key);
    button.setAttribute('aria-pressed', 'true');
    conversation.append(bubble('Вы', examples[key][0]), bubble('Галина Петровна', examples[key][1]));
    conversation.scrollTop = conversation.scrollHeight;
    resetButton.hidden = false;
    if (key === 'duration') {
      durationCheck.classList.remove('not-asked');
      durationCheck.innerHTML = '<span class="check-icon" aria-hidden="true">✓</span><div>Уточнили начало симптомов<small>«Когда это началось?»</small></div>';
    }
  });
});
resetButton.addEventListener('click', () => {
  asked.clear();
  conversation.innerHTML = initialConversation;
  durationCheck.innerHTML = initialCheck;
  durationCheck.classList.add('not-asked');
  document.querySelectorAll('[data-question]').forEach(button => button.setAttribute('aria-pressed', 'false'));
  resetButton.hidden = true;
  document.querySelector('[data-question]').focus();
});
