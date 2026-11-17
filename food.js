// ---- Питание ----
const foodTotals = d => d.food.reduce((a, i) => ({ kcal: a.kcal + i.kcal, p: a.p + i.p, f: a.f + i.f, c: a.c + i.c }), { kcal: 0, p: 0, f: 0, c: 0 });
function renderFood() {
  const d = today(), t = foodTotals(d), n = norm(sumDay(d).kcal), left = n.kcal - t.kcal;
  $('#eaten-kcal').textContent = Math.round(t.kcal);
  $('#eaten-target').textContent = n.kcal;
  $('#eaten-bar').style.width = Math.min(100, t.kcal / n.kcal * 100) + '%';
  $('#eaten-left').textContent = left >= 0 ? `Осталось ${Math.round(left)} ккал` : `Перебор на ${Math.round(-left)} ккал`;
  ['p', 'f', 'c'].forEach(k => $('#eaten-' + k).textContent = `${Math.round(t[k])} / ${n[k]} г`);
  $('#food-list').innerHTML = d.food.length ? d.food.map(i => `<div class="ex-card" data-c="food"><div class="food-row">
      <div><div class="ex-title">${esc(i.emoji)} ${esc(i.name)}</div><span class="subtitle">${i.g} г · ${i.kcal} ккал · Б ${i.p} Ж ${i.f} У ${i.c}</span></div>
      <button class="btn-text danger" data-food="${i.uid}" aria-label="Удалить">✕</button></div></div>`).join('')
    : '<div class="empty-state">Пока ничего не съедено. Выберите продукт и граммы — посчитаем КБЖУ.</div>';
}
