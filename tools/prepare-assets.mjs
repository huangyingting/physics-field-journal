import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { chapters } from '../lib/catalog.js';
import { publicPath } from '../lib/paths.js';

function prepareHtml(html, base) {
  return html.replace('<head>', `<head>\n<base href="${base}">`)
    .replace(/<link[^>]+href="https:\/\/fonts\.(?:googleapis|gstatic)\.com[^"]*"[^>]*>\n?/g, '')
    .replaceAll('https://cdn.jsdelivr.net/npm/three@0.186.1/', publicPath('/vendor/three/'))
    .replace('<script defer src="/_vercel/insights/script.js"></script>', '');
}

await mkdir('public/legacy', { recursive: true });
for (const name of ['engine', 'equations', ...chapters.map(chapter => chapter.slug)]) {
  await cp(name, `public/legacy/${name}`, { recursive: true });
  if (name !== 'engine') {
    const path = `public/legacy/${name}/index.html`;
    const html = await readFile(path, 'utf8');
    await writeFile(path, prepareHtml(html, publicPath(`/legacy/${name}/`)));
  }
}
await cp('atlas.css', 'public/legacy/atlas.css');
await cp('img', 'public/img', { recursive: true });
await cp('img', 'public/legacy/img', { recursive: true });
const contents = await readFile('index.html', 'utf8');
await writeFile('public/legacy/index.html', prepareHtml(contents, publicPath('/legacy/')));
await cp('node_modules/three/build', 'public/vendor/three/build', { recursive: true });
await cp('node_modules/three/examples/jsm', 'public/vendor/three/examples/jsm', { recursive: true });

async function redirectFile(path, destination) {
  const url = publicPath(destination);
  const target = JSON.stringify(url);
  await writeFile(path, `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="refresh" content="0;url=${url}"><title>物理图志 · Atlas of Physics</title><script>location.replace(${target}+location.hash)</script></head><body><a href="${url}">打开物理图志 / Open Atlas of Physics</a></body></html>`);
}

await redirectFile('public/index.html', '/zh/');
for (const slug of ['equations', ...chapters.map(chapter => chapter.slug)]) {
  await mkdir(`public/${slug}`, { recursive: true });
  await redirectFile(`public/${slug}/index.html`, slug === 'equations' ? '/en/equations/' : `/en/explore/${slug}/`);
}
