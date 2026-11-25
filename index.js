// Billes : Le solitaire en croix : une bille saute par-dessus sa voisine dans un trou vide et la fait sortir. Finis avec une seule bille, au centre si tu peux.
// Jeu NeoDex en pixel art dessiné à la main (police bitmap, cadres et boutons en pixels). Il tourne dans le bac à sable de NeoDex.
const HTML = `<div class="appWrap wide">
  <div class="agHead"><span class="label">Billes</span><span class="hint">Clic sur une bille, puis sur le trou d'arrivée · Retour : annuler · I : indice</span></div>
  <div class="gMain"><div class="gameBox"><canvas id="gc" width="320" height="340"></canvas></div>
    <div class="gSide">
      <div class="sysCard"><b>RECORDS</b><div class="gStats" id="gStats"></div></div>
      <div class="row" id="biTabs"><button class="btn main" data-t="free">PLATEAUX</button><button class="btn" data-t="pz">ÉNIGMES</button></div>
      <div id="biFree" class="gSide"><div class="row"><button class="btn main" id="gNew">NOUVELLE PARTIE</button><select id="biSel" class="f"></select></div></div>
      <div id="biPzBox" hidden><div class="hint">Finis avec une seule bille, sur la case dorée. 3 étoiles sans annuler ni indice, 2 avec trois retours au plus.</div><div class="biGrid" id="biGrid"></div></div>
      <div class="row"><button class="btn" id="biUndo">ANNULER</button><button class="btn" id="biHint">INDICE</button></div>
      <div class="sysCard"><b>SULFURES</b><div class="biCol" id="biCol"></div><div class="hint" id="biColTxt"></div></div>
      <div class="hint">Une bille saute en ligne droite par-dessus une voisine, jusqu'au trou juste derrière. Les arrivées possibles s'allument en jaune.</div><div class="hint">Annuler sans limite : on apprend en revenant en arrière. L'indice montre le prochain bon coup (dans une énigme, il coûte la 3e étoile).</div><div class="hint">Chaque énigme réussie donne un sulfure, une bille de verre avec un motif dedans : 30 à collectionner.</div>
    </div></div>
</div>`;
const CSS = `.biCol{display:grid;grid-template-columns:repeat(10,1fr);gap:3px;margin:6px 0}.biCol canvas{width:100%;image-rendering:pixelated} .gMain{display:flex;gap:22px;align-items:flex-start;flex-wrap:wrap}
.gameBox{display:grid;place-items:center;padding:10px;background:#05010b;flex:2;min-width:320px;position:relative}
.gameBox canvas{width:100%;image-rendering:pixelated;cursor:var(--cp,pointer);touch-action:none}
.gSide{display:flex;flex-direction:column;gap:14px;flex:1;min-width:250px;max-width:420px}
.gSide .sysCard{display:flex;flex-direction:column}
.gStats{display:grid;grid-template-columns:1fr auto;gap:4px 14px}
.gStats b{text-align:right}
.biGrid{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;margin-top:8px}.biGrid .btn{padding:6px 2px;min-width:0}
.gameBox canvas{width:min(100%,max(240px,calc((100vh - 210px) * 320 / 340)));aspect-ratio:320/340}`;
/* ---------- l'habillage pixel art, dessiné à la main : police bitmap (accents compris), cadres, boutons, icônes ----------
   Tout est en pixels pleins, agrandis par 2 sans lissage : aucun dégradé, aucune ombre floue. */
