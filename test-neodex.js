// lancé par le test « local » de NeoDex : vérification interne, une croix anglaise finie au clic jusqu'au « parfait », la première énigme à 3 étoiles,
// un départ impossible reconnu par l’indicateur, la grille des énigmes et la mise en page
module.exports = async ({ pj, sleep }) => {
  const B = `document.getElementById('gc').__bi`;
  const S = expr => pj(`(() => { const b = ${B}.st(); return ${expr}; })()`);
  const shot = async n => { if (!process.env.NEO_SHOTS) return; const d = await pj(`document.getElementById('gc').toDataURL()`); require('fs').writeFileSync(require('path').join(process.env.NEO_SHOTS, 'billes-' + n + '.png'), Buffer.from(d.split(',')[1], 'base64')); };
  const click = i => pj(`(() => { const c = document.getElementById('gc'), r = c.getBoundingClientRect(), [x, y] = ${B}.st().P.pos[${i}]; c.dispatchEvent(new PointerEvent('pointerdown', {bubbles: true, clientX: r.left + x / c.width * r.width, clientY: r.top + y / c.height * r.height})); return 0; })()`);
  // joue la solution du solveur, saut par saut, avec de vrais clics
  const playOut = async name => {
    const sol = await S(`${B}.solve()`); if (!sol) throw new Error(name + ' : le solveur ne trouve pas de solution');
    for (let k = 0; k < sol.length; k++) { const [a, , c] = await S(`b.P.moves[${sol[k]}]`); await click(a); await sleep(60); await click(c); await sleep(380); if (k === 3) await shot(name + '-saut'); }
    await sleep(900); await shot(name + '-fin'); return sol.length;
  };
  const sc = await pj(`document.querySelector('[data-selfcheck]')?.dataset.selfcheck`); if (sc !== 'ok') throw new Error('vérification interne : ' + sc);
  await S(`${B}.board('Croix anglaise')`); await sleep(400); await shot('0-depart');
  if (await S('b.state') !== 'win') throw new Error('l’indicateur ne dit pas que la croix anglaise est gagnable');
  const n = await playOut('anglaise');
  const r = await S('b.result'); if (!(r && r.n === 1 && r.onT)) throw new Error('la croix anglaise ne finit pas en parfait : ' + JSON.stringify(r));
  if (await S('b.gutter.length') !== 31) throw new Error('les billes sorties ne sont pas dans la rigole');
  for (const name of ['Croix française', 'Petite croix', 'Pyramide', 'Asymétrique']) { await S(`${B}.board('${name}')`); await sleep(300); await shot('1-' + name.split(' ').pop()); }
  await S(`${B}.load('Petite croix', [[3, 2]])`); await sleep(2500);
  if (await S('b.state') !== 'lost') throw new Error('l’indicateur ne voit pas un départ impossible : ' + await S('b.state'));
  await pj(`document.querySelector('#biTabs [data-t="pz"]').click(), 0`); await sleep(400);
  if (await pj(`document.querySelectorAll('#biGrid button').length`) !== 30 || await S('b.pz') !== 0) throw new Error('la grille des énigmes ne s’ouvre pas');
  await playOut('enigme1');
  if (await S(`b.result && b.result.stars`) !== 3) throw new Error('l’énigme 1 ne donne pas 3 étoiles');
  await click(0); await sleep(300);
  if (await S('b.pz') !== 1 || await pj(`document.querySelectorAll('#biGrid button')[1].disabled`)) throw new Error('l’énigme suivante ne s’ouvre pas');
  for (const i of [9, 15, 22, 27]) { await S(`${B}.play(${i})`); await sleep(400); await shot('2-enigme' + (i + 1)); }
  const lay = await pj(`(() => { const c = document.getElementById('gc').getBoundingClientRect(), s = document.querySelector('.gSide').getBoundingClientRect(); return { beside: s.left >= c.right - 1, fits: document.documentElement.scrollWidth <= innerWidth + 1, w: innerWidth, h: Math.round(c.height) }; })()`);
  if (!lay.fits || (lay.w >= 900 && !lay.beside)) throw new Error('mise en page : ' + JSON.stringify(lay));
  { // la zone de jeu tient dans la fenêtre, quelle que soit sa taille
    const L = await pj(`(() => { const c = [...document.querySelectorAll('.gameBox canvas')].filter(c => c.offsetWidth).sort((a, b) => b.offsetWidth - a.offsetWidth)[0], r = c.getBoundingClientRect(); let s = 0; for (let e = c.parentElement; e; e = e.parentElement) s += e.scrollTop; return { top: Math.round(r.top + s), bottom: Math.round(r.bottom + s), h: Math.round(r.height), w: Math.round(r.width), wh: innerHeight, ww: innerWidth, sw: document.documentElement.scrollWidth }; })()`);
    if (process.env.NEO_FIT_LOG) console.log('FIT', JSON.stringify(L));
    if (L.bottom > L.wh + 1 || L.sw > L.ww + 1) throw new Error('la zone de jeu dépasse la fenêtre : ' + JSON.stringify(L));
  }
  return 'croix anglaise au clic en ' + n + ' sauts (parfait) · énigme 1 à 3 étoiles · départ impossible reconnu · plateau ' + lay.h + ' px';
};
