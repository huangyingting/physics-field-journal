import { notFound } from 'next/navigation';
import Course from '../../../../components/course.js';
import { stages } from '../../../../lib/catalog.js';
import { languages } from '../../../../lib/i18n.js';

export function generateStaticParams() {
  return languages.flatMap(lang => Object.keys(stages).map(stage => ({ lang, stage })));
}

export async function generateMetadata({ params }) {
  const { lang, stage } = await params;
  return { title: stages[stage]?.[lang] || 'Curriculum' };
}

export default async function Page({ params }) {
  const { lang, stage } = await params;
  if (!stages[stage]) notFound();
  return <Course lang={lang} stageId={stage} />;
}