const PXK = (() => {
  // chaque lettre : ses lignes, de haut en bas, à partir de la ligne 2 de la case (0-1 : accents des majuscules, 9-10 : jambages)
  const S = {
    A: '.###. #...# #...# ##### #...# #...# #...#', B: '####. #...# #...# ####. #...# #...# ####.', C: '.###. #...# #.... #.... #.... #...# .###.',
    D: '####. #...# #...# #...# #...# #...# ####.', E: '##### #.... #.... ####. #.... #.... #####', F: '##### #.... #.... ####. #.... #.... #....',
    G: '.###. #...# #.... #.### #...# #...# .####', H: '#...# #...# #...# ##### #...# #...# #...#', I: '### .#. .#. .#. .#. .#. ###',
    J: '..### ...#. ...#. ...#. #..#. #..#. .##..', K: '#...# #..#. #.#.. ##... #.#.. #..#. #...#', L: '#.... #.... #.... #.... #.... #.... #####',
    M: '#...# ##.## #.#.# #.#.# #...# #...# #...#', N: '#...# ##..# #.#.# #..## #...# #...# #...#', O: '.###. #...# #...# #...# #...# #...# .###.',
    P: '####. #...# #...# ####. #.... #.... #....', Q: '.###. #...# #...# #...# #.#.# #..#. .##.#', R: '####. #...# #...# ####. #.#.. #..#. #...#',
    S: '.#### #.... #.... .###. ....# ....# ####.', T: '##### ..#.. ..#.. ..#.. ..#.. ..#.. ..#..', U: '#...# #...# #...# #...# #...# #...# .###.',
    V: '#...# #...# #...# #...# #...# .#.#. ..#..', W: '#...# #...# #...# #.#.# #.#.# ##.## #...#', X: '#...# #...# .#.#. ..#.. .#.#. #...# #...#',
    Y: '#...# #...# .#.#. ..#.. ..#.. ..#.. ..#..', Z: '##### ....# ...#. ..#.. .#... #.... #####',
    a: '..... ..... .###. ....# .#### #...# .####', b: '#.... #.... ####. #...# #...# #...# ####.', c: '..... ..... .###. #.... #.... #.... .###.',
    d: '....# ....# .#### #...# #...# #...# .####', e: '..... ..... .###. #...# ##### #.... .###.', f: '..## .#.. #### .#.. .#.. .#.. .#..',
    g: '..... ..... .#### #...# #...# #...# .#### ....# .###.', h: '#.... #.... ####. #...# #...# #...# #...#', i: '.#. ... ##. .#. .#. .#. ###',
    'ı': '... ... ##. .#. .#. .#. ###', j: '...# .... ..## ...# ...# ...# ...# #..# .##.', k: '#... #... #..# #.#. ##.. #.#. #..#',
    l: '##. .#. .#. .#. .#. .#. ###', m: '..... ..... ##.#. #.#.# #.#.# #.#.# #...#', n: '..... ..... ####. #...# #...# #...# #...#',
    o: '..... ..... .###. #...# #...# #...# .###.', p: '..... ..... ####. #...# #...# #...# ####. #.... #....', q: '..... ..... .#### #...# #...# #...# .#### ....# ....#',
    r: '.... .... #.## ##.. #... #... #...', s: '..... ..... .#### #.... .###. ....# ####.', t: '.#.. .#.. #### .#.. .#.. .#.. ..##',
    u: '..... ..... #...# #...# #...# #..## .##.#', v: '..... ..... #...# #...# #...# .#.#. ..#..', w: '..... ..... #...# #...# #.#.# #.#.# .#.#.',
    x: '..... ..... #...# .#.#. ..#.. .#.#. #...#', y: '..... ..... #...# #...# #...# #...# .#### ....# .###.', z: '..... ..... ##### ...#. ..#.. .#... #####',
    0: '.###. #...# #..## #.#.# ##..# #...# .###.', 1: '..#.. .##.. ..#.. ..#.. ..#.. ..#.. .###.', 2: '.###. #...# ....# ...#. ..#.. .#... #####',
    3: '####. ....# ....# .###. ....# ....# ####.', 4: '...#. ..##. .#.#. #..#. ##### ...#. ...#.', 5: '##### #.... ####. ....# ....# #...# .###.',
    6: '.###. #.... #.... ####. #...# #...# .###.', 7: '##### ....# ...#. ..#.. .#... .#... .#...', 8: '.###. #...# #...# .###. #...# #...# .###.',
    9: '.###. #...# #...# .#### ....# ....# .###.',
    '.': '. . . . . . #', ',': '.. .. .. .. .. .# .# #.', ':': '. . # . . . #', ';': '.. .. .# .. .. .# .# #.', '!': '# # # # # . #',
    '?': '.###. #...# ....# ...#. ..#.. ..... ..#..', "'": '# # . . . . .', '"': '#.# #.# ... ... ... ... ...', '-': '... ... ... ### ... ... ...',
    '+': '..... ..#.. ..#.. ##### ..#.. ..#.. .....', '/': '....# ...#. ...#. ..#.. .#... .#... #....', '(': '.# #. #. #. #. #. .#', ')': '#. .# .# .# .# .# #.',
    '%': '##..# ##.#. ...#. ..#.. .#... .#.## #..##', '·': '. . . # . . .', '×': '..... ..... #...# .#.#. ..#.. .#.#. #...#',
    '<': '...# ..#. .#.. #... .#.. ..#. ...#', '>': '#... .#.. ..#. ...# ..#. .#.. #...', '=': '.... .... #### .... #### .... ....',
    '_': '..... ..... ..... ..... ..... ..... #####', '#': '.#.#. .#.#. ##### .#.#. ##### .#.#. .#.#.', '&': '.##.. #..#. #.#.. .#... #.#.# #..#. .##.#',
    '…': '..... ..... ..... ..... ..... ..... #.#.#', '«': '..... ..#.# .#.#. #.#.. .#.#. ..#.# .....', '»': '..... #.#.. .#.#. ..#.# .#.#. #.#.. .....',
    '◀': '...# ..## .### #### .### ..## ...#', '▶': '#... ##.. ###. #### ###. ##.. #...', '→': '..... ..#.. ...#. ##### ...#. ..#.. .....',
    '←': '..... ..#.. .#... ##### .#... ..#.. .....', '↑': '..#.. .###. #.#.# ..#.. ..#.. ..#.. ..#..', '↓': '..#.. ..#.. ..#.. ..#.. #.#.# .###. ..#..',
    '*': '..... #.#.# .###. ##### .###. #.#.# .....', '[': '## #. #. #. #. #. ##', ']': '## .# .# .# .# .# ##', '|': '# # # # # # #',
    '@': '.###. #...# #.### #.#.# #.### #.... .###.', '€': '..### .#... ####. .#... ####. .#... ..###', '$': '..#.. .#### #.#.. .###. ..#.# ####. ..#..',
    '°': '.#. #.# .#. ... ... ... ...', '~': '..... ..... .#..# #.##. ..... ..... .....', '♪': '..##. ..#.# ..#.. ..#.. .##.. ###.. .#...',
  };
  const ACC = { a: ['..#', '.#.'], g: ['#..', '.#.'], c: ['.#.', '#.#'], d: ['...', '#.#'], t: ['.#.#', '#.#.'], z: ['.#.', '##.'] };  // aigu, grave, circonflexe, tréma, tilde, cédille
  const COMP = { é: 'ea', è: 'eg', ê: 'ec', ë: 'ed', á: 'aa', à: 'ag', â: 'ac', ä: 'ad', í: 'ıa', ì: 'ıg', î: 'ıc', ï: 'ıd', ó: 'oa', ò: 'og', ô: 'oc', ö: 'od',
    ú: 'ua', ù: 'ug', û: 'uc', ü: 'ud', ÿ: 'yd', ñ: 'nt', ç: 'cz', É: 'Ea', È: 'Eg', Ê: 'Ec', Ë: 'Ed', Á: 'Aa', À: 'Ag', Â: 'Ac', Ä: 'Ad', Í: 'Ia', Î: 'Ic', Ï: 'Id',
    Ó: 'Oa', Ô: 'Oc', Ö: 'Od', Ú: 'Ua', Ù: 'Ug', Û: 'Uc', Ü: 'Ud', Ñ: 'Nt', Ç: 'Cz' };
  const SUB = { 'œ': 'oe', 'Œ': 'OE', '’': "'", '‘': "'", '“': '"', '”': '"', '–': '-', '—': '-', ' ': ' ', ' ': ' ', '•': '·', '✓': 'v', 'ᐸ': '<', 'ᐳ': '>', '＜': '<', '＞': '>', '｜': '|', '／': '/', '！': '!', '？': '?', '（': '(', '）': ')', '：': ':', '　': ' ' };  // ᐸ ᐳ : les < > des titres YouTube
  const H = 11, glyphs = new Map(); let raster;
  function glyph(ch) {
    let g = glyphs.get(ch); if (g) return g;
    const px = [], add = (rows, ox, oy) => rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) if (r[x] === '#') px.push([ox + x, oy + y]); });
    const c = COMP[ch], src = S[c ? c[0] : ch]; let w = 3;
    if (src) {
      const rows = src.split(' '); w = Math.max(...rows.map(r => r.length)); add(rows, 0, 2);
      if (c) { const a = ACC[c[1]]; add(a, Math.floor((w - a[0].length) / 2), c[1] === 'z' ? 9 : /[A-Z]/.test(c[0]) ? 0 : 1); }
    } else if (ch !== ' ') {  // japonais, emoji… : la lettre du système, réduite à des pixels nets (sans lissage) sur la même hauteur que la police
      const q = (raster ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true })), RW = 16;
      q.canvas.width = RW; q.canvas.height = H; q.font = '11px "MS Gothic", "Yu Gothic UI", Meiryo, "Segoe UI Symbol", sans-serif'; q.fillStyle = '#000'; q.fillText(ch, 0, 10);
      const d = q.getImageData(0, 0, RW, H).data; let mx = 0;
      for (let y = 0; y < H; y++) for (let x = 0; x < RW; x++) if (d[(y * RW + x) * 4 + 3] > 110) { px.push([x, y]); mx = Math.max(mx, x + 1); }
      w = mx || 3;
      if (!px.length) { w = 5; add(['#####', '#...#', '#...#', '#...#', '#...#', '#...#', '#####'], 0, 2); }  // vraiment inconnue : une petite case
    }
    g = { w, px }; glyphs.set(ch, g); return g;
  }
  function layout(text) {
    let x = 0; const items = [];
    for (const ch of String(text)) for (const c of SUB[ch] ?? ch) { const g = glyph(c); items.push([g, x]); x += g.w + 1; }
    return { w: Math.max(0, x - 1), items };
  }
  function draw(g, text, x, y, color, s = 1) {  // (x, y) : coin haut gauche de la case
    const L = layout(text); g.fillStyle = color;
    for (const [gl, ox] of L.items) for (const [px, py] of gl.px) g.fillRect(x + (ox + px) * s, y + py * s, s, s);
    return L.w * s;
  }
  const bmp = new Map();
  function sprite(text, color, s = 1) {  // le texte tout prêt, gardé pour les images suivantes du jeu
    const k = text + '|' + color + '|' + s; let c = bmp.get(k); if (c) return c;
    c = document.createElement('canvas'); c.width = Math.max(1, layout(text).w * s); c.height = H * s; draw(c.getContext('2d'), text, 0, 0, color, s);
    if (bmp.size > 400) bmp.delete(bmp.keys().next().value);
    bmp.set(k, c); return c;
  }
  // comme fillText : (x, y) sur la ligne de base, aligné à gauche, au centre ou à droite
  function fill(g, text, x, y, color, s = 1, align = 'left') {
    const c = sprite(String(text), color, s), dx = align === 'center' ? -c.width / 2 : align === 'right' ? -c.width : 0;
    g.drawImage(c, Math.round(x + dx), Math.round(y - 9 * s));
  }
  const scale = size => Math.max(1, Math.round((size || 8) / 8));
  function art(rows, pal, s = 1) {  // un dessin en lignes de caractères, chaque caractère une couleur de la palette (« . » : transparent)
    const c = document.createElement('canvas'); c.width = Math.max(...rows.map(r => r.length)) * s; c.height = rows.length * s;
    const g = c.getContext('2d');
    rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) { const col = pal[r[x]]; if (col) { g.fillStyle = col; g.fillRect(x * s, y * s, s, s); } } });
    return c;
  }
  return { H, layout, draw, sprite, fill, scale, art };
})();

// les pièces de l'interface, pixel par pixel (K : contour, les autres lettres : la palette du jeu)
const PX_PANEL = ['..KKKKKKKKKKKK..', '.KAAAAAAAAAAAAK.', 'KALAAAAAAAAAALSK', 'KAAKKKKKKKKKKSSK', 'KAAKHHHHHHHHKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK',
  'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKKKKKKKKKKSSK', 'KALSSSSSSSSSSLSK', '.KSSSSSSSSSSSSK.', '..KKKKKKKKKKKK..'];
