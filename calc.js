// kcal = MET × вес × часы. Силовые: подход ≈ повторы по 3 с + ~75 с отдыха (MET уже учитывает отдых)
function calc(ex, a, b = 10) {
  const hours = ex.mode === 'minutes' ? a / 60 : (a * (b * 3 + 75)) / 3600;
  const kcal = Math.round(ex.met * S.p.weight * hours);
  const { p, f, c } = ex.macroSplit;
  return { kcal, p: Math.round(kcal * p / 4), f: Math.round(kcal * f / 9), c: Math.round(kcal * c / 4) };
}

function norm(burned) {
  const { weight: w, height: h, age: a, sex, act, goal } = S.p;
  const bmr = 10 * w + 6.25 * h - 5 * a + (sex === 'm' ? 5 : -161);
  let kcal = bmr * act + burned;
  if (goal === 'bulk') kcal *= 1.15;
  if (goal === 'cut') kcal *= 0.85;
  kcal = Math.round(kcal);
  const p = Math.round(w * (goal === 'cut' ? 2.1 : 1.8));
  const f = Math.round(w * 0.9);
  const c = Math.max(50, Math.round((kcal - p * 4 - f * 9) / 4));
  return { kcal, p, f, c };
}
