'use client';

import Link from 'next/link';
import { getLessons, lessonHref, lessons } from '../lib/curriculum.js';
import { stages } from '../lib/catalog.js';
import { text } from '../lib/i18n.js';
import { Icon } from './icons.js';
import MotionLab from './motion-lab.js';
import { useProgress } from './progress.js';

function CourseDrawing({ high = false }) {
  return <svg viewBox="0 0 160 105" fill="none" aria-hidden="true">
    {high ? <><ellipse cx="80" cy="53" rx="61" ry="22" transform="rotate(-27 80 53)" /><ellipse cx="80" cy="53" rx="61" ry="22" transform="rotate(34 80 53)" /><ellipse cx="80" cy="53" rx="22" ry="46" /><circle cx="80" cy="53" r="6" fill="currentColor" /><circle cx="129" cy="22" r="5" fill="var(--rust)" stroke="none" /></> : <><path d="M20 88h119M46 85V16l60 20" /><path d="m46 16 41 59" strokeDasharray="3 4" /><path d="m46 16 60 20v40" /><circle cx="87" cy="75" r="10" fill="currentColor" /><path d="M46 42a26 26 0 0 0 15-5" /><path d="m106 76-5-7m5 7 5-7" stroke="var(--rust)" /><text x="112" y="63" stroke="none" fill="var(--rust)" fontFamily="Georgia" fontSize="16">g</text></>}
  </svg>;
}

