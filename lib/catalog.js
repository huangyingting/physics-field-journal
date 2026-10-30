export const chapters = [
  { slug: 'kinematics', zh: '运动学', en: 'Kinematics' },
  { slug: 'newton', zh: '牛顿运动定律', en: "Newton’s laws" },
  { slug: 'circular', zh: '圆周运动', en: 'Circular motion' },
  { slug: 'energy', zh: '功与能', en: 'Work & energy' },
  { slug: 'momentum', zh: '动量', en: 'Momentum' },
  { slug: 'oscillations', zh: '振动', en: 'Oscillations' },
  { slug: 'rotation', zh: '转动', en: 'Rotation' },
  { slug: 'fluids', zh: '流体', en: 'Fluids' },
  { slug: 'electrostatics', zh: '静电场', en: 'Electrostatics' },
  { slug: 'gauss', zh: '高斯定律', en: "Gauss’s law" },
  { slug: 'potential', zh: '电势', en: 'Electric potential' },
  { slug: 'capacitors', zh: '电容器', en: 'Capacitors' },
  { slug: 'circuits', zh: '电路', en: 'Circuits' },
  { slug: 'magnetism', zh: '磁场', en: 'Magnetic fields' },
  { slug: 'induction', zh: '电磁感应', en: 'Induction' },
];

export const stages = {
  middle: {
    zh: '初中物理', en: 'Middle school', label: { zh: '从生活出发，建立物理直觉。', en: 'Start with everyday life. Build physical intuition.' },
    grades: ['八年级', '九年级'],
    gradeEn: ['Grade 8', 'Grade 9'],
    description: { zh: '从声音与光，到力、能量和电路。先观察，再提问，最后用实验与计算找到答案。', en: 'From sound and light to forces, energy and circuits. Observe, ask, and find answers through experiments and calculation.' },
  },
  high: {
    zh: '高中物理', en: 'High school', label: { zh: '从现象深入，理解世界的规律。', en: 'Go beyond observation. Discover the rules.' },
    grades: ['高一', '高二', '高三'],
    gradeEn: ['Grade 10', 'Grade 11', 'Grade 12'],
    description: { zh: '连接运动、相互作用与守恒定律，逐步走进电磁场、波与现代物理。用模型理解，用推导验证。', en: 'Connect motion, interactions and conservation, then explore fields, waves and modern physics. Build models and test your reasoning.' },
  },
};

export const bilingual = (zh, en) => ({ zh, en });
