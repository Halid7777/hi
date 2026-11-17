// ---- Приколюхи ----
const BURN_GOAL = 500;
const FOODS = [['🍌', 105, 'банан'], ['🍕', 285, 'кусок пиццы'], ['🍩', 250, 'пончик'], ['🍫', 230, 'плитка шоколада'], ['🍔', 500, 'бургер'], ['🥐', 230, 'круассан']];
const TITLES = ['Новичок', 'Разминка', 'Любитель', 'Боец', 'Атлет', 'Машина', 'Легенда'];
let funI = 0;
function funLine(k) {
  const f = FOODS[funI % FOODS.length];
  $('#fun-line').textContent = k ? `Это ≈ ${(k / f[1]).toFixed(1)} × ${f[0]} ${f[2]}` : 'Добавьте упражнение — и узнаем, сколько это бананов 🍌';
}
function streak() {
  let n = 0; const dt = new Date();
  const burned = x => S.days[dayKey(x)] && sumDay(S.days[dayKey(x)]).kcal > 0;
  if (!burned(dt)) dt.setDate(dt.getDate() - 1);
  while (burned(dt)) { n++; dt.setDate(dt.getDate() - 1); }
  return n;
}
function level() {
  const total = Object.values(S.days).reduce((a, d) => a + sumDay(d).kcal, 0);
  const n = Math.floor(total / 1500) + 1;
  return { n, title: TITLES[Math.min(n - 1, TITLES.length - 1)] };
}
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 2600);
}
function confetti() {
  const box = $('#confetti'), colors = ['#a3e635', '#38bdf8', '#fbbf24', '#f472b6', '#fff'];
  for (let i = 0; i < 44; i++) {
    const s = document.createElement('i');
    s.style.cssText = `left:${Math.random() * 100}%;background:${colors[i % 5]};--x:${(Math.random() - .5) * 160}px;--r:${Math.random() * 720}deg;animation-delay:${Math.random() * .25}s`;
    box.appendChild(s); setTimeout(() => s.remove(), 2400);
  }
  navigator.vibrate && navigator.vibrate(80);
}
