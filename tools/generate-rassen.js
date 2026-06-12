// Generiert aus den Quiz-Rassendaten in index.html:
//   rassen/<slug>.html  (80 ausführliche Rasse-Dossiers)
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

// ── Wissensbasis: ursprünglicher Verwendungszweck ──
const PURPOSE = {
  "Golden Retriever": "Apportierhund für die Wasserjagd (Schottland)",
  "Labrador Retriever": "Apportierhund der Fischer und Jäger (Neufundland/England)",
  "Deutscher Schäferhund": "Hüte- und Gebrauchshund (Deutschland)",
  "Französische Bulldogge": "Gesellschaftshund (Frankreich/England)",
  "Englische Bulldogge": "Früher Bullenbeißer, heute Gesellschaftshund (England)",
  "Beagle": "Meutejagdhund für die Hasenjagd (England)",
  "Dackel": "Baujagd auf Dachs und Fuchs (Deutschland)",
  "Malteser": "Gesellschaftshund (Mittelmeerraum)",
  "Shih Tzu": "Palast- und Gesellschaftshund (Tibet/China)",
  "Cavalier King Charles Spaniel": "Gesellschaftshund des Adels (England)",
  "Pudel (Standard)": "Apportierhund für die Wasserjagd (Frankreich/Deutschland)",
  "Zwergpudel": "Begleit- und Gesellschaftshund (Frankreich)",
  "Border Collie": "Hütehund für Schafe (britisches Grenzland)",
  "Australian Shepherd": "Hütehund für Vieh (USA)",
  "Siberian Husky": "Ausdauernder Schlittenhund (Sibirien)",
  "Alaskan Malamute": "Schwerer Lasten-Schlittenhund (Alaska)",
  "Dobermann": "Schutz- und Gebrauchshund (Deutschland)",
  "Rottweiler": "Treib- und Schutzhund der Metzger (Deutschland)",
  "Boxer": "Jagd-, später Schutz- und Diensthund (Deutschland)",
  "Deutsche Dogge": "Jagd auf Wildschweine, später Repräsentation (Deutschland)",
  "Berner Sennenhund": "Hof-, Zug- und Treibhund (Schweiz)",
  "Labradoodle": "Hybrid, gezüchtet als allergikerfreundlicher Begleithund (Australien)",
  "Corgi (Pembroke)": "Treibhund für Rinder (Wales)",
  "Shiba Inu": "Jagdhund für Kleinwild (Japan)",
  "Chow Chow": "Wach- und Jagdhund (China)",
  "Akita Inu": "Jagd- und Wachhund (Japan)",
  "Jack Russell Terrier": "Baujagd auf Füchse (England)",
  "West Highland Terrier": "Jagd auf Fuchs und Dachs (Schottland)",
  "Yorkshire Terrier": "Rattenfänger, später Schoßhund (England)",
  "Chihuahua": "Gesellschaftshund (Mexiko)",
  "Pomeranian (Spitz)": "Wach- und Begleithund (Pommern)",
  "Hovawart": "Hofwächter (Deutschland)",
  "Eurasier": "Familien- und Begleithund (Deutschland, junge Rasse)",
  "Vizsla": "Vorstehhund für die Jagd (Ungarn)",
  "Weimaraner": "Jagd-Vorstehhund (Deutschland)",
  "Dalmatiner": "Kutschen-Begleithund (Dalmatien/England)",
  "Irischer Setter": "Vorstehhund für die Federwildjagd (Irland)",
  "Samojede": "Rentier-Hüte- und Schlittenhund (Sibirien)",
  "Bernedoodle": "Hybrid aus Berner Sennenhund und Pudel (Familienhund)",
  "Greyhound": "Hetz- und Rennhund (England)",
  "Whippet": "Kleiner Renn- und Jagdhund (England)",
  "Großer Münsterländer": "Jagd-Vorstehhund (Deutschland)",
  "Kleiner Münsterländer": "Jagd-Vorstehhund (Deutschland)",
  "Lagotto Romagnolo": "Wasserapportierhund, heute Trüffelsuchhund (Italien)",
  "Bolonka Zwetna": "Gesellschaftshund (Russland)",
  "Zwergpinscher": "Rattenfänger in Ställen (Deutschland)",
  "Papillon": "Gesellschaftshund des Adels (Frankreich/Belgien)",
  "Havaneser": "Gesellschaftshund (Kuba)",
  "Rhodesian Ridgeback": "Jagd- und Wachhund für Großwild (südliches Afrika)",
  "Cane Corso": "Hof-, Treib- und Schutzhund (Italien)",
  "Belgischer Schäferhund (Malinois)": "Hütehund, heute Dienst- und Schutzhund (Belgien)",
  "Australian Cattle Dog": "Treibhund für Rinder (Australien)",
  "Basenji": "Jagdhund (Zentralafrika)",
  "Basset Hound": "Spurlaut jagender Laufhund (Frankreich)",
  "Boston Terrier": "Gesellschaftshund (USA)",
  "Bull Terrier": "Früher Kampfhund, heute Begleithund (England)",
  "Cockapoo": "Hybrid aus Cocker Spaniel und Pudel (Familienbegleiter)",
  "Cocker Spaniel": "Stöberhund für die Jagd (England)",
  "English Springer Spaniel": "Stöberhund für die Jagd (England)",
  "Flat Coated Retriever": "Apportierhund (England)",
  "Foxterrier": "Baujagd auf Füchse (England)",
  "Irish Wolfhound": "Wolfs- und Hirschjagd (Irland)",
  "Keeshond": "Wachhund auf Flusskähnen (Niederlande/Deutschland)",
  "Leonberger": "Repräsentations- und Hofhund (Deutschland)",
  "Mops": "Gesellschaftshund (China)",
  "Neufundländer": "Arbeits- und Wasserrettungshund (Neufundland)",
  "Nova Scotia Duck Tolling Retriever": "Lockjagd auf Enten (Kanada)",
  "Parson Russell Terrier": "Baujagd auf Füchse (England)",
  "Pointer": "Vorstehhund für die Feldjagd (England)",
  "Pekingese": "Palasthund des Kaiserhofs (China)",
  "Puli": "Hütehund für Schafe (Ungarn)",
  "Schipperke": "Wach- und Rattenhund auf Booten (Belgien)",
  "Schnauzer": "Stall-, Wach- und Rattenhund (Deutschland)",
  "Zwergschnauzer": "Rattenfänger, heute Begleithund (Deutschland)",
  "Riesenschnauzer": "Treibhund, später Dienst- und Schutzhund (Deutschland)",
  "Scottish Terrier": "Baujagd auf Fuchs und Dachs (Schottland)",
  "Staffordshire Bull Terrier": "Früher Kampfhund, heute Familienbegleiter (England)",
  "American Staffordshire Terrier": "Früher Kampfhund, heute Begleithund (USA)",
  "Tibet Terrier": "Wach- und Hütehund in Klöstern (Tibet)",
  "Bichon Frisé": "Gesellschaftshund (Mittelmeerraum)"
};
const BRACHY = ["Mops", "Französische Bulldogge", "Englische Bulldogge", "Boston Terrier", "Pekingese", "Shih Tzu"];

