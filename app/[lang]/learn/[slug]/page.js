import { notFound } from 'next/navigation';
import Lesson from '../../../../components/lesson.js';
import { getLesson, lessons } from '../../../../lib/curriculum.js';
import { languages } from '../../../../lib/i18n.js';

export function generateStaticParams() {
  return languages.flatMap(lang => lessons.map(lesson => ({ lang, slug: lesson.id })));
}

export async function generateMetadata({ params }) {
  const { lang, slug } = await params;
  const lesson = getLesson(slug);
  return { title: lesson?.title[lang] || 'Lesson', description: lesson?.summary[lang] };
}

export default async function Page({ params }) {
  const { lang, slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();
  return <Lesson key={`${lang}-${slug}`} lang={lang} lesson={lesson} />;
}
