// Testet alle Dog-CEO-Slugs (aktuell + Korrektur-Kandidaten) live gegen die API
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const ceoBody = html.match(/var dogCEOBreeds=\{([\s\S]*?)\n\};/)[1];
const map = new Function('return {' + ceoBody + '}')();

const candidates = [
  'germanshepherd', 'pointer', 'cattledog', 'pinscher', 'frise', 'terrier/fox',
  'mastiff/bull', 'waterdog/spanish', 'spaniel/brittany', 'springer/english',
  'hound/basset', 'bulldog/boston', 'bullterrier/staffordshire', 'spaniel/blenheim',
  'keeshond', 'havanese', 'retriever/flatcoated', 'greyhound/italian', 'corgi/cardigan'
];
const slugs = [...new Set([...Object.values(map), ...candidates])].sort();

(async () => {
  const bad = [], ok = [];
  for (const s of slugs) {
    try {
      const r = await fetch('https://dog.ceo/api/breed/' + s + '/images/random');
      const d = await r.json();
      if (d.status === 'success' && d.message) ok.push(s); else bad.push(s);
    } catch (e) { bad.push(s + ' (Netzwerk)'); }
  }
  console.log('OK: ' + ok.length + ' Slugs');
  console.log(bad.length ? 'KAPUTT:\n  ' + bad.join('\n  ') : 'Keine kaputten Slugs');
  // Welche Rassen sind von kaputten Slugs betroffen?
  const affected = Object.entries(map).filter(([n, s]) => bad.includes(s)).map(([n, s]) => n + ' -> ' + s);
  if (affected.length) console.log('Betroffene Rassen:\n  ' + affected.join('\n  '));
})();