const PX_CARD = ['.KKKKKKKKKK.', 'KFFFFFFFFFFK', 'KFHHHHHHHHFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFSSSSSSSSFK', 'KFFFFFFFFFFK', '.KKKKKKKKKK.'];
const PX_BTN = ['.KKKKKKKKKK.', 'KWWWWWWWWWWK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KBBBBBBBBBBK', 'KKKKKKKKKKKK', 'KDDDDDDDDDDK', '.KKKKKKKKKK.'];
const PX_BTN_DOWN = ['............', '............', '.KKKKKKKKKK.', 'KBBBBBBBBBBK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KWWWWWWWWWWK', '.KKKKKKKKKK.'];
const PX_TRACK = ['.KKKKKKKKKK.', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KHHHHHHHHHHK', '.KKKKKKKKKK.'];
const PX_KNOB = ['.KKKKK.', 'KWWWWWK', 'KWAAABK', 'KWAAABK', 'KKKKKKK', 'KWAAABK', 'KWAAABK', 'KBBBBBK', 'KDDDDDK', '.KKKKK.'];
const PX_RAIL = ['KDDDDDDK', 'KDDDDDDK', 'KDDDDDDK', 'KDDHHDDK'];
const PX_ICONS = {
  play: ['kk......', 'kakk....', 'kaaakk..', 'kaaaaakk', 'kaaaaaak', 'kaaaaakk', 'kaaakk..', 'kakk....', 'kk......'],
  full: ['www...www', 'w.......w', 'w.......w', '.........', '....a....', '.........', 'w.......w', 'w.......w', 'www...www'],
  note: ['...aaaaaa', '...aaaaaa', '...a....a', '...a....a', '...a....a', '.aaa..aaa', 'aaaa.aaaa', 'aaaa.aaaa', '.aa...aa.'],
  star: ['....g....', '....g....', '...ggg...', 'ggggwgggg', '.ggwwwgg.', '..ggggg..', '..oo.oo..', '.oo...oo.', '.o.....o.'],
  crown: ['g...g...g', 'gg.ggg.gg', 'ggggggggg', 'grgggggrg', 'ggggggggg', 'ooooooooo'],
  folder: ['oooo.....', 'oggoooooo', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ooooooooo'],
  vol: ['....w....', '...ww..b.', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', '...ww..b.', '....w....'],
  clock: ['..wwwww..', '.w.....w.', 'w...a...w', 'w...a...w', 'w...aaa.w', 'w.......w', 'w.......w', '.w.....w.', '..wwwww..'],
  cursor: ['....a....', '..aaaaa..', '.a..a..a.', '.a.....a.', 'aaa.w.aaa', '.a.....a.', '.a..a..a.', '..aaaaa..', '....a....'],
  plus: ['...b...', '...b...', '...b...', 'bbbbbbb', '...b...', '...b...', '...b...'],
  down: ['wwwwwww', '.wwwww.', '..www..', '...w...'],
};

/* habille la page du jeu : root = son conteneur, T = sa palette, icons = [motif du texte, icône] pour les boutons et libellés */
function pxSkin(root, { T, icons = [], emblem, title }) {
  root.classList.add('pxk'); const s = 2, url = c => c.toDataURL();
  const btnPal = (M, W, B, D) => ({ K: T.k, W, M, B, D });
  const BN = btnPal(T.btn, T.btnHi, T.btnLo, T.k2), BH = btnPal(T.btnHov, T.btnHovHi, T.btnLo, T.k2);
  const BA = btnPal(T.acc, T.accL, T.accS, T.accD), BAH = btnPal(T.accL, '#ffffff', T.acc, T.accD);
  const img = { panel: PXK.art(PX_PANEL, { K: T.k, A: T.acc, S: T.accS, L: T.rivet, H: T.hl, D: T.fill }, s),
    card: PXK.art(PX_CARD, { K: T.k, F: T.line, H: T.hl, D: T.fill, S: T.k2 }, s), cardOn: PXK.art(PX_CARD, { K: T.k, F: T.acc, H: T.accS, D: T.fillOn, S: T.accD }, s),
    btn: PXK.art(PX_BTN, BN, s), btnH: PXK.art(PX_BTN, BH, s), btnD: PXK.art(PX_BTN_DOWN, BH, s),
    main: PXK.art(PX_BTN, BA, s), mainH: PXK.art(PX_BTN, BAH, s), mainD: PXK.art(PX_BTN_DOWN, BA, s),
    track: PXK.art(PX_TRACK, { K: T.k, D: T.k2, H: T.line }, s), knob: PXK.art(PX_KNOB, { K: T.k, W: T.accL, A: T.acc, B: T.accS, D: T.accD }, s),
    rail: PXK.art(PX_RAIL, { K: T.k, D: T.k2, H: T.line }, s), tile: PXK.art(T.tile, { x: T.bgDot, ':': T.bgDot2, '+': T.spark, '*': T.spark2 }, s) };
  const u = Object.fromEntries(Object.entries(img).map(([k, c]) => [k, url(c)]));
  const nine = (k, sl) => `border-style:solid;border-width:${sl * s}px;border-image:url(${u[k]}) ${sl * s} fill / ${sl * s}px stretch`;
  const IP = { k: T.k, w: T.text, a: T.acc, b: T.acc2, g: T.gold, o: T.orange, r: T.red, n: T.green, N: T.green2, m: T.muted, s: T.accS };
  const iconUrl = new Map(), icon = name => {
    let v = iconUrl.get(name); if (!v) { const c = PXK.art(PX_ICONS[name] || emblem, IP, s); v = { u: url(c), w: c.width, h: c.height }; iconUrl.set(name, v); }
    const b = document.createElement('b'); b.className = 'pxI'; b.setAttribute('aria-hidden', 'true'); b.style.cssText = `width:${v.w}px;height:${v.h}px;background-image:url(${v.u})`; return b;
  };
  const R = '.pxk.pxk';
  const css = document.createElement('style');
  css.textContent = `html,html body{background:${T.bg} url(${u.tile}) 0 0/${img.tile.width}px ${img.tile.height}px repeat!important}
::-webkit-scrollbar{width:16px;height:16px} ::-webkit-scrollbar-track{background:url(${u.rail}) 0 0/16px 8px repeat-y} ::-webkit-scrollbar-thumb{${nine('main', 4)}} ::-webkit-scrollbar-corner{background:none}
${R}{color:${T.text}}
${R} .px{box-shadow:none;background:none}
${R} .agHead{gap:18px;margin:0}
${R} .agHead .label{display:flex;align-items:center;gap:12px}
${R} .btn,${R} .tab{${nine('btn', 4)};height:auto;min-height:0;padding:0 6px 4px;margin:0;color:${T.text};font:12px/1 monospace;display:inline-flex;align-items:center;gap:6px;filter:none;text-shadow:none;letter-spacing:0;cursor:var(--cp,pointer)}
${R} .btn:hover,${R} .tab:hover{border-image-source:url(${u.btnH})}
${R} .btn:active,${R} .tab:active{border-image-source:url(${u.btnD});padding:4px 6px 0}
${R} .btn.main,${R} .tab.on{border-image-source:url(${u.main});color:${T.k}}
${R} .btn.main:hover,${R} .tab.on:hover{border-image-source:url(${u.mainH})}
${R} .btn.main:active,${R} .tab.on:active{border-image-source:url(${u.mainD})}
${R} .btn:focus-visible,${R} .tab:focus-visible{outline:2px dashed ${T.acc2};outline-offset:2px}
${R} .btn .pxV,${R} .tab .pxV{white-space:nowrap}
${R} .sysCard{${nine('card', 4)};padding:4px 6px;gap:8px;background:none}
${R} .sysCard.on{border-image-source:url(${u.cardOn})}
${R} .sysCard.on>b{color:${T.acc}}
${R} .sysCard>b{color:${T.text}}
${R} .row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
${R} .gameBox,${R} .thBox{${nine('panel', 5)};box-shadow:none;background:none;padding:2px;gap:8px;grid-template-rows:auto auto}
${R} .gameBox canvas,${R} .thBox canvas{display:block;background:#05010b}
${R} .gameBox:fullscreen,${R} .thBox:fullscreen{border:0;padding:0;background:#000}
${R} .rhFs{position:static;opacity:1;justify-self:end;margin:0 6px 6px 0}
${R} .rhTabs{gap:8px;flex-wrap:wrap}
${R} .hint{color:${T.muted};line-height:24px}
${R} label{color:${T.muted};display:inline-flex;align-items:center;gap:8px}
${R} .rhDel{color:${T.red};top:6px;right:8px}
${R} input[type=range]{-webkit-appearance:none;appearance:none;background:none;height:20px;width:150px}
${R} input[type=range]::-webkit-slider-runnable-track{height:12px;${nine('track', 2)}}
${R} input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:20px;border:0;background:url(${u.knob}) 0 0/100% 100%;margin-top:-8px;cursor:var(--cp,pointer)}
${R} .pxSel{justify-content:space-between;gap:10px;max-width:100%;overflow:hidden}
${R} .rhImport .pxSel{flex:1;min-width:0}
.pxMenu{position:fixed;z-index:50;${nine('card', 4)};padding:2px;max-height:280px;overflow-y:auto;display:flex;flex-direction:column;gap:2px;color:${T.text}}
.pxMenu button{all:unset;padding:3px 8px;cursor:var(--cp,pointer);white-space:nowrap}
.pxMenu button:hover,.pxMenu button:focus-visible,.pxMenu button.on{background:${T.btnHov};color:${T.text}}
.pxMenu button.on{color:${T.acc}}
.pxT{position:relative;white-space:normal;font:12px/1 monospace;letter-spacing:0;text-transform:none}
.pxT i{display:inline-block;vertical-align:middle;background:currentColor;-webkit-mask:var(--m) 0 0/100% 100% no-repeat;mask:var(--m) 0 0/100% 100% no-repeat;image-rendering:pixelated}
.pxI{display:inline-block;vertical-align:middle;background:0 0/100% 100% no-repeat;image-rendering:pixelated;margin-right:6px}
.pxV>.pxI+.pxI{margin-left:-4px}
.pxSr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}`;
  document.head.append(css);
  // un mot = une image (en masque : sa couleur suit celle du texte), une règle par mot pour ne pas répéter l'image
  const words = new Map(), sheet = document.head.appendChild(document.createElement('style')).sheet;
  const word = w => {
    let k = words.get(w);
    if (!k) { const c = PXK.sprite(w, '#fff', s); k = 'pw' + words.size; words.set(w, k); sheet.insertRule(`.${k}{--m:url(${c.toDataURL()});width:${c.width}px;height:${c.height}px}`, sheet.cssRules.length); }
    const i = document.createElement('i'); i.className = k; return i;
  };
  function render(vis, text, lead) {
    const parts = [], ic = lead && icons.find(([re]) => re.test(text.trim()));
    if (ic) parts.push(icon(ic[1]));
    for (const m of text.matchAll(/(★+)|(\s+)|([^\s★]+)/g)) {
      if (m[1]) for (const _ of m[1]) parts.push(icon('star'));
      else if (m[2]) parts.push(document.createTextNode(' '));
      else parts.push(word(m[3]));
    }
    vis.replaceChildren(...parts);
  }
  const lead = node => node.parentElement?.matches('button,label,.tab,.btn') && !node.previousSibling;
  function pixText(node) {  // le texte reste dans la page (lecteur d'écran, copier) ; on voit ses lettres en pixels
    const wrap = document.createElement('span'), sr = document.createElement('span'), vis = document.createElement('span');
    wrap.className = 'pxT'; sr.className = 'pxSr'; vis.className = 'pxV'; vis.setAttribute('aria-hidden', 'true');
    const first = lead(node); node.replaceWith(wrap); sr.append(node); wrap.append(sr, vis); render(vis, node.data, first);
  }
  function pxSelect(sel) {  // une liste déroulante en pixels ; la vraie reste cachée et garde sa valeur et ses événements
    sel.dataset.px = '1'; sel.style.display = 'none';
    const b = document.createElement('button'), lab = document.createElement('span'); b.type = 'button'; b.className = 'btn pxSel'; b.append(lab, icon('down')); sel.after(b);
    const sync = () => { const t = sel.selectedOptions[0]?.textContent || '—'; if (lab.dataset.t !== t) { lab.dataset.t = t; lab.textContent = t; } };
    const d = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
    Object.defineProperty(sel, 'value', { configurable: true, get() { return d.get.call(this); }, set(v) { d.set.call(this, v); sync(); } });
    new MutationObserver(sync).observe(sel, { childList: true, subtree: true, characterData: true, attributes: true });
    sel.addEventListener('change', sync);
    b.onclick = () => {
      document.querySelector('.pxMenu')?.remove();
      const m = document.createElement('div'), r = b.getBoundingClientRect(); m.className = 'pxMenu'; m.setAttribute('role', 'listbox');
      for (const o of sel.options) {
        const it = document.createElement('button'); it.type = 'button'; it.textContent = o.textContent; it.className = o.selected ? 'on' : ''; it.setAttribute('role', 'option');
        it.onclick = () => { sel.value = o.value; sel.dispatchEvent(new Event('input', { bubbles: true })); sel.dispatchEvent(new Event('change', { bubbles: true })); close(); b.focus(); };
        m.append(it);
      }
      root.append(m);
      const below = innerHeight - r.bottom; m.style.minWidth = r.width + 'px'; m.style.left = Math.min(r.left, innerWidth - m.offsetWidth - 4) + 'px';
      m.style.top = (below > m.offsetHeight + 8 || below > r.top ? r.bottom + 2 : r.top - m.offsetHeight - 2) + 'px';
      const close = () => { m.remove(); removeEventListener('pointerdown', out, true); removeEventListener('keydown', key, true); removeEventListener('blur', close); };
      const out = e => { if (!m.contains(e.target) && e.target !== b && !b.contains(e.target)) close(); };
      const key = e => { if (e.key === 'Escape') { e.stopPropagation(); close(); b.focus(); } };
      addEventListener('pointerdown', out, true); addEventListener('keydown', key, true); addEventListener('blur', close);
      (m.querySelector('.on') || m.firstChild)?.focus();
    };
    sync();
  }
  const SKIP = 'select,option,textarea,script,style,canvas,.pxT,[data-pxskip]';
  let queued = false;
  function pass() {
    queued = false;
    root.querySelectorAll('select.gSel:not([data-px])').forEach(pxSelect);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), todo = [];
    for (let n; (n = w.nextNode());) if (n.data.trim() && n.parentElement && !n.parentElement.closest(SKIP)) todo.push(n);
    todo.forEach(pixText);
  }
  new MutationObserver(ms => {
    for (const m of ms) if (m.type === 'characterData') { const wrap = m.target.parentNode?.closest?.('.pxT'); if (wrap) render(wrap.lastChild, m.target.data, false); }
    if (!queued) { queued = true; queueMicrotask(pass); }
  }).observe(root, { childList: true, subtree: true, characterData: true });
  // le titre : grosses lettres à contour, trois tons, et l'emblème du jeu
  const lab = root.querySelector('.agHead .label');
  if (lab) {
    const L = PXK.layout(title), c = document.createElement('canvas'), g = c.getContext('2d'), on = [];
    c.width = L.w + 3; c.height = PXK.H + 3;
    for (const [gl, ox] of L.items) for (const [x, y] of gl.px) on.push([ox + x + 1, y + 1]);
    g.fillStyle = T.k; for (const [x, y] of on) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [2, 2], [1, 2], [2, 1]]) g.fillRect(x + dx, y + dy, 1, 1);
    for (const [x, y] of on) { g.fillStyle = y <= 5 ? T.accL : y <= 7 ? T.acc : T.accS; g.fillRect(x, y, 1, 1); }
    const big = document.createElement('canvas'), z = 4; big.width = c.width * z; big.height = c.height * z;
    const bg = big.getContext('2d'); bg.imageSmoothingEnabled = false; bg.drawImage(c, 0, 0, big.width, big.height);
    const t = document.createElement('b'); t.className = 'pxI'; t.style.cssText = `width:${big.width}px;height:${big.height}px;background-image:url(${big.toDataURL()})`;
    const e = PXK.art(emblem, IP, 3), em = document.createElement('b'); em.className = 'pxI'; em.style.cssText = `width:${e.width}px;height:${e.height}px;background-image:url(${e.toDataURL()})`;
    const sr = document.createElement('span'); sr.className = 'pxSr'; sr.textContent = lab.textContent;
    lab.dataset.pxskip = '1'; lab.replaceChildren(em, t, sr);
  }
  pass();
}

