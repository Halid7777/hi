// Состояние и хранилище
const KEY = 'fitmacro_v2';
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const dayKey = (d = new Date()) => d.toLocaleDateString('sv'); // YYYY-MM-DD

const DEF_PROFILE = { weight: 65, height: 170, age: 25, sex: 'm', act: 1.375, goal: 'maintain' };
let S = { p: { ...DEF_PROFILE }, custom: [], days: {} };
let cat = 'all', query = '';

try {
  const saved = JSON.parse(localStorage.getItem(KEY) || '{}');
  S = { ...S, ...saved, p: { ...DEF_PROFILE, ...(saved.p || {}) } };
} catch (e) {}

const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
const today = () => {
  const k = dayKey();
  if (!S.days[k]) S.days[k] = { w: [], water: 0 };
  const d = S.days[k];
  if (!d.w) d.w = [];
  if (!d.food) d.food = [];
  return d;
};
const allExercises = () => [...S.custom, ...DEFAULT_EXERCISES];
const sumDay = d => d.w.reduce((a, i) => ({ kcal: a.kcal + i.kcal, p: a.p + i.p, f: a.f + i.f, c: a.c + i.c }), { kcal: 0, p: 0, f: 0, c: 0 });
