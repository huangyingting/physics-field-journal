'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { text } from '../lib/i18n.js';
import { getLesson } from '../lib/curriculum.js';
import { Icon } from './icons.js';

export default function Shell({ lang, children }) {
  const t = text[lang];
  const pathname = usePathname().replace(/\/$/, '') || '/';
  const [open, setOpen] = useState(false);
  const menuButton = useRef(null);
  const sidebar = useRef(null);
  const otherLang = lang === 'zh' ? 'en' : 'zh';
  const lessonStage = getLesson(pathname.split('/learn/')[1])?.stage;
  useEffect(() => {
    const media = window.matchMedia('(min-width: 761px)');
    const onResize = () => { if (media.matches) setOpen(false); };
    media.addEventListener('change', onResize);
    return () => media.removeEventListener('change', onResize);
  }, []);
  useEffect(() => {
    if (!open) return;
    sidebar.current?.querySelector('nav a')?.focus();
    function onKey(event) {
      if (event.key === 'Escape') {
        setOpen(false);
        menuButton.current?.focus();
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);
  const links = [
    ['', 'overview', 'grid'],
    ['/courses/middle', 'middle', 'book'],
    ['/courses/high', 'high', 'orbit'],
    ['/explore', 'explore', 'flask'],
    ['/equations', 'equations', 'formula'],
  ];
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">{lang === 'zh' ? '跳到正文' : 'Skip to content'}</a>
      <div className="mobile-bar">
        <Link href={`/${lang}`} className="mobile-brand"><Icon name="orbit" />{t.brand}</Link>
        <button ref={menuButton} className="icon-button" aria-label={open ? t.close : t.menu} aria-expanded={open} aria-controls="sidebar" onClick={() => setOpen(!open)}><Icon name={open ? 'close' : 'menu'} /></button>
      </div>
      {open && <button className="nav-scrim" aria-label={t.close} onClick={() => setOpen(false)} />}
      <aside ref={sidebar} className={`sidebar ${open ? 'is-open' : ''}`} id="sidebar">
        <Link href={`/${lang}`} className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark"><Icon name="orbit" size={33} /></span>
          <span><strong>{t.brand}</strong><small>{t.brandSub}</small></span>
        </Link>
        <div className="nav-caption">{t.learning}</div>
        <nav aria-label={lang === 'zh' ? '主导航' : 'Main navigation'}>
          {links.map(([href, label, icon], index) => {
            const active = href ? pathname.startsWith(`/${lang}${href}`) || (lessonStage && href === `/courses/${lessonStage}`) : pathname === `/${lang}`;
            return <div key={label}>
              {index === 3 && <div className="nav-caption resources">{t.resources}</div>}
              <Link href={`/${lang}${href}`} className={`nav-link ${active ? 'active' : ''}`} aria-current={active ? 'page' : undefined} onClick={() => setOpen(false)}><Icon name={icon} /><span>{t[label]}</span>{active && <span className="active-dot" />}</Link>
            </div>;
          })}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-note"><Icon name="spark" size={21} /><p>{t.note}</p><small>{t.noteSub}</small><span className="note-line" /></div>
          <Link className="locale-link" href={pathname.replace(/^\/(zh|en)(?=\/|$)/, `/${otherLang}`)} hrefLang={otherLang} onClick={() => setOpen(false)}><Icon name="globe" size={17} />{t.switch}<span>↗</span></Link>
          <span className="edition">FIELD NOTES · VOL. 01</span>
        </div>
      </aside>
      <div className="main-wrap" inert={open}>
        <header className="topbar"><span>{t.journal}</span><div><span className="status-dot" />{lang === 'zh' ? '为理解而学' : 'LEARN TO UNDERSTAND'}<span className="topbar-divider" /><Link href={pathname.replace(/^\/(zh|en)(?=\/|$)/, `/${otherLang}`)} hrefLang={otherLang}>{lang === 'zh' ? '中 / EN' : 'EN / 中'}</Link></div></header>
        <main id="main" tabIndex={-1}>{children}</main>
        <footer className="site-footer"><span>{t.brand} <span className="footer-dot">·</span> {lang === 'zh' ? '把世界，看得更明白。' : 'See a little more of the world.'}</span><span>OBSERVE. WONDER. UNDERSTAND.</span></footer>
      </div>
    </div>
  );
}
