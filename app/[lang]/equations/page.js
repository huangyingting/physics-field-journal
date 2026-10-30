import Link from 'next/link';
import { lessons, lessonHref } from '../../../lib/curriculum.js';
import { stages } from '../../../lib/catalog.js';
import { text } from '../../../lib/i18n.js';
import { Icon } from '../../../components/icons.js';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return { title: text[lang].equations };
}

export default async function Page({ params }) {
  const { lang } = await params;
  const t = text[lang];
  return <div className="page">
    <div className="breadcrumbs"><Link href={`/${lang}`}>{t.home}</Link><span>/</span><span>{t.equations}</span></div>
    <header className="page-intro"><div className="eyebrow">THE POCKET HANDBOOK / 01</div><h1>{t.equations}<span className="rust">.</span></h1><p>{lang === 'zh' ? '公式不是孤立的记忆。看清每个符号、适用条件，回到它讲述的那一个物理故事。' : 'An equation is not an isolated fact. Know its symbols and assumptions, then return to the physical story behind it.'}</p></header>
    {Object.keys(stages).map(stage => <section key={stage} className="equation-section"><div className="section-heading"><h2>{stages[stage][lang]}</h2><span className="section-aside">{lang === 'zh' ? '每条公式，都有来处' : 'EVERY EQUATION HAS A STORY'}</span></div><div className="equation-grid">{lessons.filter(lesson => lesson.stage === stage).map(lesson => <Link href={lessonHref(lang, lesson)} key={lesson.id} className="equation-card"><div className="eyebrow small">{lesson.title[lang]}<Icon name="arrow" size={16} /></div><div className="equation-expression">{lesson.formula}</div><p>{lesson.symbols[lang]}</p></Link>)}</div></section>)}
  </div>;
}
