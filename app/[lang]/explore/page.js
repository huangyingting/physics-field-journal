import Link from 'next/link';
import Image from 'next/image';
import { chapters } from '../../../lib/catalog.js';
import { publicPath } from '../../../lib/paths.js';
import { text } from '../../../lib/i18n.js';
import { Icon } from '../../../components/icons.js';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return { title: text[lang].explore };
}

export default async function Page({ params }) {
  const { lang } = await params;
  const t = text[lang];
  return <div className="page">
    <div className="breadcrumbs"><Link href={`/${lang}`}>{t.home}</Link><span>/</span><span>{t.explore}</span></div>
    <header className="page-intro"><div className="eyebrow">THE EXPLORATION ROOM / 15 CHAPTERS</div><h1>{lang === 'zh' ? '把物理，转个角度看。' : 'A different angle on physics.'}</h1><p>{lang === 'zh' ? '拖动、旋转、拆解。让一个三维模型，打开另一种理解。' : 'Drag, rotate, take it apart. Let a three-dimensional model open a new way to understand.'}</p></header>
    <div className="explore-notice"><Icon name="flask" size={22} /><p>{lang === 'zh' ? '原版 AP 进阶探索库：这 15 个章节保留英语讲解，部分包含微积分，适合拓展学习。中文分步课程请从「初中物理 / 高中物理」进入。三维渲染需要 WebGL 和网络连接。' : 'The original AP enrichment library: these 15 chapters retain their English explanations and some use calculus. For bilingual school lessons, follow the middle- or high-school paths. 3D rendering requires WebGL and a network connection.'}</p></div>
    <div className="explore-grid">{chapters.map((chapter, i) => <Link className="explore-card" href={`/${lang}/explore/${chapter.slug}`} key={chapter.slug}><div className="explore-image"><Image src={publicPath(`/img/${chapter.slug}.jpg`)} width={540} height={480} alt={lang === 'zh' ? `${chapter.zh}三维模型预览` : `${chapter.en} 3D model preview`} /><span>{String(i + 1).padStart(2, '0')}</span></div><div><h2>{chapter[lang]}<Icon name="arrow" size={19} /></h2><span>{lang === 'zh' ? `${chapter.en} · 英语拓展` : 'INTERACTIVE · ENGLISH ENRICHMENT'}</span></div></Link>)}</div>
  </div>;
}
