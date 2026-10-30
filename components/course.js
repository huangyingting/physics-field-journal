'use client';

import Link from 'next/link';
import { useState } from 'react';
import { getLessons, lessonHref } from '../lib/curriculum.js';
import { stages } from '../lib/catalog.js';
import { text } from '../lib/i18n.js';
import { useProgress } from './progress.js';
import { Icon } from './icons.js';

export default function Course({ lang, stageId }) {
  const [query, setQuery] = useState('');
  const [grade, setGrade] = useState(-1);
  const { completed } = useProgress();
  const stage = stages[stageId];
  const t = text[lang];
  const allLessons = getLessons(stageId);
  const filtered = allLessons.filter(lesson =>
    (grade === -1 || lesson.grade === grade) &&
    `${lesson.title.zh} ${lesson.title.en} ${lesson.summary.zh} ${lesson.summary.en} ${lesson.formula}`.toLowerCase().includes(query.trim().toLowerCase()));
  const done = allLessons.filter(lesson => completed.includes(lesson.id)).length;
  return <div className="page course-page">
    <div className="breadcrumbs"><Link href={`/${lang}`}>{t.home}</Link><span>/</span><span>{stage[lang]}</span></div>
    <header className="page-intro"><div className="eyebrow">{stageId === 'middle' ? 'PATH 01' : 'PATH 02'} / {t.sequence}</div><h1>{stage[lang]}<span className="rust">.</span></h1><p>{stage.description[lang]}</p></header>
    <div className="course-summary"><span><Icon name="book" size={17} />{allLessons.length} {t.lessons}</span><span><Icon name="check" size={17} />{done} / {allLessons.length} {t.complete}</span><div className="progress-track"><span style={{ width: `${done / allLessons.length * 100}%` }} /></div></div>
    <div className="course-tools">
      <div className="filter-tabs" role="group" aria-label={lang === 'zh' ? '按年级筛选' : 'Filter by grade'}>{[-1, ...stage.grades.map((_, i) => i)].map(value => <button key={value} aria-pressed={grade === value} onClick={() => setGrade(value)} className={grade === value ? 'selected' : ''}>{value === -1 ? t.all : lang === 'zh' ? stage.grades[value] : stage.gradeEn[value]}</button>)}</div>
      <label className="search-field"><Icon name="search" size={18} /><input type="search" aria-label={t.search} placeholder={t.search} value={query} onChange={event => setQuery(event.target.value)} /></label>
    </div>
    <div className="results-caption" aria-live="polite">{filtered.length} {t.lessons}<span>{lang === 'zh' ? '按顺序学习，也可以从感兴趣的地方开始。' : 'Follow the sequence, or start with a question you love.'}</span></div>
    <div className="lesson-list">
      {filtered.map(lesson => <Link className="lesson-row" href={lessonHref(lang, lesson)} key={lesson.id}>
        <span className={`lesson-number ${completed.includes(lesson.id) ? 'done' : ''}`}>{completed.includes(lesson.id) ? <Icon name="check" /> : String(allLessons.indexOf(lesson) + 1).padStart(2, '0')}</span>
        <div className="lesson-row-copy"><div className="row-meta">{lang === 'zh' ? stage.grades[lesson.grade] : stage.gradeEn[lesson.grade]}<span>·</span>{lesson.minutes} {t.minutes}{completed.includes(lesson.id) && <span className="completed-label">{t.complete}</span>}</div><h2>{lesson.title[lang]}</h2><p>{lesson.summary[lang]}</p></div>
        <span className="row-formula">{lesson.formula.split('    ')[0]}</span><span className="row-arrow"><Icon name="arrow" /></span>
      </Link>)}
      {!filtered.length && <div className="empty-state"><Icon name="search" size={32} /><h2>{t.noResults}</h2><button className="button secondary" onClick={() => { setGrade(-1); setQuery(''); }}>{t.reset}</button></div>}
    </div>
    <p className="curriculum-note"><Icon name="book" size={18} />{t.mapping}</p>
  </div>;
}