export default async function (ctx) {
  const view = ctx.view;
  if (!ctx.host) { view.textContent = "Ce plugin doit être approuvé par NeoDex pour s'ouvrir."; return; }
  const host = ctx.host, { el, toast, sfx } = host;
  const folder = ctx.folder;
  host.addStyle(CSS);
  view.innerHTML = HTML;
  pxSkin(view.querySelector('.appWrap'), { title: "BILLES", T: {"k": "#0a0604", "k2": "#160e08", "fill": "#22160c", "fillOn": "#2e1e10", "hl": "#3a2614", "line": "#5a3a1a", "acc": "#ffd84a", "accL": "#fff4b0", "accS": "#c49a1a", "accD": "#4a3a06", "rivet": "#fff4b0", "btn": "#3a2614", "btnHi": "#6a4a24", "btnLo": "#160e08", "btnHov": "#4a3018", "btnHovHi": "#8a5e2e", "text": "#fff4e0", "muted": "#c8a880", "acc2": "#ffa030", "gold": "#ffd84a", "orange": "#ffa030", "red": "#ff4a5a", "green": "#7ee07a", "green2": "#2f8a3a", "bg": "#0c0804", "bgDot": "#22160c", "bgDot2": "#160e08", "spark": "#5a3a1a", "spark2": "#ffa030", "tile": ["................", "...:............", "................", "..........+.....", "................", "................", ".....:..........", "................", "................", ".............:..", "................", "..+.............", "................", ".........:......", "................", "................"]},
  emblem: ["....kkkk....", "....kook....", "....kook....", "kkkkkookkkkk", "koookookoook", "kooookkooook", "koookookoook", "kkkkkookkkkk", "....kook....", "....kook....", "....kkkk....", "............"],
  icons: [[/^NOUVELLE/, "play"], [/^RECORDS/, "crown"]] });
  const $ = id => view.querySelector('#' + id) || document.getElementById(id);
  const doc = async n => { try { return await folder.read(n); } catch { return null; } };
  const games = { best: {}, ...(await doc('games')) };
  let gamesTimer = null;
  const saveGames = () => { clearTimeout(gamesTimer); gamesTimer = setTimeout(() => { gamesTimer = null; folder.write('games', games).catch(() => {}); }, 500); };
  const best = (k, v) => { const b = games.best[k]; if (b == null || v > b) { games.best[k] = v; saveGames(); return true; } return false; };
  const gstore = (k, init) => (games[k] ??= init);
  // les trophées de NeoDex (3.4.8 et plus) : succès et records déclarés dans plugin.json ; sur un NeoDex plus ancien, rien ne se passe
  const trophy = id => { ctx.games?.unlock(id).catch(() => {}); };
  const trophyRecord = (id, v) => { if (v != null && Number.isFinite(+v)) ctx.games?.record(id, +v).catch(() => {}); };
function gameLoop(st, appKey, update, draw) {
  cancelAnimationFrame(st.raf);
  const STEP = 1000 / 60; let acc = 0, last = performance.now();
  const frame = t => {
    if (!view.classList.contains('on')) { st.raf = 0; if (st.mode === 'play') st.mode = 'pause'; return; }  // leaving the tab pauses the game
    st.raf = requestAnimationFrame(frame);
    acc += Math.min(200, t - last); last = t;
    while (acc >= STEP) { if (st.mode === 'play') update(); st.tick++; acc -= STEP; }
    draw();
  };
  st.raf = requestAnimationFrame(frame);
}
function gameText(g, w, lines, y0) {  // lignes centrées en police pixel, sur une bande sombre
  g.fillStyle = 'rgba(11,3,28,.72)'; g.fillRect(0, y0 - 14, w, lines.length * 14 + 14);
  lines.forEach(([text, color, size], i) => PXK.fill(g, text, w / 2, y0 + i * 14, color, PXK.scale(size), 'center'));
}
const px = (g, color, x, y, w = 1, h = 1) => { g.fillStyle = color; g.fillRect(Math.round(x), Math.round(y), w, h); };
function sprite(g, rows, x, y, pal) { rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c) px(g, c, x + i, y + j); } }); }
const seeded = s => () => { s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const pxFont = (g, text, x, y, color, size = 8, align = 'left') => { const s = PXK.scale(size); PXK.fill(g, text, x + s, y + s, '#05010b', s, align); PXK.fill(g, text, x, y, color, s, align); };

const clock = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
// petits outils communs aux jeux : une toile pré-dessinée, la position du pointeur dans le canevas, un bip
const cnv = (w, h, fn) => { const c = el('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); g.imageSmoothingEnabled = false; fn(g); return c; };
const spr = (rows, pal) => cnv(Math.max(...rows.map(r => r.length)), rows.length, g => sprite(g, rows, 0, 0, pal));
const W = 320, H = 340, cv = $('gc'), g = cv.getContext('2d'); g.imageSmoothingEnabled = false;
const cpos = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * W, (e.clientY - r.top) / r.height * H]; };
let actx = null;
const beep = (f, d = .1, type = 'square', slide = 0, vol = .08) => { try { actx ??= new AudioContext(); const o = actx.createOscillator(), gn = actx.createGain(), t = actx.currentTime; o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d); gn.gain.setValueAtTime(vol, t); gn.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(gn).connect(actx.destination); o.start(t); o.stop(t + d + .02); } catch {} };
const keyOk = e => view.classList.contains('on') && !/INPUT|SELECT|TEXTAREA/.test(e.target.tagName);
const showStats = rows => $('gStats').replaceChildren(...rows.flatMap(([a, b]) => [el('span', '', a), el('b', '', String(b))]));