const sizeLabel = ['', 'Klein', 'Mittel', 'Groß', 'Sehr groß'];
const costL = ['', '~100 €/Monat', '~200 €/Monat', '~350 €/Monat', '500 €+ /Monat'];
const lvl = ['', 'niedrig', 'mittel', 'hoch', 'sehr hoch'];
const lvlGood = ['', 'gering', 'okay', 'gut', 'hervorragend'];
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

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

const hasTrait = (b, list) => b.traits.some(t => list.some(k => t.toLowerCase().includes(k)));
const SMART = ['intelligen', 'klug', 'lernwillig', 'lernfreudig', 'gelehrig', 'lernbegierig', 'clever'];
const STUBBORN = ['eigenwillig', 'eigenständig', 'unabhängig', 'stur', 'würdevoll'];
const SENSITIVE = ['sensibel', 'sanft', 'zart', 'feinfühlig'];

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
function dots(v) {
  let s = '';
  for (let i = 1; i <= 4; i++) s += '<span class="dot' + (i <= v ? ' on' : '') + '"></span>';
  return s;
}

// ── Abschnitts-Logik ──
function profileFacts(b, a) {
  const learn = hasTrait(b, SMART) ? 'Sehr hoch – will arbeiten und gefordert werden'
    : hasTrait(b, STUBBORN) ? 'Eigenständig – arbeitet für sich, nicht für Beifall'
    : 'Mittel – arbeitet gern mit, ohne Workaholic zu sein';
  const guardT = ['', 'Kaum ausgeprägt', 'Vorhanden, aber moderat', 'Deutlich – Besuch wird gemeldet', 'Stark – braucht aktives Management'][a.guard];
  const huntT = ['', 'Kaum vorhanden', 'Gering', 'Deutlich – Training nötig', 'Sehr stark – bestimmt den Alltag'][a.hunt];
  const soc = Math.round((a.kids + a.pets) / 2);
  const socT = ['', 'Reserviert – wählt seine Menschen', 'Wählerisch, braucht Gewöhnung', 'Umgänglich und offen', 'Sehr sozial, liebt Gesellschaft'][soc];
  return [
    ['Ursprünglicher Zweck', PURPOSE[b.name] || 'Begleithund'],
    ['Energielevel', cap(lvl[a.act])],
    ['Lern- & Arbeitsbereitschaft', learn],
    ['Schutztrieb', guardT],
    ['Jagdtrieb', huntT],
    ['Sozialverhalten', socT]
  ];
}

