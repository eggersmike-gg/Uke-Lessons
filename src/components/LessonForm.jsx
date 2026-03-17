import { useState, useEffect } from 'react';

const STATUS_OPTIONS = [
  { value: 'not-started', label: 'Not Started' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

const EMPTY_FORM = {
  title: '',
  description: '',
  url: '',
  source: '',
  status: 'not-started',
  rating: '',
  notes: '',
};

export default function LessonForm({ lesson, subscriptions, onSave, onCancel }) {
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (lesson) {
      setForm({
        title: lesson.title || '',
        description: lesson.description || '',
        url: lesson.url || '',
        source: lesson.source || '',
        status: lesson.status || 'not-started',
        rating: lesson.rating != null ? String(lesson.rating) : '',
        notes: lesson.notes || '',
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [lesson]);

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave({
      ...form,
      rating: form.rating !== '' ? Number(form.rating) : null,
    });
  }

  return (
    <form className="lesson-form" onSubmit={handleSubmit}>
      <h2>{lesson ? 'Edit Lesson' : 'Add Lesson'}</h2>

      <label>
        Title *
        <input
          type="text"
          value={form.title}
          onChange={e => set('title', e.target.value)}
          placeholder="e.g. Basic Chord Progressions"
          required
        />
      </label>

      <label>
        URL
        <input
          type="url"
          value={form.url}
          onChange={e => set('url', e.target.value)}
          placeholder="https://..."
        />
      </label>

      <label>
        Source / Subscription
        <select value={form.source} onChange={e => set('source', e.target.value)}>
          <option value="">— Select source —</option>
          {subscriptions.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </label>

      <label>
        Status
        <select value={form.status} onChange={e => set('status', e.target.value)}>
          {STATUS_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </label>

      <label>
        Rating
        <select value={form.rating} onChange={e => set('rating', e.target.value)}>
          <option value="">— No rating —</option>
          {[1, 2, 3, 4, 5].map(n => (
            <option key={n} value={n}>{'★'.repeat(n)}{'☆'.repeat(5 - n)}</option>
          ))}
        </select>
      </label>

      <label>
        Description
        <textarea
          value={form.description}
          onChange={e => set('description', e.target.value)}
          placeholder="What does this lesson cover?"
          rows={2}
        />
      </label>

      <label>
        Notes
        <textarea
          value={form.notes}
          onChange={e => set('notes', e.target.value)}
          placeholder="Personal notes, practice reminders..."
          rows={3}
        />
      </label>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {lesson ? 'Save Changes' : 'Add Lesson'}
        </button>
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
