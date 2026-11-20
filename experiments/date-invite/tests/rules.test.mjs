import test from 'node:test';
import assert from 'node:assert/strict';
import { defaults, inviteUrl, readInvite, foodOptions } from '../js/config.js';
import { appointment, localDay, toggleActivity, foodAllowed, formatDay } from '../js/choices.js';

const base = 'https://leonjywl.github.io/experiments/date-invite/';
const encode = (o) => new URL(inviteUrl(base + 'create.html', o));
test('通用路径与仅含差异的 V1 配置', () => {
  assert.equal(encode({}).href, base);
  assert.equal(encode(defaults).href, base);
  const link = encode({ to: '小美🌿' });
  assert.match(link.hash, /^#v1\./);
  assert.deepEqual(JSON.parse(Buffer.from(link.hash.slice(4), 'base64url').toString()), {
    to: '小美🌿',
  });
  assert.equal(readInvite('').config.to, '你');
});
test('新旧邀请独立，Unicode、换行与标点往返一致', () => {
  const first = encode({ to: '小雨', message: '你好，“🍵”！\n周末见？', foods: [['🍰', '蛋糕']] });
  const next = encode({ to: '小林👩🏽‍🌾' });
  const a = readInvite(first.hash).config;
  assert.equal(a.to, '小雨');
  assert.equal(a.message, '你好，“🍵”！\n周末见？');
  assert.equal(readInvite(next.hash).config.to, '小林👩🏽‍🌾');
  assert.deepEqual(
    foodOptions(a).map((r) => r[0]),
    ['food-0', 'host', 'skip'],
  );
});
test('字段类型、控制字符、重复或保留选项及长度限制', () => {
  for (const bad of [
    { to: '甲'.repeat(25) },
    { from: 42 },
    { to: '甲\u0000乙' },
    { message: '甲'.repeat(181) },
    { foods: [] },
    {
      foods: [
        ['🍜', '面'],
        ['🍣', '面'],
      ],
    },
    { foods: [['🍵', '你来决定']] },
    { foods: Array(10).fill(['🍲', '汤']) },
  ])
    assert.throws(() => encode(bad));
  assert.throws(() => inviteUrl('https://example.com/' + 'a'.repeat(3000) + '/create.html', {}));
});
test('缺失、损坏、未知版本、过长、不兼容配置安全降级', () => {
  for (const hash of [
    '#v1.',
    '#v1.a',
    '#v1._w',
    '#v1.e30=',
    '#v2.e30',
    '#v1.' + 'A'.repeat(3001),
    ...[null, [], { to: 3 }, { unknown: true }].map(
      (v) => '#v1.' + Buffer.from(JSON.stringify(v)).toString('base64url'),
    ),
  ]) {
    assert.deepEqual(readInvite(hash).config, defaults);
    assert.ok(readInvite(hash).warning);
  }
});
test('活动数量、取消与惊喜独占', () => {
  let items = toggleActivity([], 'meal').items;
  assert.ok(toggleActivity(items, 'surprise').message);
  items = toggleActivity(items, 'walk').items;
  assert.equal(toggleActivity(items, 'film').items, items);
  assert.deepEqual(toggleActivity(items, 'meal').items, ['walk']);
  assert.ok(toggleActivity(['surprise'], 'walk').message);
  assert.deepEqual(toggleActivity(['surprise'], 'surprise').items, []);
});
test('餐饮冲突仅与稳定标识相关', () => {
  assert.equal(foodAllowed(['meal'], 'skip'), false);
  for (const id of ['host', 'food-0']) assert.equal(foodAllowed(['meal'], id), true);
  assert.equal(foodAllowed(['walk'], 'skip'), true);
});
test('设备本地的日期、午夜、过去分钟以及闰年', () => {
  const now = new Date(2026, 10, 28, 0, 1, 15);
  assert.equal(localDay(now), '2026-11-28');
  assert.equal(formatDay(now), '2026年11月28日 · 周六');
  for (const [d, t] of [
    ['', '18:30'],
    ['2026-11-28', ''],
    ['2026-11-27', '23:59'],
    ['2026-11-28', '00:00'],
    ['2026-11-28', '00:01'],
    ['2027-02-29', '18:30'],
    ['2027-01-01', '24:00'],
  ])
    assert.equal(appointment(d, t, now), null);
  assert.ok(appointment('2026-11-28', '00:02', now));
  assert.ok(appointment('2028-02-29', '18:30', now));
});
