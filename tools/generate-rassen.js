// Generiert aus den Quiz-Rassendaten in index.html:
//   rassen/<slug>.html  (80 SEO-Rasseprofile)
//   rassen.html         (Übersicht)
//   sitemap.xml, robots.txt
// Aufruf: node tools/generate-rassen.js  (aus dem Projekt-Root)
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

const breedsBody = html.match(/const breeds = \[([\s\S]*?)\n\];/)[1];
const breeds = new Function('return [' + breedsBody + '\n]')();
const sizesBody = html.match(/const breedSizes=\{([\s\S]*?)\n\};/)[1];
const breedSizes = new Function('return {' + sizesBody + '}')();

function slug(n) {
  return n.toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss').replace(/é/g, 'e')
    .replace(/[()]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

const sizeLabel = ['', 'Klein', 'Mittel', 'Groß', 'Sehr groß'];
const costL = ['', '~100 €/Monat', '~200 €/Monat', '~350 €/Monat', '500 €+ /Monat'];
const lvl = ['', 'niedrig', 'mittel', 'hoch', 'sehr hoch'];
const lvlGood = ['', 'gering', 'okay', 'gut', 'hervorragend'];

const ATTRS = [
  ['act', 'Aktivitätsbedarf', lvl],
  ['train', 'Erziehungsaufwand', lvl],
  ['xp', 'Benötigte Erfahrung', lvl],
  ['groom', 'Pflegeaufwand', lvl],
  ['shed', 'Haaren', lvl],
  ['bark', 'Bellfreude', lvl],
  ['hunt', 'Jagdtrieb', lvl],
  ['alone', 'Bedürfnis nach Gesellschaft', lvl],
  ['kids', 'Kinderfreundlichkeit', lvlGood],
  ['pets', 'Verträglichkeit mit Tieren', lvlGood]
];

function challenges(a) {
  const c = [];
  if (a.shed >= 3) c.push('Starkes Haaren');
  if (a.bark >= 3) c.push('Bellfreudig');
  if (a.drool >= 3) c.push('Sabbert viel');
  if (a.alone >= 3) c.push('Sollte selten allein sein');
  if (a.act >= 3) c.push('Hoher Bewegungsbedarf');
  if (a.train >= 3) c.push('Braucht konsequente Führung');
  if (a.groom >= 3) c.push('Aufwendige Fellpflege');
  if (a.cost >= 3) c.push('Höhere Haltungskosten');
  if (a.hunt >= 3) c.push('Hoher Jagdtrieb');
  if (a.xp >= 3) c.push('Nicht für Anfänger');
  return c;
}
function positives(a) {
  const p = [];
  if (a.xp <= 2) p.push('Auch für Einsteiger geeignet');
  if (a.kids >= 3) p.push('Familienfreundlich');
  if (a.pets >= 3) p.push('Verträgt sich gut mit anderen Tieren');
  if (a.alone <= 2) p.push('Kommt vergleichsweise gut mit Alleinsein zurecht');
  if (a.bark <= 2) p.push('Eher ruhig');
  if (a.shed <= 2) p.push('Haart wenig bis moderat');
  if (a.groom <= 2) p.push('Pflegeleichtes Fell');
  if (a.hunt <= 2) p.push('Geringer Jagdtrieb');
  if (a.cost <= 2) p.push('Moderate Haltungskosten');
  return p;
}
function dots(v) {
  let s = '';
  for (let i = 1; i <= 4; i++) s += '<span class="dot' + (i <= v ? ' on' : '') + '"></span>';
  return s;
}

const NAV_SVG = '<svg class="logo-icon" width="29" height="30" viewBox="0 0 122 126" aria-hidden="true"><ellipse class="logo-toe" cx="46" cy="22" rx="15.5" ry="20" transform="rotate(-8 46 22)"/><ellipse class="logo-toe" cx="76" cy="22" rx="15.5" ry="20" transform="rotate(8 76 22)"/><ellipse class="logo-toe" cx="15" cy="46" rx="12.5" ry="16.5" transform="rotate(-24 15 46)"/><ellipse class="logo-toe" cx="107" cy="46" rx="12.5" ry="16.5" transform="rotate(24 107 46)"/><path class="logo-heart" d="M61 124C38 103 23 88 23 70C23 57 32 48 44 48C52 48 58 53 61 62C64 53 70 48 78 48C90 48 99 57 99 70C99 88 84 103 61 124Z"/></svg>';
const FAVICON = `<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 128 128'><rect width='128' height='128' rx='28' fill='%231B4332'/><g transform='translate(20 18) scale(0.72)' fill='%23F4A51C'><ellipse cx='46' cy='22' rx='15.5' ry='20' transform='rotate(-8 46 22)'/><ellipse cx='76' cy='22' rx='15.5' ry='20' transform='rotate(8 76 22)'/><ellipse cx='15' cy='46' rx='12.5' ry='16.5' transform='rotate(-24 15 46)'/><ellipse cx='107' cy='46' rx='12.5' ry='16.5' transform='rotate(24 107 46)'/><path d='M61 124C38 103 23 88 23 70C23 57 32 48 44 48C52 48 58 53 61 62C64 53 70 48 78 48C90 48 99 57 99 70C99 88 84 103 61 124Z'/></g></svg>">`;

const STYLE = `
  :root { --forest:#1B4332; --forest-2:#2D6A4F; --forest-3:#40916C; --forest-soft:#D8EDDF; --gold:#F4A51C; --gold-bg:#FFF9ED; --white:#FFFFFF; --off-white:#F7F3EE; --cream:#EDE8DF; --ink:#1A1A18; --ink-mid:#4A4744; --ink-muted:#8C8880; --border-soft:#EDE8E0; }
  *,*::before,*::after { box-sizing:border-box; margin:0; padding:0; }
  body { font-family:'Plus Jakarta Sans',sans-serif; background:var(--white); color:var(--ink); -webkit-font-smoothing:antialiased; }
  ::selection { background:var(--forest); color:var(--white); }
  :focus-visible { outline:3px solid var(--forest); outline-offset:3px; border-radius:4px; }
  nav { position:fixed; top:0; left:0; right:0; z-index:1000; background:rgba(255,255,255,0.94); backdrop-filter:blur(16px); border-bottom:1px solid var(--border-soft); padding:0 clamp(20px,5vw,64px); height:64px; display:flex; align-items:center; justify-content:space-between; }
  .nav-logo { font-family:'Plus Jakarta Sans',sans-serif; font-weight:700; font-size:1.3rem; letter-spacing:-0.02em; color:var(--forest); text-decoration:none; display:flex; align-items:center; gap:10px; }
  .logo-word-accent { color:var(--gold); }
  nav .logo-icon { width:38px; height:38px; padding:7px 6px; background:var(--forest); border-radius:11px; box-sizing:border-box; box-shadow:0 2px 8px rgba(27,67,50,0.25); }
  nav .logo-icon .logo-toe, nav .logo-icon .logo-heart { fill:var(--gold); }
  .nav-cta { background:var(--forest); color:var(--white); padding:10px 22px; border-radius:8px; font-size:0.875rem; font-weight:700; text-decoration:none; transition:background 0.2s; min-height:44px; display:inline-flex; align-items:center; }
  .nav-cta:hover { background:var(--forest-2); }
  main { max-width: 860px; margin:0 auto; padding:120px clamp(24px,5vw,40px) 80px; }
  h1 { font-family:'Fraunces',serif; font-size:clamp(2rem,5vw,2.8rem); font-weight:900; letter-spacing:-0.03em; line-height:1.08; margin-bottom:14px; }
  h2 { font-family:'Fraunces',serif; font-size:1.35rem; font-weight:700; margin:40px 0 16px; color:var(--forest); }
  p, li { font-size:0.95rem; line-height:1.75; color:var(--ink-mid); }
  a { color:var(--forest); }
  .crumbs { font-size:0.78rem; color:var(--ink-muted); margin-bottom:24px; }
  .crumbs a { color:var(--ink-muted); text-decoration:none; }
  .crumbs a:hover { color:var(--forest); }
  .breed-head { display:flex; align-items:center; gap:18px; margin-bottom:10px; }
  .breed-emoji { width:72px; height:72px; flex-shrink:0; border-radius:18px; background:var(--forest-soft); display:flex; align-items:center; justify-content:center; font-size:2.4rem; }
  .traits { display:flex; flex-wrap:wrap; gap:6px; margin:14px 0 18px; }
  .trait { background:var(--forest-soft); color:var(--forest); padding:4px 12px; border-radius:100px; font-size:0.76rem; font-weight:600; }
  .pills { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:8px; }
  .pill { font-size:0.74rem; padding:4px 11px; border-radius:100px; font-weight:600; background:var(--off-white); border:1px solid var(--border-soft); color:var(--ink-mid); }
  .pill.warn { background:#FEF3C7; color:#92400E; border-color:transparent; }
  .pill.ok { background:#D1FAE5; color:#065F46; border-color:transparent; }
  .attrs { margin-top:8px; border:1px solid var(--border-soft); border-radius:16px; padding:8px 20px; }
  .attr { display:flex; align-items:center; gap:12px; padding:11px 0; border-bottom:1px solid var(--border-soft); }
  .attr:last-child { border-bottom:none; }
  .attr-name { flex:1; font-size:0.86rem; color:var(--ink-mid); }
  .attr-dots { display:flex; gap:4px; }
  .dot { width:18px; height:8px; border-radius:4px; background:var(--cream); }
  .dot.on { background:var(--forest-3); }
  .attr-word { width:92px; text-align:right; font-size:0.74rem; font-weight:700; color:var(--forest); }
  ul.plain { list-style:none; }
  ul.plain li { padding:7px 0 7px 26px; position:relative; border-bottom:1px solid var(--border-soft); font-size:0.9rem; }
  ul.plain li:last-child { border-bottom:none; }
  ul.plain.good li::before { content:'✓'; position:absolute; left:0; color:var(--forest-3); font-weight:800; }
  ul.plain.bad li::before { content:'!'; position:absolute; left:4px; color:#C2402F; font-weight:800; }
  .cta-box { background:var(--forest); border-radius:18px; padding:28px; margin-top:36px; color:var(--white); }
  .cta-box h2 { color:var(--white); margin:0 0 8px; }
  .cta-box p { color:rgba(255,255,255,0.65); margin-bottom:18px; }
  .btn-gold { display:inline-block; background:var(--gold); color:var(--ink); padding:13px 26px; border-radius:9px; font-weight:700; font-size:0.92rem; text-decoration:none; transition:background 0.18s, transform 0.18s; }
  .btn-gold:hover { background:#f5b740; transform:translateY(-1px); }
  .btn-line { display:inline-block; margin-left:14px; color:rgba(255,255,255,0.8); font-size:0.88rem; }
  .related { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-top:10px; }
  .related a { display:flex; align-items:center; gap:9px; background:var(--off-white); border:1px solid var(--border-soft); border-radius:12px; padding:12px 14px; text-decoration:none; font-size:0.84rem; font-weight:600; color:var(--ink); transition:border-color 0.2s, transform 0.2s; }
  .related a:hover { border-color:var(--forest-3); transform:translateY(-2px); }
  .note { font-size:0.76rem; color:var(--ink-muted); margin-top:36px; line-height:1.6; }
  footer { background:#0F2D1F; padding:32px clamp(24px,6vw,80px); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px; margin-top:40px; }
  .footer-links { display:flex; gap:24px; flex-wrap:wrap; }
  .footer-links a { font-size:0.8rem; color:rgba(255,255,255,0.4); text-decoration:none; }
  .footer-links a:hover { color:rgba(255,255,255,0.8); }
  .footer-copy { font-size:0.78rem; color:rgba(255,255,255,0.25); }
  .grid-index { display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:12px; margin-top:32px; }
  .grid-index a { display:flex; align-items:center; gap:10px; background:var(--off-white); border:1px solid var(--border-soft); border-radius:12px; padding:13px 15px; text-decoration:none; color:var(--ink); font-size:0.88rem; font-weight:600; transition:border-color 0.2s, transform 0.2s; }
  .grid-index a:hover { border-color:var(--forest-3); transform:translateY(-2px); }
  .grid-index .em { font-size:1.15rem; }
  @media (max-width:720px) { .related { grid-template-columns:1fr; } }
`;

function shell(title, desc, canonical, body) {
  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#FFFFFF">
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${canonical}">
${FAVICON}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,700;9..144,900&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap" rel="stylesheet">
<style>${STYLE}</style>
</head>
<body>
${body}
</body>
</html>
`;
}

function navFooter(rel) {
  const nav = `<nav>
  <a class="nav-logo" href="${rel}index.html">${NAV_SVG}<span>Welpen<span class="logo-word-accent">lotse</span></span></a>
  <a class="nav-cta" href="${rel}index.html#quiz">Kostenloses Quiz starten</a>
</nav>`;
  const footer = `<footer>
  <div class="footer-links">
    <a href="${rel}index.html">Startseite</a>
    <a href="${rel}rassen.html">Alle Rassen</a>
    <a href="${rel}index.html#angebot">Welpenkauf-Schutzpaket</a>
    <a href="${rel}datenschutz.html">Datenschutz</a>
    <a href="${rel}impressum.html">Impressum</a>
  </div>
  <p class="footer-copy">© 2026 Welpenlotse. Alle Rechte vorbehalten.</p>
</footer>`;
  return { nav, footer };
}

const outDir = path.join(ROOT, 'rassen');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

const sorted = [...breeds].sort((a, b) => a.name.localeCompare(b.name, 'de'));

let count = 0;
for (const b of breeds) {
  const s = slug(b.name);
  const a = b.attr;
  const size = breedSizes[b.name] || 2;
  const { nav, footer } = navFooter('../');

  const pills = [
    `<span class="pill">Größe: ${sizeLabel[size]}</span>`,
    `<span class="pill">Kosten: ${costL[a.cost]}</span>`,
    a.xp <= 2 ? `<span class="pill ok">Anfängergeeignet</span>` : `<span class="pill warn">Erfahrung nötig</span>`,
    a.kids >= 3 ? `<span class="pill ok">Kinderfreundlich</span>` : ''
  ].join('');

  const attrRows = ATTRS.map(([k, label, words]) =>
    `<div class="attr"><span class="attr-name">${label}</span><span class="attr-dots">${dots(a[k])}</span><span class="attr-word">${words[a[k]]}</span></div>`
  ).join('\n      ');

  const pos = positives(a).map(x => `<li>${x}</li>`).join('');
  const cha = challenges(a).map(x => `<li>${x}</li>`).join('');

  const rel = sorted.filter(x => x.name !== b.name && (breedSizes[x.name] || 2) === size).slice(0, 3);
  const relHtml = rel.map(r => `<a href="${slug(r.name)}.html"><span class="em">${r.emoji}</span>${r.name}</a>`).join('\n      ');

  const title = `${b.name}: Passt die Rasse zu mir? | Welpenlotse`;
  const desc = `${b.name} im ehrlichen Rasseprofil: Charakter, Aktivität, Pflege, Herausforderungen und für wen die Rasse passt – plus kostenloses Eignungs-Quiz mit 80 Rassen.`;
  const canonical = `https://www.welpenlotse.de/rassen/${s}.html`;

  const body = `${nav}
<main>
  <p class="crumbs"><a href="../index.html">Start</a> › <a href="../rassen.html">Rassen</a> › ${b.name}</p>
  <div class="breed-head">
    <div class="breed-emoji" aria-hidden="true">${b.emoji}</div>
    <h1>${b.name}</h1>
  </div>
  <p>${b.desc}</p>
  <div class="traits">${b.traits.map(t => `<span class="trait">${t}</span>`).join('')}</div>
  <div class="pills">${pills}</div>

  <h2>Auf einen Blick</h2>
  <div class="attrs">
      ${attrRows}
  </div>

  ${pos ? `<h2>Das spricht für die Rasse</h2>\n  <ul class="plain good">${pos}</ul>` : ''}
  ${cha ? `<h2>Das solltest du ehrlich einplanen</h2>\n  <ul class="plain bad">${cha}</ul>` : ''}

  <div class="cta-box">
    <h2>Passt ${b.name === 'Mops' || b.name === 'Dackel' || b.name === 'Beagle' || b.name === 'Boxer' ? 'der' : 'die Rasse'} wirklich zu deinem Alltag?</h2>
    <p>Das kostenlose Quiz gleicht 22 Fragen zu deinem Leben mit 80 Rassen ab – und sagt dir ehrlich, ob es passt.</p>
    <a class="btn-gold" href="../index.html#quiz">Quiz jetzt starten →</a>
    <span class="btn-line">5 Minuten · kostenlos · ohne Anmeldung</span>
  </div>

  <div class="cta-box" style="background:linear-gradient(150deg,#081A0F 0%,#1B4332 60%,#0A1F15 100%)">
    <h2>Und wenn es passt: sicher kaufen.</h2>
    <p>Das Welpenkauf-Schutzpaket führt dich Schritt für Schritt zum seriösen Züchter – ohne Vermehrer, ohne kranken Welpen, ohne Betrug. 5 Teile, 8 Checklisten, mit Quellen belegt.</p>
    <a class="btn-gold" href="../index.html#angebot">Zum Schutzpaket – 19,90 € →</a>
  </div>

  <h2>Ähnliche Rassen (${sizeLabel[size]})</h2>
  <div class="related">
      ${relHtml}
  </div>

  <p class="note">Hinweis: Dieses Profil basiert auf den Welpenlotse-Rassedaten (14 Merkmale, Skala 1–4) und beschreibt rassetypische Tendenzen. Jeder Hund ist ein Individuum – Aufzucht, Sozialisierung und Linie prägen das Wesen mindestens genauso stark. Stand: Juni 2026.</p>
</main>
${footer}`;

  fs.writeFileSync(path.join(outDir, s + '.html'), shell(title, desc, canonical, body));
  count++;
}

// Übersichtsseite
{
  const { nav, footer } = navFooter('');
  const links = sorted.map(b => `<a href="rassen/${slug(b.name)}.html"><span class="em">${b.emoji}</span>${b.name}</a>`).join('\n    ');
  const body = `${nav}
<main style="max-width:1000px">
  <p class="crumbs"><a href="index.html">Start</a> › Rassen</p>
  <h1>80 Hunderassen im ehrlichen Profil</h1>
  <p style="max-width:640px">Charakter, Aktivität, Pflege, Herausforderungen – ohne Zuckerguss. Du weißt noch nicht, welche Rasse passt? Dann starte mit dem <a href="index.html#quiz">kostenlosen Eignungs-Quiz</a> (22 Fragen, 5 Minuten).</p>
  <div class="grid-index">
    ${links}
  </div>
</main>
${footer}`;
  fs.writeFileSync(path.join(ROOT, 'rassen.html'), shell(
    'Alle 80 Hunderassen im ehrlichen Profil | Welpenlotse',
    'Alle 80 Hunderassen aus dem Welpenlotse-Quiz im ehrlichen Profil: Charakter, Aktivität, Pflege und Herausforderungen – finde die Rasse, die wirklich zu dir passt.',
    'https://www.welpenlotse.de/rassen.html',
    body
  ));
}

// Sitemap & robots
{
  const today = '2026-06-12';
  const urls = ['https://www.welpenlotse.de/', 'https://www.welpenlotse.de/rassen.html']
    .concat(sorted.map(b => `https://www.welpenlotse.de/rassen/${slug(b.name)}.html`));
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map(u => `  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`).join('\n') + '\n</urlset>\n';
  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml);
  fs.writeFileSync(path.join(ROOT, 'robots.txt'), 'User-agent: *\nAllow: /\n\nSitemap: https://www.welpenlotse.de/sitemap.xml\n');
}

console.log('Fertig: ' + count + ' Rassenseiten, rassen.html, sitemap.xml, robots.txt');