function requirements(b, a, size) {
  const expT = ['', 'Keine Vorerfahrung nötig – mit Hundeschule gut machbar', 'Grundkenntnisse hilfreich – als engagierter Ersthund machbar', 'Hundeerfahrung nötig – kein Ersthund', 'Nur für sehr erfahrene Halter mit Trainingshintergrund'][a.xp];
  const timeT = ['', '1–1,5 Stunden täglich', '1,5–2,5 Stunden täglich', '2,5–3,5 Stunden täglich', '3,5+ Stunden täglich – bei jedem Wetter'][Math.max(a.act, Math.round((a.act + a.train) / 2))];
  const moveT = ['', 'Kurze, ruhige Spaziergänge genügen', 'Moderate tägliche Bewegung (45–90 Min.)', '1,5–2+ Stunden täglich, plus Freilauf oder Sport', 'Sportliche Auslastung: Joggen, Rad oder Hundesport – jeden Tag'][a.act];
  const mentalT = hasTrait(b, SMART) || a.train >= 3
    ? 'Tägliche Kopfarbeit ist Pflicht: Nasenarbeit, Tricks, Aufgaben – sonst sucht sich der Hund eigene Beschäftigung'
    : a.act >= 3 ? 'Regelmäßige geistige Beschäftigung zusätzlich zur Bewegung' : 'Moderat – Abwechslung auf Spaziergängen und gelegentliche Suchspiele genügen';
  const trainT = ['', 'Grundkommandos und klare Alltagsregeln genügen', 'Regelmäßiges, freundlich-konsequentes Training', 'Konsequente Erziehung ab Tag eins, idealerweise mit Hundeschule', 'Strukturierte Ausbildung und Regeln ohne Ausnahmen – sonst führt der Hund dich'][a.train];
  const homeT = ['', 'Wohnung geeignet – auch ohne Garten', 'Wohnung möglich, wenn täglicher Auslauf garantiert ist', 'Haus mit Garten klar im Vorteil – reine Stadtwohnung wird eng', 'Viel Platz nötig – beengte Haltung wird zum Problem'][a.space];
  const famT = ['', 'Besser in einen Haushalt ohne kleine Kinder', 'Mit älteren, hundeerfahrenen Kindern möglich – Kleinkinder eher nicht', 'Familientauglich – Umgang respektvoll begleiten', 'Ausgesprochen kinderfreundlich – Aufsicht bleibt trotzdem Pflicht'][a.kids];
  const petsT = ['', 'Zusammenleben mit Katzen und Kleintieren meist konfliktreich', 'Mit früher Gewöhnung möglich, aber kein Selbstläufer', 'Verträgt sich bei normaler Sozialisierung gut', 'Sehr verträglich – auch mit Artgenossen und Katzen'][a.pets];
  return [
    ['🎓', 'Hundeerfahrung', expT],
    ['⏱️', 'Zeit pro Tag', timeT],
    ['🏃', 'Bewegung', moveT],
    ['🧠', 'Geistige Auslastung', mentalT],
    ['📋', 'Training & Erziehung', trainT],
    ['🏠', 'Wohnsituation', homeT],
    ['👨‍👩‍👧', 'Familie & Kinder', famT],
    ['🐈', 'Andere Haustiere', petsT]
  ];
}

