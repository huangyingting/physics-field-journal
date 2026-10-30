import test from 'node:test';
import assert from 'node:assert/strict';
import { getLesson, getLessons, lessonHref, lessons } from '../lib/curriculum.js';
import { chapters, stages } from '../lib/catalog.js';
import { flightTime, projectile } from '../lib/physics.js';

test('every learning path has ordered, reachable bilingual lessons with complete guides', () => {
  const ids = new Set();
  for (const stage of Object.keys(stages)) {
    const path = getLessons(stage);
    assert.ok(path.length > 0);
    let grade = -1;
    for (const lesson of path) {
      assert.ok(!ids.has(lesson.id), `Duplicate lesson: ${lesson.id}`);
      ids.add(lesson.id);
      assert.ok(lesson.grade >= grade && lesson.grade < stages[stage].grades.length);
      grade = lesson.grade;
      assert.equal(getLesson(lesson.id), lesson);
      assert.ok(lesson.steps.length >= 3);
      assert.ok(lesson.solution.length >= 3);
      for (const lang of ['zh', 'en']) {
        assert.ok(lessonHref(lang, lesson).startsWith(`/${lang}/learn/`));
        for (const field of [lesson.title, lesson.summary, lesson.symbols, lesson.example, ...lesson.steps, ...lesson.solution, lesson.quiz.question, lesson.quiz.why, ...lesson.quiz.choices]) {
          assert.ok(typeof field[lang] === 'string' && field[lang].trim().length > 0, `${lesson.id}: missing ${lang} content`);
        }
      }
      assert.ok(Number.isInteger(lesson.quiz.answer));
      assert.ok(lesson.quiz.answer >= 0 && lesson.quiz.answer < lesson.quiz.choices.length);
      assert.equal(new Set(lesson.quiz.choices.map(choice => choice.en)).size, lesson.quiz.choices.length);
      if (lesson.chapter) assert.ok(chapters.some(chapter => chapter.slug === lesson.chapter));
    }
  }
  assert.equal(ids.size, lessons.length);
  assert.equal(getLesson('not-a-lesson'), undefined);
});

test('projectile starts at launch and returns to ground at the predicted flight time', () => {
  for (const speed of [5, 9, 11]) {
    const duration = flightTime(speed, 52);
    assert.deepEqual(projectile(speed, 52, 0), { x: 0, y: 0 });
    const end = projectile(speed, 52, duration);
    assert.ok(Math.abs(end.y) < 1e-10);
    assert.ok(end.x > 0);
    const peak = projectile(speed, 52, duration / 2);
    assert.ok(peak.y > 0);
    assert.ok(Math.abs(peak.x * 2 - end.x) < 1e-10);
  }
});

test('launch speed changes range and height quadratically, consistent with the guide', () => {
  const slowTime = flightTime(5, 52);
  const fastTime = flightTime(10, 52);
  const slowEnd = projectile(5, 52, slowTime);
  const fastEnd = projectile(10, 52, fastTime);
  assert.ok(Math.abs(fastEnd.x / slowEnd.x - 4) < 1e-10);
  assert.ok(Math.abs(projectile(10, 52, fastTime / 2).y / projectile(5, 52, slowTime / 2).y - 4) < 1e-10);
});

test('horizontal launch separates constant horizontal motion from free fall', () => {
  assert.deepEqual(projectile(4, 0, 1, 10), { x: 4, y: -5 });
  assert.equal(flightTime(4, 0), 0);
});
