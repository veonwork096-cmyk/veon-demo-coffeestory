import { createRequire } from 'node:module';
const require = createRequire(process.env.USERPROFILE + '/.veon/tools/package.json');
const puppeteer = require('puppeteer-core');
const [url, chrome] = process.argv.slice(2);
const b = await puppeteer.launch({ executablePath: chrome, headless: 'new' });
const p = await b.newPage();
const ok = (c, m) => console.log(c ? 'PASS' : 'FAIL', m);
for (const w of [320, 375, 390, 768, 1024, 1280, 1440, 1920]) {
  await p.setViewport({ width: w, height: 844 });
  await p.goto(url, { waitUntil: 'networkidle0' });
  const r = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, vw: document.documentElement.clientWidth,
    off: [...document.querySelectorAll('main *, header *, footer *')].filter(e => { if (e.closest('.stage,.menu-panel,.visually-hidden,.future-link__note')) return false; const r = e.getBoundingClientRect(); return r.width && (r.right > document.documentElement.clientWidth + 1); }).map(e => e.tagName + '.' + e.className).slice(0, 5) }));
  ok(r.sw <= r.vw && r.off.length === 0, `${w}px no overflow ${r.off.join(',')}`);
}
// fold: H1, CTA, phone link visible at 390x844 and 1280x800
for (const [w, h] of [[390, 844], [1280, 800]]) {
  await p.setViewport({ width: w, height: h }); await p.goto(url, { waitUntil: 'networkidle0' });
  const v = await p.evaluate((h) => ['h1', '.btn-hero', '.call-link'].map(s => document.querySelector(s).getBoundingClientRect().bottom <= h), h);
  ok(v.every(Boolean), `${w}x${h} H1 + CTA + phone in first screen ${v}`);
}
// tabs
await p.setViewport({ width: 1440, height: 900 }); await p.goto(url, { waitUntil: 'networkidle0' });
await p.click('#tab-shef');
ok(await p.$eval('#heroi-shef', e => getComputedStyle(e).display !== 'none') && await p.$eval('#heroi-lys', e => getComputedStyle(e).display === 'none'), 'tab click shows Шеф');
await p.focus('#tab-shef'); await p.keyboard.press('ArrowRight');
ok(await p.$eval('#tab-vedmid', e => e.getAttribute('aria-selected') === 'true' && document.activeElement === e), 'ArrowRight moves to Ведмідь');
await p.goto(url, { waitUntil: 'networkidle0' });
await p.click('a.pack.right'); await new Promise(r => setTimeout(r, 900));
ok(await p.$eval('#tab-vedmid', e => e.getAttribute('aria-selected') === 'true'), 'hero pack "Під фільтр" opens Ведмідь');
ok(await p.evaluate(() => Math.abs(document.getElementById('heroi').getBoundingClientRect().top - 64) < 80), 'scrolled to #heroi');
// Z-1: tap in the centre of each side pack on phones opens its own hero
for (const w of [320, 390]) {
  await p.setViewport({ width: w, height: 844 }); await p.goto(url, { waitUntil: 'networkidle0' });
  for (const [sel, id] of [['a.pack.right', 'vedmid'], ['a.pack.left', 'shef']]) {
    const hit = await p.$eval(sel, (a) => { const r = a.getBoundingClientRect(); const x = Math.min(r.left + r.width / 2, innerWidth - 4), y = r.top + r.height / 2; return document.elementFromPoint(x, y)?.closest('a')?.dataset.heroLink; });
    ok(hit === id, `${w}px tap centre of ${sel} -> ${hit}`);
  }
}
await p.setViewport({ width: 1440, height: 900 }); await p.goto(url, { waitUntil: 'networkidle0' });
// links
const links = await p.$$eval('a[href]', as => as.map(a => a.getAttribute('href')));
ok(!links.some(h => /coffeestory\.in\.ua/.test(h) || h === '#' || h === ''), 'no links to old site / empty: ' + [...new Set(links)].join(' '));
ok(await p.$$eval('[id]', els => { const ids = els.map(e => e.id); return ids.length === new Set(ids).size; }), 'unique ids');
ok(await p.$$eval('a[href^="#"]', as => as.every(a => a.getAttribute('href') === '#main' || document.getElementById(a.getAttribute('href').slice(1)))), 'anchors resolve');
const fl = await p.$$eval('.future-link', els => els.every(e => e.getAttribute('aria-disabled') === 'true' && !e.hasAttribute('href')));
ok(fl, 'FutureLinks inactive');
await p.hover('.btn-hero'); await new Promise(r => setTimeout(r, 300));
ok(await p.$eval('.btn-hero .future-link__note', e => getComputedStyle(e).opacity === '1' && e.textContent === 'Розділ у розробці'), 'FutureLink note on hover');
// mobile menu
await p.setViewport({ width: 390, height: 844 }); await p.goto(url, { waitUntil: 'networkidle0' });
await p.click('.menu summary');
ok(await p.$eval('.menu', e => e.open) && await p.$eval('.menu-panel', e => e.getBoundingClientRect().height > 400), 'mobile menu opens');
await p.click(".menu-nav a[href=\"#dostavka\"]"); await new Promise(r => setTimeout(r, 2500));
ok(await p.$eval('.menu', e => !e.open), 'menu closes after anchor');
ok(await p.evaluate(() => Math.abs(document.getElementById('dostavka').getBoundingClientRect().top - 64) < 10), 'scrolled to #dostavka under header');
// tel in header
ok(await p.$eval('header a.call', e => e.getAttribute('href') === 'tel:+380684827286' && e.getBoundingClientRect().width >= 44), 'header call button 44px tel');
// no-JS
const p2 = await b.newPage(); await p2.setJavaScriptEnabled(false); await p2.setViewport({ width: 390, height: 844 });
await p2.goto(url, { waitUntil: 'networkidle0' });
ok(await p2.$$eval('[data-panel]', ps => ps.every(x => getComputedStyle(x).display !== 'none')), 'no-JS: all hero panels visible');
ok(await p2.$eval('.fill', e => getComputedStyle(e).opacity === '1'), 'no-JS: freshness bar visible');
// reduced motion
const p3 = await b.newPage(); await p3.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]); await p3.setViewport({ width: 1440, height: 900 });
await p3.goto(url, { waitUntil: 'domcontentloaded' });
ok(await p3.$$eval('.pack picture', ps => ps.every(x => getComputedStyle(x).animationName === 'none')), 'reduced motion: packs not animated');
await b.close();
