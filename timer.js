// ---- Таймер (по реальному времени, не сбивается при сворачивании) ----
let tPreset = 90, tLeft = 90, tEnd = 0, tInt = null;
const fmt = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
function timerUI() {
  $('#timer-display').textContent = $('#mini-timer').textContent = fmt(tLeft);
  $('#timer-display').classList.toggle('done', tLeft === 0);
  $('#open-timer-btn').classList.toggle('running', !!tInt);
  $('#timer-start-btn').textContent = tInt ? 'Пауза' : 'Старт';
}
function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [0, .45, .9].forEach(t => {
      const o = ctx.createOscillator(); o.frequency.value = 880; o.connect(ctx.destination);
      o.start(ctx.currentTime + t); o.stop(ctx.currentTime + t + .3);
    });
  } catch (e) {}
  navigator.vibrate && navigator.vibrate([300, 150, 300]);
}
function stopTimer() { clearInterval(tInt); tInt = null; }
function startTimer() {
  if (tInt) { stopTimer(); return timerUI(); }
  if (tLeft <= 0) tLeft = tPreset;
  tEnd = Date.now() + tLeft * 1000;
  tInt = setInterval(() => {
    tLeft = Math.max(0, Math.ceil((tEnd - Date.now()) / 1000));
    if (!tLeft) { stopTimer(); beep(); }
    timerUI();
  }, 250);
  timerUI();
}
