'use client';

import { useSyncExternalStore } from 'react';

const KEY = 'atlas-completed-v1';
const EMPTY = '[]';
function subscribe(callback) {
  window.addEventListener('storage', callback);
  window.addEventListener('atlas-progress', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('atlas-progress', callback);
  };
}
function snapshot() {
  try { return window.localStorage.getItem(KEY) || EMPTY; } catch { return EMPTY; }
}
export function useProgress() {
  const raw = useSyncExternalStore(subscribe, snapshot, () => EMPTY);
  let completed;
  try {
    const parsed = JSON.parse(raw);
    completed = Array.isArray(parsed) ? parsed.filter(id => typeof id === 'string') : [];
  } catch { completed = []; }
  function toggle(id) {
    const next = completed.includes(id) ? completed.filter(value => value !== id) : [...completed, id];
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
      window.dispatchEvent(new Event('atlas-progress'));
      return true;
    } catch { return false; }
  }
  return { completed, toggle };
}
