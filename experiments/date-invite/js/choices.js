export function toggleActivity(current, id) {
  if (current.includes(id)) return { items: current.filter((value) => value !== id) };
  if (current.length >= 2) return { items: current, message: '最多选两项，请先取消一项' };
  if (current.length && (id === 'surprise' || current.includes('surprise')))
    return { items: current, message: '「留点惊喜」需要单独选择，请先取消已选活动。' };
  return { items: [...current, id] };
}
export function foodAllowed(activities, food) {
  return !(food === 'skip' && activities.includes('meal'));
}
const pad = (n) => String(n).padStart(2, '0');
export const localDay = (d) =>
  [String(d.getFullYear()).padStart(4, '0'), pad(d.getMonth() + 1), pad(d.getDate())].join('-');
export function appointment(day, time, now = new Date()) {
  if (!/^\d{4,}-\d\d-\d\d$/.test(day) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) return null;
  const [year, month, date] = day.split('-').map(Number),
    [hour, minute] = time.split(':').map(Number);
  const d = new Date(year, month - 1, date, hour, minute);
  return localDay(d) === day && d.getHours() === hour && d.getMinutes() === minute && d >= now
    ? d
    : null;
}
export const formatDay = (d) =>
  d.getFullYear() +
  '年' +
  (d.getMonth() + 1) +
  '月' +
  d.getDate() +
  '日 · 周' +
  '日一二三四五六'[d.getDay()];
