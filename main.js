document.addEventListener('DOMContentLoaded', () => {
  $('#current-date').textContent = new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' });
  const p = S.p;
  $('#user-weight').value = p.weight; $('#user-height').value = p.height; $('#user-age').value = p.age;
  $('#user-sex').value = p.sex; $('#user-act').value = [1.2, 1.375, 1.55].reduce((a, b) => Math.abs(b - p.act) < Math.abs(a - p.act) ? b : a); $('#user-goal').value = p.goal;
  updateSummary(); renderCatalog(); renderWorkout(); timerUI();

  $('#food-select').innerHTML = FOODS_DB.map((f, i) => `<option value="${i}">${f[1]} ${f[0]} — ${f[2]} ккал/100 г</option>`).join('');
  $('#add-food-btn').addEventListener('click', () => {
    const f = FOODS_DB[Number($('#food-select').value)], g = Math.min(2000, Math.max(1, Number($('#food-grams').value) || 100)), k = g / 100;
    today().food.push({ uid: Date.now(), name: f[0], emoji: f[1], g, kcal: Math.round(f[2] * k), p: Math.round(f[3] * k), f: Math.round(f[4] * k), c: Math.round(f[5] * k) });
    save(); renderFood(); toast(`${f[1]} добавлено`);
  });
  $('#food-list').addEventListener('click', e => {
    const b = e.target.closest('[data-food]'); if (!b) return;
    const d = today(); d.food = d.food.filter(i => i.uid !== Number(b.dataset.food)); save(); renderFood();
  });
  $('#fun-line').addEventListener('click', () => { funI++; funLine(sumDay(today()).kcal); });
  $$('.nav-btn').forEach(b => b.addEventListener('click', () => switchTab(b.dataset.target)));

  $$('.chip').forEach(c => c.addEventListener('click', () => {
    $$('.chip').forEach(x => x.classList.remove('active'));
    c.classList.add('active'); cat = c.dataset.cat; renderCatalog();
  }));
  $('#search').addEventListener('input', e => { query = e.target.value; renderCatalog(); });

  // Каталог: делегирование событий
  const cat_ = $('#exercise-catalog');
  cat_.addEventListener('input', e => {
    const card = e.target.closest('.ex-card'); if (!card) return;
    const { ex, v1, v2 } = readCard(card);
    card.querySelector('.ex-kbzhu').innerHTML = kbzhuHTML(calc(ex, v1, v2));
  });
  cat_.addEventListener('click', e => {
    const btn = e.target.closest('[data-act]'); if (!btn) return;
    const card = btn.closest('.ex-card');
    if (btn.dataset.act === 'add') {
      const { ex, v1, v2 } = readCard(card);
      today().w.push({
        uid: Date.now(), name: ex.name,
        volumeText: ex.mode === 'minutes' ? `${v1} мин` : `${v1} подх. × ${v2} повт.`, ...calc(ex, v1, v2)
      });
      save(); updateSummary(); renderWorkout(); switchTab('tab-workout');
    } else if (confirm('Удалить своё упражнение из базы?')) {
      S.custom = S.custom.filter(x => x.id !== card.dataset.id); save(); renderCatalog();
    }
  });

  $('#workout-list').addEventListener('click', e => {
    const b = e.target.closest('[data-uid]'); if (!b) return;
    const d = today(); d.w = d.w.filter(i => i.uid !== Number(b.dataset.uid));
    save(); updateSummary(); renderWorkout();
  });
  $('#clear-workout-btn').addEventListener('click', () => {
    if (!today().w.length || !confirm('Очистить тренировку за сегодня? Вода сохранится.')) return;
    today().w = []; save(); updateSummary(); renderWorkout();
  });

  $('#add-water-btn').addEventListener('click', () => { today().water += 250; save(); updateSummary(); });
  $('#sub-water-btn').addEventListener('click', () => { const d = today(); d.water = Math.max(0, d.water - 250); save(); updateSummary(); });

  $('#toggle-custom-form-btn').addEventListener('click', () => $('#custom-exercise-form').classList.toggle('hidden'));
  $('#custom-exercise-form').addEventListener('submit', e => {
    e.preventDefault();
    const type = $('#custom-type').value, cardio = type === 'cardio';
    S.custom.unshift({
      id: 'custom-' + Date.now(), name: $('#custom-name').value.trim(), category: type,
      mode: cardio ? 'minutes' : 'sets', met: parseFloat($('#custom-met').value) || 6,
      defaultSets: 4, defaultReps: 12, defaultMinutes: 15,
      macroSplit: cardio ? { p: .22, f: .15, c: .63 } : { p: .35, f: .20, c: .45 }, muscle: 'Своё'
    });
    save(); renderCatalog(); e.target.reset(); e.target.classList.add('hidden');
  });

  $('#save-profile-btn').addEventListener('click', () => {
    const num = (id, def, lo, hi) => Math.min(hi, Math.max(lo, Number($(id).value) || def));
    S.p = {
      weight: num('#user-weight', 65, 35, 250), height: num('#user-height', 170, 120, 230),
      age: num('#user-age', 25, 12, 90), sex: $('#user-sex').value,
      act: Number($('#user-act').value), goal: $('#user-goal').value
    };
    $('#user-weight').value = S.p.weight; $('#user-height').value = S.p.height; $('#user-age').value = S.p.age;
    save(); updateSummary(); renderCatalog();
    const b = $('#save-profile-btn'); b.textContent = 'Сохранено ✓'; setTimeout(() => b.textContent = 'Сохранить и пересчитать', 1200);
  });


  // Таймер
  const modal = $('#timer-modal');
  $('#open-timer-btn').addEventListener('click', () => modal.classList.remove('hidden'));
  $('#close-timer-btn').addEventListener('click', () => modal.classList.add('hidden'));
  modal.addEventListener('click', e => { if (e.target === modal) modal.classList.add('hidden'); });
  $$('.timer-presets button').forEach(b => b.addEventListener('click', () => {
    stopTimer(); tPreset = tLeft = Number(b.dataset.sec); timerUI();
  }));
  $('#timer-start-btn').addEventListener('click', startTimer);
  $('#timer-add-btn').addEventListener('click', () => { tLeft += 15; if (tInt) tEnd += 15000; timerUI(); });
  $('#timer-reset-btn').addEventListener('click', () => { stopTimer(); tLeft = tPreset; timerUI(); });

  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});
});
