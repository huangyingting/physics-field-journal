import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import puppeteer from 'puppeteer-core';
import { lessons } from '../lib/curriculum.js';
import { chapters } from '../lib/catalog.js';

const base = (process.env.BASE_URL || 'http://127.0.0.1:3000').replace(/\/$/, '');
const prefix = new URL(base).pathname.replace(/\/$/, '');
const staticMode = process.env.GITHUB_PAGES === 'true';
const screenshotDir = process.env.SCREENSHOTS;
if (screenshotDir) await mkdir(screenshotDir, { recursive: true });

const routes = ['zh', 'en'].flatMap(lang => [
  `/${lang}`, `/${lang}/courses/middle`, `/${lang}/courses/high`, `/${lang}/equations`, `/${lang}/explore`,
  ...lessons.map(lesson => `/${lang}/learn/${lesson.id}`),
  ...chapters.map(chapter => `/${lang}/explore/${chapter.slug}`),
]);
for (let i = 0; i < routes.length; i += 6) {
  await Promise.all(routes.slice(i, i + 6).map(async route => {
    const response = await fetch(`${base}${route}`);
    assert.equal(response.status, 200, route);
    const html = await response.text();
    assert.ok(html.includes(`<html lang="${route.startsWith('/zh') ? 'zh-CN' : 'en'}"`), `${route}: document language`);
    assert.ok(html.includes('<h1'), `${route}: heading`);
  }));
}
for (const route of ['/zh/learn/missing', '/en/courses/missing', '/zh/explore/missing', '/fr', '/fr/equations']) {
  assert.equal((await fetch(`${base}${route}`)).status, 404, `${route}: missing page`);
}
if (staticMode) {
  assert.ok((await (await fetch(`${base}/`)).text()).includes(`url=${prefix}/zh/`));
} else {
  assert.equal((await fetch(`${base}/`, { redirect: 'manual' })).headers.get('location'), `${prefix}/zh`);
}
for (const chapter of chapters) {
  if (staticMode) {
    const redirect = await (await fetch(`${base}/${chapter.slug}/`)).text();
    assert.ok(redirect.includes(`url=${prefix}/en/explore/${chapter.slug}/`));
  } else {
    const redirect = await fetch(`${base}/${chapter.slug}`, { redirect: 'manual' });
    assert.equal(redirect.headers.get('location'), `${prefix}/en/explore/${chapter.slug}`);
  }
  assert.equal((await fetch(`${base}/legacy/${chapter.slug}/index.html`)).status, 200);
}
console.log(`HTTP: ${routes.length} bilingual routes, missing pages, redirects and preserved chapters passed.`);

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME || '/usr/bin/google-chrome',
  headless: true,
  args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
