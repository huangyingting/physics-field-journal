import Link from 'next/link';
import { notFound } from 'next/navigation';
import { chapters } from '../../../../lib/catalog.js';
import { publicPath } from '../../../../lib/paths.js';
import { languages, text } from '../../../../lib/i18n.js';
import LegacyViewer from '../../../../components/legacy-viewer.js';

export function generateStaticParams() {
  return languages.flatMap(lang => chapters.map(chapter => ({ lang, chapter: chapter.slug })));
}

export async function generateMetadata({ params }) {
  const { lang, chapter: slug } = await params;
  return { title: chapters.find(chapter => chapter.slug === slug)?.[lang] || 'Explore' };
}

export default async function Page({ params }) {
  const { lang, chapter: slug } = await params;
  const chapter = chapters.find(chapter => chapter.slug === slug);
  if (!chapter) notFound();
  return <div className="page viewer-page"><div className="breadcrumbs"><Link href={`/${lang}/explore`}>{text[lang].explore}</Link><span>/</span><span>{chapter[lang]}</span></div><div className="viewer-heading"><h1>{chapter[lang]}</h1><a href={publicPath(`/legacy/${chapter.slug}/`)} target="_blank" rel="noreferrer">{lang === 'zh' ? '在独立窗口打开' : 'Open standalone'} ↗</a></div><p className="viewer-note">{lang === 'zh' ? '英语进阶章节 · 滚动翻页 · 拖动旋转 · 点击模型部件查看解析' : 'English enrichment · Scroll to turn pages · Drag to orbit · Click a part to inspect'}</p><LegacyViewer key={`${lang}-${chapter.slug}`} lang={lang} chapter={chapter} /></div>;
}