/* ---------- Billes : le solitaire. Une bille saute par-dessus sa voisine dans un trou vide, la voisine sort et roule dans la rigole.
   Chaque plateau part d'un trou d'où l'on peut finir avec une seule bille (vérifié par le solveur) ; un indicateur dit en direct si c'est encore possible.
   Les énigmes : des départs imposés, une case d'arrivée, jusqu'à 3 étoiles. ---------- */
const BI_SQ = [[1, 0], [-1, 0], [0, 1], [0, -1]], BI_TRI = [...BI_SQ, [1, 1], [-1, -1]];
// rows : # trou, . hors plateau ; start : le trou vide du départ ; end : la case du « parfait » (une fin à une bille possible, trouvée par le solveur)
const BI_BOARDS = {
  'Croix anglaise': {rows: ['..###..', '..###..', '#######', '#######', '#######', '..###..', '..###..'], start: [3, 3], end: [3, 3]},
  'Croix française': {rows: ['..###..', '.#####.', '#######', '#######', '#######', '.#####.', '..###..'], start: [2, 0], end: [4, 6]},
  'Petite croix': {rows: ['..###..', '..###..', '..###..', '#######', '..###..', '..###..'], start: [2, 3], end: [4, 3]},
  'Pyramide': {rows: ['#....', '##...', '###..', '####.', '#####'], tri: true, start: [0, 0], end: [0, 0]},
  'Asymétrique': {rows: ['..###...', '..###...', '..###...', '########', '########', '########', '..###...', '..###...'], start: [4, 3], end: [4, 3]},
  'Hexagone': {rows: ['####...', '#####..', '######.', '#######', '.######', '..#####', '...####'], tri: true, start: [1, 0], end: [4, 4]},  // départ et arrivée trouvés par le solveur
};
// les sulfures : un par énigme, motif × couleur (30 différents)
const BI_MOTIF = ['Fleur', 'Étoile', 'Spirale', 'Lune', 'Cœur', 'Flocon'], BI_TINT = [['rouge', 'rouge', '#ff5a6a', '#ffd0d0'], ['bleue', 'bleu', '#4a8aff', '#d0e4ff'], ['verte', 'vert', '#3ad070', '#d0ffd8'], ['dorée', 'doré', '#ffc83a', '#fff0c0'], ['violette', 'violet', '#b06aff', '#ecd8ff']];
const biSulName = i => { const mo = BI_MOTIF[i % 6], tn = BI_TINT[Math.floor(i / 6) % 5]; return mo + ' ' + (mo === 'Cœur' || mo === 'Flocon' ? tn[1] : tn[0]); };
const biSulfs = {};
function biSulfure(i, r, locked) {  // une sphère de verre presque clair, le motif coloré au cœur, un reflet ; grisée si pas encore gagnée
  const k = i + ':' + r + ':' + !!locked; if (biSulfs[k]) return biSulfs[k];
  const [, , col, pale] = BI_TINT[Math.floor(i / 6) % 5], m = i % 6;
  const inMotif = (u, v) => {  // u, v entre -1 et 1, au centre de la bille
    const d = Math.hypot(u, v), a = Math.atan2(v, u);
    if (m === 0) return d < .18 ? 2 : d < .62 * Math.abs(Math.cos(a * 2.5)) + .05;                  // fleur à cinq pétales
    if (m === 1) return d < .22 + .4 * Math.pow(Math.abs(Math.cos(a * 2.5)), 6);                         // étoile
    if (m === 2) return d < .7 && Math.abs(((a + Math.PI) / (2 * Math.PI) + d * 2.2) % .5 - .25) < .09;  // spirale
    if (m === 3) return d < .55 && Math.hypot(u - .22, v + .12) > .45;                                   // croissant de lune
    if (m === 4) { const x = u * 1.25, y = -v * 1.25 + .25; return (x * x + y * y - .35) ** 3 - x * x * y * y * y < 0; }  // cœur
    return d < .65 && (Math.abs(Math.sin(a * 3)) < .14 || d < .14) || (d > .4 && d < .5 && Math.abs(Math.sin(a * 3)) < .5);  // flocon
  };
  return biSulfs[k] = cnv(2 * r + 2, 2 * r + 2, b => { for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) {
    const d = Math.hypot(x + .5, y + .5) / r; if (d > 1) continue;
    const u = (x + .5) / r / .8, v = (y + .5) / r / .8, mo = inMotif(u, v), lt = -((x + .5) / r * .55 + (y + .5) / r * .75);
    let c = mo === 2 ? '#ffffff' : mo ? col : d > .86 ? '#5a6a7a' : lt > .4 ? '#f4fbff' : lt > -.3 ? '#cfe2ee' : '#9ab4c8';
    if (!mo && d < .86 && Math.hypot(u, v) < .8 && (x + y) % 3 === 0) c = pale;  // de petites bulles d'air dans le verre
    if (Math.hypot((x + .5) / r + .4, (y + .5) / r + .44) < .17) c = '#ffffff';
    if (locked) c = d > .86 ? '#2a2420' : mo ? '#4a3e34' : '#3a302a';
    px(b, d > .93 ? '#05010b' : c, x + r + 1, y + r + 1);
  } });
}
// plateaux des énigmes en plus
const BI_PZB = {...BI_BOARDS,
  'Croix allemande': {rows: ['...###...', '...###...', '...###...', '#########', '#########', '#########', '...###...', '...###...', '...###...']},
  'Losange': {rows: ['....#....', '...###...', '..#####..', '.#######.', '#########', '.#######.', '..#####..', '...###...', '....#....']},
  'Grand triangle': {rows: ['#.....', '##....', '###...', '####..', '#####.', '######'], tri: true},
};
// le solveur : chaque plateau devient une liste de trous (0..n-1) et de sauts [départ, sautée, arrivée] ; une position tient dans deux entiers de 32 bits
function biPrep(rows, dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
  const idx = [], at = {};
  rows.forEach((r, y) => [...r].forEach((c, x) => { if (c !== '.') { at[x + ',' + y] = idx.length; idx.push([x, y]); } }));
  const moves = [];
  idx.forEach(([x, y], a) => { for (const [dx, dy] of dirs) { const b = at[(x + dx) + ',' + (y + dy)], c = at[(x + 2 * dx) + ',' + (y + 2 * dy)]; if (b != null && c != null) moves.push([a, b, c]); } });
  return {idx, at, moves, dead: {}, w: Math.max(...rows.map(r => r.length)), h: rows.length};
}
const biHas = (s, i) => i < 32 ? (s[0] >>> i) & 1 : (s[1] >>> (i - 32)) & 1;
const biFlip = (s, i) => i < 32 ? [(s[0] ^ (1 << i)) >>> 0, s[1]] : [s[0], (s[1] ^ (1 << (i - 32))) >>> 0];
const biCount = s => { let n = 0; for (let v of s) while (v) { v &= v - 1; n++; } return n; };
const biKey = s => s[1] * 4294967296 + s[0];
// cherche une suite de sauts qui finit avec une bille (sur le trou target si target >= 0) : la liste des sauts, null si c'est impossible,
// undefined si le budget de positions est épuisé avant de savoir. Les positions perdantes sont retenues d'une recherche à l'autre.
function biSolve(P, s, target = -1, budget = 2e5) {
  const D = P.dead[target] ??= new Set(), M = P.moves, OUT = {}; let nodes = 0;
  const rec = (s, n) => {
    if (n === 1) return target < 0 || biHas(s, target) ? [] : null;
    const k = biKey(s); if (D.has(k)) return null;
    if (++nodes > budget) throw OUT;
    for (let m = 0; m < M.length; m++) {
      const [a, b, c] = M[m]; if (!biHas(s, a) || !biHas(s, b) || biHas(s, c)) continue;
      const r = rec(biFlip(biFlip(biFlip(s, a), b), c), n - 1); if (r) { r.push(m); return r; }
    }
    if (D.size < 1.5e7) D.add(k); return null;
  };
  try { const r = rec(s, biCount(s)); return r && r.reverse(); } catch (e) { if (e === OUT) return undefined; throw e; }
}
const biStart = (P, empty) => { let s = [0, 0]; P.idx.forEach((_, i) => { if (!empty.includes(i)) s = biFlip(s, i); }); return s; };
// la géométrie d'un plateau : la position de chaque trou sur la toile, la taille des billes
const BI_O = {x: 160, y: 184, R: 148};
const biPreps = {};
function biP(name) {
  if (biPreps[name]) return biPreps[name];
  const B = BI_PZB[name], P = biPrep(B.rows, B.tri ? BI_TRI : BI_SQ)
  { const cx = (P.w - 1) / 2, cy = (P.h - 1) / 2, d = i => Math.hypot(P.idx[i][0] - cx, P.idx[i][1] - cy); P.moves.sort((m, n) => (d(m[2]) - d(m[0])) - (d(n[2]) - d(n[0]))); }  // les sauts vers le centre d'abord : le solveur trouve bien plus vite
  const raw = P.idx.map(([x, y]) => B.tri ? [x - y / 2, y * .866] : [x, y]);
  const xs = raw.map(r => r[0]), ys = raw.map(r => r[1]), mx = (Math.min(...xs) + Math.max(...xs)) / 2, my = (Math.min(...ys) + Math.max(...ys)) / 2;
  const span = Math.max(...raw.map(([x, y]) => Math.hypot(x - mx, y - my))) + .62, C = Math.min(38, (BI_O.R - 22) / span);
  P.pos = raw.map(([x, y]) => [Math.round(BI_O.x + (x - mx) * C), Math.round(BI_O.y + (y - my) * C)]); P.C = C; P.r = Math.max(7, Math.round(C * .36)); P.name = name;
  P.find = ([x, y]) => P.idx.findIndex(p => p[0] === x && p[1] === y);
  return biPreps[name] = P;
}
// les billes de verre : un dégradé, un ruban de couleur dedans, un reflet ; dessinées une fois par taille et par couleur
const BI_COLS = [['#ff9a9a', '#e04050', '#7a1424', '#ffffff'], ['#9ad0ff', '#3a7ae0', '#14306a', '#ffd84a'], ['#a8f0a0', '#3aa850', '#14501e', '#ffffff'], ['#ffe08a', '#e0a030', '#704010', '#e04050'],
  ['#d8a8ff', '#8a4ad8', '#3a1470', '#7ae0ff'], ['#a0f4f0', '#30b0b8', '#105058', '#ff8ad0'], ['#ffc08a', '#f07a30', '#7a3010', '#3a7ae0'], ['#ffb0e0', '#e05aa8', '#701848', '#ffffff']];
