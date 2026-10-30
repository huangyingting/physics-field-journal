'use client';

import { useEffect, useState } from 'react';
import { flightTime, projectile } from '../lib/physics.js';
import { Icon } from './icons.js';

export default function MotionLab({ lang }) {
  const [speed, setSpeed] = useState(9);
  const [time, setTime] = useState(0.65);
  const [playing, setPlaying] = useState(false);
  const angle = 52;
  const duration = flightTime(speed, angle);
  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => setTime(value => value + 0.025 > duration ? 0 : value + 0.025), 25);
    return () => clearInterval(timer);
  }, [playing, duration]);
  const points = Array.from({ length: 61 }, (_, i) => projectile(speed, angle, duration * i / 60));
  const point = projectile(speed, angle, Math.min(time, duration));
  const px = x => 57 + x * 24;
  const py = y => 245 - y * 24;
  return (
    <div className="motion-lab">
      <div className="figure-heading"><span><span className="status-dot" />{lang === 'zh' ? '可交互的物理手记' : 'AN INTERACTIVE FIELD NOTE'}</span><span>FIG. 001</span></div>
      <svg viewBox="0 0 420 300" role="img" aria-label={lang === 'zh' ? '抛体运动轨迹，忽略空气阻力，初速度方向与水平夹角为 52 度' : 'Projectile trajectory without air resistance, launched at 52 degrees'}>
        <defs>
          <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="currentColor" strokeWidth=".5" opacity=".14" /></pattern>
          <marker id="arrow-tip" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0 0 6 3 0 6" fill="none" stroke="currentColor" /></marker>
        </defs>
        <rect x="0" y="0" width="420" height="285" fill="url(#grid)" />
        <path d="M35 245H392M57 265V35" stroke="currentColor" opacity=".45" fill="none" markerEnd="url(#arrow-tip)" />
        <text x="390" y="265" className="svg-label">x / m</text><text x="20" y="29" className="svg-label">y / m</text>
        {[0, 2, 4, 6, 8, 10, 12].map(value => <g key={value}><path d={`M${px(value)} 242v6`} stroke="currentColor" opacity=".4" /><text x={px(value)} y="264" textAnchor="middle" className="svg-tick">{value}</text></g>)}
        {[2, 4, 6, 8].map(value => <text key={value} x="45" y={py(value) + 3} textAnchor="end" className="svg-tick">{value}</text>)}
        <path d={points.map((p, i) => `${i ? 'L' : 'M'}${px(p.x)} ${py(p.y)}`).join(' ')} fill="none" stroke="var(--teal)" strokeWidth="2" strokeDasharray="4 5" />
        {points.filter((_, i) => i % 10 === 0).map((p, i) => <circle key={i} cx={px(p.x)} cy={py(p.y)} r="3" fill="var(--teal)" opacity=".4" />)}
        <path d={`M${px(point.x)} ${py(point.y)}v43`} stroke="var(--rust)" strokeWidth="1.5" markerEnd="url(#arrow-tip)" />
        <circle cx={px(point.x)} cy={py(point.y)} r="14" fill="var(--rust)" opacity=".12" />
        <circle cx={px(point.x)} cy={py(point.y)} r="7" fill="var(--rust)" stroke="var(--paper)" strokeWidth="2" />
        <text x={px(point.x) + 12} y={py(point.y) + 40} className="svg-label rust">g</text>
        <text x="258" y="55" className="svg-equation">y = v₀t sinθ − ½gt²</text>
        <path d="m280 64-24 21" stroke="var(--rust)" opacity=".6" />
        <text x="94" y="231" className="svg-label">52°</text>
        <path d="M90 245a33 33 0 0 0-13-26" fill="none" stroke="currentColor" opacity=".3" />
      </svg>
      <div className="lab-caption"><span>{lang === 'zh' ? '轨迹有弧度，好奇心没有边界。' : 'A curved path. An open-ended question.'}</span><span>g = 9.8 m/s²</span></div>
      <div className="lab-controls">
        <button className="lab-play" aria-label={playing ? (lang === 'zh' ? '暂停动画' : 'Pause animation') : (lang === 'zh' ? '播放动画' : 'Play animation')} onClick={() => setPlaying(!playing)}><Icon name={playing ? 'pause' : 'play'} size={16} /></button>
        <label htmlFor="launch-speed">{lang === 'zh' ? '初速度' : 'Launch speed'}</label>
        <input id="launch-speed" type="range" min="5" max="11" step=".5" value={speed} onChange={event => { setSpeed(Number(event.target.value)); setTime(0); }} />
        <output htmlFor="launch-speed">{speed.toFixed(1)} m/s</output>
      </div>
    </div>
  );
}
