export const DEFAULT_MESSAGE =
  '有一个不算正式，但很认真的邀请。\n我负责发出邀请，接下来的安排想听听你的意见。\n要不要一起策划一次约会？';
export const FOODS = [
  ['🍣', '日料'],
  ['🍲', '火锅'],
  ['🍢', '烧烤'],
  ['🥩', '西餐'],
  ['🥟', '早茶 / 点心'],
  ['🍜', '面食'],
  ['☕', '咖啡甜品'],
];
export const SPECIAL = [
  ['host', '✨', '你来决定'],
  ['skip', '🌿', '不另外安排吃饭'],
];
export const ACTIVITIES = [
  ['meal', '🍽️', '吃点好的'],
  ['walk', '🌿', '散步聊天'],
  ['film', '🎬', '看场电影'],
  ['coffee', '☕', '喝杯咖啡'],
  ['fun', '🎟️', '做点有趣的事'],
  ['surprise', '✨', '留点惊喜'],
];
export const defaults = { to: '你', from: 'Leon', message: DEFAULT_MESSAGE, foods: FOODS };
export const MAX_URL = 3000;

function field(value, max, multiline = false) {
  if (typeof value !== 'string') throw Error('文字格式有误');
  const s = value.trim();
  const controls = multiline ? /[\u0000-\u0009\u000b-\u001f\u007f]/ : /[\u0000-\u001f\u007f]/;
  if (!s || controls.test(s) || Array.from(s).length > max) throw Error('请检查文字内容与长度');
  return s;
}
function validateFoods(rows) {
  if (!Array.isArray(rows) || !rows.length || rows.length > 9)
    throw Error('请设置 1 至 9 种普通餐饮');
  const labels = new Set(SPECIAL.map((row) => row[2]));
  return rows.map((pair) => {
    if (!Array.isArray(pair) || pair.length !== 2) throw Error('每行请填写 Emoji 和餐饮名称');
    const emoji = field(pair[0], 12),
      name = field(pair[1], 16);
    if (labels.has(name)) throw Error('餐饮名称重复，或与保留选项相同');
    labels.add(name);
    return [emoji, name];
  });
}
function normalize(data) {
  if (
    !data ||
    typeof data !== 'object' ||
    Array.isArray(data) ||
    Object.keys(data).some((k) => !['to', 'from', 'message', 'foods'].includes(k))
  )
    throw Error('配置格式有误');
  return {
    to: field('to' in data ? data.to : defaults.to, 24),
    from: field('from' in data ? data.from : defaults.from, 24),
    message: field('message' in data ? data.message : defaults.message, 180, true),
    foods: validateFoods('foods' in data ? data.foods : FOODS),
  };
}
export function inviteUrl(base, input) {
  const url = new URL('./', base),
    config = normalize(input);
  const diff = Object.fromEntries(
    Object.entries(config).filter(([k, v]) => JSON.stringify(v) !== JSON.stringify(defaults[k])),
  );
  if (Object.keys(diff).length) {
    const bytes = new TextEncoder().encode(JSON.stringify(diff));
    url.hash =
      'v1.' +
      btoa(String.fromCharCode(...bytes))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
  }
  if (url.href.length > MAX_URL) throw Error('链接太长，请缩短文案或减少餐饮选项');
  return url.href;
}
export function readInvite(hash) {
  if (!hash) return { config: defaults };
  try {
    if (hash.length > MAX_URL || !/^#v1\.[A-Za-z0-9_-]+$/.test(hash)) throw Error();
    const bytes = Uint8Array.from(atob(hash.slice(4).replace(/-/g, '+').replace(/_/g, '/')), (c) =>
      c.charCodeAt(0),
    );
    const data = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
    return { config: normalize(data) };
  } catch {
    return { config: defaults, warning: '这封信的专属设置未能读取，已打开通用邀请。' };
  }
}
export function foodOptions(config) {
  return [...config.foods.map(([emoji, name], i) => ['food-' + i, emoji, name]), ...SPECIAL];
}
