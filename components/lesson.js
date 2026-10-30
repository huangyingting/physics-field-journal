'use client';

import Link from 'next/link';
import { useState } from 'react';
import { getLessons, lessonHref } from '../lib/curriculum.js';
import { stages } from '../lib/catalog.js';
import { text } from '../lib/i18n.js';
import { useProgress } from './progress.js';
import { Icon } from './icons.js';
import MotionLab from './motion-lab.js';

export default function Lesson({ lang, lesson }) {
  const t = text[lang];
  const path = getLessons(lesson.stage);
  const index = path.findIndex(item => item.id === lesson.id);
  const previous = path[index - 1];
  const next = path[index + 1];
  const [choice, setChoice] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const { completed, toggle } = useProgress();
  const isComplete = completed.includes(lesson.id);
  const stepTitles = lang === 'zh' ? ['从现象出发', '建立物理模型', '连接与检验'] : ['Begin with an observation', 'Build the physical model', 'Connect and check'];
  return <div className="page lesson-page">
    <div className="breadcrumbs"><Link href={`/${lang}`}>{t.home}</Link><span>/</span><Link href={`/${lang}/courses/${lesson.stage}`}>{stages[lesson.stage][lang]}</Link><span>/</span><span>{String(index + 1).padStart(2, '0')}</span></div>
    <header className="page-intro lesson-intro"><div className="eyebrow">FIELD NOTE {String(index + 1).padStart(2, '0')} / {lang === 'zh' ? stages[lesson.stage].grades[lesson.grade] : stages[lesson.stage].gradeEn[lesson.grade]}</div><h1>{lesson.title[lang]}</h1><p>{lesson.summary[lang]}</p><div className="lesson-meta"><span><Icon name="clock" size={16} />{lesson.minutes} {t.minutes}</span><span>{t.fieldNote}</span>{isComplete && <span className="completed-label"><Icon name="check" size={16} />{t.complete}</span>}</div></header>
    <div className="lesson-layout">
      <article className="lesson-body">
        {previous && <div className="prerequisite">{t.prerequisite}<Link href={lessonHref(lang, previous)}>{previous.title[lang]} ↗</Link></div>}
        <section className="formula-card" id="model"><span className="eyebrow small">{lang === 'zh' ? '把关系写下来' : 'THE RELATIONSHIP, IN INK'}</span><div className="big-formula">{lesson.formula}</div><p>{lesson.symbols[lang]}</p></section>
        <section className="guided-steps" aria-label={t.objective}>
          {lesson.steps.map((step, i) => <section id={`step-${i + 1}`} className="guided-step" key={i}><span className="step-marker">{String(i + 1).padStart(2, '0')}</span><div><h2>{stepTitles[i]}</h2><p>{step[lang]}</p></div></section>)}
        </section>
        {['measurement', 'motion', 'projectiles'].includes(lesson.id) && <section className="lesson-lab"><h2>{lang === 'zh' ? '延伸观察：抛体运动' : 'Explore further: projectile motion'}</h2><p>{lang === 'zh' ? '这是斜抛的理想模型（不是平抛或步行模型）。保持角度 52°，改变初速度，比较射程与最大高度。' : 'This is an ideal angled launch, not a horizontal-launch or walking model. Keep the angle at 52° and vary speed to compare range and height.'}</p><MotionLab lang={lang} /></section>}
        <section className="worked-example" id="example"><div className="eyebrow small">04 / {t.worked}</div><h2>{lesson.example[lang]}</h2><details><summary>{t.solution}<span>+</span></summary><ol>{lesson.solution.map((step, i) => <li key={i}><span>{i + 1}</span><p>{step[lang]}</p></li>)}</ol></details></section>
        <section className="quiz" id="practice"><div className="eyebrow small">05 / {t.practice}</div><h2>{lesson.quiz.question[lang]}</h2><fieldset disabled={submitted}><legend className="sr-only">{lesson.quiz.question[lang]}</legend>{lesson.quiz.choices.map((option, i) => <label key={i} className={`quiz-option ${choice === i ? 'chosen' : ''} ${submitted && i === lesson.quiz.answer ? 'correct' : ''} ${submitted && choice === i && i !== lesson.quiz.answer ? 'incorrect' : ''}`}><input type="radio" name={`quiz-${lesson.id}`} checked={choice === i} onChange={() => setChoice(i)} /><span className="option-letter">{String.fromCharCode(65 + i)}</span><span>{option[lang]}</span>{submitted && i === lesson.quiz.answer && <Icon name="check" size={18} />}</label>)}</fieldset>
          {!submitted ? <button className="button primary" disabled={choice === null} onClick={() => setSubmitted(true)}>{t.check}<Icon name="arrow" size={17} /></button> : <div className="quiz-feedback" role="status"><strong>{choice === lesson.quiz.answer ? t.correct : t.incorrect}</strong><p>{lesson.quiz.why[lang]}</p><button className="text-button" onClick={() => { setChoice(null); setSubmitted(false); }}>{t.retry} ↺</button></div>}
        </section>
        <div className="lesson-completion"><div><strong>{lang === 'zh' ? '理解之后，留下一个记号。' : 'A small marker for a new understanding.'}</strong><p>{t.saved}</p></div><button className={`button ${isComplete ? 'secondary' : 'primary'}`} aria-pressed={isComplete} onClick={() => setStorageError(!toggle(lesson.id))}><Icon name="check" size={18} />{isComplete ? t.complete : t.markComplete}</button></div>
        {storageError && <p role="alert">{lang === 'zh' ? '浏览器无法保存进度，请允许本地存储后重试。' : 'Your browser could not save progress. Enable local storage and try again.'}</p>}
        <nav className="lesson-pager" aria-label={lang === 'zh' ? '课程翻页' : 'Lesson navigation'}>{previous ? <Link href={lessonHref(lang, previous)}><small>← {t.previous}</small><strong>{previous.title[lang]}</strong></Link> : <Link href={`/${lang}/courses/${lesson.stage}`}><small>← {t.back}</small><strong>{stages[lesson.stage][lang]}</strong></Link>}{next ? <Link href={lessonHref(lang, next)}><small>{t.next} →</small><strong>{next.title[lang]}</strong></Link> : <Link href={`/${lang}/courses/${lesson.stage}`}><small>{t.finish} ↗</small><strong>{t.back}</strong></Link>}</nav>
      </article>
      <aside className="lesson-toc"><div className="eyebrow small">{lang === 'zh' ? '本节路线' : 'IN THIS FIELD NOTE'}</div><a href="#model">{lang === 'zh' ? '核心关系' : 'Key relationship'}</a>{stepTitles.map((title, i) => <a href={`#step-${i + 1}`} key={title}><span>0{i + 1}</span>{title}</a>)}<a href="#example"><span>04</span>{t.worked}</a><a href="#practice"><span>05</span>{t.practice}</a>{lesson.chapter && <Link className="toc-explore" href={`/${lang}/explore/${lesson.chapter}`}><Icon name="flask" /><span>{lang === 'zh' ? '用三维模型继续探索' : 'Explore the 3D model'}<small>{lang === 'zh' ? '原版英语拓展章节 ↗' : 'Original English enrichment ↗'}</small></span></Link>}</aside>
    </div>
  </div>;
}
