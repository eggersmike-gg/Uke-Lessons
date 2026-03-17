import { useState, useEffect } from 'react';

const STORAGE_KEY = 'uke-lessons-data';

const DEFAULT_SUBSCRIPTIONS = ['Fender Play', 'Yousician', 'Uke Like The Pros', 'YouTube'];

const DEFAULT_DATA = {
  lessons: [],
  subscriptions: DEFAULT_SUBSCRIPTIONS,
};

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_DATA;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_DATA;
  }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function useLessons() {
  const [data, setData] = useState(loadData);

  useEffect(() => {
    saveData(data);
  }, [data]);

  const lessons = data.lessons;
  const subscriptions = data.subscriptions;

  function addLesson(fields) {
    const lesson = {
      id: generateId(),
      title: fields.title || '',
      description: fields.description || '',
      url: fields.url || '',
      source: fields.source || '',
      status: fields.status || 'not-started',
      rating: fields.rating || null,
      notes: fields.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setData(d => ({ ...d, lessons: [...d.lessons, lesson] }));
    return lesson;
  }

  function updateLesson(id, fields) {
    setData(d => ({
      ...d,
      lessons: d.lessons.map(l =>
        l.id === id ? { ...l, ...fields, updatedAt: new Date().toISOString() } : l
      ),
    }));
  }

  function deleteLesson(id) {
    setData(d => ({ ...d, lessons: d.lessons.filter(l => l.id !== id) }));
  }

  function addSubscription(name) {
    if (!name || data.subscriptions.includes(name)) return;
    setData(d => ({ ...d, subscriptions: [...d.subscriptions, name] }));
  }

  function deleteSubscription(name) {
    setData(d => ({ ...d, subscriptions: d.subscriptions.filter(s => s !== name) }));
  }

  function exportData() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'uke-lessons.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function importData(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => {
        try {
          const parsed = JSON.parse(e.target.result);
          if (!parsed.lessons || !Array.isArray(parsed.lessons)) {
            reject(new Error('Invalid file format'));
            return;
          }
          setData(parsed);
          resolve();
        } catch {
          reject(new Error('Could not parse JSON file'));
        }
      };
      reader.readAsText(file);
    });
  }

  return {
    lessons,
    subscriptions,
    addLesson,
    updateLesson,
    deleteLesson,
    addSubscription,
    deleteSubscription,
    exportData,
    importData,
  };
}
