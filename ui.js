function updateSummary() {
  const d = today(), t = sumDay(d), n = norm(t.kcal);
  $('#total-burned').textContent = t.kcal;
  $('#total-p').textContent = `${t.p} г`;
  $('#total-f').textContent = `${t.f} г`;
  $('#total-c').textContent = `${t.c} г`;
  $('#target-kcal').textContent = n.kcal;
  const goal = Math.round(S.p.weight * 33 + t.kcal * 1.2);
  $('#water-current').textContent = d.water;
  $('#water-goal').textContent = goal;
  const pct = Math.min(100, d.water / goal * 100);
  const wb = $('#water-bar'); wb.style.setProperty('--lvl', pct); wb.classList.toggle('empty', !pct);
  $('#ring-arc').style.strokeDashoffset = 327 * (1 - Math.min(1, t.kcal / BURN_GOAL));
  funLine(t.kcal);
  $('#streak-count').textContent = streak();
  const lv = level(); $('#level-badge').textContent = `Ур. ${lv.n} · ${lv.title}`;
  if (t.kcal >= BURN_GOAL && !d.bd) { d.bd = 1; save(); confetti(); toast('Цель по калориям выполнена! 🔥'); }
  if (d.water >= goal && !d.wd) { d.wd = 1; save(); confetti(); toast('Норма воды выполнена! 💧'); }
  $('#daily-kcal').textContent = `${n.kcal} ккал`;
  $('#daily-p').textContent = `${n.p} г`;
  $('#daily-f').textContent = `${n.f} г`;
  $('#daily-c').textContent = `${n.c} г`;
  renderFood();
}

const kbzhuHTML = r => `<span>Расход: <strong>${r.kcal} ккал</strong></span>
  <span>Б <strong>${r.p}</strong> · Ж <strong>${r.f}</strong> · У <strong>${r.c}</strong> г</span>`;

function renderCatalog() {
  const box = $('#exercise-catalog');
  const q = query.trim().toLowerCase();
  const list = allExercises().filter(e =>
    (cat === 'all' || (cat === 'custom' ? e.id.startsWith('custom-') : e.category === cat)) &&
    (!q || (e.name + ' ' + e.muscle).toLowerCase().includes(q)));
  if (!list.length) { box.innerHTML = '<div class="empty-state">Ничего не найдено.</div>'; return; }
  box.innerHTML = list.map(ex => {
    const m = ex.mode === 'minutes';
    const r = calc(ex, m ? ex.defaultMinutes : ex.defaultSets, m ? 1 : ex.defaultReps);
    return `<div class="ex-card" data-id="${esc(ex.id)}" data-c="${ex.category}">
      <div class="ex-top">
        <div><div class="ex-title">${esc(ex.name)}</div><span class="subtitle">${esc(ex.muscle)}</span></div>
        <span class="ex-tag">MET ${ex.met}</span>
        ${ex.id.startsWith('custom-') ? '<button class="btn-text danger" data-act="del-custom" aria-label="Удалить">✕</button>' : ''}
      </div>
      <div class="ex-kbzhu">${kbzhuHTML(r)}</div>
      <div class="ex-controls">
        ${m ? `<input type="number" inputmode="numeric" min="1" max="180" value="${ex.defaultMinutes}" data-in="1" aria-label="Минуты" /><span class="subtitle">мин</span>`
            : `<input type="number" inputmode="numeric" min="1" max="20" value="${ex.defaultSets}" data-in="1" aria-label="Подходы" /><span class="subtitle">×</span>
               <input type="number" inputmode="numeric" min="1" max="200" value="${ex.defaultReps}" data-in="2" aria-label="Повторения" />`}
        <button class="btn-primary" data-act="add">+ В тренировку</button>
      </div></div>`;
  }).join('');
}

const readCard = card => {
  const ex = allExercises().find(e => e.id === card.dataset.id);
  const v1 = Math.max(1, Number(card.querySelector('[data-in="1"]').value) || 1);
  const i2 = card.querySelector('[data-in="2"]');
  return { ex, v1, v2: i2 ? Math.max(1, Number(i2.value) || 1) : 1 };
};

function renderWorkout() {
  const d = today(), list = $('#workout-list');
  if (!d.w.length) {
    list.innerHTML = '<div class="empty-state">Пока пусто. Откройте «Упражнения» и добавьте нагрузку — приложение посчитает расход и КБЖУ для восстановления.</div>';
    return;
  }
  list.innerHTML = d.w.map(i => `<div class="ex-card">
    <div class="ex-top">
      <div><div class="ex-title">${esc(i.name)}</div><span class="subtitle">${esc(i.volumeText)}</span></div>
      <button class="btn-text danger" data-uid="${i.uid}" aria-label="Удалить">✕</button>
    </div>
    <div class="ex-kbzhu"><span>Сожжено: <strong>${i.kcal} ккал</strong></span>
      <span>Б <strong>${i.p}</strong> · Ж <strong>${i.f}</strong> · У <strong>${i.c}</strong> г</span></div></div>`).join('');
}

function renderHistory() {
  const days = [...Array(7)].map((_, i) => { const dt = new Date(); dt.setDate(dt.getDate() - 6 + i); return dt; });
  const data = days.map(dt => ({ dt, kcal: S.days[dayKey(dt)] ? sumDay(S.days[dayKey(dt)]).kcal : 0 }));
  const max = Math.max(100, ...data.map(x => x.kcal));
  $('#week-chart').innerHTML = data.map((x, i) =>
    `<div class="${i === 6 ? 'today' : ''}"><span>${x.kcal || ''}</span><i style="height:${x.kcal / max * 100}%"></i>
     <span>${x.dt.toLocaleDateString('ru-RU', { weekday: 'short' })}</span></div>`).join('');
  $('#week-kcal').textContent = `${data.reduce((a, x) => a + x.kcal, 0)} ккал`;
  $('#week-days').textContent = `${data.filter(x => x.kcal).length} из 7`;
}

function switchTab(id) {
  $$('.tab-content').forEach(el => el.classList.toggle('active', el.id === id));
  $$('.nav-btn').forEach(el => el.classList.toggle('active', el.dataset.target === id));
  if (id === 'tab-history') renderHistory();
  scrollTo(0, 0);
}
