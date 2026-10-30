'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { publicPath } from '../lib/paths.js';

export default function LegacyViewer({ lang, chapter }) {
  const iframe = useRef(null);
  const initialLoad = useRef(true);
  const [status, setStatus] = useState('loading');
  const onLoad = useCallback(() => {
    try {
      const win = iframe.current?.contentWindow;
      if (!win) return;
      // Old chapter/#page links must also work if the iframe loads before hydration.
      if (initialLoad.current && /^#\d+$/.test(window.location.hash)) {
        win.location.replace(new URL(window.location.hash, win.location.href).href);
      }
      initialLoad.current = false;
      const brand = win.document.querySelector('.brand');
      if (brand) {
        brand.setAttribute('href', publicPath(`/${lang}/explore/`));
        brand.setAttribute('target', '_top');
      }
    } catch { setStatus('error'); }
  }, [lang]);
  useEffect(() => {
    let attempts = 0;
    const timer = setInterval(() => {
      try {
        if (iframe.current?.contentWindow?.__atlas) {
          onLoad();
          setStatus('ready');
          clearInterval(timer);
        } else if (++attempts >= 25) {
          setStatus('error');
          clearInterval(timer);
        }
      } catch {
        setStatus('error');
        clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [onLoad]);
  return <div className="legacy-viewer">
    {status !== 'ready' && <div className={`viewer-status ${status}`} role="status">{status === 'loading' ? (lang === 'zh' ? '正在载入三维模型…' : 'Loading the 3D model…') : (lang === 'zh' ? '三维模型尚未就绪。请检查网络与 WebGL 支持，或使用下面的独立窗口链接。双语课程无需三维渲染即可阅读。' : 'The 3D model is not ready. Check your connection and WebGL support, or use the standalone link above. Bilingual lessons remain available without 3D rendering.')}</div>}
    <iframe ref={iframe} src={publicPath(`/legacy/${chapter.slug}/index.html`)} title={`${chapter[lang]} — ${lang === 'zh' ? '原版英语三维探索' : 'Original English 3D exploration'}`} onLoad={onLoad} allow="fullscreen" />
  </div>;
}
