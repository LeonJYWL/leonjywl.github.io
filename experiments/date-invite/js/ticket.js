const ink = '#294338',
  green = '#345847',
  red = '#a45c43',
  muted = '#58695d',
  paper = '#fffdf5';
const sans =
  'system-ui,"PingFang SC","Microsoft YaHei","Noto Sans CJK SC",sans-serif,"Apple Color Emoji","Noto Color Emoji"';
const serif = 'Georgia,"Noto Serif CJK SC",serif';
const mono = 'ui-monospace,monospace';
const rowsOf = (t) => [
  ['To', t.to],
  ['From', t.from],
  ['日期', t.date],
  ['时间', t.time],
  ['活动', t.activity],
  ['餐饮', t.food],
];

function wrapped(ctx, value, width) {
  const chars =
    typeof Intl.Segmenter === 'function'
      ? Array.from(
          new Intl.Segmenter('zh', { granularity: 'grapheme' }).segment(value),
          (part) => part.segment,
        )
      : Array.from(value);
  const lines = [];
  let line = '';
  for (const c of chars) {
    if (line && ctx.measureText(line + c).width > width) {
      lines.push(line);
      line = '';
    }
    line += c;
  }
  lines.push(line);
  return lines;
}
// Layout in logical pixels first so the on-screen pass and its 3× PNG share every line break.
export function ticketPNG(t) {
  const canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d');
  if (!ctx) throw Error('Canvas unavailable');
  const rows = rowsOf(t).map(([label, value]) => {
    const font = '17px ' + sans;
    ctx.font = font;
    return { label, font, lines: wrapped(ctx, value, 263) };
  });
  const footer = 150 + rows.reduce((height, r) => height + 22 + 26 * r.lines.length, 0) + 8;
  const height = footer + 71,
    width = 380;
  canvas.width = width * 3;
  canvas.height = height * 3;
  ctx.scale(3, 3);
  function text(str, x, y, font, color = ink) {
    ctx.fillStyle = color;
    ctx.font = font;
    ctx.fillText(str, x, y);
  }
  function line(x1, y1, x2, y2, color) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
  ctx.fillStyle = paper;
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = '#b3bda9';
  ctx.strokeRect(0.5, 0.5, width - 1, height - 1);
  ctx.fillStyle = green;
  ctx.fillRect(0, 0, width, 8);
  text('D A T E   P A S S', 26, 43, '12px ' + mono, green);
  text('Our Date.', 23, 111, 'italic 57px ' + serif);
  // Botanical cancellation mark echoes the wax seal on the envelope.
  ctx.save();
  ctx.translate(320, 79);
  ctx.rotate(0.18);
  ctx.strokeStyle = red;
  for (const r of [24, 20]) {
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, 2 * Math.PI);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(-4, 13);
  ctx.quadraticCurveTo(3, 3, 3, -12);
  ctx.moveTo(1, 4);
  ctx.quadraticCurveTo(-9, 1, -9, -6);
  ctx.quadraticCurveTo(-1, -5, 1, 4);
  ctx.moveTo(3, -1);
  ctx.quadraticCurveTo(13, -5, 13, -12);
  ctx.quadraticCurveTo(5, -9, 3, -1);
  ctx.stroke();
  ctx.restore();
  function perforation(y) {
    ctx.setLineDash([3, 4]);
    line(0, y, width, y, '#a8b49f');
    ctx.setLineDash([]);
    for (const x of [0, width]) {
      ctx.beginPath();
      ctx.arc(x, y, 7, 0, 2 * Math.PI);
      ctx.fillStyle = '#f6f4eb';
      ctx.fill();
      ctx.strokeStyle = '#b3bda9';
      ctx.stroke();
    }
  }
  perforation(134);
  let y = 150;
  for (const row of rows) {
    text(row.label, 26, y + 22, '14px ' + sans, muted);
    for (const [i, s] of row.lines.entries()) text(s, 88, y + 22 + i * 26, row.font);
    y += 22 + row.lines.length * 26;
  }
  perforation(footer);
  text('期待见面！', 26, footer + 42, '18px ' + serif);
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i % 2 ? '#93a798' : '#ba8975';
    ctx.save();
    ctx.translate(292 + i * 8, footer + 33);
    ctx.transform(1, 0, -0.55, 1, 0, 0);
    ctx.fillRect(0, 0, 4, 8);
    ctx.restore();
  }
  const url = canvas.toDataURL('image/png');
  if (!url.startsWith('data:image/png;')) throw Error('PNG unavailable');
  return url;
}
export function showTicket(container, t) {
  const article = document.createElement('article');
  article.className = 'ticket-fallback';
  const add = (tag, content, parent = article) => {
    const node = document.createElement(tag);
    node.textContent = content;
    parent.append(node);
    return node;
  };
  add('span', 'DATE PASS');
  const title = add('h1', 'Our Date.');
  title.tabIndex = -1;
  const details = add('dl', '');
  for (const [k, v] of rowsOf(t)) {
    add('dt', k, details);
    add('dd', v, details);
  }
  add('p', '期待见面！');
  container.replaceChildren(article);
  try {
    const src = ticketPNG(t),
      img = new Image();
    img.alt = '';
    img.src = src;
    img.id = 'pass-image';
    article.classList.add('sr-only');
    container.append(img);
    return src;
  } catch {
    return null;
  }
}