export default function Home({ lang }) {
  const t = text[lang];
  const { completed } = useProgress();
  const validCompleted = lessons.filter(lesson => completed.includes(lesson.id));
  const next = lessons.find(lesson => !completed.includes(lesson.id)) || lessons[0];
  return (
    <div className="page home-page">
      <div className="eyebrow"><span className="tiny-cross">+</span>{lang === 'zh' ? '写给每一个好奇的你' : 'FOR THE ENDLESSLY CURIOUS'}<span className="eyebrow-line" /></div>
      <section className="hero">
        <div className="hero-copy">
          <div className="hero-tag"><span />{lang === 'zh' ? '不是记住公式，而是读懂世界' : 'LESS MEMORISING. MORE UNDERSTANDING.'}</div>
          <h1>{lang === 'zh' ? <>让好奇心，<br />有<span className="underlined">迹</span>可循<span className="rust">。</span></> : <>Make room<br />for <span className="underlined">wonder</span><span className="rust">.</span></>}</h1>
          <p>{lang === 'zh' ? '一束光、一次下落、一圈涟漪。把日常里的「为什么」，变成一步步看得见的理解。' : 'A ray of light. A falling leaf. A ripple in water. Turn everyday “why” into understanding, one small discovery at a time.'}</p>
          <div className="hero-actions"><Link href={lessonHref(lang, next)} className="button primary">{validCompleted.length ? (lang === 'zh' ? '继续我的学习' : 'Continue learning') : t.start}<Icon name="arrow" size={18} /></Link><Link href="#learning-paths" className="text-link">{lang === 'zh' ? '先逛逛课程' : 'Find your path'}<span>↘</span></Link></div>
          <div className="hero-footnote"><span className="mini-orbit">✳</span>{lang === 'zh' ? '中文 / English · 免费开放 · 自主探索' : '中文 / English · Open access · Self-paced'}</div>
        </div>
        <div className="hero-figure"><span className="figure-tape" /><MotionLab lang={lang} /><div className="handwritten">{lang === 'zh' ? '试着改变初速度，看看会发生什么 ↗' : 'Change the speed. See what happens. ↗'}</div></div>
      </section>
      <div className="numbers-strip">
        <div><strong>02</strong><span>{lang === 'zh' ? '循序渐进的学习阶段' : 'CONNECTED LEARNING STAGES'}</span></div>
        <div><strong>{lessons.length}</strong><span>{lang === 'zh' ? '有步骤、有例题的学习笔记' : 'GUIDED LEARNING NOTES'}</span></div>
        <div><strong>15</strong><span>{lang === 'zh' ? '可以亲手探索的三维章节' : 'INTERACTIVE 3D CHAPTERS'}</span></div>
        <span className="strip-note">{lang === 'zh' ? '从观察开始，而不是从答案开始。' : 'Begin with an observation, not an answer.'}</span>
      </div>
      <section id="learning-paths" className="paths-section">
        <div className="section-heading"><div><div className="eyebrow small">01 / {lang === 'zh' ? '找到你的起点' : 'CHOOSE A STARTING POINT'}</div><h2>{lang === 'zh' ? '每一步，都算数。' : 'Every small step counts.'}</h2></div><span className="section-aside">{lang === 'zh' ? '贴近中国初高中物理知识体系' : 'BUILT AROUND CHINESE SCHOOL PHYSICS'}</span></div>
        <div className="path-grid">
          {Object.entries(stages).map(([key, stage], index) => {
            const stageLessons = getLessons(key);
            return <article className={`path-card ${key}`} key={key}>
              <div className="path-card-top"><span className="path-label">PATH {String(index + 1).padStart(2, '0')}</span><span className="grade-tag">{lang === 'zh' ? stage.grades.join(' / ') : stage.gradeEn.join(' / ')}</span></div>
              <div className="path-card-title"><div><h3><Link href={`/${lang}/courses/${key}`}>{stage[lang]}<Icon name="arrow" size={23} /></Link></h3><p>{stage.label[lang]}</p></div><CourseDrawing high={key === 'high'} /></div>
              <div className="topic-tags">{stageLessons.slice(0, 4).map(lesson => <span key={lesson.id}>{lesson.title[lang]}</span>)}</div>
              <div className="path-card-bottom"><span><Icon name="book" size={15} />{stageLessons.length} {t.lessons}</span><Link href={`/${lang}/courses/${key}`}>{t.viewPath}<span>↗</span></Link></div>
            </article>;
          })}
        </div>
      </section>
      <div className="bottom-grid">
        <section className="continue-card">
          <div className="eyebrow small">02 / {lang === 'zh' ? '你的学习手记' : 'YOUR FIELD JOURNAL'}</div>
          <h2>{validCompleted.length ? (lang === 'zh' ? '把发现，接着写下去。' : 'Keep the discoveries going.') : (lang === 'zh' ? '第一篇手记，从这里开始。' : 'Your first field note starts here.')}</h2>
          <Link href={lessonHref(lang, next)} className="continue-lesson"><span className="lesson-number">{String(lessons.indexOf(next) + 1).padStart(2, '0')}</span><span><strong>{next.title[lang]}</strong><small>{stages[next.stage][lang]} · {next.minutes} {t.minutes}</small></span><Icon name="arrow" /></Link>
          <div className="progress-caption"><span>{t.progress}</span><span>{validCompleted.length} / {lessons.length}</span></div><div className="progress-track"><span style={{ width: `${validCompleted.length / lessons.length * 100}%` }} /></div><p className="fine-print">{t.saved}</p>
        </section>
        <section className="observation-card"><span className="observation-label">THE WAY WE LEARN</span><h2>{lang === 'zh' ? <>先看见，<br />再想明白。</> : <>Notice first.<br />Understand next.</>}</h2><p>{lang === 'zh' ? '观察现象 → 建立模型 → 分步推理 → 动手检验。每节课都留一点空间，给你自己的发现。' : 'Observe → Build a model → Reason step by step → Check your understanding. Every lesson leaves room for your own discoveries.'}</p><Link href={`/${lang}/explore`}>{lang === 'zh' ? '走进三维探索室' : 'Visit the 3D exploration room'}<Icon name="arrow" size={18} /></Link><span className="observation-star" aria-hidden="true">✳</span></section>
      </div>
    </div>
  );
}