function underestimated(b, a) {
  const u = [];
  if (a.act >= 3) u.push(['Der Bewegungsbedarf', 'Ein großer Spaziergang am Wochenende reicht nicht. Diese Rasse braucht jeden Tag echte Auslastung – auch bei Regen, auch nach deinem langen Arbeitstag.']);
  if (a.train >= 3) u.push(['Der Führungsanspruch', 'Ohne klare, konsequente Regeln trifft der Hund eigene Entscheidungen. Inkonsequenz rächt sich bei dieser Rasse schneller als bei anderen.']);
  if (a.hunt >= 3) u.push(['Der Jagdtrieb', 'Freilauf wird ohne konsequentes Anti-Jagd-Training oft unmöglich. Schleppleine und Impulskontrolle gehören dauerhaft zum Alltag.']);
  if (a.alone >= 3) u.push(['Das Alleinbleiben', 'Diese Rasse leidet schnell unter Trennungsstress. Wer täglich viele Stunden außer Haus ist, braucht eine verlässliche Betreuungslösung.']);
  if (a.guard >= 3) u.push(['Der Schutz- und Wachtrieb', 'Besucher, Paketboten, fremde Hunde: Ohne frühe Sozialisierung und Management entsteht ernstes Konfliktpotenzial.']);
  if (hasTrait(b, STUBBORN)) u.push(['Die Eigenständigkeit', 'Diese Rasse arbeitet nicht für Beifall. Kommandos werden auf Sinn geprüft – das wirkt stur, ist aber Veranlagung und lässt sich nicht wegtrainieren.']);
  if (hasTrait(b, SENSITIVE)) u.push(['Die Sensibilität', 'Harte Worte, Hektik oder Streit im Haushalt werfen diese Rasse aus der Bahn. Sie braucht ruhige, verlässliche Menschen.']);
  if (BRACHY.includes(b.name)) u.push(['Die Gesundheit (Kurzatmigkeit)', 'Kurznasige Rassen leiden häufig unter Atemproblemen und Hitzeempfindlichkeit. Achte zwingend auf eine Zucht mit Atemfunktions-Nachweis (im Schutzpaket, Teil 4) – und plane höhere Tierarztkosten ein.']);
  if (a.shed >= 3) u.push(['Das Haaren', 'Haare auf Sofa, Kleidung und im Auto sind Dauerzustand – im Fellwechsel wird täglich gesaugt.']);
  if (a.groom >= 3) u.push(['Der Pflegeaufwand', 'Regelmäßiges Bürsten bzw. Trimmen oder Schur kosten Zeit und Geld. Vernachlässigte Pflege führt zu Verfilzungen und Hautproblemen.']);
  if (a.bark >= 3) u.push(['Die Lautstärke', 'Meldefreude ist Veranlagung, kein Erziehungsfehler. In hellhörigen Wohnungen wird das schnell zum Nachbarschaftsthema.']);
  if (a.drool >= 3) u.push(['Das Sabbern', 'Sabberflecken auf Boden, Möbeln und Kleidung gehören bei dieser Rasse zum Alltag – das sollte man vorher ehrlich akzeptieren.']);
  if (a.cost >= 3) u.push(['Die laufenden Kosten', costL[a.cost] + ' sind realistisch – Futter, Tierarzt und Versicherung wachsen mit der Größe des Hundes.']);
  if (u.length < 3) u.push(['Das Zeit-Commitment', 'Auch eine unkomplizierte Rasse bedeutet 12–15 Jahre Verantwortung – Urlaub, Krankheit und Lebensumbrüche eingeplant.']);
  if (u.length < 3) u.push(['Die Kosten im ersten Jahr', 'Anschaffung, Erstausstattung, Impfungen, Kastration und Hundeschule summieren sich schnell auf 2.500–4.000 €.']);
  return u.slice(0, 6);
}

function suitability(b, a) {
  const good = [], bad = [];
  if (a.act >= 3) { good.push('Sportliche Menschen, die täglich gern draußen sind'); bad.push('Haushalte, in denen der Hund sich dem Sofa-Rhythmus anpassen soll'); }
  else { good.push('Menschen mit ruhigem, geregeltem Alltag'); bad.push('Sportler, die einen Lauf- oder Sportpartner suchen'); }
  if (a.xp <= 2) good.push('Engagierte Ersthalter, die eine Hundeschule besuchen');
  else bad.push('Anfänger ohne erfahrene Unterstützung');
  if (a.kids >= 3) good.push('Familien mit Kindern');
  if (a.kids <= 1) bad.push('Familien mit kleinen Kindern');
  if (a.alone <= 2) good.push('Berufstätige mit Homeoffice- oder Hybrid-Modell');
  else bad.push('Vollzeit-Abwesende ohne tägliche Betreuungslösung');
  if (a.space <= 1) good.push('Stadtbewohner mit guter Gassi-Routine');
  if (a.space >= 3) bad.push('Kleine Stadtwohnung ohne Auslaufmöglichkeiten');
  if (a.guard >= 3) { good.push('Halter, die einen wachsamen Hund souverän führen können'); bad.push('Haushalte mit ständig wechselndem Besuch und ohne Lust auf Management'); }
  if (a.hunt >= 3) bad.push('Menschen, die überall sorgenfreien Freilauf erwarten');
  if (a.bark >= 3) bad.push('Hellhörige Mietwohnung mit empfindlichen Nachbarn');
  if (a.pets >= 3) good.push('Mehrtier-Haushalte (Katzen, Zweithund)');
  if (a.pets <= 1) bad.push('Haushalte mit Katzen oder Kleintieren');
  return [good.slice(0, 5), bad.slice(0, 5)];
}

