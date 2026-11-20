import { defaults, inviteUrl } from './config.js';
const el = (id) => document.getElementById(id);
const form = el('form'),
  status = el('status'),
  result = el('result'),
  url = el('url');
el('sender').value = defaults.from;
el('copy').value = defaults.message;
el('foods').value = defaults.foods.map((pair) => pair.join(' ')).join('\n');
form.addEventListener('input', () => {
  result.hidden = true;
  status.textContent = '';
});
form.addEventListener('submit', (event) => {
  event.preventDefault();
  result.hidden = true;
  try {
    const foods = el('foods')
      .value.trim()
      .split(/\r?\n/)
      .map((line) => {
        const match = line.trim().match(/^(\S+)\s+(.+)$/u);
        if (!match) throw Error('每行请填写 Emoji、空格和餐饮名称');
        return match.slice(1);
      });
    const link = inviteUrl(location.href, {
      to: el('recipient').value.trim() || defaults.to,
      from: el('sender').value.trim() || defaults.from,
      message: el('copy').value.trim() || defaults.message,
      foods,
    });
    url.value = link;
    el('preview').href = link;
    result.hidden = false;
    status.textContent = '邀请链接已生成。';
    result.scrollIntoView({ block: 'nearest' });
  } catch (error) {
    status.textContent = error.message;
  }
});
el('copy-url').addEventListener('click', async () => {
  const link = url.value;
  try {
    await navigator.clipboard.writeText(link);
    status.textContent = '链接已复制。';
  } catch {
    url.focus();
    url.select();
    url.setSelectionRange(0, link.length);
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch {}
    status.textContent = ok ? '链接已复制。' : '链接已选中，请长按或使用复制快捷键。';
  }
});
