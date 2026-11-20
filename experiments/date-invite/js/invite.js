import { ACTIVITIES, readInvite, foodOptions } from './config.js';
import { toggleActivity, foodAllowed, localDay, appointment, formatDay } from './choices.js';
import { showTicket } from './ticket.js';

const el = (id) => document.getElementById(id);
const panels = ['first', 'workspace', 'final', 'declined'];
let config, foods, state, opening, tick, png;
function display(id, step, focus) {
  panels.forEach((key) => {
    el(key).hidden = key !== id;
  });
  [...el('steps').children].forEach((item, i) => {
    if (i === step - 1) item.setAttribute('aria-current', 'step');
    else item.removeAttribute('aria-current');
  });
  clearInterval(tick);
  state.step = step;
  if (focus) {
    focus.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }
}
function start(focus = false) {
  clearTimeout(opening);
  const invite = readInvite(location.hash);
  config = invite.config;
  foods = foodOptions(config);
  state = { step: 1, activities: [], day: '', time: '', food: '', dodges: 0 };
  png = null;
  el('to').textContent = config.to;
  el('from').textContent = config.from;
  el('message').textContent = config.message;
  el('warning').textContent = invite.warning || '';
  el('warning').hidden = !invite.warning;
  el('first').classList.remove('unsealed');
  el('closed').hidden = false;
  el('opened').hidden = true;
  el('open').disabled = false;
  el('decline').parentElement.style.removeProperty('--before');
  el('decline').parentElement.style.removeProperty('--after');
  el('dodge-msg').textContent = '';
  el('choices').replaceChildren();
  el('ticket').replaceChildren();
  el('feedback').textContent = '';
  display('first', 1, focus ? el('open') : null);
}
el('open').addEventListener('click', () => {
  el('open').disabled = true;
  el('first').classList.add('unsealed');
  opening = setTimeout(
    () => {
      el('closed').hidden = true;
      el('opened').hidden = false;
      el('letter-title').focus({ preventScroll: true });
    },
    matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 920,
  );
});
el('decline').addEventListener('click', (event) => {
  const btn = event.currentTarget;
  // Keyboard / assistive activation has no physical pointer detail.
  if (event.detail > 0 && event.isTrusted && state.dodges < 4) {
    const stops = [0.78, 0.12, 0.9, 0.32];
    btn.parentElement.style.setProperty('--before', stops[state.dodges]);
    btn.parentElement.style.setProperty('--after', 1 - stops[state.dodges]);
    el('dodge-msg').textContent = [
      '我挪一下。',
      '换个位置想想。',
      '再挪一小步。',
      '站好了，这次听你的。',
    ][state.dodges++];
    return;
  }
  display('declined', 1, el('declined').querySelector('h1'));
});
function setup(step, roman, label, title, sub) {
  el('act').textContent = 'ACT ' + roman + ' / ' + label;
  el('heading').textContent = title;
  el('sub').textContent = sub;
  el('choices').replaceChildren();
  el('feedback').textContent = '';
  el('next').disabled = true;
  el('next').firstChild.textContent = step === 4 ? '生成约会票根 ' : '继续 ';
  display('workspace', step, el('heading'));
}
function grid(options, select, active, blocked = () => false) {
  const group = document.createElement('div');
  group.className = 'grid';
  el('choices').append(group);
  const buttons = options.map(([id, emoji, name]) => {
    const btn = document.createElement('button'),
      icon = document.createElement('span');
    btn.type = 'button';
    btn.className = 'choice';
    btn.dataset.id = id;
    icon.className = 'emoji';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = emoji;
    btn.append(icon, document.createTextNode(name));
    group.append(btn);
    btn.setAttribute('aria-pressed', String(active(id)));
    if (blocked(id)) btn.setAttribute('aria-disabled', 'true');
    btn.addEventListener('click', () => {
      select(id);
      buttons.forEach((b) => b.setAttribute('aria-pressed', String(active(b.dataset.id))));
    });
    return btn;
  });
}
el('accept').addEventListener('click', () => {
  setup(2, 'II', '活动', '这次见面，想怎么度过？', '选一项或两项就好。');
  grid(
    ACTIVITIES,
    (id) => {
      const result = toggleActivity(state.activities, id);
      state.activities = result.items;
      el('feedback').textContent = result.message || '';
      el('next').disabled = !state.activities.length;
    },
    (id) => state.activities.includes(id),
  );
});
function refreshClock() {
  if (state.step !== 3) return;
  const now = new Date(),
    today = localDay(now);
  el('day').min = today;
  state.day = el('day').value;
  state.time = el('time').value;
  const nextMinute = new Date(Math.ceil(now.getTime() / 60000) * 60000);
  el('time').min =
    state.day === today && localDay(nextMinute) === today
      ? [nextMinute.getHours(), nextMinute.getMinutes()]
          .map((n) => String(n).padStart(2, '0'))
          .join(':')
      : '';
  const valid = appointment(state.day, state.time, now);
  el('next').disabled = !valid;
  el('feedback').textContent =
    state.day && state.day < today
      ? '请选择今天或之后的日期。'
      : state.day && state.time && !valid
        ? '这个时间已经过去或不可用，换个时间吧。'
        : '';
  document.querySelectorAll('.quick').forEach((b) => {
    b.disabled = !!state.day && !appointment(state.day, b.textContent, now);
    b.setAttribute('aria-pressed', String(b.textContent === state.time));
  });
  return valid;
}
function schedule() {
  setup(3, 'III', '时间', '那我们，什么时候见？', '按设备本地时间选择。');
  for (const [id, type, label] of [
    ['day', 'date', '日期'],
    ['time', 'time', '时间'],
  ]) {
    const node = document.createElement('input'),
      caption = document.createElement('label');
    node.id = id;
    node.type = type;
    node.required = true;
    node.value = '';
    caption.htmlFor = id;
    caption.textContent = label;
    el('choices').append(caption, node);
    node.addEventListener('input', refreshClock);
    node.addEventListener('change', refreshClock);
  }
  const row = document.createElement('div');
  row.className = 'quick-row';
  el('choices').append(row);
  for (const time of ['12:00', '15:00', '18:00', '19:00']) {
    const b = document.createElement('button');
    b.className = 'quick';
    b.textContent = time;
    b.addEventListener('click', () => {
      el('time').value = time;
      refreshClock();
    });
    row.append(b);
  }
  refreshClock();
  tick = setInterval(refreshClock, 1000);
}
function dining() {
  setup(
    4,
    'IV',
    '餐饮',
    state.activities.includes('meal') ? '那我们吃什么？' : '要不要顺便吃点什么？',
    '选一项就好。',
  );
  grid(
    foods,
    (id) => {
      if (!foodAllowed(state.activities, id)) {
        el('feedback').textContent = '已经选了「吃点好的」，可以选一种餐饮，或交给邀请人决定。';
        return;
      }
      state.food = id;
      el('next').disabled = false;
      el('feedback').textContent = '';
    },
    (id) => state.food === id,
    (id) => !foodAllowed(state.activities, id),
  );
}
function finish() {
  const describe = (row) => row.slice(1).join(' ');
  const chosenDate = state.day.split('-').map(Number);
  const t = {
    to: config.to,
    from: config.from,
    date: formatDay(new Date(chosenDate[0], chosenDate[1] - 1, chosenDate[2])),
    time: state.time,
    activity: state.activities
      .map((id) => describe(ACTIVITIES.find((a) => a[0] === id)))
      .join(' + '),
    food: describe(foods.find((f) => f[0] === state.food)),
  };
  png = showTicket(el('ticket'), t);
  el('save-hint').textContent = '请截图或保存这张票根，发给邀请你的人。';
  display('final', 5, el('ticket').querySelector('h1'));
}
el('next').addEventListener('click', () => {
  if (state.step === 2 && state.activities.length) schedule();
  else if (state.step === 3 && refreshClock()) dining();
  else if (state.step === 4 && state.food && foodAllowed(state.activities, state.food)) finish();
});
el('save').addEventListener('click', () => {
  if (!png) {
    el('save-hint').textContent = '当前浏览器无法导出图片，请直接截取上方完整票根。';
    return;
  }
  el('save-hint').textContent = '长按上方票根即可保存图片，也可以直接截图。';
  const link = document.createElement('a');
  if ('download' in link && !/MicroMessenger/i.test(navigator.userAgent)) {
    link.href = png;
    link.download = 'Date-Pass-' + state.day + '.png';
    document.body.append(link);
    link.click();
    link.remove();
  }
});
document
  .querySelectorAll('.restart')
  .forEach((b) => b.addEventListener('click', () => start(true)));
addEventListener('hashchange', () => start(true));
addEventListener('pageshow', (event) => {
  if (event.persisted) start();
});
start();