function realityCheck(b, a, u) {
  const conds = [];
  conds.push(['', 'Mindestens 1–1,5 Stunden echte Zeit pro Tag', 'Täglich 1,5–2,5 Stunden aktive Zeit – dauerhaft, nicht nur anfangs', 'Täglich 2,5–3,5 Stunden für Bewegung, Training und Beschäftigung', 'Mehrere Stunden täglich – diese Rasse ist ein Lebensmittelpunkt, kein Nebenbei-Projekt'][Math.max(a.act, a.train)]);
  if (a.xp >= 3) conds.push('Echte Hundeerfahrung oder professionelle Begleitung von Anfang an');
  else conds.push('Bereitschaft zur Hundeschule – auch wenn vieles intuitiv klappt');
  if (a.alone >= 3) conds.push('Eine Betreuungslösung für Arbeitszeiten (Familie, Sitter, Büro-Hund)');
  if (a.space >= 3) conds.push('Ausreichend Platz – idealerweise Haus mit Garten');
  if (a.hunt >= 3) conds.push('Akzeptanz, dass Freilauf Training und Management erfordert');
  if (a.groom >= 3 || a.cost >= 3) conds.push('Ein realistisches Budget: ' + costL[a.cost] + ' plus Rücklagen für den Tierarzt');
  conds.push('12–15 Jahre Verantwortung – durch Umzüge, Jobwechsel und Lebensphasen hindurch');
  const fails = u.slice(0, 3).map(x => x[0].toLowerCase().replace(/^der |^die |^das /, ''));
  return { conds: conds.slice(0, 5), fails };
}

function verdict(a) {
  const cls = v => v <= 1 ? 'f-good' : v === 2 ? 'f-mid' : 'f-bad';
  const beginner = a.xp === 1 ? ['Ja', 'f-good'] : a.xp === 2 ? ['Ja, mit Einsatz', 'f-mid'] : a.xp === 3 ? ['Eher nein', 'f-bad'] : ['Nein', 'f-bad'];
  const t = Math.max(a.act, Math.round((a.act + a.train) / 2));
  const fam = a.kids >= 3 ? ['Ja', 'f-good'] : a.kids === 2 ? ['Eingeschränkt', 'f-mid'] : ['Nein', 'f-bad'];
  const apt = a.space === 1 ? ['Ja', 'f-good'] : a.space === 2 ? ['Eingeschränkt', 'f-mid'] : ['Nein', 'f-bad'];
  return [
    ['Anfängergeeignet', beginner[0], beginner[1]],
    ['Zeitaufwand', cap(lvl[t]), cls(t)],
    ['Trainingsaufwand', cap(lvl[a.train]), cls(a.train)],
    ['Bewegungsbedarf', cap(lvl[a.act]), cls(a.act)],
    ['Familiengeeignet', fam[0], fam[1]],
    ['Wohnungsgeeignet', apt[0], apt[1]]
  ];
}