const biBalls = {};
function biBall(r, c) {
  const k = r + ':' + c; if (biBalls[k]) return biBalls[k];
  const [li, mid, dk, rib] = BI_COLS[c % BI_COLS.length];
  return biBalls[k] = cnv(2 * r + 2, 2 * r + 2, b => { for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) {
    const d = Math.hypot(x + .5, y + .5) / r; if (d > 1) continue;
    const nx = (x + .5) / r, ny = (y + .5) / r, lt = -(nx * .55 + ny * .75);
    let col = d > .86 ? dk : lt > .35 ? li : lt > -.35 ? mid : dk;
    if (Math.abs(ny - .38 * Math.sin(nx * 2.6 + c)) < .16 && d < .86) col = lt > -.2 ? rib : mixHex(rib, dk, .5);
    if (Math.hypot(nx + .38, ny + .42) < .2) col = '#ffffff'; else if (Math.hypot(nx - .35, ny - .5) < .14) col = mixHex(li, '#ffffff', .4);
    px(b, d > .93 ? '#05010b' : col, x + r + 1, y + r + 1);
  } });
}
function mixHex(a, b, k) { const p = h => [1, 3, 5].map(i => parseInt(h.substr(i, 2), 16)), x = p(a), y = p(b); return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * k).toString(16).padStart(2, '0')).join(''); }
// le plateau : une table en planches, un plateau rond en bois tourné avec sa rigole, des trous creusés ; la case d'arrivée cerclée d'or
function biBoardArt(P, target) {
  const key = P.name + ':' + target; biBoardArt.c ??= {}; if (biBoardArt.c[key]) return biBoardArt.c[key];
  biBoardArt.base ??= cnv(W, H, b => {
    for (let x = 0; x < W; x += 40) for (let y = 0; y < H; y++) for (let k = 0; k < 40; k++) { const xx = x + k, n = Math.sin(xx * .7 + Math.sin(y * .05 + x) * 3) + Math.sin(y * .02 + xx * .1); px(b, k === 0 ? '#0a0604' : n > 1.2 ? '#3a2414' : n > -.4 ? '#2e1c10' : '#26170c', xx, y); }
    const {x: cx, y: cy, R} = BI_O;
    for (let y = -R - 8; y <= R + 8; y++) for (let x = -R - 8; x <= R + 8; x++) {
      const d = Math.hypot(x, y); if (d > R + 6) continue;
      if (d > R) { if (Math.hypot(x - 4, y - 6) <= R) px(b, '#0a0604', cx + x, cy + y); continue; }
      const an = Math.atan2(y, x), ring = Math.sin(d * .32 + Math.sin(an * 3) * .8) + Math.sin(d * .9) * .3;
      let col = ring > .9 ? '#b47838' : ring > -.2 ? '#a0662e' : '#8a5428';
      if (d > R - 3) col = Math.cos(an + 2.3) > 0 ? '#e0a860' : '#5a3014';
      else if (d > R - 16 && d < R - 5) col = d < R - 13 ? (Math.cos(an + 2.3) > 0 ? '#3a1e0a' : '#c8904a') : d > R - 7 ? (Math.cos(an + 2.3) > 0 ? '#c8904a' : '#3a1e0a') : '#5a3014';
      px(b, d > R - 1 ? '#05010b' : col, cx + x, cy + y);
    }
  });
  return biBoardArt.c[key] = cnv(W, H, b => {
    b.drawImage(biBoardArt.base, 0, 0);
    const hr = Math.round(P.C * .4);
    P.pos.forEach(([x, y], i) => {
      for (let dy = -hr - 1; dy <= hr + 1; dy++) for (let dx = -hr - 1; dx <= hr + 1; dx++) { const d = Math.hypot(dx, dy); if (d > hr + 1) continue; px(b, d > hr ? (dy > 0 ? '#d09858' : '#5a3014') : dy < -hr * .3 ? '#120802' : dy < hr * .5 ? '#2a1406' : '#3a1e0a', x + dx, y + dy); }
      if (i === target) for (let a = 0; a < 40; a++) { const an = a / 40 * Math.PI * 2; px(b, a % 2 ? '#ffd84a' : '#c8902a', x + Math.cos(an) * (hr + 4) - 1, y + Math.sin(an) * (hr + 4) - 1, 2, 2); }
    });
  });
}
// les énigmes : partir d'une seule bille sur la case d'arrivée et « dé-sauter » à l'envers ; on obtient un départ dont on sait qu'il se résout
const BI_PZ = Array.from({length: 30}, (_, i) => {
  const plan = i < 8 ? ['Croix anglaise', 2 + i] : i < 14 ? [i % 2 ? 'Croix française' : 'Asymétrique', i - 1] : i < 20 ? [i % 2 ? 'Losange' : 'Croix allemande', i - 4] : i < 25 ? ['Grand triangle', i - 13] : [['Croix anglaise', 'Croix allemande', 'Losange', 'Croix française', 'Croix allemande'][i - 25], 16 + (i - 25) * 3];
  return {board: plan[0], k: plan[1]};
});
function biPuzzle(i) {
  const {board, k} = BI_PZ[i], P = biP(board), r = seeded(4242 + i * 97), B = BI_PZB[board];
  const cx = P.pos.reduce((a, p) => a + p[0], 0) / P.pos.length, cy = P.pos.reduce((a, p) => a + p[1], 0) / P.pos.length, dist = j => Math.hypot(P.pos[j][0] - cx, P.pos[j][1] - cy);
  const t = i % 3 === 2 ? Math.floor(r() * P.idx.length) : P.idx.map((_, j) => j).sort((a, b) => dist(a) - dist(b))[B.tri ? Math.floor(r() * 3) : 0];
  let s = biFlip([0, 0], t);
  for (let n = 0; n < k; n++) {
    const cands = P.moves.filter(([a, b, c]) => biHas(s, c) && !biHas(s, b) && !biHas(s, a)); if (!cands.length) break;
    const [a, b, c] = cands.map(m => [m, dist(m[0]) + dist(m[1]) * .5 + r() * P.C * 2]).sort((x, y) => x[1] - y[1])[0][0];
    s = biFlip(biFlip(biFlip(s, a), b), c);
  }
  return {board, s, t};
}
const bis = gstore('billes', {board: 'Croix anglaise', wins: 0, games: 0}); bis.pz ??= {}; bis.perfect ??= 0; bis.hints ??= 0;
let bi = null;
const biLeft = () => biCount(bi.s);
const biMoves = () => bi.P.moves.filter(([a, b, c]) => biHas(bi.s, a) && biHas(bi.s, b) && !biHas(bi.s, c));
function biLoad(P, s, target, pz) {
  bi = Object.assign(bi || {tick: 0, raf: 0}, {mode: 'play', P, s, target, pz, sel: -1, hist: [], undos: 0, jump: null, fly: [], gutter: [], endAt: 0, result: null, state: '?', sol: null, solKeys: null, hint: null, hints: 0,
    col: P.idx.map((_, i) => biColOf(i, P.name))});
  biCheck(); biInfo();
}
const biColOf = (i, name) => (i * 7 + name.length * 3 + (i >> 2)) % BI_COLS.length;
function biNew(name = bis.board) {
  bis.board = BI_BOARDS[name] ? name : 'Croix anglaise'; saveGames();
  const B = BI_BOARDS[bis.board], P = biP(bis.board);
  biLoad(P, biStart(P, [P.find(B.start)]), P.find(B.end), -1);
  const sel = $('biSel'); if (!sel.options.length) sel.replaceChildren(...Object.keys(BI_BOARDS).map(n => { const o = el('option', '', n); o.value = n; return o; })); sel.value = bis.board;
}
function biPlay(i) { const z = biPuzzle(i); biLoad(biP(z.board), z.s, z.t, i); }
// est-ce encore gagnable ? Une solution connue suffit ; sinon le solveur cherche, par petits morceaux pour ne pas figer la page
function biCheck(tries = 0) {
  const s = bi.s, k = s[1] * 4294967296 + s[0], goal = bi.pz >= 0 ? bi.target : -1;
  if (bi.solKeys?.has(k)) { bi.state = 'win'; return; }
  const r = biSolve(bi.P, s, goal, 6e4);
  if (r) { bi.state = 'win'; bi.sol = r; bi.solKeys = new Set(); let q = s; bi.solKeys.add(k); for (const m of r) { q = bi.P.moves[m].reduce((a, i) => biFlip(a, i), q); bi.solKeys.add(q[1] * 4294967296 + q[0]); } }
  else if (r === null) bi.state = 'lost';
  else { bi.state = '?'; if (tries < 40) setTimeout(() => { if (bi.s === s) biCheck(tries + 1); }, 40); }
}
function biJump([a, b, c]) {
  bi.hist.push({s: bi.s, col: bi.col.slice(), gutter: bi.gutter.slice()}); bi.sel = -1; bi.hint = null;
  bi.s = biFlip(biFlip(biFlip(bi.s, a), b), c); bi.col[c] = bi.col[a];
  bi.jump = {a, c, t: 0, col: bi.col[c]}; bi.fly.push({from: b, col: bi.col[b], t: 0, slot: bi.gutter.length}); bi.gutter.push(bi.col[b]);
  beep(900 + Math.random() * 200, .04, 'sine', 0, .05);
  biCheck();
  if (!biMoves().length) {
    bi.mode = 'over'; bi.endAt = bi.tick; const n = biLeft(), onT = n === 1 && biHas(bi.s, bi.target);
    if (bi.pz >= 0) {
      const stars = onT ? (bi.undos === 0 && !bi.hints ? 3 : bi.undos <= 3 ? 2 : 1) : 0; bi.result = {n, onT, stars, sulf: stars && !bis.pz[bi.pz] ? bi.pz : -1};
      if (stars > (bis.pz[bi.pz] || 0)) bis.pz[bi.pz] = stars;
      if (bi.result.sulf >= 0) setTimeout(() => [1568, 2093, 2637].forEach((f, i) => setTimeout(() => beep(f, .1, 'sine', 0, .05), i * 90)), 600);  // un nouveau sulfure
    } else {
      bis.games++; bi.result = {n, onT}; if (n === 1) bis.wins++; if (onT) bis.perfect++;
      const k = 'billes:' + bis.board; if (games.best[k] == null || n < games.best[k]) games.best[k] = n;
    }
    saveGames(); biInfo();
    if (n === 1 && (onT || bi.pz < 0)) [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, .14, 'triangle'), i * 100)); else beep(220, .3, 'triangle', 160, .06);
  }
}
function biHint(quiet) {
  if (!bi || bi.mode !== 'play') return null;
  const goal = bi.pz >= 0 ? bi.target : -1, sol = biSolve(bi.P, bi.s, goal, 4e5);
  if (!sol || !sol.length) { bi.hint = {none: true, t: bi.tick}; if (!quiet) beep(200, .1, 'triangle'); return null; }
  const [a, , c] = bi.P.moves[sol[0]]; bi.hint = {a, c, t: bi.tick}; bi.sel = a; bi.hints++; bis.hints++; saveGames(); if (!quiet) beep(1046, .08, 'triangle', 1568, .05); return [a, c];
}
const biGut = k => { const an = -Math.PI / 2 + k * .085 + Math.floor(k / 70) * .04; return [BI_O.x + Math.cos(an) * (BI_O.R - 10), BI_O.y + Math.sin(an) * (BI_O.R - 10)]; };
function biDraw() {
  const P = bi.P, t = bi.tick, r = P.r;
  g.drawImage(biBoardArt(P, bi.target), 0, 0);
  // les billes sorties, dans la rigole
  const gr = Math.max(5, Math.round(r * .62));
  bi.gutter.forEach((c, k) => { if (bi.fly.some(f => f.slot === k)) return; const [x, y] = biGut(k); g.drawImage(biBall(gr, c), Math.round(x - gr - 1), Math.round(y - gr - 1)); });
  const moves = bi.sel >= 0 ? biMoves().filter(m => m[0] === bi.sel) : [];
  if (bi.hint && !bi.hint.none && bi.tick - bi.hint.t < 240) {  // l'indice : la bille et son arrivée cerclées de vert, une flèche entre les deux
    const [ax, ay] = P.pos[bi.hint.a], [cx, cy] = P.pos[bi.hint.c], k = .5 + .5 * Math.sin(t / 5);
    g.strokeStyle = 'rgba(126,224,122,' + (.5 + k * .5).toFixed(2) + ')'; g.lineWidth = 2; for (const [x, y] of [[ax, ay], [cx, cy]]) { g.beginPath(); g.arc(x, y, r + 3 + k * 2, 0, 7); g.stroke(); }
    const n = Math.max(1, Math.round(Math.hypot(cx - ax, cy - ay) / 4)); for (let q = 1; q < n; q++) if ((q + (t >> 3)) % 2) px(g, '#7ee07a', Math.round(ax + (cx - ax) * q / n) - 1, Math.round(ay + (cy - ay) * q / n - Math.sin(q / n * Math.PI) * P.C * .5) - 1, 2, 2);
  }
  // les arrivées possibles brillent
  for (const [, , c] of moves) { const [x, y] = P.pos[c], k = .5 + .5 * Math.sin(t / 6); g.fillStyle = 'rgba(255,216,74,' + (.25 + k * .35).toFixed(2) + ')'; g.beginPath(); g.arc(x, y, r * .8, 0, 7); g.fill(); px(g, '#fff0a0', x - 2, y - 2, 4, 4); }
  P.pos.forEach(([x, y], i) => {
    if (!biHas(bi.s, i) || (bi.jump && bi.jump.c === i)) return;
    const lift = i === bi.sel ? 3 + Math.round(Math.abs(Math.sin(t / 7)) * 3) : 0;
    g.fillStyle = 'rgba(10,4,0,' + (lift ? .3 : .45) + ')'; g.beginPath(); g.ellipse(x + 2, y + r * .5 + 1, r * .95, r * .45, 0, 0, 7); g.fill();
    g.drawImage(biBall(r, bi.col[i]), x - r - 1, y - r - 1 - lift);
  });
  if (bi.jump) {  // le saut en arc, avec un petit rebond à l'arrivée
    const j = bi.jump, k = Math.min(1, ++j.t / 16), [ax, ay] = P.pos[j.a], [cx, cy] = P.pos[j.c], x = ax + (cx - ax) * k, y = ay + (cy - ay) * k - Math.sin(k * Math.PI) * P.C * .7 - (k === 1 ? Math.max(0, 3 - (j.t - 16)) : 0);
    g.fillStyle = 'rgba(10,4,0,.3)'; g.beginPath(); g.ellipse(ax + (cx - ax) * k + 2, ay + (cy - ay) * k + r * .5, r * .9, r * .4, 0, 0, 7); g.fill();
    g.drawImage(biBall(r, j.col), Math.round(x - r - 1), Math.round(y - r - 1)); if (j.t > 20) { bi.jump = null; beep(1300, .03, 'sine', 0, .04); }
  }
  for (const f of bi.fly) {  // la bille sautée saute hors du trou et roule jusqu'à la rigole
    const k = Math.min(1, ++f.t / 34), [bx, by] = P.pos[f.from], [gx, gy] = biGut(f.slot), e = k * k * (3 - 2 * k), x = bx + (gx - bx) * e, y = by + (gy - by) * e - Math.sin(Math.min(1, k * 1.6) * Math.PI) * 14, rr = Math.round(r + (gr - r) * e);
    g.drawImage(biBall(rr, f.col), Math.round(x - rr - 1), Math.round(y - rr - 1));
  }
  bi.fly = bi.fly.filter(f => f.t < 34);
  // le bandeau : billes restantes, et est-ce encore gagnable
  px(g, 'rgba(10,6,4,.78)', 0, 0, W, 24); px(g, '#5a3a1a', 0, 24, W, 1);
  pxFont(g, biLeft() + ' billes', 8, 16, '#ffffff', 8);
  const lab = bi.state === 'win' ? [bi.pz >= 0 ? 'ARRIVÉE POSSIBLE' : 'UNE BILLE POSSIBLE', '#7ee07a'] : bi.state === 'lost' ? [bi.pz >= 0 ? 'ARRIVÉE IMPOSSIBLE' : 'PLUS QU\'À FAIRE AU MIEUX', '#ff8a6a'] : ['ON CHERCHE…', '#c8a880'];
  pxFont(g, lab[0], W - 8, 16, lab[1], 8, 'right');
  if (bi.pz >= 0) pxFont(g, 'ÉNIGME ' + (bi.pz + 1) + (bi.hints ? ' · indice utilisé' : ''), W / 2, 40, '#ffd84a', 8, 'center');
  if (bi.hint?.none && bi.tick - bi.hint.t < 150) pxFont(g, 'Plus de solution d\'ici : annule un coup', W / 2, H - 10, '#ff8a6a', 8, 'center');
  if (bi.mode === 'over' && t - bi.endAt > 30) {
    const {n, onT, stars} = bi.result;
    const lines = bi.pz >= 0 ? [[stars ? 'RÉUSSIE !' : 'RATÉ', stars ? '#5fdf6a' : '#ffa030', 16], [stars ? '*'.repeat(stars) + ' ' + ['', '1 étoile', '2 étoiles', '3 étoiles'][stars] : n > 1 ? n + ' billes restantes' : 'pas sur la case dorée', '#ffd84a'], [stars < 3 && stars ? 'Sans annuler ni indice : 3 étoiles' : stars ? 'Clic : énigme suivante' : 'Retour : annuler', '#ffffff']]
      : [[n === 1 ? (onT ? 'PARFAIT !' : 'UNE SEULE BILLE !') : 'PLUS DE SAUT', n === 1 ? '#5fdf6a' : '#ffa030', 16], [n + ' bille' + (n > 1 ? 's' : '') + ' restante' + (n > 1 ? 's' : ''), '#ffffff'], [n === 1 && !onT ? 'Parfait : finir sur la case dorée' : 'Retour : annuler · clic : rejouer', '#ffd84a']];
    gameText(g, W, lines, 160);
    if (bi.result.sulf >= 0) { const sr = 20, s = biSulfure(bi.result.sulf, sr); g.drawImage(s, W / 2 - sr - 1, 232 - sr - 1 - Math.round(Math.abs(Math.sin(t / 12)) * 3)); pxFont(g, 'Nouveau sulfure : ' + biSulName(bi.result.sulf), W / 2, 270, '#c8f0ff', 8, 'center'); }
  }
}
const biHit = (mx, my) => { let best = -1, bd = 1e9; bi.P.pos.forEach(([x, y], i) => { const d = Math.hypot(mx - x, my - y); if (d < bd) { bd = d; best = i; } }); return bd < bi.P.C * .55 ? best : -1; };
cv.onpointerdown = e => {
  e.preventDefault(); if (!bi) return;
  if (bi.mode === 'over') { if (bi.tick - bi.endAt > 30) { if (bi.pz >= 0) { const nx = bi.result.stars && bi.pz < 29 ? bi.pz + 1 : bi.pz; biPlay(nx); biGrid(); } else biNew(); } return; }
  const [mx, my] = cpos(e), i = biHit(mx, my); if (i < 0) return;
  if (biHas(bi.s, i)) { bi.sel = i; beep(700, .02, 'square', 0, .03); }
  else if (bi.sel >= 0) { const m = biMoves().find(m => m[0] === bi.sel && m[2] === i); if (m) biJump(m); else beep(150, .06, 'square', 0, .04); }
};
const biUndo = () => { const h = bi.hist.pop(); if (!h) return; Object.assign(bi, h, {sel: -1, mode: 'play', jump: null, fly: [], result: null, hint: null}); bi.undos++; biCheck(); };
document.addEventListener('keydown', e => { if (!keyOk(e) || !bi) return; if (e.key.toLowerCase() === 'i' && !e.ctrlKey) { e.preventDefault(); biHint(); return; } if (e.key === 'Backspace' || (e.key.toLowerCase() === 'z' && e.ctrlKey)) { e.preventDefault(); biUndo(); } });
function biCol() {  // la vitrine des sulfures : gagnés en couleur, les autres en silhouette
  const got = BI_PZ.filter((_, i) => bis.pz[i] > 0).length;
  $('biCol').replaceChildren(...BI_PZ.map((_, i) => { const c = el('canvas'), on = bis.pz[i] > 0, s = biSulfure(i, 11, !on); c.width = s.width; c.height = s.height; c.getContext('2d').drawImage(s, 0, 0); c.title = on ? biSulName(i) : 'Énigme ' + (i + 1); return c; }));
  $('biColTxt').textContent = got + ' / 30 sulfures';
}
function biInfo() { biCol(); setTimeout(biTrophies);
  const b = games.best['billes:' + bis.board], st = Object.values(bis.pz).reduce((a, x) => a + x, 0), done = Object.values(bis.pz).filter(x => x > 0).length;
  showStats([['Record sur ce plateau', b != null ? b + ' bille' + (b > 1 ? 's' : '') : '—'], ['Réussites (1 bille)', bis.wins + ' / ' + bis.games], ['Parfaits', bis.perfect], ['Énigmes réussies', done + ' / 30'], ['Étoiles', st + ' / 90'], ['Indices demandés', bis.hints]]);
}
// la grille des énigmes : chacune s'ouvre quand la précédente est réussie
function biGrid() {
  $('biGrid').replaceChildren(...BI_PZ.map((_, i) => {
    const s = bis.pz[i] || 0, b = el('button', 'btn biPz' + (bi?.pz === i ? ' main' : ''), (i + 1) + (s ? ' ' + '*'.repeat(s) : ''));
    b.disabled = i > 0 && !bis.pz[i - 1]; b.onclick = () => { biPlay(i); biGrid(); b.blur(); }; return b;
  }));
}
function biTab(t) {
  $('biFree').hidden = t !== 'free'; $('biPzBox').hidden = t !== 'pz';
  for (const b of $('biTabs').children) b.classList.toggle('main', b.dataset.t === t);
  if (t === 'pz') { const first = BI_PZ.findIndex((_, i) => !bis.pz[i]); biPlay(first < 0 ? 0 : first); biGrid(); } else biNew();
}
$('biTabs').onclick = e => { const t = e.target.closest('[data-t]')?.dataset.t; if (t) biTab(t); };
$('gNew').onclick = () => { biNew(); $('gNew').blur(); };
$('biUndo').onclick = () => { biUndo(); $('biUndo').blur(); };
$('biHint').onclick = () => { biHint(); $('biHint').blur(); };
$('biSel').onchange = () => { biNew($('biSel').value); $('biSel').blur(); };
{  // vérification : la croix anglaise a 4 sauts au départ et se résout jusqu'au centre ; chaque énigme a des sauts et se résout jusqu'à sa case
  const P = biP('Croix anglaise'), s = biStart(P, [P.find([3, 3])]), first = P.moves.filter(([a, b, c]) => biHas(s, a) && biHas(s, b) && !biHas(s, c)).length;
  const pz = [0, 7, 13, 21].map(i => { const z = biPuzzle(i), Q = biP(z.board); return biCount(z.s) > 2 && !!biSolve(Q, z.s, z.t, 2e5); });
  const HX = biP('Hexagone'), hs = biStart(HX, [HX.find(BI_BOARDS.Hexagone.start)]), hex = HX.idx.length === 37 && !!biSolve(HX, hs, HX.find(BI_BOARDS.Hexagone.end), 2e6);
  const keepBi = bi; bi = {P, s, target: P.find([3, 3]), pz: -1, mode: 'play', tick: 0, hints: 0, sel: -1}; const hint = biHint(true), hintOk = !!hint && biMoves().some(m => m[0] === hint[0] && m[2] === hint[1]); bis.hints--; bi = keepBi;
  const names = new Set(BI_PZ.map((_, i) => biSulName(i))), sulf = names.size === 30 && biSulfure(4, 11).width === 24;
  const ok = first === 4 && !!biSolve(P, s, P.find([3, 3]), 2e5) && pz.every(Boolean) && Object.values(BI_BOARDS).every(B => B.start && B.end) && hex && hintOk && sulf;
  console.assert(ok, 'billes', {first, pz, hex, hintOk, sulf}); view.dataset.selfcheck = ok ? 'ok' : JSON.stringify({first, pz, hex, hintOk, sulf});
}
// les trophées, tirés des statistiques et des records gardés (aussi à l'ouverture : ce qui a été fait avant compte)
function biTrophies() {
  const pz = BI_PZ.map((_, i) => bis.pz[i] || 0), done = pz.filter(x => x > 0).length, st = pz.reduce((a, x) => a + x, 0), one = b => games.best['billes:' + b] === 1;
  const sig = [bis.games, bis.wins, bis.perfect, st, Object.keys(BI_BOARDS).filter(one).length].join(); if (sig === biTrophies.sig) return; biTrophies.sig = sig;
  trophyRecord('etoiles', st || null); trophyRecord('reussites', bis.wins || null);
  if (bis.games >= 1) trophy('premier'); if (bis.wins >= 1) trophy('une'); if (bis.perfect >= 1) trophy('parfait'); if (Object.keys(BI_BOARDS).every(one)) trophy('plateaux');
  if (done >= 1) trophy('enigme'); if (done >= 10) trophy('enigmes10'); if (done >= BI_PZ.length) trophy('enigmes30'); if (pz.every(x => x >= 3)) trophy('etoiles');
}
ctx.onOpen(() => {
  if (!bi) biNew(); if (bi.mode === 'pause') bi.mode = 'play';
  cv.__bi = {st: () => bi, hint: biHint, play: biPlay, board: biNew, tab: biTab, solve: () => biSolve(bi.P, bi.s, bi.pz >= 0 ? bi.target : -1, 2e6), has: biHas, puz: biPuzzle, load: (n, holes) => { const P = biP(n); biLoad(P, biStart(P, holes.map(P.find)), -1, -1); }};
  gameLoop(bi, 'billes', () => {}, biDraw); biInfo();
});

}