try {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  async function waitPath(expected) {
    await page.waitForFunction((path, prefix) => location.pathname.replace(/\/$/, '') === `${prefix}${path}`, {}, expected, prefix);
  }
  await page.setViewport({ width: 1440, height: 1100, deviceScaleFactor: 1 });
  async function visit(path) {
    await page.goto(`${base}${path}`, { waitUntil: 'networkidle0' });
    await page.waitForSelector('main h1');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${path}: horizontal overflow`);
  }
  async function screenshot(name) {
    if (screenshotDir) {
      await page.evaluate(() => { document.activeElement?.blur(); window.scrollTo(0, 0); });
      await new Promise(resolve => setTimeout(resolve, 200));
      await page.screenshot({ path: `${screenshotDir}/${name}.png`, fullPage: true });
    }
  }
  await visit('/zh');
  await screenshot('home-zh-desktop');
  const before = await page.$eval('.motion-lab svg > path[stroke-dasharray]', node => node.getAttribute('d'));
  await page.$eval('#launch-speed', input => {
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    setter.call(input, '6');
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.waitForFunction(() => document.querySelector('.lab-controls output').textContent === '6.0 m/s');
  const after = await page.$eval('.motion-lab svg > path[stroke-dasharray]', node => node.getAttribute('d'));
  assert.notEqual(before, after, 'launch speed changes trajectory');
  await page.click('.lab-play');
  assert.equal(await page.$eval('.lab-play', button => button.getAttribute('aria-label')), '暂停动画');
  await page.click('.lab-play');
  await visit('/en');
  await screenshot('home-en-desktop');
  assert.match(await page.$eval('h1', element => element.textContent), /wonder/);
  await visit('/zh/courses/middle');
  assert.equal((await page.$$('.lesson-row')).length, 12);
  await page.click('.filter-tabs button:nth-child(3)');
  assert.equal((await page.$$('.lesson-row')).length, 4);
  await page.type('.search-field input', '欧姆');
  assert.equal((await page.$$('.lesson-row')).length, 1);
  await page.click('.lesson-row');
  await page.waitForSelector('.quiz');
  await waitPath('/zh/learn/ohm');
  await page.click('.worked-example summary');
  assert.equal(await page.$eval('.worked-example details', element => element.open), true);
  await page.click('.quiz-option:nth-of-type(1)');
  await page.click('.quiz > button');
  await page.waitForSelector('.quiz-feedback');
  assert.match(await page.$eval('.quiz-feedback', element => element.textContent), /再想一想/);
  await page.click('.quiz-feedback button');
  await page.click('.quiz-option:nth-of-type(2)');
  await page.click('.quiz > button');
  await page.waitForSelector('.quiz-feedback');
  assert.match(await page.$eval('.quiz-feedback', element => element.textContent), /答对了/);
  await page.click('.lesson-completion button');
  assert.equal(await page.$eval('.lesson-completion button', element => element.getAttribute('aria-pressed')), 'true');
  await page.reload({ waitUntil: 'networkidle0' });
  await page.waitForFunction(() => document.querySelector('.lesson-completion button').getAttribute('aria-pressed') === 'true');
  await screenshot('lesson-zh-desktop');
  await page.click('.topbar a');
  await waitPath('/en/learn/ohm');
  assert.match(await page.$eval('h1', element => element.textContent), /Ohm/);
  assert.equal(await page.$eval('html', element => element.lang), 'en');
  assert.equal(await page.$eval('.lesson-completion button', element => element.getAttribute('aria-pressed')), 'true');
  await visit('/en/courses/middle');
  assert.equal((await page.$$('.lesson-number.done')).length, 1);
  await visit('/zh/equations');
  await page.click('.equation-card');
  await waitPath('/zh/learn/measurement');

  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  for (const path of ['/zh', '/en', '/zh/courses/high', '/en/courses/middle', '/zh/learn/projectiles', '/en/learn/thermodynamics', '/zh/equations', '/en/explore']) {
    await visit(path);
    if (['/zh', '/zh/learn/projectiles', '/zh/courses/high'].includes(path)) await screenshot(`mobile-${path.replaceAll('/', '-')}`);
  }
  await page.click('.mobile-bar button');
  assert.equal(await page.$eval('.mobile-bar button', element => element.getAttribute('aria-expanded')), 'true');
  await page.waitForFunction(() => document.querySelector('.sidebar').getBoundingClientRect().left >= 0);
  await page.click('.sidebar nav > div:nth-child(3) a');
  await waitPath('/en/courses/high');
  assert.equal(await page.$eval('.mobile-bar button', element => element.getAttribute('aria-expanded')), 'false');
  await page.evaluate(() => localStorage.setItem('atlas-completed-v1', '{broken'));
  await visit('/zh');
  assert.match(await page.$eval('.progress-caption', element => element.textContent), /0 \/ 26/);
  assert.deepEqual(errors, [], 'No client errors in the new application');
  console.log('Browser: simulation, course filters, search, worked solutions, quiz feedback, saved progress, locale switching, equation links and mobile navigation passed.');

  await page.setViewport({ width: 1440, height: 1000, isMobile: false, hasTouch: false });
  await visit('/en/explore/kinematics#4');
  const frame = page.frames().find(frame => frame.url().includes('/legacy/kinematics/'));
  assert.ok(frame, 'Legacy iframe exists');
  await frame.waitForFunction(() => !!window.__atlas, { timeout: 35000 });
  await frame.waitForFunction(() => location.hash === '#4', { timeout: 10000 });
  assert.equal(await frame.evaluate(() => location.hash), '#4');
  await frame.waitForSelector('#sheet h1', { timeout: 10000 });
  await screenshot('exploration-desktop');
  await frame.goto(`${base}/legacy/newton/`, { waitUntil: 'networkidle0' });
  await frame.waitForFunction(() => !!window.__atlas, { timeout: 35000 });
  await frame.waitForSelector('#sheet .practice .q', { timeout: 10000 });
  await frame.click('#sheet .q [data-c="0"]');
  assert.equal(await frame.$eval('#sheet .q .why', element => element.hidden), false);
  assert.deepEqual(errors, [], 'No client errors in the preserved 3D chapters');
  if (staticMode) {
    await page.goto(`${base}/kinematics/#4`, { waitUntil: 'networkidle0' });
    await waitPath('/en/explore/kinematics');
    assert.equal(new URL(page.url()).hash, '#4');
  }
  console.log('Legacy: 3D renderer and preserved page deep link passed.');
} finally {
  await browser.close();
}