// ── Seiten-Gerüst ──
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
  main { max-width: 880px; margin:0 auto; padding:120px clamp(24px,5vw,40px) 80px; }
  h1 { font-family:'Fraunces',serif; font-size:clamp(2rem,5vw,2.8rem); font-weight:900; letter-spacing:-0.03em; line-height:1.08; margin-bottom:14px; }
  h2 { font-family:'Fraunces',serif; font-size:clamp(1.4rem,3vw,1.7rem); font-weight:900; margin:56px 0 18px; color:var(--ink); letter-spacing:-0.02em; scroll-margin-top:84px; }
  h2 .h2-num { color:var(--gold); font-size:0.85em; margin-right:8px; }
  p, li { font-size:0.95rem; line-height:1.75; color:var(--ink-mid); }
  a { color:var(--forest); }
  .crumbs { font-size:0.78rem; color:var(--ink-muted); margin-bottom:24px; }
  .crumbs a { color:var(--ink-muted); text-decoration:none; }
  .crumbs a:hover { color:var(--forest); }
  .breed-head { display:flex; align-items:center; gap:18px; margin-bottom:10px; }
  .breed-emoji { width:72px; height:72px; flex-shrink:0; border-radius:18px; background:var(--forest-soft); display:flex; align-items:center; justify-content:center; font-size:2.4rem; }
  .traits { display:flex; flex-wrap:wrap; gap:6px; margin:14px 0 12px; }
  .trait { background:var(--forest-soft); color:var(--forest); padding:4px 12px; border-radius:100px; font-size:0.76rem; font-weight:600; }
  .pills { display:flex; flex-wrap:wrap; gap:6px; }
  .pill { font-size:0.74rem; padding:4px 11px; border-radius:100px; font-weight:600; background:var(--off-white); border:1px solid var(--border-soft); color:var(--ink-mid); }
  .pill.warn { background:#FEF3C7; color:#92400E; border-color:transparent; }
  .pill.ok { background:#D1FAE5; color:#065F46; border-color:transparent; }
  .toc { display:flex; flex-wrap:wrap; gap:8px; margin:26px 0 8px; padding:16px 0; border-top:1px solid var(--border-soft); border-bottom:1px solid var(--border-soft); }
  .toc a { font-size:0.78rem; font-weight:600; color:var(--ink-mid); text-decoration:none; background:var(--off-white); border:1px solid var(--border-soft); padding:7px 13px; border-radius:100px; transition:background 0.2s, color 0.2s, border-color 0.2s; }
  .toc a:hover { background:var(--forest-soft); color:var(--forest); border-color:transparent; }
  .facts { display:grid; grid-template-columns:repeat(2,1fr); gap:12px; margin-bottom:24px; }
  .fact { background:var(--off-white); border:1px solid var(--border-soft); border-radius:14px; padding:14px 16px; }
  .fact-label { font-size:0.62rem; font-weight:800; text-transform:uppercase; letter-spacing:0.1em; color:var(--ink-muted); margin-bottom:5px; }
  .fact-value { font-size:0.86rem; font-weight:600; color:var(--ink); line-height:1.45; }
  .attrs { border:1px solid var(--border-soft); border-radius:16px; padding:8px 20px; }
  .attr { display:flex; align-items:center; gap:12px; padding:11px 0; border-bottom:1px solid var(--border-soft); }
  .attr:last-child { border-bottom:none; }
  .attr-name { flex:1; font-size:0.86rem; color:var(--ink-mid); }
  .attr-dots { display:flex; gap:4px; }
  .dot { width:18px; height:8px; border-radius:4px; background:var(--cream); }
  .dot.on { background:var(--forest-3); }
  .attr-word { width:92px; text-align:right; font-size:0.74rem; font-weight:700; color:var(--forest); }
  .chal { display:flex; flex-wrap:wrap; gap:6px; margin-top:16px; }
  .chal span { font-size:0.74rem; padding:4px 11px; background:#FEE2E2; color:#991B1B; border-radius:100px; font-weight:600; }
  .req-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:12px; }
  .req { background:var(--white); border:1px solid var(--border-soft); border-radius:14px; padding:16px; display:flex; gap:12px; align-items:flex-start; box-shadow:0 4px 16px rgba(27,67,50,0.04); }
  .req-ico { font-size:1.15rem; flex-shrink:0; width:38px; height:38px; border-radius:10px; background:var(--forest-soft); display:flex; align-items:center; justify-content:center; }
  .req strong { display:block; font-size:0.8rem; color:var(--ink); margin-bottom:3px; }
  .req p { font-size:0.82rem; line-height:1.55; }
  .under { border-left:3px solid var(--gold); background:var(--gold-bg); border-radius:0 14px 14px 0; padding:6px 20px; }
  .under-item { padding:13px 0; border-bottom:1px solid rgba(146,100,10,0.12); }
  .under-item:last-child { border-bottom:none; }
  .under-item strong { display:block; font-size:0.9rem; color:#7A5C0A; margin-bottom:3px; }
  .under-item p { font-size:0.86rem; }
  .suit { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
  .suit-col { border-radius:16px; padding:20px; }
  .suit-col.yes { background:#EAF6EE; border:1px solid #CDE8D6; }
  .suit-col.no { background:#FBEDEA; border:1px solid #F2D6CF; }
  .suit-col h3 { font-size:0.95rem; font-weight:800; margin-bottom:10px; }
  .suit-col.yes h3 { color:#1E6B3C; }
  .suit-col.no h3 { color:#A33A28; }
  .suit-col li { list-style:none; font-size:0.85rem; padding:6px 0 6px 24px; position:relative; }
  .suit-col.yes li::before { content:'✓'; position:absolute; left:0; color:#1E6B3C; font-weight:800; }
  .suit-col.no li::before { content:'✕'; position:absolute; left:2px; color:#A33A28; font-weight:800; }
  .reality { background:linear-gradient(150deg,#102E1F 0%,#1B4332 65%,#0D2A1C 100%); border-radius:18px; padding:28px; color:var(--white); }
  .reality p { color:rgba(255,255,255,0.65); }
  .reality h3 { font-size:0.7rem; font-weight:800; text-transform:uppercase; letter-spacing:0.12em; color:var(--gold); margin:20px 0 10px; }
  .reality h3:first-child { margin-top:0; }
  .reality li { list-style:none; font-size:0.88rem; color:rgba(255,255,255,0.8); padding:6px 0 6px 26px; position:relative; }
  .reality li::before { content:'✓'; position:absolute; left:0; top:7px; width:17px; height:17px; border-radius:5px; background:rgba(244,165,28,0.2); color:var(--gold); font-size:0.6rem; font-weight:900; display:flex; align-items:center; justify-content:center; }
  .reality .fails { font-size:0.85rem; color:rgba(255,255,255,0.55); }
  .reality .fails strong { color:#F0A898; font-weight:700; }
  .verdict { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; }
  .v-item { background:var(--off-white); border:1px solid var(--border-soft); border-radius:14px; padding:16px; text-align:center; }
  .v-label { font-size:0.66rem; font-weight:800; text-transform:uppercase; letter-spacing:0.08em; color:var(--ink-muted); margin-bottom:8px; }
  .v-chip { display:inline-block; font-size:0.8rem; font-weight:800; padding:6px 14px; border-radius:100px; }
  .f-good { background:#D1FAE5; color:#065F46; }
  .f-mid { background:#FEF3C7; color:#92400E; }
  .f-bad { background:#FEE2E2; color:#991B1B; }
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
  .search-wrap { position:relative; max-width:520px; margin:28px 0 0; }
  .search-wrap svg { position:absolute; left:16px; top:50%; transform:translateY(-50%); color:var(--ink-muted); pointer-events:none; }
  .search-wrap input { width:100%; padding:15px 18px 15px 48px; font-family:'Plus Jakarta Sans',sans-serif; font-size:0.95rem; color:var(--ink); background:var(--off-white); border:1.5px solid var(--border-soft); border-radius:14px; transition:border-color 0.2s, background 0.2s, box-shadow 0.2s; }
  .search-wrap input:focus { outline:none; background:var(--white); border-color:var(--forest); box-shadow:0 4px 18px rgba(27,67,50,0.10); }
  .search-wrap input::placeholder { color:var(--ink-muted); }
  .no-hit { margin-top:20px; font-size:0.9rem; color:var(--ink-muted); background:var(--gold-bg); border:1px solid #F2E3C0; border-radius:12px; padding:14px 18px; }
  @media (max-width:720px) { .related, .req-grid, .suit, .facts { grid-template-columns:1fr; } .verdict { grid-template-columns:repeat(2,1fr); } }
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

  const facts = profileFacts(b, a).map(([l, v]) =>
    `<div class="fact"><div class="fact-label">${l}</div><div class="fact-value">${v}</div></div>`).join('\n    ');
  const attrRows = ATTRS.map(([k, label, words]) =>
    `<div class="attr"><span class="attr-name">${label}</span><span class="attr-dots">${dots(a[k])}</span><span class="attr-word">${words[a[k]]}</span></div>`).join('\n      ');
  const chal = challenges(a);
  const reqs = requirements(b, a, size).map(([ico, l, v]) =>
    `<div class="req"><span class="req-ico" aria-hidden="true">${ico}</span><div><strong>${l}</strong><p>${v}</p></div></div>`).join('\n    ');
  const u = underestimated(b, a);
  const underHtml = u.map(([t, x]) => `<div class="under-item"><strong>${t}</strong><p>${x}</p></div>`).join('\n    ');
  const [good, bad] = suitability(b, a);
  const rc = realityCheck(b, a, u);
  const verd = verdict(a).map(([l, v, c]) =>
    `<div class="v-item"><div class="v-label">${l}</div><span class="v-chip ${c}">${v}</span></div>`).join('\n    ');

  const rel = sorted.filter(x => x.name !== b.name && (breedSizes[x.name] || 2) === size).slice(0, 3);
  const relHtml = rel.map(r => `<a href="${slug(r.name)}.html"><span class="em">${r.emoji}</span>${r.name}</a>`).join('\n      ');

  const title = `${b.name}: Passt die Rasse zu mir? Ehrliche Analyse | Welpenlotse`;
  const desc = `${b.name} im ehrlichen Realitätscheck: Voraussetzungen, was Interessenten unterschätzen, für wen die Rasse (nicht) geeignet ist – plus kostenloses Eignungs-Quiz.`;
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

  <nav class="toc" aria-label="Inhalt">
    <a href="#profil">Rasseprofil</a>
    <a href="#voraussetzungen">Voraussetzungen</a>
    <a href="#unterschaetzt">Was viele unterschätzen</a>
    <a href="#geeignet">Für wen (nicht) geeignet</a>
    <a href="#realitaetscheck">Realitätscheck</a>
    <a href="#fazit">Fazit</a>
  </nav>

  <h2 id="profil"><span class="h2-num">01</span>Rasseprofil</h2>
  <div class="facts">
    ${facts}
  </div>
  <div class="attrs">
      ${attrRows}
  </div>
  ${chal.length ? `<div class="chal">${chal.map(c => `<span>${c}</span>`).join('')}</div>` : ''}

  <h2 id="voraussetzungen"><span class="h2-num">02</span>Voraussetzungen für eine erfolgreiche Haltung</h2>
  <div class="req-grid">
    ${reqs}
  </div>

  <h2 id="unterschaetzt"><span class="h2-num">03</span>Was viele Interessenten unterschätzen</h2>
  <div class="under">
    ${underHtml}
  </div>

  <h2 id="geeignet"><span class="h2-num">04</span>Für wen die Rasse (nicht) geeignet ist</h2>
  <div class="suit">
    <div class="suit-col yes">
      <h3>Gut geeignet für</h3>
      <ul>${good.map(g => `<li>${g}</li>`).join('')}</ul>
    </div>
    <div class="suit-col no">
      <h3>Eher ungeeignet für</h3>
      <ul>${bad.map(g => `<li>${g}</li>`).join('')}</ul>
    </div>
  </div>

  <h2 id="realitaetscheck"><span class="h2-num">05</span>Ehrlicher Realitätscheck</h2>
  <div class="reality">
    <p>Damit ein ${b.name} mit hoher Wahrscheinlichkeit ein artgerechtes, glückliches Leben führt – und du langfristig zufrieden bleibst – müssen diese Bedingungen erfüllt sein:</p>
    <h3>Diese Bedingungen sind nicht verhandelbar</h3>
    <ul>${rc.conds.map(c => `<li>${c}</li>`).join('')}</ul>
    <h3>Daran scheitern Halter am häufigsten</h3>
    <p class="fails">Die typischen Abgabegründe bei dieser Rasse: <strong>${rc.fails.join(', ')}</strong>. Fast immer steckt dahinter keine böse Absicht, sondern eine ehrliche Frage, die vor dem Kauf nicht gestellt wurde: Passt dieser Hund wirklich zu meinem echten Alltag – nicht zu meinem Wunsch-Alltag?</p>
  </div>

  <h2 id="fazit"><span class="h2-num">06</span>Fazit</h2>
  <div class="verdict">
    ${verd}
  </div>

  <div class="cta-box">
    <h2>Passt diese Rasse wirklich zu deinem Alltag?</h2>
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

  <p class="note">Hinweis: Diese Analyse basiert auf den Welpenlotse-Rassedaten (14 Merkmale, Skala 1–4) und beschreibt rassetypische Tendenzen. Jeder Hund ist ein Individuum – Aufzucht, Sozialisierung und Zuchtlinie prägen das Wesen mindestens genauso stark wie die Rasse. Stand: Juni 2026.</p>
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
  <h1>80 Hunderassen im ehrlichen Realitätscheck</h1>
  <p style="max-width:680px">Jedes Profil zeigt dir Voraussetzungen, unterschätzte Probleme und ein klares Fazit – ohne Zuckerguss. Du weißt noch nicht, welche Rasse passt? Dann starte mit dem <a href="index.html#quiz">kostenlosen Eignungs-Quiz</a> (22 Fragen, 5 Minuten).</p>
  <div class="search-wrap">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
    <input id="breedSearch" type="search" placeholder="Rasse eingeben, z. B. Golden Retriever …" autocomplete="off" aria-label="Hunderasse suchen">
  </div>
  <p class="no-hit" id="noHit" hidden>Keine Rasse gefunden. Probier einen anderen Begriff – oder <a href="index.html#quiz">finde im Quiz heraus, welche Rasse zu dir passt</a>.</p>
  <div class="grid-index" id="breedGrid">
    ${links}
  </div>
</main>
${footer}
<script>
(function(){
  var inp=document.getElementById('breedSearch');
  var cards=[].slice.call(document.querySelectorAll('#breedGrid a'));
  var noHit=document.getElementById('noHit');
  function norm(s){return s.toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/é/g,'e');}
  inp.addEventListener('input',function(){
    var q=norm(inp.value.trim());var hits=0;
    cards.forEach(function(c){var ok=!q||norm(c.textContent).indexOf(q)>=0;c.style.display=ok?'':'none';if(ok)hits++;});
    noHit.hidden=hits>0;
  });
  inp.addEventListener('keydown',function(e){
    if(e.key==='Enter'){var first=cards.filter(function(c){return c.style.display!=='none';})[0];if(first)location.href=first.getAttribute('href');}
  });
  inp.focus();
})();
</script>`;
  fs.writeFileSync(path.join(ROOT, 'rassen.html'), shell(
    'Alle 80 Hunderassen im ehrlichen Realitätscheck | Welpenlotse',
    'Alle 80 Hunderassen aus dem Welpenlotse-Quiz mit ehrlicher Analyse: Voraussetzungen, unterschätzte Probleme, Eignung und Fazit – finde die Rasse, die wirklich zu dir passt.',
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

console.log('Fertig: ' + count + ' Rasse-Dossiers, rassen.html, sitemap.xml, robots.txt');
