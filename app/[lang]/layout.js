import { notFound } from 'next/navigation';
import Shell from '../../components/shell.js';
import { languages } from '../../lib/i18n.js';
import { publicPath } from '../../lib/paths.js';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/600.css';
import '@fontsource/noto-serif-sc/400.css';
import '@fontsource/noto-serif-sc/500.css';
import '@fontsource/noto-serif-sc/600.css';
import './globals.css';

export const dynamicParams = false;

export function generateStaticParams() {
  return languages.map(lang => ({ lang }));
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  return {
    title: { default: lang === 'zh' ? '物理图志 · 让好奇心有迹可循' : 'Atlas of Physics · A field guide to curiosity', template: '%s · Atlas of Physics' },
    description: lang === 'zh' ? '面向中国初高中学生的双语物理学习手记：分步讲解、例题、练习和三维探索。' : 'A bilingual physics field journal for Chinese middle and high school: guided lessons, worked examples, practice and 3D explorations.',
    icons: { icon: publicPath('/icon.svg') },
  };
}

export default async function Layout({ children, params }) {
  const { lang } = await params;
  if (!languages.includes(lang)) notFound();
  return <html lang={lang === 'zh' ? 'zh-CN' : 'en'}><body><Shell lang={lang}>{children}</Shell></body></html>;
}
